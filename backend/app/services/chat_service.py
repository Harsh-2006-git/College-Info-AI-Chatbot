import os
import sys
import time
import re
import json
from typing import List, Dict, Any, Optional

import google.generativeai as genai
from app.rag.retriever import Retriever
from app.models.schemas import ChatRequest, ChatResponse, SourceChunk, RAGAnalytics

# ── Official MITS System Prompt ──────────────────────────

SYSTEM_PROMPT = """\
You are the official AI assistant for Madhav Institute of Technology & Science (MITS), Gwalior — one of the premier engineering institutions in Madhya Pradesh.

══ ABSOLUTE RULES ══
1. ALWAYS answer from the CONTEXT block below. Every fact, number, date, fee, or name MUST come from that context.
2. NEVER say "context", "document", "provided information", "based on the information", "according to the data". Speak as an authoritative official assistant.
3. NEVER start with filler: "Sure!", "Of course!", "Great question!", "Certainly!", "Hello!".
4. NEVER hallucinate. If a specific fact is not in the context, say exactly: "I don't have that specific information. Please contact the MITS office or visit web.mitsgwalior.in"
5. NEVER truncate your answer mid-sentence. Complete every sentence you start.
6. NEVER summarize away important details. If the context contains a list of names, requirements, or steps, you MUST list ALL of them in your answer.
7. **CRITICAL — NO REDIRECTS**: NEVER say things like "see faculty_profiles.md", "refer to the document", "visit the website for details", "please check the official portal". If data is in your context, USE IT and present it directly. Only use the fallback message from Rule 4 if the specific fact is truly absent.
8. **CRITICAL — FULL PROFILES**: When asked about a specific person (e.g. "who is Praveen Bansal"), you MUST extract and present ALL available details from context: designation, qualifications, research interests, email, phone, and any other listed attributes. Do NOT give a partial answer.
9. **CRITICAL — DOWNLOAD LINKS & PDF REMARKS**: Whenever any document, notice, syllabus, fee structure, ordinance, or official form has a URL or download link available in the context or available links:
   - You MUST include the full clickable Markdown hyperlink in your answer.
   - You MUST explicitly add a clear remark stating that this is the link to download the PDF / document (e.g. "📥 **Download PDF:** [Download <Document Name> (PDF)](<url>)" or "Official download link for the PDF: [Download <Document Name> (PDF)](<url>)").
   - Clearly state that the user can click the link to download or view the official PDF document.
   - NEVER mention or describe a document, scheme, or category without providing its direct download link if one exists in the context.
   - Label all PDF links clearly with "(PDF)".
10. **CRITICAL — FULL FACULTY LISTS**: When asked for all faculties, faculty members, or professors of a department (e.g. "all faculties of CSE", "who are the faculties in mechanical"), you MUST list EVERY SINGLE faculty member present in the context. NEVER truncate, never provide only 1 or 2 names, and NEVER say "and others". List all of them clearly as a numbered list with their designation.
11. **CRITICAL — FULL LABORATORY (LAB) LISTS**: "lab", "labs", and "laboratories" refer to the exact same thing. When asked for laboratories or labs of a department (e.g. "labs in CSE", "laboratories in civil"), you MUST list EVERY SINGLE laboratory present in the context. Never provide only 1 or 2. If a lab manual or PDF link is available in the context, provide it with the explicit download remark.

══ CLARIFICATION BEHAVIOR (IMPORTANT) ══
If the user's question is vague, ambiguous, or could refer to multiple topics, you MUST ask a clarifying question INSTEAD of guessing. Examples:
• "faculties" → Ask: "Could you clarify which department's faculty you'd like to know about? For example: CSE, IoT, Mechanical, etc."
• "fees" → Ask: "Which program's fee structure are you looking for? For example: B.Tech, M.Tech, MBA, or Ph.D.?"
• "placements" → Ask: "Are you asking about the overall placement statistics, a specific branch's placements, or the top recruiters?"
• "tell me about mits" → This is clear enough — answer it directly.

Rules for clarification:
- Only ask ONE focused clarifying question, not multiple.
- Provide 2-4 specific options the user can pick from (as shown above).
- If the question IS clear enough to answer, answer it directly. Do NOT over-clarify obvious questions.
- When asking a clarifying question, set confidence to 0.50 and put your clarifying question in the "answer" field.
- A specific person's name (e.g. "Praveen Bansal") is ALWAYS a clear, unambiguous query — answer it directly, never ask for clarification.

══ SOURCE PRIORITY ══
• ✔ [VERIFIED] = Manually curated, 100% authoritative MITS data. Use verbatim numbers (fees, cutoffs, packages).
• [UPLOADED] = Official uploaded documents. High trust, use as-is.
• No label = Web-crawled data. Use only if no VERIFIED source covers the topic.
If VERIFIED and web sources conflict → ALWAYS use VERIFIED.

══ FORMATTING & STRUCTURE RULES (STRICT) ══
• ALWAYS use clean, readable Markdown with generous paragraph spacing.
• Separate distinct paragraphs with a blank line (\\n\\n). NEVER combine separate sentences or steps into a continuous wall of text.
• Use ### Headings for distinct topics or sections (e.g. ### B.Tech Admission Requirements, ### Key Steps, ### NRI Quota).
• Use bullet lists (- item) for steps, requirements, or lists. ALWAYS put a blank line before starting a list, and put each bullet on its own line.
• Use **bold** for key terms, dates, exams, and amounts.
• Never cram multiple points into a single line.
• For fees/numbers: always include the unit (₹, %, years, etc.).

══ RESPONSE FORMAT ══
You MUST respond ONLY with this exact JSON (no text before or after):
{
  "answer": "Your complete Markdown answer here",
  "confidence": 0.92,
  "sources_used": [0, 1],
  "suggested_followups": ["Question 1?", "Question 2?", "Question 3?"]
}

confidence rules:
- 0.90-0.99 → VERIFIED sources used, direct answer available
- 0.70-0.89 → UPLOADED doc sources, good coverage
- 0.50-0.69 → Web sources only, answer inferred, OR clarification needed
- 0.20-0.49 → Partial or uncertain information
- 0.10-0.19 → Fallback / no relevant context found

sources_used: 0-indexed list of which [Source N] blocks you used.
suggested_followups: Array of exactly 3 relevant, short, curiosity-driven follow-up questions the user could ask next. If you cannot think of any, provide 3 general MITS questions."""


