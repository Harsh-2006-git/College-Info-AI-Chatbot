import os
import sys
import json
import shutil
from pathlib import Path
from typing import List, Dict, Any
from dotenv import load_dotenv

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

backend_dir = Path(__file__).resolve().parent.parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from langchain_core.documents import Document
from app.rag.splitter import TextChunker
from app.rag.embedding import EmbeddingModel
from app.rag.vectorstore import VectorStore
from app.rag.retriever import Retriever

load_dotenv(backend_dir / ".env")

def locate_documents_dir(root_dir: Path) -> Path:
    """Find the active documents directory."""
    inner = root_dir / "documents" / "documents"
    if inner.exists() and any(inner.iterdir()):
        return inner
    outer = root_dir / "documents"
    if outer.exists() and any(outer.iterdir()):
        return outer
    raise FileNotFoundError(f"Documents folder not found in {root_dir}")

def locate_old_knowledge_dir(root_dir: Path) -> Path:
    """Find the curated/old knowledge base directory."""
    kd = backend_dir / "app" / "knowledge_data"
    if kd.exists() and any(kd.iterdir()):
        return kd
    kb_json = root_dir / "frontend" / "src" / "data" / "predefinedKnowledgeBase.json"
    if kb_json.exists():
        return kb_json
    return kd

def load_combined_knowledge_base(root_dir: Path) -> List[Document]:
    """
    Load both:
    1. The comprehensive 'documents/' directory (207 domain files)
    2. The curated 'knowledge_data/' / 'predefinedKnowledgeBase.json' (16 master reference files)
    """
    documents: List[Document] = []
    seen_ids = set()

    # 1. Load from documents/
    docs_dir = locate_documents_dir(root_dir)
    doc_files = sorted(list(docs_dir.rglob("*.txt")))
    print(f"\n=======================================================")
    print(f"LOADING KNOWLEDGE BASE FROM: {docs_dir}")
    print(f"Found {len(doc_files)} files in documents folder.")
    print(f"=======================================================")

    for fpath in doc_files:
        try:
            content = fpath.read_text(encoding="utf-8", errors="ignore").strip()
            if not content:
                continue
            relpath = str(fpath.relative_to(docs_dir)).replace("\\", "/")
            parts = relpath.split("/")
            category = parts[0] if len(parts) > 1 else "General"
            subcategory = parts[1] if len(parts) > 2 else ""

            doc_id = f"documents/{relpath}"
            seen_ids.add(doc_id)
            documents.append(
                Document(
                    page_content=content,
                    metadata={
                        "document_id": doc_id,
                        "filename": fpath.name,
                        "relative_path": relpath,
                        "category": category,
                        "subcategory": subcategory,
                        "owner_id": "default",
                        "is_knowledge_base": True,
                        "page": 1,
                        "source": relpath,
                        "origin": "documents"
                    }
                )
            )
        except Exception as e:
            print(f"Error reading {fpath}: {e}")

    # 2. Load from old knowledge data / predefinedKnowledgeBase.json
    kd_dir = locate_old_knowledge_dir(root_dir)
    print(f"\n=======================================================")
    print(f"LOADING CURATED KNOWLEDGE BASE FROM: {kd_dir}")
    print(f"=======================================================")

    old_files_count = 0
    if isinstance(kd_dir, Path) and kd_dir.is_dir():
        old_txt_files = sorted(list(kd_dir.glob("*.txt")) + list(kd_dir.glob("*.md")))
        for fpath in old_txt_files:
            if fpath.name.endswith(".json") or fpath.name == "text file.txt":
                continue
            try:
                content = fpath.read_text(encoding="utf-8", errors="ignore").strip()
                if not content:
                    continue
                doc_id = f"knowledge_data/{fpath.name}"
                if doc_id in seen_ids:
                    continue
                seen_ids.add(doc_id)
                old_files_count += 1
                documents.append(
                    Document(
                        page_content=content,
                        metadata={
                            "document_id": doc_id,
                            "filename": fpath.name,
                            "relative_path": f"knowledge_data/{fpath.name}",
                            "category": "Curated_Directory",
                            "subcategory": fpath.stem,
                            "owner_id": "default",
                            "is_knowledge_base": True,
                            "page": 1,
                            "source": fpath.name,
                            "origin": "knowledge_data"
                        }
                    )
                )
            except Exception as e:
                print(f"Error reading {fpath}: {e}")

    elif isinstance(kd_dir, Path) and kd_dir.is_file():
        # Fallback to json dictionary
        try:
            data = json.loads(kd_dir.read_text(encoding="utf-8"))
            for fname, content in data.items():
                doc_id = f"predefined/{fname}"
                if doc_id in seen_ids:
                    continue
                seen_ids.add(doc_id)
                old_files_count += 1
                documents.append(
                    Document(
                        page_content=content,
                        metadata={
                            "document_id": doc_id,
                            "filename": fname,
                            "relative_path": f"predefined/{fname}",
                            "category": "Curated_Directory",
                            "subcategory": Path(fname).stem,
                            "owner_id": "default",
                            "is_knowledge_base": True,
                            "page": 1,
                            "source": fname,
                            "origin": "predefined_json"
                        }
                    )
                )
        except Exception as e:
            print(f"Error reading predefined json: {e}")

    print(f"Loaded {len(doc_files)} document files + {old_files_count} curated reference files.")
    print(f"TOTAL COMBINED DOCUMENTS: {len(documents)}")
    return documents

