
import { Plus, ChevronDown, File, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { Input } from "./ui/input";
import { useToast } from "../hooks/use-toast";
import { useDropzone } from "react-dropzone";

interface SourcePanelProps {
  sources: string[];
  onSourceAdd: (source: string) => void;
  onSourceSelect: (source: string) => void;
}

const SourcePanel = ({ sources, onSourceAdd, onSourceSelect }: SourcePanelProps) => {
  const { toast } = useToast();
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const onDrop = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:8000/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          onSourceAdd(file.name);
          toast({
            title: "File uploaded successfully",
            description: `${file.name} has been processed and added to your sources.`,
          });
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "There was an error uploading your file.",
          variant: "destructive",
        });
      }
    }
    setShowUploadArea(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    }
  });

  return (
    <div className="h-full flex flex-col bg-background rounded-xl">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">Sources</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {showUploadArea ? (
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}
              hover:border-primary hover:bg-primary/5`}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-sm text-muted-foreground">Drop your files here</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports PDF, DOC, DOCX, and TXT
                </p>
              </>
            )}
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full rounded-xl border-dashed bg-transparent hover:bg-muted"
            onClick={() => setShowUploadArea(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add source
          </Button>
        )}

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
    </div>
  );
};

export default SourcePanel;
