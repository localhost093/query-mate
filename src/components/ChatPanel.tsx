
import { Send, Save, FileText, Mic } from "lucide-react";
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
      setMessages([...messages, { text: message, sender: "user" }]);
      setMessage("");

      try {
        const response = await fetch('http://localhost:8000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message, source: selectedSource }),
        });

        if (!response.ok) throw new Error('Chat request failed');

        const data = await response.json();
        setMessages(prev => [...prev, { text: data.response, sender: "ai" }]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to get response from the chat service.",
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
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm ml-auto"
                    : "bg-muted rounded-2xl rounded-tl-sm"
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
              className="capsule-input"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">
                {selectedSource ? '1 source' : 'No source selected'}
              </span>
              <Button 
                size="icon" 
                className="round-button"
                onClick={handleSend}
              >
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
