from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
from pathlib import Path
import chromadb
import fitz  # PyMuPDF for PDF processing
import docx  # python-docx for DOCX processing
import requests
import json

# Database setup (using SQLite)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models (Removed User model since authentication is not required)
class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)

# Create tables
Base.metadata.create_all(bind=engine)

# Vector store setup
chroma_client = chromadb.Client()
collection = chroma_client.create_collection(name="documents")

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# File upload and processing endpoint
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Save file
    file_path = Path(f"uploads/{file.filename}")
    with file_path.open("wb") as buffer:
        content = await file.read()
        buffer.write(content)

    # Extract text based on file type
    text = ""
    if file.filename.endswith(".pdf"):
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()
    elif file.filename.endswith(".docx"):
        doc = docx.Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    elif file.filename.endswith(".txt"):
        text = file_path.read_text()

    # Add document to vector store
    collection.add(
        documents=[text],
        metadatas=[{"source": file.filename}],
        ids=[f"doc_{datetime.now().timestamp()}"]
    )

    return {"message": "File processed successfully"}

# Notes CRUD endpoints
@app.post("/notes")
async def create_note(title: str, content: str, db: Session = Depends(get_db)):
    note = Note(title=title, content=content)
    db.add(note)
    db.commit()
    return note

@app.get("/notes/{note_id}")
async def get_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

# Chat endpoint using RAG and Ollama API
@app.post("/chat")
async def chat(message: str):
    # Search relevant documents from the vector store
    results = collection.query(
        query_texts=[message],
        n_results=3
    )

    context = "\n".join(results["documents"][0]) if results.get("documents") else ""
    prompt = f"Context: {context}\n\nQuestion: {message}\n\nAnswer:"

    # Call Ollama API
    ollama_url = "http://localhost:11434/api/generate"
    payload = {
        "model": "llama3",  # Replace with your model name if needed
        "prompt": prompt,
        "stream": False
    }
    response = requests.post(ollama_url, json=payload)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to get response from LLM")
    response_json = response.json()
    return {"response": response_json.get("response", "No response generated.")}

# Run with: uvicorn main:app --reload
