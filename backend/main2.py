from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain.document_loaders import PyPDFLoader
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
import os
import shutil
from dotenv import load_dotenv

# Load environment variables (make sure you have a .env file with OPENAI_API_KEY)
load_dotenv()

app = FastAPI()

# Enable CORS for frontend communication (adjust origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define paths for vector store and uploads
VECTOR_DB_PATH = "backend/vectorstore"
os.makedirs(VECTOR_DB_PATH, exist_ok=True)

# Load your OpenAI API key from environment variables and create embeddings object
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable not set.")

embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)

# Global variable to hold the vector store
vector_store = None

# Define a Pydantic model for the chat endpoint
class ChatRequest(BaseModel):
    query: str

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    # Ensure the uploads directory exists
    os.makedirs("backend/uploads", exist_ok=True)
    file_path = f"backend/uploads/{file.filename}"
    
    # Save the uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Process the PDF file and load its documents
    loader = PyPDFLoader(file_path)
    docs = loader.load()

    # Create a vector store from the documents and save it locally
    global vector_store
    vector_store = FAISS.from_documents(docs, embeddings)
    vector_store.save_local(VECTOR_DB_PATH)
    
    return {"message": "File uploaded and processed successfully"}

@app.post("/chat/")
async def chat(request: ChatRequest):
    global vector_store
    if not vector_store:
        raise HTTPException(status_code=400, detail="No documents uploaded yet.")
    
    # Retrieve similar documents using a vector search
    docs = vector_store.similarity_search(request.query, k=5)
    response_text = "\n".join([doc.page_content for doc in docs])
    
    return {"response": response_text}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
