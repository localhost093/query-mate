
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { HelpCircle, MessageSquare, Share2 } from "lucide-react";
import { useState } from "react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [activeSection, setActiveSection] = useState<'help' | 'feedback' | 'discord' | null>(null);

  const renderContent = () => {
    switch (activeSection) {
      case 'help':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">NotebookLM Help Center</h3>
            <p className="text-muted-foreground">
              Learn how to use NotebookLM effectively with our comprehensive guides and tutorials.
            </p>
            {/* Add more help content here */}
          </div>
        );
      case 'feedback':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Send Feedback</h3>
            <textarea 
              className="w-full h-32 p-2 rounded-md border border-input bg-background"
              placeholder="Tell us what you think..."
            />
            <Button className="w-full">Submit Feedback</Button>
          </div>
        );
      case 'discord':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Join our Discord Community</h3>
            <p className="text-muted-foreground">
              Connect with other NotebookLM users, share experiences, and get help.
            </p>
            <Button className="w-full">Join Discord</Button>
          </div>
        );
      default:
        return (
          <div className="grid gap-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setActiveSection('help')}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              NotebookLM Help
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setActiveSection('feedback')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Feedback
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setActiveSection('discord')}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Discord Community
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {activeSection ? (
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  className="mr-2" 
                  onClick={() => setActiveSection(null)}
                >
                  ←
                </Button>
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </div>
            ) : (
              "Settings"
            )}
          </DialogTitle>
          <DialogDescription>
            {!activeSection && "Manage your NotebookLM preferences and get help"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
