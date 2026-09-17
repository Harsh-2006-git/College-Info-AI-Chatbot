import os
from typing import List

class EmbeddingModel:
    def __init__(self, api_key: str = ""):
        """Initialize the embedding model, defaulting or falling back to local ONNX (all-MiniLM-L6-v2)."""
        env_val = os.getenv("USE_LOCAL_EMBEDDINGS", "true").strip().lower()
        force_local = env_val in ["true", "1", "yes"]
        
        keys = [k.strip() for k in (api_key or os.getenv("GEMINI_API_KEY", "")).split(",") if k.strip() and k.strip() != "your_gemini_api_key_here"]
        self.use_local = force_local or len(keys) == 0
        
        from chromadb.utils import embedding_functions
        self.local_model = embedding_functions.DefaultEmbeddingFunction()
        
        if self.use_local:
            print("Using local ChromaDB ONNX embedding model (all-MiniLM-L6-v2) for offline speed and reliability.")
            self.model = self.local_model
        else:
            try:
                from langchain_google_genai import GoogleGenerativeAIEmbeddings
                self.model = GoogleGenerativeAIEmbeddings(
                    model="models/gemini-embedding-2",
                    google_api_key=keys[0]
                )
                print("Configured Google Gemini GenerativeAI embeddings.")
            except Exception as e:
                print(f"Warning: Failed to initialize Gemini embeddings ({e}). Falling back to local ONNX embeddings.")
                self.use_local = True
                self.model = self.local_model

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of documents."""
        clean_texts = [(t.strip() if t and t.strip() else "document content") for t in texts]
        if self.use_local:
            return self.local_model(clean_texts)
        try:
            return self.model.embed_documents(clean_texts)
        except Exception as e:
            print(f"Error in Gemini embed_documents ({e}), falling back to local ONNX model.")
            return self.local_model(clean_texts)

    def embed_query(self, text: str) -> List[float]:
        """Generate an embedding for a single query string."""
        clean_text = (text or "").strip()
        if not clean_text:
            clean_text = "general inquiry"
        if self.use_local:
            return self.local_model([clean_text])[0]
        try:
            return self.model.embed_query(clean_text)
        except Exception as e:
            print(f"Error in Gemini embed_query ({e}), falling back to local ONNX model.")
            return self.local_model([clean_text])[0]