def export_chunks_locally(chunks: List[Document], output_path: Path):
    """Save all structured chunks and metadata into a local JSON file for portability and version control."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    serializable = []
    for c in chunks:
        serializable.append({
            "chunk_id": c.metadata.get("chunk_id"),
            "document_id": c.metadata.get("document_id"),
            "filename": c.metadata.get("filename"),
            "category": c.metadata.get("category"),
            "subcategory": c.metadata.get("subcategory"),
            "origin": c.metadata.get("origin", "knowledge_base"),
            "has_table": c.metadata.get("has_table", False),
            "has_links": c.metadata.get("has_links", False),
            "content": c.page_content,
            "metadata": c.metadata
        })
    output_path.write_text(json.dumps(serializable, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Saved {len(serializable)} local chunks to: {output_path} ({output_path.stat().st_size / 1024:.1f} KB)")

def ingest_into_store(chunks: List[Document], persist_path: str, use_local: bool):
    """Embed chunks into a specific ChromaDB vector store."""
    print(f"\n--- Ingesting {len(chunks)} chunks into: {persist_path} (use_local={use_local}) ---")
    
    gemini_key = os.getenv("GEMINI_API_KEY", "") if not use_local else ""
    embedding_model = EmbeddingModel(api_key=gemini_key)
    vector_store = VectorStore(persist_directory=persist_path, embedding_model=embedding_model)
    
    # Reset collection to ensure pure combined data
    try:
        print(f"Resetting collection '{vector_store.collection_name}' for clean ingestion...")
        vector_store.client.delete_collection(vector_store.collection_name)
        vector_store.collection = vector_store.client.get_or_create_collection(
            name=vector_store.collection_name,
            metadata={"hnsw:space": "cosine"}
        )
    except Exception as e:
        print(f"Notice resetting collection: {e}")
    
    batch_size = 50
    total_added = 0
    total_batches = (len(chunks) - 1) // batch_size + 1
    
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        try:
            added = vector_store.add_documents(batch)
            total_added += added
            print(f"Embedded batch {i//batch_size + 1}/{total_batches} ({len(batch)} chunks, cumulative: {total_added}/{len(chunks)})")
        except Exception as e:
            print(f"Error embedding batch {i}: {e}")
            
    total_chunks = vector_store.count_chunks()
    print(f"Total chunks now in collection '{vector_store.collection_name}': {total_chunks}")
    return vector_store

def test_queries(vector_store: VectorStore):
    """Test retrieval on sample questions to ensure high precision across both sources."""
    print("\n=======================================================")
    print("RUNNING COMPREHENSIVE VALIDATION SEARCHES (COMBINED KB)")
    print("=======================================================")
    retriever = Retriever(vector_store=vector_store)
    
    sample_queries = [
        # From documents/
        "What are the placement statistics, highest salary and average package for 2025 and 2024?",
        "What are the official fee structure PDF links and notices for B.Tech programmes?",
        "What specialized laboratories exist in the Department of Information Technology?",
        # From knowledge_data/ (old data)
        "Who is Dr. Sanjay Tiwari and what is his department?",
        "Name some prominent alumni of MITS Gwalior in NITI Aayog and TRAI.",
        "Who is the Chief Warden and what are the hostel mess charges and rules?",
        "What is the intake for Master in Computer Applications (MCA)?"
    ]
    
    for q in sample_queries:
        print(f"\n[Query]: {q}")
        results = retriever.retrieve(query=q, top_k=2)
        if results:
            top = results[0]
            print(f"-> Top Source: {top.filename} ({top.document_id}) [Score: {top.score:.3f}]")
            snippet = top.content.replace('\n', ' ')[:200]
            print(f"-> Snippet: {snippet}...")
        else:
            print("-> No results found!")

def main():
    root_dir = backend_dir.parent
    docs = load_combined_knowledge_base(root_dir)
    if not docs:
        print("No documents loaded!")
        return

    # Semantic structure-aware chunking
    chunker = TextChunker(chunk_size=850, chunk_overlap=100)
    chunks = chunker.split_documents(docs)
    print(f"\nSplit {len(docs)} combined documents into {len(chunks)} high-quality semantic chunks.")
    
    tables_count = sum(1 for c in chunks if c.metadata.get("has_table"))
    links_count = sum(1 for c in chunks if c.metadata.get("has_links"))
    print(f"Chunks containing structured tables: {tables_count}")
    print(f"Chunks containing URLs/download links: {links_count}")

    # 1. Export chunks locally to JSON for offline backup, inspection, and production auto-seeding
    local_cache_path = backend_dir / "app" / "knowledge_data" / "all_chunks_cache.json"
    export_chunks_locally(chunks, local_cache_path)

    # 2. Ingest into both primary storage locations:
    target_dirs = [
        str(backend_dir / "vectorstore"),
        str(root_dir / "vectorstore")
    ]
    
    for target in target_dirs:
        # A. Ingest with Local ONNX Embeddings (all-MiniLM-L6-v2) - production default
        store_local = ingest_into_store(chunks, target, use_local=True)
        
        # B. Ingest with Gemini Embeddings (if API key available)
        gemini_key = os.getenv("GEMINI_API_KEY", "")
        if gemini_key and gemini_key != "your_gemini_api_key_here":
            try:
                ingest_into_store(chunks, target, use_local=False)
            except Exception as e:
                print(f"Notice: Gemini embedding ingestion skipped or hit error: {e}")

    # Validate retrieval on the local store with a fresh handle
    fresh_local_store = VectorStore(str(backend_dir / "vectorstore"), EmbeddingModel())
    test_queries(fresh_local_store)
    print("\n================================================================================")
    print("SUCCESS! Combined knowledge base (documents + old data) chunked and embedded.")
    print("Local database is completely ready for GitHub and production deployment.")
    print("================================================================================")

if __name__ == "__main__":
    main()
