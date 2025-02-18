
import { Send, Save, FileText, Mic } from "lucide-react";
import { Button } from "./ui/button";

const ChatPanel = () => {
  return (
    <div className="h-full flex flex-col bg-[#1a1b1e]">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl">👋</span>
            <h1 className="text-2xl font-semibold">Introduction to NotebookLM</h1>
          </div>
          
          <p className="text-gray-400 leading-relaxed">
            NotebookLM is an AI-powered tool designed to enhance understanding and synthesis of complex information from uploaded sources. Users create notebooks and upload documents, URLs, or other text-based materials, which then become searchable and analyzable by the AI.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-800 p-4">
        <div className="max-w-3xl mx-auto flex gap-4">
          <Button variant="outline" className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            Save to note
          </Button>
          <Button variant="outline" className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            Add note
          </Button>
          <Button variant="outline" className="flex-1">
            <Mic className="mr-2 h-4 w-4" />
            Audio Overview
          </Button>
        </div>
        
        <div className="mt-4 max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Start typing..."
              className="w-full bg-gray-800/50 rounded-lg pl-4 pr-24 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <span className="text-sm text-gray-500">7 sources</span>
              <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
