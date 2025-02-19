
import { FileText, Plus, FolderPlus, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

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
}

const StudioPanel = ({ onNoteSelect }: StudioPanelProps) => {
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
            onClick={() => setShowNewNote(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {showNewFolder && (
          <div className="space-y-2">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="bg-background"
            />
            <div className="flex gap-2">
              <Button 
                variant="default" 
                className="flex-1"
                onClick={handleAddFolder}
              >
                Add
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowNewFolder(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {showNewNote && (
          <div className="space-y-2">
            <Input
              placeholder="Note title"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="bg-background"
            />
            <select
              className="w-full p-2 rounded-md border border-border bg-background"
              onChange={(e) => setSelectedFolderId(e.target.value)}
            >
              <option value="">Select folder</option>
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button 
                variant="default" 
                className="flex-1"
                onClick={handleAddNote}
              >
                Add
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowNewNote(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
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
                        onClick={() => onNoteSelect(note.id)}
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
      </div>
    </div>
  );
};

export default StudioPanel;
