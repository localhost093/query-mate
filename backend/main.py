
# main.py
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List
import jwt
from datetime import datetime, timedelta
import bcrypt
from pathlib import Path
import chromadb
from llama_cpp import Llama
import fitz  # PyMuPDF for PDF processing
import docx  # python-docx for DOCX processing

# Database setup
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/dbname"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"))

# Vector store setup
chroma_client = chromadb.Client()
collection = chroma_client.create_collection(name="documents")

# LLM setup
llm = Llama(
    model_path="path/to/llama/model.gguf",
    n_ctx=2048,
    n_threads=4
)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Dependencies
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auth routes
@app.post("/register")
async def register(email: str, password: str, db: Session = Depends(get_db)):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user = User(email=email, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/login")
async def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# File upload and processing
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
    
    # Add to vector store
    collection.add(
        documents=[text],
        metadatas=[{"source": file.filename}],
        ids=[f"doc_{datetime.now().timestamp()}"]
    )
    
    return {"message": "File processed successfully"}

# Notes CRUD
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

# Chat endpoint with RAG
@app.post("/chat")
async def chat(message: str):
    # Search relevant documents
    results = collection.query(
        query_texts=[message],
        n_results=3
    )
    
    # Construct prompt with context
    context = "\n".join(results["documents"][0])
    prompt = f"Context: {context}\n\nQuestion: {message}\n\nAnswer:"
    
    # Generate response with LLM
    response = llm(prompt, max_tokens=500, stop=["Question:", "\n\n"])
    
    return {"response": response["choices"][0]["text"]}

# Run with: uvicorn main:app --reload

