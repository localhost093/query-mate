
import { FileText, Clock, BookOpen, HelpCircle, MessageSquare, Share2 } from "lucide-react";
import { Button } from "./ui/button";

const StudioPanel = () => {
  return (
    <div className="h-full flex flex-col bg-[#1a1b1e]">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-medium">Studio</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Audio Overview</span>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
            <h4 className="font-medium">Click to load the audio overview</h4>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm text-gray-400">Notes</h3>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent hover:bg-gray-800 border-gray-700 text-gray-300"
          >
            <FileText className="mr-2 h-4 w-4" />
            Add note
          </Button>
        </div>

        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-800"
          >
            <FileText className="mr-2 h-4 w-4" />
            Study guide
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-800"
          >
            <Clock className="mr-2 h-4 w-4" />
            Timeline
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-800"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            FAQ
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm text-gray-400">Help</h3>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-800"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            NotebookLM Help
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-800"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Send feedback
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-800"
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
