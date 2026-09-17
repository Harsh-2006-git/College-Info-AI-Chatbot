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
        
        # 3. Perform keyword matching and merge
        merged_results = {}
        for res in filtered_vector_results:
            merged_results[res["id"]] = res
            
        if keywords:
            try:
                # Fast sample retrieval for keyword matches
                all_records = self.vector_store.collection.get(
                    include=["documents", "metadatas"],
                    limit=500
                )
                
                docs = all_records.get("documents", [])
                metadatas = all_records.get("metadatas", [])
                ids = all_records.get("ids", [])
                
                for doc, meta, cid in zip(docs, metadatas, ids):
                    meta = meta or {}
                    chunk_owner = meta.get("owner_id", "default")
                    is_kb = meta.get("is_knowledge_base", False)
                    doc_id = meta.get("document_id", "")
                    
                    if document_ids and len(document_ids) > 0:
                        if doc_id not in document_ids and not is_kb and not doc_id.startswith("knowledge_base/"):
                            continue
                            
                    if not (is_kb or chunk_owner in [owner_id, "default", "mits_official"] or doc_id.startswith("knowledge_base/")):
                        continue

                    match_count = sum(1 for kw in keywords if kw in doc.lower())
                    if match_count > 0:
                        kw_score = max(0.01, 0.5 - (match_count * 0.12))
                        if cid in merged_results:
                            merged_results[cid]["score"] = min(merged_results[cid]["score"], kw_score)
                        else:
                            merged_results[cid] = {
                                "id": cid,
                                "content": doc,
                                "metadata": meta,
                                "score": kw_score
                            }
            except Exception as e:
                print(f"Notice: Keyword search skipped ({e})")

                
        # 4. Sort by score ascending (lowest distance/score first)
        sorted_results = sorted(merged_results.values(), key=lambda x: x["score"])
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
