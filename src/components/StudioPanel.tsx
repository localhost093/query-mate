import { FileText, Plus, FolderPlus, ChevronRight, ChevronDown, ChevronLeft, Heading1, Heading2, Bold, Italic, ListOrdered, List, Undo, Redo } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string;
}

interface Folder {
  id: string;
  name: string;
  isOpen: boolean;
}

interface StudioPanelProps {
  onNoteSelect: (noteId: string) => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

const StudioPanel = ({ onNoteSelect, isFullScreen, onToggleFullScreen }: StudioPanelProps) => {
  const { toast } = useToast();
  const [folders, setFolders] = useState<Folder[]>([
    { id: "1", name: "General Notes", isOpen: true },
    { id: "2", name: "Research", isOpen: false }
  ]);
  const [notes, setNotes] = useState<Note[]>([
    { id: "1", title: "Welcome Note", content: "# Welcome\nThis is your first note!", folderId: "1" },
    { id: "2", title: "Research Ideas", content: "## Research Topics\n1. Topic A\n2. Topic B", folderId: "2" }
  ]);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewNote, setShowNewNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);
  const [editHistory, setEditHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: newFolderName,
        isOpen: true
      };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setShowNewFolder(false);
    }
  };

  const handleAddNote = () => {
    if (newNoteTitle.trim() && selectedFolderId) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: newNoteTitle,
        content: `# ${newNoteTitle}\n\nStart writing here...`,
        folderId: selectedFolderId
      };
      setNotes([...notes, newNote]);
      setNewNoteTitle("");
      setShowNewNote(false);
      toast({
        title: "Note created",
        description: `${newNoteTitle} has been created.`
      });
    }
  };

  const toggleFolder = (folderId: string) => {
    setFolders(folders.map(folder => 
      folder.id === folderId ? { ...folder, isOpen: !folder.isOpen } : folder
    ));
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setEditHistory([note.content]);
    setHistoryIndex(0);
  };

  const handleContentChange = (content: string) => {
    if (!selectedNote) return;
    
    const newHistory = editHistory.slice(0, historyIndex + 1);
    newHistory.push(content);
    setEditHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setNotes(notes.map(note =>
      note.id === selectedNote.id ? { ...note, content } : note
    ));
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const content = editHistory[historyIndex - 1];
      setNotes(notes.map(note =>
        note.id === selectedNote?.id ? { ...note, content } : note
      ));
    }
  };

  const handleRedo = () => {
    if (historyIndex < editHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const content = editHistory[historyIndex + 1];
      setNotes(notes.map(note =>
        note.id === selectedNote?.id ? { ...note, content } : note
      ));
    }
  };

  const insertMarkdown = (type: string) => {
    if (!selectedNote) return;
    
    const textArea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textArea) return;

    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const text = selectedNote.content;
    let newText = text;
    let newCursorPos = start;

    switch (type) {
      case 'h1':
        newText = text.slice(0, start) + '# ' + text.slice(start);
        newCursorPos = start + 2;
        break;
      case 'h2':
        newText = text.slice(0, start) + '## ' + text.slice(start);
        newCursorPos = start + 3;
        break;
      case 'bold':
        newText = text.slice(0, start) + '**' + text.slice(start, end) + '**' + text.slice(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        newText = text.slice(0, start) + '*' + text.slice(start, end) + '*' + text.slice(end);
        newCursorPos = end + 2;
        break;
      case 'bullet':
        newText = text.slice(0, start) + '- ' + text.slice(start);
        newCursorPos = start + 2;
        break;
      case 'number':
        newText = text.slice(0, start) + '1. ' + text.slice(start);
        newCursorPos = start + 3;
        break;
    }

    handleContentChange(newText);
    setTimeout(() => {
      textArea.focus();
      textArea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="h-full flex flex-col bg-background rounded-xl">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">Notes</h2>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowNewFolder(true)}
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setShowNewNote(true);
              setSelectedFolderId(folders[0].id); // Set default folder if none selected
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showNewFolder && (
        <div className="absolute top-16 right-0 left-0 p-4 border-b border-border bg-background z-10">
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddFolder()}
            placeholder="New folder name..."
            className="mb-2"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowNewFolder(false)}>Cancel</Button>
            <Button onClick={handleAddFolder}>Create</Button>
          </div>
        </div>
      )}

      {showNewNote && (
        <div className="absolute top-16 right-0 left-0 p-4 border-b border-border bg-background z-10">
          <Input
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
            placeholder="New note title..."
            className="mb-2"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowNewNote(false)}>Cancel</Button>
            <Button onClick={handleAddNote}>Create</Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {selectedNote ? (
          <div className="flex flex-col h-full">
            <div className="border-b border-border p-2 flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedNote(undefined)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <span className="flex-1 text-sm font-medium truncate">{selectedNote.title}</span>
            </div>
            <div className="p-2 border-b border-border flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Heading1 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => insertMarkdown('h1')}>
                      <Heading1 className="h-4 w-4 mr-2" />
                      Heading 1
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertMarkdown('h2')}>
                      <Heading2 className="h-4 w-4 mr-2" />
                      Heading 2
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" onClick={() => insertMarkdown('bold')}>
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertMarkdown('italic')}>
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertMarkdown('bullet')}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertMarkdown('number')}>
                <ListOrdered className="h-4 w-4" />
              </Button>
              <div className="border-l border-border h-6 mx-1" />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleUndo}
                disabled={historyIndex <= 0}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRedo}
                disabled={historyIndex >= editHistory.length - 1}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 p-4">
              <textarea
                value={selectedNote.content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full h-full resize-none p-2 bg-background text-foreground focus:outline-none border rounded-md"
                placeholder="Start writing your note..."
              />
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {folders.map(folder => (
              <div key={folder.id} className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => toggleFolder(folder.id)}
                >
                  {folder.isOpen ? 
                    <ChevronDown className="mr-2 h-4 w-4" /> : 
                    <ChevronRight className="mr-2 h-4 w-4" />
                  }
                  {folder.name}
                </Button>
                
                {folder.isOpen && (
                  <div className="ml-4 space-y-1">
                    {notes
                      .filter(note => note.folderId === folder.id)
                      .map(note => (
                        <Button
                          key={note.id}
                          variant="ghost"
                          className="w-full justify-start pl-6"
                          onClick={() => handleNoteClick(note)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {note.title}
                        </Button>
                      ))
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioPanel;
