from typing import List, Dict, Any, Optional
from app.rag.vectorstore import VectorStore
from app.models.schemas import SourceChunk

class Retriever:
    def __init__(self, vector_store: VectorStore):
        self.vector_store = vector_store

    def retrieve(self, query: str, document_ids: Optional[List[str]] = None, top_k: int = 5, owner_id: Optional[str] = None) -> List[SourceChunk]:
        """
        Retrieve top_k chunks relevant to the query.
        Optionally filter by document_ids.
        Uses a hybrid search combining vector similarity search and keyword matching.
        """
        clean_query = (query or "").strip()
        if not clean_query:
            return []
        query = clean_query

        
        # 1. Perform vector similarity search
        vector_results = []
        try:
            vector_results = self.vector_store.similarity_search(
                query=query,
                top_k=top_k * 3,
                filter_dict=None
            )
        except Exception as e:
            print(f"Error in vector similarity search: {e}")

        # Filter vector results in Python for robustness
        filtered_vector_results = []
        for res in vector_results:
            meta = res.get("metadata", {})
            chunk_owner = meta.get("owner_id", "default")
            is_kb = meta.get("is_knowledge_base", False)
            doc_id = meta.get("document_id", "")
            
            # Check document filter
            if document_ids and len(document_ids) > 0:
                if doc_id not in document_ids and not is_kb and not doc_id.startswith("knowledge_base/"):
                    continue
                    
            # Check owner filter
            if is_kb or chunk_owner in [owner_id, "default", "mits_official"] or doc_id.startswith("knowledge_base/"):
                filtered_vector_results.append(res)

        # 2. Extract keywords from query
        import re
        words = re.findall(r'\b[A-Za-z0-9_]{3,}\b', query)
        stopwords = {
            "tell", "about", "show", "many", "there", "what", "where", "whom", 
            "this", "that", "them", "then", "their", "they", "from", "with", 
            "have", "here", "know", "find", "give", "does", "mean", "name", 
            "info", "information", "some", "more", "very", "much", "please"
        }
        keywords = [w.lower() for w in words if w.lower() not in stopwords]
        
        # 3. Apply keyword matching to boost semantically relevant chunks
        if keywords:
            for res in filtered_vector_results:
                doc_lower = res.get("content", "").lower()
                match_count = sum(1 for kw in keywords if kw in doc_lower)
                if match_count > 0:
                    # Give a proportional boost (lower score is closer distance in cosine space)
                    res["score"] = res["score"] * (1.0 - 0.08 * min(match_count, 4))
                    
        # 4. Fallback to PREDEFINED_KNOWLEDGE_BASE if vector search returns no results
        if not filtered_vector_results:
            try:
                from app.knowledge_base_data import PREDEFINED_KNOWLEDGE_BASE
                kb_chunks = []
                for fname, full_text in PREDEFINED_KNOWLEDGE_BASE.items():
                    # Split into natural paragraphs/sections
                    paragraphs = [p.strip() for p in full_text.split("\n\n") if p.strip()]
                    for p_idx, p in enumerate(paragraphs):
                        p_lower = p.lower()
                        match_count = sum(1 for kw in keywords if kw in p_lower) if keywords else 0
                        if match_count > 0:
                            score = max(0.05, 0.40 - (match_count * 0.08))
                            kb_chunks.append({
                                "id": f"kb_{fname}_{p_idx}",
                                "content": p,
                                "metadata": {
                                    "document_id": f"knowledge_base/{fname}",
                                    "filename": fname,
                                    "owner_id": "default",
                                    "is_knowledge_base": True,
                                    "page": 1
                                },
                                "score": score
                            })
                if kb_chunks:
                    kb_chunks.sort(key=lambda x: x["score"])
                    filtered_vector_results = kb_chunks[:top_k * 2]
            except Exception as e:
                print(f"Notice: Predefined KB fallback error: {e}")

        # 5. Sort by score ascending (lowest distance/score first)
        sorted_results = sorted(filtered_vector_results, key=lambda x: x["score"])
        final_results = sorted_results[:top_k]
        
        # Format results as SourceChunk objects
        sources = []
        for result in final_results:
            metadata = result.get('metadata', {})
            
            page_num = metadata.get('page', 0)
            if isinstance(page_num, str):
                try:
                    page_num = int(page_num)
                except ValueError:
                    page_num = 0
                    
            sources.append(
                SourceChunk(
                    id=result.get('id', ''),
                    document_id=metadata.get('document_id', 'unknown'),
                    filename=metadata.get('filename', 'Unknown Document'),
                    page=page_num,
                    content=result.get('content', ''),
                    score=result.get('score', 0.0)
                )
            )
            
        return sources
