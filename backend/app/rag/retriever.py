import re
from typing import List, Dict, Any, Optional
from collections import Counter
from app.rag.vectorstore import VectorStore
from app.models.schemas import SourceChunk

class Retriever:
    def __init__(self, vector_store: VectorStore):
        self.vector_store = vector_store
        # Stopwords that appear across almost all university documents and dilute retrieval
        self.stopwords = {
            "tell", "about", "show", "many", "there", "what", "where", "whom", 
            "this", "that", "them", "then", "their", "they", "from", "with", 
            "have", "here", "know", "find", "give", "does", "mean", "name", 
            "info", "information", "some", "more", "very", "much", "please",
            "who", "the", "and", "for", "are", "can", "you", "mits", "gwalior",
            "institute", "college", "madhav", "in", "of", "to", "is", "a", "an",
            "any", "all", "our", "were", "been", "was", "will", "would", "should"
        }

    def _tokenize(self, text: str) -> List[str]:
        """Extract meaningful alphanumeric tokens from text."""
        return [w.lower() for w in re.findall(r'\b[A-Za-z0-9_]{2,}\b', text) if w.lower() not in self.stopwords]

    def retrieve(self, query: str, document_ids: Optional[List[str]] = None, top_k: int = 5, owner_id: Optional[str] = None) -> List[SourceChunk]:
        """
        Retrieve top_k chunks relevant to the query using robust Hybrid Search (Dense Vector + BM25 Lexical + RRF).
        Respects owner_id and document_ids filters, and deduplicates identical overlapping chunks.
        """
        clean_query = (query or "").strip()
        if not clean_query:
            return []

        # 1. Fetch all documents from vector store collection to filter and index
        try:
            all_store = self.vector_store.collection.get()
        except Exception as e:
            print(f"Error fetching collection from vector store: {e}")
            all_store = {'ids': [], 'documents': [], 'metadatas': []}

        all_ids = all_store.get('ids', [])
        all_docs = all_store.get('documents', [])
        all_metas = all_store.get('metadatas', [])

        # Filter by owner_id and document_ids
        accessible_indices = []
        for i, meta in enumerate(all_metas):
            meta = meta or {}
            chunk_owner = meta.get("owner_id", "default")
            is_kb = meta.get("is_knowledge_base", False)
            doc_id = meta.get("document_id", "")
            
            # Check document filter
            if document_ids and len(document_ids) > 0:
                if doc_id not in document_ids and not is_kb and not doc_id.startswith("knowledge_base/"):
                    continue
                    
            # Check owner filter
            if is_kb or chunk_owner in [owner_id, "default", "mits_official"] or doc_id.startswith("knowledge_base/"):
                accessible_indices.append(i)

        # Fallback to predefined knowledge base if collection is empty
        if not accessible_indices:
            try:
                from app.knowledge_base_data import PREDEFINED_KNOWLEDGE_BASE
                kb_sources = []
                query_tokens = self._tokenize(clean_query)
                for fname, full_text in PREDEFINED_KNOWLEDGE_BASE.items():
                    paragraphs = [p.strip() for p in full_text.split("\n\n") if p.strip()]
                    for p in paragraphs:
                        p_lower = p.lower()
                        kw_matches = sum(1 for kw in query_tokens if kw in p_lower)
                        if kw_matches > 0:
                            kb_sources.append(
                                SourceChunk(
                                    id=f"kb_{fname}",
                                    document_id=f"knowledge_base/{fname}",
                                    filename=fname,
                                    page=1,
                                    content=p,
                                    score=0.9
                                )
                            )
                if kb_sources:
                    return kb_sources[:top_k]
            except Exception as e:
                print(f"Predefined fallback error: {e}")
            return []

        accessible_ids_set = {all_ids[idx] for idx in accessible_indices}
        query_tokens = self._tokenize(clean_query)
        clean_query_lower = clean_query.lower()

        # 2. Vector Similarity Search with wide candidate pool
        vector_rank_map: Dict[str, tuple] = {}
        try:
            # Query vector store for candidates
            v_pool_size = min(60, len(accessible_indices))
            vector_raw = self.vector_store.similarity_search(
                query=clean_query,
                top_k=v_pool_size,
                filter_dict=None
            )
            v_rank = 0
            for item in vector_raw:
                cid = item.get("id")
                if cid in accessible_ids_set:
                    vector_rank_map[cid] = (v_rank, item.get("score", 0.5))
                    v_rank += 1
        except Exception as e:
            print(f"Error in vector similarity search: {e}")

        # 3. BM25 / Lexical Scoring across all accessible documents
        bm25_scores = []
        for idx in accessible_indices:
            cid = all_ids[idx]
            doc_text = all_docs[idx]
            doc_lower = doc_text.lower()
            doc_tokens = self._tokenize(doc_text)
            doc_len = len(doc_tokens) or 1
            tf = Counter(doc_tokens)

            lexical_score = 0.0
            for qt in query_tokens:
                if qt in tf:
                    term_freq = tf[qt]
                    # BM25 frequency saturation
                    lexical_score += (term_freq * 2.2) / (term_freq + 1.2 * (0.25 + 0.75 * (doc_len / 50.0)))

            # Phrase bonus for multi-word sequence match (e.g. "vice chancellor", "civil engineering")
            if len(query_tokens) >= 2:
                phrase = " ".join(query_tokens)
                if phrase in doc_lower:
                    lexical_score += 5.0
                else:
                    for p_i in range(len(query_tokens) - 1):
                        pair = f"{query_tokens[p_i]} {query_tokens[p_i+1]}"
                        if pair in doc_lower:
                            lexical_score += 2.0

            if lexical_score > 0:
                bm25_scores.append((cid, lexical_score))

        bm25_scores.sort(key=lambda x: x[1], reverse=True)
        bm25_rank_map = {item[0]: (rank, item[1]) for rank, item in enumerate(bm25_scores[:50])}

        # 4. Reciprocal Rank Fusion (RRF) & Deduplication
        all_candidate_ids = set(vector_rank_map.keys()) | set(bm25_rank_map.keys())
        id_to_idx = {all_ids[idx]: idx for idx in accessible_indices}

        rrf_candidates = []
        seen_snippets = set()

        for cid in all_candidate_ids:
            if cid not in id_to_idx:
                continue
            idx = id_to_idx[cid]
            content = all_docs[idx]
            meta = all_metas[idx] or {}

            # Deduplicate nearly identical chunks across files by body text (ignoring breadcrumb context header)
            lines = [l.strip() for l in content.splitlines() if l.strip() and not l.startswith("[MITS Knowledge Base") and not l.startswith("Section:")]
            body_sample = " ".join(lines)[:120].lower() if lines else content[:80].lower()
            norm_snip = re.sub(r'\s+', ' ', body_sample)

            v_rank = vector_rank_map.get(cid, (100, 1.0))[0]
            bm_rank = bm25_rank_map.get(cid, (100, 0.0))[0]

            # RRF combined score with heavier weight on precise keyword matches
            combined_score = (1.0 / (60.0 + v_rank)) + (1.6 / (60.0 + bm_rank))

            # Metadata keyword boosts: filename, section, breadcrumbs
            fname_stem = meta.get("filename", "").replace(".txt", "").replace(".md", "").lower()
            crumbs = meta.get("breadcrumbs", "").lower()
            section = meta.get("section", "").lower()
            for qt in query_tokens:
                if len(qt) >= 3:
                    if qt in fname_stem:
                        combined_score += 0.025
                    if qt in section:
                        combined_score += 0.020
                    if qt in crumbs:
                        combined_score += 0.015

            # Tabular data boost if query asks for data, records, intake, capacity, fees, statistics
            tabular_keywords = {"intake", "capacity", "statistics", "record", "records", "fee", "fees", "table", "package", "salary", "placement", "placements", "eligible", "placed"}
            if meta.get("has_table") and any(tk in clean_query_lower for tk in tabular_keywords):
                combined_score += 0.035

            # Academic level synonym mapping (e.g. b.tech -> under_graduate, m.tech -> post_graduate)
            if ("b.tech" in clean_query_lower or "btech" in clean_query_lower or "undergraduate" in clean_query_lower) and "under_graduate" in fname_stem:
                combined_score += 0.045
            if ("m.tech" in clean_query_lower or "mtech" in clean_query_lower or "postgraduate" in clean_query_lower) and "post_graduate" in fname_stem:
                combined_score += 0.045

            # Additional boost if exact multi-token query appears
            if len(query_tokens) >= 2 and " ".join(query_tokens) in content.lower():
                combined_score += 0.05

            rrf_candidates.append({
                "id": cid,
                "score": combined_score,
                "content": content,
                "meta": meta,
                "norm_snip": norm_snip
            })

        # Sort descending by combined RRF score
        rrf_candidates.sort(key=lambda x: x["score"], reverse=True)

        # 5. Format results as SourceChunk objects with diversity guarantee
        sources: List[SourceChunk] = []
        doc_counts = {}
        for item in rrf_candidates:
            if item["norm_snip"] in seen_snippets:
                continue

            meta = item["meta"]
            doc_id = meta.get('document_id', 'unknown')
            
            # Avoid a single file taking more than 2 slots in top_k
            if doc_counts.get(doc_id, 0) >= 2:
                continue

            seen_snippets.add(item["norm_snip"])
            doc_counts[doc_id] = doc_counts.get(doc_id, 0) + 1

            page_num = meta.get('page', 1)
            if isinstance(page_num, str):
                try:
                    page_num = int(page_num)
                except ValueError:
                    page_num = 1

            sources.append(
                SourceChunk(
                    id=item["id"],
                    document_id=doc_id,
                    filename=meta.get('filename', 'Unknown Document'),
                    page=page_num,
                    content=item["content"],
                    score=item["score"]
                )
            )
            if len(sources) >= top_k:
                break

        return sources
