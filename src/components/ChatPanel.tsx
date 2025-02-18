
import { Send } from "lucide-react";
import { Button } from "./ui/button";

const ChatPanel = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-2xl font-semibold">Research Assistant</h1>
        <p className="text-gray-400 mt-1">Ask questions about your documents</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div className="bg-gray-800/50 p-4 rounded-lg max-w-2xl">
            Hello! I'm your research assistant. Upload some documents and I'll help you analyze them.
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-gray-800/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button size="icon" className="bg-blue-600 hover:bg-blue-700">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
