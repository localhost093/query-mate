
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../hooks/use-toast";

interface ChatPanelProps {
  selectedSource?: string;
  selectedNote?: string;
}

const ChatPanel = ({ selectedSource, selectedNote }: ChatPanelProps) => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "ai" }>>([
    { 
      text: selectedSource 
        ? `Hello! I'm here to help you understand ${selectedSource}. What would you like to know?`
        : "Hello! I'm here to help you understand NotebookLM. What would you like to know?", 
      sender: "ai" 
    }
  ]);

  const handleSend = async () => {
    if (message.trim()) {
      // Add user message immediately
      setMessages(prev => [...prev, { text: message, sender: "user" }]);
      const currentMessage = message;
      setMessage("");

      try {
        const response = await fetch('http://localhost:8090/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: currentMessage,
            source: selectedSource 
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMessages(prev => [...prev, { text: data.response, sender: "ai" }]);
      } catch (error) {
        console.error('Chat error:', error);
        toast({
          title: "Error",
          description: "Failed to get response from the chat service. Please ensure the backend server is running.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-background rounded-xl">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[80%] p-4 transition-all duration-300 hover:scale-[1.02] ${
                  msg.sender === "user"
                    ? "bg-[#EDEFFA] text-gray-900 rounded-2xl rounded-tr-sm ml-auto"
                    : "bg-white text-gray-900 rounded-2xl rounded-tl-sm shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Start typing..."
              className="w-full rounded-full pl-4 pr-24 py-2 bg-white border border-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">
                {selectedSource ? '1 source' : 'No source selected'}
              </span>
              <Button 
                size="icon" 
                className="rounded-full h-8 w-8 bg-blue-500 hover:bg-blue-600 transition-colors duration-300 hover:scale-110"
                onClick={handleSend}
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
