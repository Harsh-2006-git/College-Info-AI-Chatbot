import os
import sys
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv
load_dotenv(backend_dir / ".env")

from app.rag.embedding import EmbeddingModel
from app.rag.vectorstore import VectorStore
from app.rag.retriever import Retriever
from app.services.chat_service import ChatService
from app.models.schemas import ChatRequest

def run_tests():
    print("=================================================================")
    print("MITS GWALIOR UPDATED KNOWLEDGE BASE (207 DOCS) - VERIFICATION")
    print("=================================================================")
    
    chroma_path = str(backend_dir / "vectorstore")
    print(f"Connecting to VectorStore at: {chroma_path}")
    
    emb_model = EmbeddingModel()
    vs = VectorStore(persist_directory=chroma_path, embedding_model=emb_model)
    retriever = Retriever(vector_store=vs)
    
    print(f"Active Collection: {vs.collection_name}")
    print(f"Total Chunks in VectorStore: {vs.count_chunks()}")
    
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    groq_key = os.getenv("GROQ_API_KEY", "")
    chat_service = ChatService(retriever=retriever, api_key=gemini_key, groq_key=groq_key)
    
    test_questions = [
        {
            "category": "Fee Structure & Official PDF Links",
            "question": "What is the fee structure notice and download link for B.Tech under TFW and general quota?",
            "model": "llama-3.3-70b-versatile"
        },
        {
            "category": "Placement Statistics 2021-2025",
            "question": "What are the consolidated placement records for 2025 and 2024 including total placed, highest salary and average salary?",
            "model": "llama-3.3-70b-versatile"
        },
        {
            "category": "Hostel Facilities & Wardens",
            "question": "Who is the Chief Warden and what are the wardens names and phone numbers for Hostel 6 and Hostel 7?",
            "model": "llama-3.3-70b-versatile"
        },
        {
            "category": "IT Department Laboratories",
            "question": "What specialized laboratories exist in the Department of Information Technology at MITS?",
            "model": "llama-3.3-70b-versatile"
        },
        {
            "category": "Undergraduate Programmes & Intake",
            "question": "What B.Tech programmes are offered and what is the intake capacity for AI, IoT, and CSE?",
            "model": "llama-3.3-70b-versatile"
        }
    ]
    
    for i, test in enumerate(test_questions, 1):
        print(f"\n-----------------------------------------------------------------")
        print(f"TEST {i}: [{test['category']}]")
        print(f"Question: {test['question']}")
        print(f"-----------------------------------------------------------------")
        
        req = ChatRequest(
            question=test['question'],
            model=test['model'],
            retrieval_mode="history_aware",
            owner_id="default"
        )
        
        response = chat_service.generate_answer(req)
        
        print(f"Answer:\n{response.answer}\n")
        print("Retrieved Sources:")
        for s in response.sources:
            print(f"  - [{s.filename}] ({s.document_id}) [Score: {s.score:.3f}]")
            
    print("\n=================================================================")
    print("ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!")
    print("=================================================================")

if __name__ == "__main__":
    run_tests()
