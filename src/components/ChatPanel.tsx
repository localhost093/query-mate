
import { Send, Save, FileText, Mic } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../hooks/use-toast";

const ChatPanel = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "ai" }>>([
    { text: "Hello! I'm here to help you understand NotebookLM. What would you like to know?", sender: "ai" }
  ]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: "user" }]);
      setMessage("");
      // Simulated AI response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: "I'm processing your request. This is a placeholder response until the backend is connected.",
          sender: "ai"
        }]);
      }, 1000);
    }
  };

  const handleSaveToNote = () => {
    toast({
      title: "Note saved",
      description: "Your conversation has been saved to notes.",
    });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto flex gap-4">
          <Button variant="outline" className="flex-1" onClick={handleSaveToNote}>
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Start typing..."
              className="w-full bg-muted/50 rounded-lg pl-4 pr-24 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <span className="text-sm text-muted-foreground">7 sources</span>
              <Button size="sm" className="h-8" onClick={handleSend}>
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
