import os
# Force transformers to run in offline mode
os.environ["TRANSFORMERS_OFFLINE"] = "1"

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain.document_loaders import PyPDFLoader
from langchain.vectorstores import FAISS
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
from langchain.llms import Ollama
from langchain.chains import RetrievalQA

import shutil

app = FastAPI()

# Enable CORS for frontend communication (update allowed origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend's URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define paths for the vector store and uploads
VECTOR_DB_PATH = "backend/vectorstore"
os.makedirs(VECTOR_DB_PATH, exist_ok=True)

# Initialize the offline embeddings model.
# Ensure that the model "all-MiniLM-L6-v2" is available locally (download if needed).
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Global variable to hold the vector store (populated after file upload)
vector_store = None

# Pydantic model for chat requests
class ChatRequest(BaseModel):
    query: str

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    # Ensure the uploads directory exists
    os.makedirs("backend/uploads", exist_ok=True)
    file_path = f"backend/uploads/{file.filename}"
    
    # Save the uploaded file locally
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Process the PDF using PyPDFLoader
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    
    # Create a FAISS vector store from the documents using offline embeddings
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
    # Adjust 'model' and 'base_url' according to your local Ollama configuration.
    llm = Ollama(model="llama2", base_url="http://localhost:11434")
    
    # Build a RetrievalQA chain that retrieves relevant document snippets
    # from the vector store and uses Ollama to generate a response.
    qa = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vector_store.as_retriever()
    )
    
    # Run the chain with the incoming query.
    response = qa.run(request.query)
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
