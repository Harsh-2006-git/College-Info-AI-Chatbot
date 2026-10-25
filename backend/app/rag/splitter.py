import re
from typing import List, Dict, Any, Optional
from langchain_core.documents import Document

class TextChunker:
    """
    Intelligent, structure-aware semantic chunker tailored for university knowledge bases:
    1. Preserves Markdown and delimiter tables intact without cutting rows or separating headers.
    2. Preserves Markdown links [text](url) and bare URLs without splitting them across chunks.
    3. Respects Markdown hierarchy (#, ##, ###, horizontal rules, and double newlines).
    4. Automatically prepends hierarchical context breadcrumbs (Category > Department > Document Title)
       to each chunk for dense semantic alignment in vector and lexical search.
    5. Extracts rich metadata: has_table, has_links, url_count, category, subcategory, filename.
    """
    def __init__(
        self,
        chunk_size: int = 850,
        chunk_overlap: int = 100,
        min_chunk_size: int = 200,
        max_chunk_size: int = 1500
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.min_chunk_size = min_chunk_size
        self.max_chunk_size = max_chunk_size
        self.url_pattern = re.compile(r'https?://[^\s\)\>\]]+')
        self.md_link_pattern = re.compile(r'\[([^\]]+)\]\((https?://[^\)]+)\)')

    def is_table_row(self, line: str) -> bool:
        s = line.strip()
        return bool(s and (s.count('|') >= 2 or s.count('||') >= 1))

    def is_separator_row(self, line: str) -> bool:
        s = line.strip().replace(' ', '')
        if re.match(r'^\|?(:?-+:?\|)+:?-+:?\|?$', s):
            return True
        if re.match(r'^-{3,}$', s) or re.match(r'^={3,}$', s):
            return True
        return False

    def extract_breadcrumbs(self, metadata: Dict[str, Any]) -> str:
        source = metadata.get("source", "") or metadata.get("relative_path", "") or metadata.get("filename", "")
        norm_source = source.replace("\\", "/")
        parts = [p for p in norm_source.split("/") if p and p not in ("documents", ".")]
        
        crumbs = []
        for p in parts[:-1]:
            clean_part = p.replace("_", " ").replace("&", " & ").title()
            crumbs.append(clean_part)
        
        filename = metadata.get("filename", parts[-1] if parts else "document")
        clean_name = filename.replace(".txt", "").replace(".md", "").replace("_", " ").title()
        crumbs.append(clean_name)
        
        return " > ".join(crumbs)

    def split_text_into_blocks(self, text: str) -> List[Dict[str, Any]]:
        """
        Group text into semantic blocks:
        - Heading blocks
        - Table blocks (complete tables kept together)
        - Paragraph blocks (separated by blank lines)
        """
        lines = text.splitlines()
        blocks = []
        i = 0
        n = len(lines)
        
        current_heading = ""
        
        while i < n:
            line = lines[i]
            stripped = line.strip()
            
            if not stripped:
                i += 1
                continue
                
            # Check for Heading
            is_heading = False
            if stripped.startswith('#'):
                hashes = len(stripped) - len(stripped.lstrip('#'))
                if hashes <= 6 and (len(stripped) == hashes or stripped[hashes] == ' '):
                    is_heading = True
            elif (
                i + 1 < n 
                and lines[i+1].strip() 
                and (lines[i+1].strip().startswith('===') or lines[i+1].strip().startswith('---')) 
                and len(stripped) >= 3 
                and not self.is_table_row(stripped)
            ):
                is_heading = True
                
            if is_heading:
                heading_text = stripped.lstrip('#').strip()
                current_heading = heading_text
                if (
                    i + 1 < n 
                    and lines[i+1].strip() 
                    and (lines[i+1].strip().startswith('===') or lines[i+1].strip().startswith('---')) 
                    and not stripped.startswith('#')
                ):
                    blocks.append({
                        "type": "heading",
                        "heading": heading_text,
                        "text": f"{line}\n{lines[i+1]}",
                        "is_table": False
                    })
                    i += 2
                    continue
                else:
                    blocks.append({
                        "type": "heading",
                        "heading": heading_text,
                        "text": line,
                        "is_table": False
                    })
                    i += 1
                    continue
                    
            # Check for Table Block
            if self.is_table_row(line):
                table_lines = [line]
                i += 1
                while i < n and (self.is_table_row(lines[i]) or self.is_separator_row(lines[i])):
                    table_lines.append(lines[i])
                    i += 1
                table_text = "\n".join(table_lines)
                blocks.append({
                    "type": "table",
                    "heading": current_heading,
                    "text": table_text,
                    "is_table": True,
                    "rows": table_lines
                })
                continue
                
            # Paragraph or list block
            para_lines = [line]
            i += 1
            while i < n:
                nxt = lines[i]
                nxt_stripped = nxt.strip()
                if not nxt_stripped:
                    break
                if nxt_stripped.startswith('#') and len(nxt_stripped) > 1 and nxt_stripped[1] in ('#', ' '):
                    break
                if self.is_table_row(nxt):
                    break
                para_lines.append(nxt)
                i += 1
                
            blocks.append({
                "type": "paragraph",
                "heading": current_heading,
                "text": "\n".join(para_lines),
                "is_table": False
            })
            
        return blocks

    def split_documents(self, documents: List[Document]) -> List[Document]:
        """Split a list of documents into structure-preserving semantic chunks with context headers."""
        all_chunks = []
        
        for doc_idx, doc in enumerate(documents):
            meta = dict(doc.metadata or {})
            raw_text = doc.page_content.strip()
            if not raw_text:
                continue
                
            breadcrumbs = self.extract_breadcrumbs(meta)
            blocks = self.split_text_into_blocks(raw_text)
            
            current_chunk_blocks = []
            current_length = 0
            doc_chunks = []
            current_section_heading = ""
            
            for block in blocks:
                b_text = block["text"]
                b_len = len(b_text)
                
                if block.get("heading"):
                    current_section_heading = block["heading"]
                    
                # If a single table is extremely large, split by table rows repeating header
                if block.get("is_table") and b_len > self.max_chunk_size:
                    if current_chunk_blocks:
                        merged = "\n\n".join(cb["text"] for cb in current_chunk_blocks).strip()
                        if merged:
                            doc_chunks.append({
                                "text": merged,
                                "section": current_section_heading,
                                "has_table": any(cb["is_table"] for cb in current_chunk_blocks)
                            })
                        current_chunk_blocks = []
                        current_length = 0
                        
                    table_rows = block.get("rows", [])
                    header_row = table_rows[0] if table_rows else ""
                    sub_rows = []
                    sub_len = 0
                    
                    for r in table_rows[1:]:
                        if sub_len + len(r) > self.chunk_size and len(sub_rows) > 0:
                            t_chunk = header_row + "\n" + "\n".join(sub_rows)
                            doc_chunks.append({
                                "text": t_chunk,
                                "section": current_section_heading,
                                "has_table": True
                            })
                            sub_rows = [r]
                            sub_len = len(r)
                        else:
                            sub_rows.append(r)
                            sub_len += len(r)
                            
                    if sub_rows:
                        t_chunk = header_row + "\n" + "\n".join(sub_rows)
                        doc_chunks.append({
                            "text": t_chunk,
                            "section": current_section_heading,
                            "has_table": True
                        })
                    continue
                    
                # Normal block aggregation
                if current_length + b_len > self.chunk_size and current_length >= self.min_chunk_size:
                    merged = "\n\n".join(cb["text"] for cb in current_chunk_blocks).strip()
                    if merged:
                        doc_chunks.append({
                            "text": merged,
                            "section": current_section_heading,
                            "has_table": any(cb["is_table"] for cb in current_chunk_blocks)
                        })
                    current_chunk_blocks = [block]
                    current_length = b_len
                else:
                    current_chunk_blocks.append(block)
                    current_length += b_len + 2
                    
            if current_chunk_blocks:
                merged = "\n\n".join(cb["text"] for cb in current_chunk_blocks).strip()
                if merged:
                    doc_chunks.append({
                        "text": merged,
                        "section": current_section_heading,
                        "has_table": any(cb["is_table"] for cb in current_chunk_blocks)
                    })
                    
            # Build final Document objects with context headers and metadata
            for c_idx, c_info in enumerate(doc_chunks):
                body = c_info["text"]
                section = c_info.get("section", "")
                
                header_line = f"[MITS Knowledge Base | {breadcrumbs}]"
                if section and section.lower() not in breadcrumbs.lower():
                    context_prefix = f"{header_line}\nSection: {section}\n\n"
                else:
                    context_prefix = f"{header_line}\n\n"
                    
                full_content = context_prefix + body
                
                urls = self.url_pattern.findall(body)
                md_links = self.md_link_pattern.findall(body)
                
                chunk_meta = dict(meta)
                base_id = meta.get('document_id', f'doc_{doc_idx}')
                clean_id_suffix = re.sub(r'[^a-zA-Z0-9_-]', '_', base_id)
                chunk_meta["chunk_id"] = f"{clean_id_suffix}_c{c_idx}"
                chunk_meta["chunk_index"] = c_idx
                chunk_meta["total_chunks"] = len(doc_chunks)
                chunk_meta["has_table"] = c_info.get("has_table", False)
                chunk_meta["has_links"] = bool(urls or md_links)
                chunk_meta["url_count"] = len(urls)
                chunk_meta["breadcrumbs"] = breadcrumbs
                if section:
                    chunk_meta["section"] = section
                    
                all_chunks.append(Document(page_content=full_content, metadata=chunk_meta))
                
        return all_chunks

    def split_text(self, text: str) -> List[str]:
        """Split raw text into chunks."""
        dummy_doc = Document(page_content=text, metadata={"document_id": "text"})
        chunks = self.split_documents([dummy_doc])
        return [c.page_content for c in chunks]
