
import { FileText, Clock, BookOpen, HelpCircle, MessageSquare, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";

const StudioPanel = () => {
  const { toast } = useToast();
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const handleLoadAudio = () => {
    setIsAudioLoading(true);
    setTimeout(() => {
      setIsAudioLoading(false);
      toast({
        title: "Audio Overview",
        description: "Audio overview is not yet implemented.",
      });
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">Studio</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Audio Overview</span>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            className="w-full justify-center py-6"
            onClick={handleLoadAudio}
            disabled={isAudioLoading}
          >
            {isAudioLoading ? "Loading..." : "Click to load the audio overview"}
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm text-muted-foreground">Notes</h3>
          <Button
            variant="outline"
            className="w-full justify-start"
          >
            <FileText className="mr-2 h-4 w-4" />
            Add note
          </Button>
        </div>

        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <FileText className="mr-2 h-4 w-4" />
            Study guide
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <Clock className="mr-2 h-4 w-4" />
            Timeline
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            FAQ
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm text-muted-foreground">Help</h3>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            NotebookLM Help
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Send feedback
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Discord
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudioPanel;