# ── RAG Prompt Builder ───────────────────────────────────

def build_rag_prompt(
    question: str,
    context_chunks: List[Dict],
    memory_context: str = "",
) -> str:
    """
    Build the highest-quality RAG prompt.

    Strategy:
    - Sort chunks so VERIFIED (trust>=0.99) always appear FIRST in context
    - Include chunk index, trust tier, relevance, and source in each block
    - Keep VERIFIED and UPLOADED chunks' full text; truncate web chunks to 600 chars
    - Inject conversation memory concisely after context
    """
    sorted_chunks: List[Dict] = []
    if not context_chunks:
        context_text = (
            "NO_CONTEXT_AVAILABLE: The vector database returned zero matching chunks for this query. "
            "You MUST respond with the fallback message: "
            "'I don't have that specific information. Please contact the MITS office or visit web.mitsgwalior.in'"
            " Do NOT invent any names, emails, phone numbers, or facts."
        )
    else:
        doc_chunks = [c for c in context_chunks if c.get("source_type") != "graph"]
        context_chunks = doc_chunks

        def _priority(c: Dict) -> int:
            t = c.get("trust_score", 0.5)
            if t >= 0.99:
                return 0
            if t >= 0.70:
                return 1
            return 2

        sorted_chunks = sorted(context_chunks, key=_priority)

        context_parts = []
        for i, chunk in enumerate(sorted_chunks):
            source   = chunk.get("filename", "Unknown Source")
            url      = chunk.get("source_url", "")
            text     = chunk.get("text", "").strip()
            trust    = float(chunk.get("trust_score", 0.5))
            src_type = chunk.get("source_type", "web_crawl")
            score    = chunk.get("rerank_score", chunk.get("score", 0.0))
            category = chunk.get("category", "")

            if src_type == "golden_knowledge" or trust >= 0.99:
                tier = "✔ [VERIFIED — USE FIRST]"
                max_len = 2200
            elif trust >= 0.70:
                tier = "[UPLOADED]"
                max_len = 1600
            else:
                tier = "[WEB]"
                max_len = 700

            if len(text) > max_len:
                text = text[:max_len].rsplit(" ", 1)[0] + "…"

            header_parts = [f"Source {i}", tier, source]
            if category:
                header_parts.append(f"cat:{category}")
            header_parts.append(f"rel:{score:.3f}")
            header = " | ".join(header_parts)

            block = f"[{header}]\n{text}"
            if url and src_type != "golden_knowledge":
                block += f"\n↳ {url}"

            context_parts.append(block)

        context_text = "\n\n━━━\n\n".join(context_parts)

    memory_section = ""
    if memory_context and memory_context.strip():
        memory_section = f"\n\n── CONVERSATION CONTEXT ──\n{memory_context.strip()}"

    # Build a compact download links reference
    links_section = ""
    if sorted_chunks:
        link_lines = []
        seen_urls = set()
        for i, chunk in enumerate(sorted_chunks):
            url = (chunk.get("source_url", "") or "").strip()
            fname = chunk.get("filename", "")
            if url and url.startswith("http") and url not in seen_urls:
                seen_urls.add(url)
                label = fname if fname else f"Source {i}"
                if url.lower().endswith(".pdf") or "/pdf/" in url.lower():
                    link_lines.append(f"  - Download PDF: [Download {label} (PDF)]({url})")
                else:
                    link_lines.append(f"  - Link: [{label}]({url})")

            text = chunk.get("text", "")
            found_md_links = re.findall(r'\[([^\]]+)\]\((https?://[^\s\)]+)\)', text)
            for link_label, link_url in found_md_links:
                if link_url not in seen_urls:
                    seen_urls.add(link_url)
                    if link_url.lower().endswith(".pdf") or "/pdf/" in link_url.lower() or "pdf" in link_label.lower():
                        clean_label = link_label if "pdf" in link_label.lower() else f"{link_label} (PDF)"
                        link_lines.append(f"  - Download PDF: [{clean_label}]({link_url})")
                    else:
                        link_lines.append(f"  - Link: [{link_label}]({link_url})")

        if link_lines:
            links_section = (
                "\n\n══ AVAILABLE OFFICIAL DOWNLOAD LINKS & URLS ══\n"
                "The following official download links are available. When you refer to any of these documents or topics, "
                "you MUST include each relevant link in your response with a clear remark that this is the link to download the PDF "
                "(e.g. \"📥 **Download PDF:** [Download ... (PDF)](url)\" or \"Official download link to download the PDF: [Download ... (PDF)](url)\"):\n"
                + "\n".join(link_lines)
            )

    prompt = f"""══ CONTEXT (official MITS sources) ══
{context_text}{memory_section}{links_section}

══ STUDENT QUESTION ══
{question}

Respond ONLY with valid JSON: {{"answer": "...", "confidence": 0.XX, "sources_used": [N, ...], "suggested_followups": ["...", "...", "..."]}}
CRITICAL: For every document, fee structure, or notice mentioned, explicitly include the remark indicating that this is the link to download the PDF (e.g. "📥 **Download PDF:** [Download ... (PDF)](url)"). NEVER omit download links."""

    return prompt


