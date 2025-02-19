import { Plus, ChevronDown, File, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { Input } from "./ui/input";
import { useToast } from "../hooks/use-toast";
import { useDropzone } from "react-dropzone";
import FileUploadDialog from "./FileUploadDialog";

interface SourcePanelProps {
  sources: string[];
  onSourceAdd: (source: string) => void;
  onSourceSelect: (source: string) => void;
}

const SourcePanel = ({ sources, onSourceAdd, onSourceSelect }: SourcePanelProps) => {
  const { toast } = useToast();
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const handleFilesUpload = (files: File[]) => {
    files.forEach(file => {
      onSourceAdd(file.name);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been processed and added to your sources.`,
      });
    });
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
            <div 
              key={index}
              className="flex items-center space-x-2 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer"
              onClick={() => onSourceSelect(source)}
            >
              <File className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-foreground">{source}</span>
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
