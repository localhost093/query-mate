
# NotebookLM Clone

A modern document management and chat application built with React, FastAPI, and Vector Search.

## Features

- 📝 Document upload and processing (PDF, DOC, DOCX, TXT)
- 💬 AI-powered chat interface
- 📚 Note-taking with markdown support
- 🎨 Dark/Light mode
- 📱 Responsive design
- 🔍 Vector search for document queries
- 📂 Folder organization for notes

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS
- Shadcn/ui components
- React Router
- React Query

### Backend
- FastAPI
- SQLAlchemy
- ChromaDB for vector storage
- Ollama for LLM integration

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.8+
- Ollama (for LLM support)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd notebooklm-clone
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Start the backend server:
```bash
cd backend
uvicorn main:app --reload
```

5. Start the frontend development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:3000`

## Project Structure

```
.
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utility functions
├── backend/
│   ├── main.py         # FastAPI application
│   └── requirements.txt # Python dependencies
└── public/             # Static files
```

## API Endpoints

- `POST /upload` - Upload documents
- `POST /chat` - Send messages to chat
- `POST /notes` - Create new notes
- `GET /notes` - Get all notes

## Development

- Uses Vite for fast development
- Hot module replacement enabled
- Tailwind CSS for styling
- TypeScript for type safety

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details
