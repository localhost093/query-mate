
import { Plus, ChevronDown, File, Upload, Pencil, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Input } from "./ui/input";
import { useToast } from "../hooks/use-toast";
import FileUploadDialog from "./FileUploadDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface SourcePanelProps {
  sources: string[];
  onSourceAdd: (source: string) => void;
  onSourceSelect: (source: string) => void;
  onSourceDelete: (source: string) => void;
  onSourceRename: (oldName: string, newName: string) => void;
  onBackToChat: () => void;
}

const SourcePanel = ({ 
  sources, 
  onSourceAdd, 
  onSourceSelect,
  onSourceDelete,
  onSourceRename,
  onBackToChat 
}: SourcePanelProps) => {
  const { toast } = useToast();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [editingSource, setEditingSource] = useState<string | null>(null);
  const [newSourceName, setNewSourceName] = useState("");

  const handleFilesUpload = (files: File[]) => {
    files.forEach(file => {
      onSourceAdd(file.name);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been processed and added to your sources.`,
      });
    });
  };

  const handleSourceClick = (source: string) => {
    onSourceSelect(source);
    onBackToChat();
  };

  const handleRename = (source: string) => {
    if (newSourceName.trim()) {
      onSourceRename(source, newSourceName.trim());
      setEditingSource(null);
      setNewSourceName("");
      toast({
        title: "Source renamed",
        description: "The source has been renamed successfully.",
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-background rounded-xl">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">Sources</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setShowUploadDialog(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <div className="space-y-2">
          {sources.map((source, index) => (
            <div key={index}>
              {editingSource === source ? (
                <div className="flex gap-2 items-center">
                  <Input
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                    className="flex-1 bg-background text-foreground"
                    placeholder="New name"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRename(source)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingSource(null);
                      setNewSourceName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors group">
                  <div
                    className="flex items-center space-x-2 flex-1 cursor-pointer"
                    onClick={() => handleSourceClick(source)}
                  >
                    <File className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-foreground">{source}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingSource(source);
                          setNewSourceName(source);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onSourceDelete(source)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <FileUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUpload={handleFilesUpload}
      />
    </div>
  );
};

export default SourcePanel;
