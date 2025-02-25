import os
import shutil
import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from the .env file.
# This allows you to configure sensitive values like OLLAMA_MODEL and OLLAMA_BASE_URL.
load_dotenv()

# =============================================================================
# Configuration and Logging
# =============================================================================

# Production logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Embeddings Offline/Online Mode:
#
# By default, the Hugging Face embeddings model is fetched online.
# To switch to offline mode:
# 1. Download and cache the model (e.g., "all-MiniLM-L6-v2") using the transformers library.
#    Example:
#      from transformers import AutoTokenizer, AutoModel
#      tokenizer = AutoTokenizer.from_pretrained("all-MiniLM-L6-v2")
#      model = AutoModel.from_pretrained("all-MiniLM-L6-v2")
# 2. Uncomment the following line to force transformers to work offline:
# os.environ["TRANSFORMERS_OFFLINE"] = "1"
# ---------------------------------------------------------------------------

# =============================================================================
# Import components from langchain_community
# =============================================================================
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings.huggingface import HuggingFaceEmbeddings
from langchain_community.llms import Ollama

# =============================================================================
# FastAPI Application Setup
# =============================================================================
app = FastAPI(
    title="ChatDoc Production API",
    description="A backend API for processing documents and answering queries using offline embeddings and Ollama LLM.",
    version="1.0.0",
)

# Enable CORS for frontend communication.
# For production, restrict allowed origins to your specific frontend domains.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend domain(s) for production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# Global Variables and Directory Setup
# =============================================================================
VECTOR_DB_PATH = "backend/vectorstore"
UPLOADS_PATH = "backend/uploads"

os.makedirs(VECTOR_DB_PATH, exist_ok=True)
os.makedirs(UPLOADS_PATH, exist_ok=True)

# Initialize the Hugging Face embeddings model.
# This model is online by default.
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Global variable to hold the FAISS vector store.
vector_store = None

# =============================================================================
# Pydantic Models
# =============================================================================
class ChatRequest(BaseModel):
    query: str

# =============================================================================
# API Endpoints
# =============================================================================
@app.post("/upload/", tags=["Document Processing"])
async def upload_file(file: UploadFile = File(...)):
    """
    Upload and process a PDF file.
    
    - Saves the PDF file.
    - Loads and splits the PDF into documents.
    - Creates a FAISS vector store from document embeddings.
    
    Returns a success message upon completion.
    """
    try:
        file_path = os.path.join(UPLOADS_PATH, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info("File saved at: %s", file_path)
        
        # Load and process the PDF.
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        logger.info("Loaded %d documents from PDF.", len(docs))
        
        # Build a FAISS vector store using the Hugging Face embeddings.
        global vector_store
        vector_store = FAISS.from_documents(docs, embeddings)
        vector_store.save_local(VECTOR_DB_PATH)
        logger.info("Vector store created and saved at: %s", VECTOR_DB_PATH)
        
        return {"message": "File uploaded and processed successfully."}
    except Exception as e:
        logger.error("Error processing file: %s", str(e))
        raise HTTPException(status_code=500, detail="File processing failed.")

@app.post("/chat/", tags=["Query"])
async def chat(request: ChatRequest):
    """
    Answer a query using uploaded document context.
    
    - Retrieves the top relevant documents using similarity search.
    - Constructs a prompt with retrieved context and user query.
    - Uses Ollama to generate a response.
    
    Returns the generated answer.
    """
    global vector_store
    if not vector_store:
        logger.warning("No documents available for query.")
        raise HTTPException(status_code=400, detail="No documents uploaded yet.")
    
    try:
        # Retrieve relevant documents from the vector store.
        docs = vector_store.similarity_search(request.query, k=5)
        logger.info("Retrieved %d relevant documents.", len(docs))
        
        # Combine the content of the retrieved documents.
        context = "\n\n".join([doc.page_content for doc in docs])
        
        # Construct a prompt for the LLM.
        prompt = (
            "You are a helpful assistant. Use the following context to answer the question.\n\n"
            f"Context:\n{context}\n\n"
            f"Question: {request.query}\n"
            "Answer:"
        )
        logger.debug("Constructed prompt: %s", prompt)
        
        # Load sensitive configurations from the .env file.
        ollama_model = os.getenv("OLLAMA_MODEL", "llama2")
        ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        
        # Initialize the Ollama LLM.
        llm = Ollama(model=ollama_model, base_url=ollama_base_url)
        
        # Generate a response using Ollama.
        response = llm(prompt)
        logger.info("Generated response from Ollama.")
        
        return {"response": response}
    except Exception as e:
        logger.error("Error during chat processing: %s", str(e))
        raise HTTPException(status_code=500, detail="Failed to process query.")

# =============================================================================
# Health Check Endpoint (optional for production monitoring)
# =============================================================================
@app.get("/health", tags=["Health"])
async def health():
    """
    Simple health-check endpoint.
    """
    return {"status": "ok"}

# =============================================================================
# Run the Application
# =============================================================================
if __name__ == "__main__":
    # For production deployment, consider using a production-ready ASGI server.
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
