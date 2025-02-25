import os
# For now, we are fetching the Hugging Face embeddings online.
# To run offline, follow these steps:
# 1. Download and cache the Hugging Face model (e.g., "all-MiniLM-L6-v2") locally.
# 2. Uncomment the line below to force transformers into offline mode.
# os.environ["TRANSFORMERS_OFFLINE"] = "1"

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Updated imports from langchain_community
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings.huggingface import HuggingFaceEmbeddings
from langchain_community.llms import Ollama
from langchain_community.chains import RetrievalQAChain

import shutil

app = FastAPI()

# Enable CORS for frontend communication.
# In production, replace "*" with your frontend's domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define paths for the vector store and uploads
VECTOR_DB_PATH = "backend/vectorstore"
os.makedirs(VECTOR_DB_PATH, exist_ok=True)

# Initialize the Hugging Face embeddings model.
# By default, this will fetch the model online.
# When switching to offline mode, ensure the model is cached locally and uncomment the offline line above.
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Global variable to hold the vector store (populated after a file is uploaded)
vector_store = None

# Pydantic model for chat requests.
class ChatRequest(BaseModel):
    query: str

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    # Ensure the uploads directory exists.
    os.makedirs("backend/uploads", exist_ok=True)
    file_path = f"backend/uploads/{file.filename}"
    
    # Save the uploaded file locally.
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Load and process the PDF using PyPDFLoader.
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    
    # Create a FAISS vector store from the documents using the Hugging Face embeddings.
    global vector_store
    vector_store = FAISS.from_documents(docs, embeddings)
    vector_store.save_local(VECTOR_DB_PATH)
    
    return {"message": "File uploaded and processed successfully"}

@app.post("/chat/")
async def chat(request: ChatRequest):
    global vector_store
    if not vector_store:
        raise HTTPException(status_code=400, detail="No documents uploaded yet.")
    
    # Initialize the Ollama LLM.
    # Adjust 'model' and 'base_url' as required for your local Ollama configuration.
    llm = Ollama(model="llama2", base_url="http://localhost:11434")
    
    # Build a retrieval QA chain that uses the vector store's retriever and Ollama to answer queries.
    # The 'chain_type' parameter is set to "stuff" as an example. Adjust if necessary.
    qa_chain = RetrievalQAChain(llm=llm, retriever=vector_store.as_retriever(), chain_type="stuff")
    
    # Run the QA chain with the incoming query.
    response = qa_chain.run(request.query)
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