# ── Escalation Logic ─────────────────────────────────────

def needs_escalation(question: str, context_chunks: List[Dict]) -> bool:
    """
    Decide if question needs a higher-capacity reasoning model.
    """
    q_lower = question.lower()
    complex_markers = [
        "compare", "difference between", "explain why", "analyze",
        "pros and cons", "which is better", "how does", "step by step",
        "what are the steps", "detailed process", "explain in detail",
        "why is", "how to apply", "eligibility criteria", "fee structure",
        "all faculties", "all laboratories", "placement statistics"
    ]
    if any(marker in q_lower for marker in complex_markers):
        return True

    if context_chunks:
        max_score = max(c.get("rerank_score", c.get("score", 0)) for c in context_chunks)
        if max_score < 0.25:
            return True

    if len(question.split()) > 18:
        return True

    return False


class ChatService:
    def __init__(self, retriever: Retriever, api_key: str, groq_key: str = ""):
        self.retriever = retriever
        self.groq_key = groq_key
        
        self.gemini_keys = [k.strip() for k in api_key.split(",") if k.strip() and k.strip() != "your_gemini_api_key_here"]
        self.current_gemini_idx = 0
        self.api_key_configured = len(self.gemini_keys) > 0
        
        self.groq_keys = [k.strip() for k in groq_key.split(",") if k.strip()]
        self.current_groq_idx = 0
        
        self._configure_gemini()

    def _configure_gemini(self):
        if not self.gemini_keys:
            self.api_key_configured = False
            return
        active_key = self.gemini_keys[self.current_gemini_idx]
        try:
            genai.configure(api_key=active_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
            self.api_key_configured = True
            print(f"Gemini configured with key index {self.current_gemini_idx}")
        except Exception as e:
            print(f"Error configuring Gemini with key index {self.current_gemini_idx}: {e}")

    def _rotate_gemini_key(self) -> bool:
        if len(self.gemini_keys) <= 1:
            return False
        self.current_gemini_idx = (self.current_gemini_idx + 1) % len(self.gemini_keys)
        print(f"Rotating to Gemini key index {self.current_gemini_idx}...")
        self._configure_gemini()
        return True

    def _rotate_groq_key(self) -> bool:
        if len(self.groq_keys) <= 1:
            return False
        self.current_groq_idx = (self.current_groq_idx + 1) % len(self.groq_keys)
        print(f"Rotating to Groq key index {self.current_groq_idx}...")
        return True

    def _get_active_groq_key(self) -> str:
        if not self.groq_keys:
            return ""
        return self.groq_keys[self.current_groq_idx]

    def _filter_used_sources(self, original_sources: List[SourceChunk], used_indices: Any) -> List[SourceChunk]:
        if used_indices and isinstance(used_indices, list):
            valid = []
            for idx in used_indices:
                if isinstance(idx, int) and 0 <= idx < len(original_sources):
                    valid.append(original_sources[idx])
            if valid:
                return valid
        return original_sources

    def _parse_llm_json(self, raw_output: str, original_sources: List[SourceChunk]):
        """Robustly parse structured JSON response from LLM output, extracting pure Markdown."""
        raw_output = (raw_output or "").strip()
        if not raw_output:
            return "", 0.1, original_sources, []

        # 1. Check for code fence
        json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', raw_output, re.DOTALL)
        candidate_str = json_match.group(1).strip() if json_match else ""

        # 2. Check if raw_output has braces
        if not candidate_str:
            first_brace = raw_output.find("{")
            last_brace = raw_output.rfind("}")
            if first_brace != -1 and last_brace > first_brace:
                candidate_str = raw_output[first_brace:last_brace+1].strip()
            elif first_brace != -1:
                candidate_str = raw_output[first_brace:].strip()

        if candidate_str:
            # A. Direct JSON parse
            try:
                parsed = json.loads(candidate_str)
                if isinstance(parsed, dict) and "answer" in parsed:
                    ans = parsed.get("answer", "")
                    conf = float(parsed.get("confidence", 0.92))
                    used = parsed.get("sources_used", [])
                    followups = parsed.get("suggested_followups", [])
                    return ans.strip(), conf, self._filter_used_sources(original_sources, used), followups
            except Exception:
                pass

            # B. Clean invalid JSON backslash escapes (e.g. \*, \-, \[, \], etc.)
            cleaned = re.sub(r'\\([^"\\/bfnrtu])', r'\1', candidate_str)
            try:
                parsed = json.loads(cleaned)
                if isinstance(parsed, dict) and "answer" in parsed:
                    ans = parsed.get("answer", "")
                    conf = float(parsed.get("confidence", 0.92))
                    used = parsed.get("sources_used", [])
                    followups = parsed.get("suggested_followups", [])
                    return ans.strip(), conf, self._filter_used_sources(original_sources, used), followups
            except Exception:
                pass

            # C. Resilient Regex Extraction for "answer": "..."
            answer_match = re.search(r'"answer"\s*:\s*"(.*)', candidate_str, re.DOTALL)
            if answer_match:
                content = answer_match.group(1)
                end_match = re.search(r'(.*?)(?:",\s*"(?:confidence|sources_used|suggested_followups)"|"\s*\}\s*$)', content, re.DOTALL)
                raw_ans = end_match.group(1) if end_match else content
                raw_ans = re.sub(r'"\s*\}\s*$', '', raw_ans)
                raw_ans = re.sub(r'"\s*$', '', raw_ans)
                decoded = raw_ans.replace('\\n', '\n').replace('\\t', '\t').replace('\\"', '"').replace('\\/', '/').replace('\\\\', '\\')
                decoded = re.sub(r'\\([*_\-\[\]\(\)#`])', r'\1', decoded).strip()
                if decoded:
                    followups = []
                    f_match = re.search(r'"suggested_followups"\s*:\s*\[(.*?)\]', candidate_str, re.DOTALL)
                    if f_match:
                        try:
                            followups = json.loads(f"[{f_match.group(1)}]")
                        except Exception:
                            pass
                    return decoded, 0.92, original_sources, followups

        # 3. If raw_output starts with { "answer":, strip the JSON envelope completely
        if raw_output.startswith("{") and '"answer"' in raw_output:
            cleaned = re.sub(r'^\s*\{\s*"answer"\s*:\s*"', '', raw_output)
            cleaned = re.sub(r'"\s*,\s*"confidence".*$', '', cleaned, flags=re.DOTALL)
            cleaned = re.sub(r'"\s*\}\s*$', '', cleaned)
            cleaned = cleaned.replace('\\n', '\n').replace('\\"', '"').strip()
            return cleaned, 0.85, original_sources, []

        return raw_output, 0.85, original_sources, []

    def generate_answer(self, request: ChatRequest) -> ChatResponse:
        start_time = time.time()
        
        # 0. Check for simple greetings to bypass retrieval and LLM call
        clean_question = request.question.strip().lower().rstrip("?.!")
        if clean_question in ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"]:
            return ChatResponse(
                answer="Hello! I am the official AI assistant for Madhav Institute of Technology & Science (MITS), Gwalior. How can I assist you today regarding courses, admissions, fees, faculties, or placements?",
                sources=[],
                processing_time_ms=0,
                confidence=0.99,
                suggested_followups=[
                    "What are the B.Tech programmes offered?",
                    "What is the fee structure for B.Tech?",
                    "How are the campus placements at MITS?"
                ]
            )
        
        # 1. Determine retrieval mode and execute search
        retrieval_mode = request.retrieval_mode or "history_aware"
        model_name = request.model or "llama-3.3-70b-versatile"
        
        if request.history:
            request.history = request.history[-4:]

        search_query = request.question
        retrieved_queries = []

        # Build history log
        history_log = ""
        if request.history:
            history_log = "Previous Conversation History:\n"
            for msg in request.history:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                role_name = "Assistant" if role in ["assistant", "ai"] else "User"
                history_log += f"{role_name}: {content}\n"
            history_log += "\n"
            
        # STEP A: Standalone Query Rewriting
        if retrieval_mode in ["history_aware", "advanced"] and request.history:
            search_query = self._rewrite_query(request.question, history_log, model_name)
            if not search_query or not search_query.strip():
                search_query = request.question.strip()
            retrieved_queries.append(search_query)
        else:
            search_query = request.question.strip()
            retrieved_queries.append(search_query)
            
        # STEP B: Retrieve relevant contexts (with top_k=7 for rich multi-topic context)
        target_top_k = 7
        if retrieval_mode in ["multi_query", "advanced"]:
            variations = self._generate_query_variations(search_query, model_name)
            variations = [v.strip() for v in variations if v and v.strip()]
            retrieved_queries.extend(variations)
            
            all_lists = []
            all_lists.append(self.retriever.retrieve(
                query=search_query,
                document_ids=request.document_ids,
                top_k=target_top_k,
                owner_id=request.owner_id
            ))
            for var in variations:
                all_lists.append(self.retriever.retrieve(
                    query=var,
                    document_ids=request.document_ids,
                    top_k=target_top_k,
                    owner_id=request.owner_id
                ))
            sources = self._reciprocal_rank_fusion(all_lists)[:target_top_k]
        else:
            sources = self.retriever.retrieve(
                query=search_query,
                document_ids=request.document_ids,
                top_k=target_top_k,
                owner_id=request.owner_id
            )

        # 2. Convert retrieved sources to context chunk dicts
        context_chunk_dicts = []
        for s in sources:
            is_kb = s.document_id.startswith("knowledge_base/")
            trust = 0.99 if is_kb else 0.75
            context_chunk_dicts.append({
                "filename": s.filename,
                "source_url": s.document_id,
                "text": s.content,
                "trust_score": trust,
                "source_type": "golden_knowledge" if is_kb else "uploaded_doc",
                "score": s.score,
                "rerank_score": s.score
            })

        # 3. Build RAG prompt with verified source prioritization and download link extraction
        rag_prompt = build_rag_prompt(
            question=request.question,
            context_chunks=context_chunk_dicts,
            memory_context=history_log
        )

        # 4. Construct messages for chat-based LLMs
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": rag_prompt}
        ]

        # 5. Call LLM (Groq / Ollama / Gemini)
        raw_answer = ""
        is_escalated = needs_escalation(request.question, context_chunk_dicts)
        
        if "groq" in model_name.lower() or model_name == "llama-3.3-70b-versatile":
            candidate_models = (
                ["llama-3.3-70b-versatile", "openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"]
                if is_escalated else
                ["llama-3.3-70b-versatile", "openai/gpt-oss-20b", "qwen/qwen3.8-27b", "openai/gpt-oss-120b"]
            )
            max_attempts = max(1, len(self.groq_keys))
            for attempt in range(max_attempts):
                active_groq_key = self._get_active_groq_key()
                if not active_groq_key:
                    raw_answer = '{"answer": "Groq API key is not configured. Please set GROQ_API_KEY in the backend .env file.", "confidence": 0.1}'
                    break
                
                success = False
                for candidate in candidate_models:
                    try:
                        import httpx
                        print(f"Sending chat messages to Groq model {candidate} (attempt {attempt+1}/{max_attempts})...")
                        response = httpx.post(
                            "https://api.groq.com/openai/v1/chat/completions",
                            headers={
                                "Authorization": f"Bearer {active_groq_key}",
                                "Content-Type": "application/json"
                            },
                            json={
                                "model": candidate,
                                "messages": messages,
                                "temperature": 0.15,
                                "max_tokens": 2500
                            },
                            timeout=45.0
                        )
                        if response.status_code == 404:
                            continue
                        if response.status_code == 429:
                            break
                        response.raise_for_status()
                        raw_answer = response.json().get("choices", [{}])[0].get("message", {}).get("content", "")
                        success = True
                        break
                    except Exception as e:
                        print(f"Groq API Error for {candidate}: {e}")
                        
                if success:
                    break
                if self._rotate_groq_key() and attempt < max_attempts - 1:
                    continue
                else:
                    if not raw_answer:
                        raw_answer = '{"answer": "I encountered an error with the Groq API. Please switch to Gemini 2.5 Flash in the model dropdown.", "confidence": 0.1}'
                    break
        elif "llama" in model_name.lower() or "ollama" in model_name.lower():
            try:
                import httpx
                ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
                response = httpx.post(
                    f"{ollama_url}/api/chat",
                    json={
                        "model": "llama3.2:latest",
                        "messages": messages,
                        "stream": False,
                        "options": {"temperature": 0.15, "num_predict": 2500}
                    },
                    timeout=60.0
                )
                response.raise_for_status()
                raw_answer = response.json().get("message", {}).get("content", "")
            except Exception as e:
                raw_answer = f'{{"answer": "Ollama error: {str(e)}", "confidence": 0.1}}'
        else:
            # Gemini Generative AI
            if not self.api_key_configured:
                raw_answer = '{"answer": "Gemini API key is not configured.", "confidence": 0.1}'
            else:
                gemini_full_prompt = f"{SYSTEM_PROMPT}\n\n{rag_prompt}"
                max_attempts = max(1, len(self.gemini_keys))
                for attempt in range(max_attempts):
                    try:
                        print(f"Sending chat to Gemini (attempt {attempt+1}/{max_attempts})...")
                        response = self.model.generate_content(
                            gemini_full_prompt,
                            generation_config={"max_output_tokens": 2500, "temperature": 0.15}
                        )
                        raw_answer = response.text
                        break
                    except Exception as e:
                        if ("429" in str(e) or "quota" in str(e).lower()) and self._rotate_gemini_key() and attempt < max_attempts - 1:
                            continue
                        raw_answer = f'{{"answer": "Gemini error: {str(e)}", "confidence": 0.1}}'
                        break

        # 6. Parse structured JSON from LLM output
        final_answer, confidence, final_sources, suggested_followups = self._parse_llm_json(raw_answer, sources)

        # 7. Calculate RAG Analytics
        if not sources:
            avg_similarity = 0.0
            precision = 0.0
            accuracy = 0.0
        else:
            avg_dist = sum(s.score for s in sources) / len(sources)
            avg_similarity = max(0.0, 1.0 - avg_dist)
            relevant_sources = sum(1 for s in sources if s.score < 0.6)
            precision = relevant_sources / len(sources)
            if "don't have that specific information" in final_answer.lower():
                accuracy = 0.15
            else:
                accuracy = (avg_similarity * 0.7) + (precision * 0.3)
                
        analytics_data = RAGAnalytics(
            model=model_name,
            retrieval_mode=retrieval_mode,
            distance_metric="cosine",
            avg_similarity=round(avg_similarity, 3),
            accuracy=round(accuracy, 3),
            precision=round(precision, 3),
            retrieved_queries=retrieved_queries,
            prompt_template="[Official MITS SYSTEM_PROMPT + RAG Prompt Template]"
        )

        processing_time = int((time.time() - start_time) * 1000)

        return ChatResponse(
            session_id=request.session_id or "",
            answer=final_answer,
            sources=final_sources,
            processing_time_ms=processing_time,
            analytics=analytics_data,
            confidence=confidence,
            suggested_followups=suggested_followups
        )

    def _call_llm(self, prompt: str, model_name: str, max_tokens: Optional[int] = None) -> str:
        """Helper to invoke the correct LLM API based on model name."""
        if "groq" in model_name.lower() or model_name == "llama-3.3-70b-versatile":
            max_attempts = max(1, len(self.groq_keys))
            last_err = None
            for attempt in range(max_attempts):
                active_groq_key = self._get_active_groq_key()
                if not active_groq_key:
                    raise ValueError("Groq API key is not configured.")
                candidate_models = ["llama-3.3-70b-versatile", "openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"]
                for candidate in candidate_models:
                    try:
                        import httpx
                        json_payload = {
                            "model": candidate,
                            "messages": [{"role": "user", "content": prompt}],
                            "temperature": 0.1
                        }
                        if max_tokens:
                            json_payload["max_tokens"] = max_tokens
                        response = httpx.post(
                            "https://api.groq.com/openai/v1/chat/completions",
                            headers={"Authorization": f"Bearer {active_groq_key}", "Content-Type": "application/json"},
                            json=json_payload,
                            timeout=25.0
                        )
                        if response.status_code == 404:
                            continue
                        if response.status_code == 429:
                            break
                        response.raise_for_status()
                        return response.json().get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                    except Exception as e:
                        last_err = e
                if self._rotate_groq_key() and attempt < max_attempts - 1:
                    continue
                else:
                    break
            raise last_err or Exception("Failed to query Groq models.")
        elif "llama" in model_name.lower() or "ollama" in model_name.lower():
            import httpx
            ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
            payload = {
                "model": "llama3.2:latest",
                "messages": [{"role": "user", "content": prompt}],
                "stream": False,
                "options": {"temperature": 0.1}
            }
            if max_tokens:
                payload["options"]["num_predict"] = max_tokens
            response = httpx.post(f"{ollama_url}/api/chat", json=payload, timeout=40.0)
            response.raise_for_status()
            return response.json().get("message", {}).get("content", "").strip()
        else:
            if not self.api_key_configured:
                raise ValueError("Gemini API key is not configured.")
            max_attempts = max(1, len(self.gemini_keys))
            last_err = None
            for attempt in range(max_attempts):
                try:
                    gen_config = {"temperature": 0.1}
                    if max_tokens:
                        gen_config["max_output_tokens"] = max_tokens
                    response = self.model.generate_content(prompt, generation_config=gen_config)
                    return response.text.strip()
                except Exception as e:
                    last_err = e
                    if ("429" in str(e) or "quota" in str(e).lower()) and self._rotate_gemini_key() and attempt < max_attempts - 1:
                        continue
                    break
            raise last_err or Exception("Failed to query Gemini API.")

    def _reciprocal_rank_fusion(self, results_lists: List[List[SourceChunk]], k: int = 60) -> List[SourceChunk]:
        """Combine multiple retrieval result lists using Reciprocal Rank Fusion."""
        rrf_scores: Dict[str, float] = {}
        chunk_map: Dict[str, SourceChunk] = {}
        for r_list in results_lists:
            for rank, chunk in enumerate(r_list):
                if chunk.id not in chunk_map:
                    chunk_map[chunk.id] = chunk
                rrf_scores[chunk.id] = rrf_scores.get(chunk.id, 0.0) + (1.0 / (k + rank))
        sorted_ids = sorted(rrf_scores.keys(), key=lambda x: rrf_scores[x], reverse=True)
        return [chunk_map[cid] for cid in sorted_ids]

    def _rewrite_query(self, question: str, history: str, model_name: str) -> str:
        """Rewrite ambiguous follow-up question into standalone query."""
        prompt = f"""Given the following conversation history and a follow up question, rephrase the follow up question to be a standalone question that can be understood without the conversation history. Do NOT answer the question, just reformulate it if needed, otherwise return it as is.

{history}
Follow Up Input: {question}
Standalone question:"""
        try:
            return self._call_llm(prompt, model_name, max_tokens=100)
        except Exception as e:
            print(f"Error rewriting query: {e}")
            return question

    def _generate_query_variations(self, question: str, model_name: str) -> List[str]:
        """Generate 3 different search query variations."""
        prompt = f"""Generate exactly 3 different search query variations for the following question to help retrieve relevant documents.
Provide each query on a new line. Do NOT include numbers or bullet points.

Question: {question}

Queries:"""
        try:
            content = self._call_llm(prompt, model_name, max_tokens=150)
            lines = [line.strip() for line in content.split("\n") if line.strip()]
            cleaned_lines = []
            for l in lines:
                cleaned = re.sub(r"^\d+[\.\)]\s*", "", l).strip()
                cleaned = re.sub(r"^[-*•]\s*", "", cleaned).strip()
                if cleaned:
                    cleaned_lines.append(cleaned)
            return cleaned_lines[:3]
        except Exception as e:
            print(f"Error generating query variations: {e}")
            return [question]
