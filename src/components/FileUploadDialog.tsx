
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (files: File[]) => void;
}

const FileUploadDialog = ({ open, onOpenChange, onUpload }: FileUploadDialogProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setSelectedFiles(prev => [...prev, ...acceptedFiles]);
    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    }
  });

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    let progress = 0;
    const increment = 100 / selectedFiles.length;

    for (const file of selectedFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        await fetch('http://localhost:8000/upload', {
          method: 'POST',
          body: formData,
        });
        
        progress += increment;
        setUploadProgress(Math.min(progress, 100));
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    onUpload(selectedFiles);
    setSelectedFiles([]);
    setUploadProgress(0);
    onOpenChange(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[60vh]">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full gap-4">
          <div 
            {...getRootProps()} 
            className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}
              hover:border-primary hover:bg-primary/5`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg text-muted-foreground">Drop your files here</p>
            ) : (
              <>
                <p className="text-lg text-muted-foreground mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, DOC, DOCX, and TXT
                </p>
              </>
            )}
          </div>

          {selectedFiles.length > 0 && (
            <div className="border rounded-lg p-4 max-h-[200px] overflow-y-auto">
              <h3 className="font-medium mb-2">Selected Files</h3>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-lg">
                    <span className="text-sm truncate">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={selectedFiles.length === 0}>
                Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog;
