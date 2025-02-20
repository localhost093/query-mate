
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import FileUploadDialog from "@/components/FileUploadDialog";

const Upload = () => {
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(true);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Chat
        </Button>

        <div className="glass-panel p-6">
          <h1 className="text-2xl font-semibold mb-6 text-foreground">Upload Documents</h1>
          <p className="text-muted-foreground mb-4">
            Upload your documents here. We support PDF, DOC, DOCX, and TXT files.
          </p>
          
          <FileUploadDialog
            open={showUpload}
            onOpenChange={setShowUpload}
            onUpload={(files) => {
              // Handle upload success
              navigate("/");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Upload;
