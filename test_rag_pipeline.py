import os
import sys
from pathlib import Path

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

backend_dir = Path(__file__).resolve().parent / "backend"
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
    print("MITS GWALIOR RAG KNOWLEDGE BASE - END-TO-END VERIFICATION")
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
            "category": "Fee Structure & Scholarships",
            "question": "What is the annual tuition fee for B.Tech at MITS Gwalior and what scholarships are available?",
            "model": "llama-3.3-70b-versatile"
        },
        {
            "category": "Hostel Facilities & Mess",
            "question": "What are the hostel options, curfew rules, and mess charges for students?",
            "model": "llama-3.3-70b-versatile"
        },
        {
            "category": "Faculty Directory Verification",
            "question": "Who is Dr. Sanjay Tiwari, what is his designation, qualification, and department?",
            "model": "llama-3.3-70b-versatile"
        },
        {
            "category": "Department of Information Technology",
            "question": "What specialized laboratories and research areas exist in the IT department?",
            "model": "llama-3.3-70b-versatile"
        },
        {
            "category": "Civil Engineering Consultancy",
            "question": "What consultancy revenue was earned by the Civil Engineering department in 2023-2024?",
            "model": "llama-3.3-70b-versatile"
        },
        {
            "category": "Prominent Alumni",
            "question": "Name some distinguished MITS alumni holding key leadership positions in government or industry.",
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
            owner_id="test_student_user"
        )
        
        response = chat_service.generate_answer(req)
        
        print(f"Answer:\n{response.answer}\n")
        print("Retrieved Sources:")
        for s in response.sources:
            print(f"  - [{s.filename}] (Score: {s.score:.3f})")
        if response.analytics:
            print(f"Analytics: Similarity={response.analytics.avg_similarity}, Accuracy={response.analytics.accuracy}")
            
    print("\n=================================================================")
    print("ALL TESTS COMPLETED SUCCESSFULLY!")
    print("=================================================================")

if __name__ == "__main__":
    run_tests()
