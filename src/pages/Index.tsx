
import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "react-resizable-panels";
import SourcePanel from "../components/SourcePanel";
import ChatPanel from "../components/ChatPanel";
import StudioPanel from "../components/StudioPanel";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Settings } from "lucide-react";

const Index = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [sources, setSources] = useState<string[]>([
    "Getting Started with NotebookLM",
    "NotebookLM Features",
    "NotebookLM Glossary",
    "NotebookLM Troubleshooting",
    "Using NotebookLM As A Help Center",
    "Using NotebookLM For Research",
    "Using NotebookLM with Meeting/Interview Transcripts"
  ]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`h-screen w-full ${theme === "dark" ? "bg-[#1a1b1e]" : "bg-white"} text-gray-100 overflow-hidden`}>
      {/* Header */}
      <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/72e3b36f-557c-4941-95ef-868bae28e5a3.png" alt="NotebookLM" className="h-6 w-6" />
          <h1 className="text-lg font-medium">Introduction to NotebookLM</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-48px)]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <SourcePanel sources={sources} onSourceAdd={(source) => setSources([...sources, source])} />
          </ResizablePanel>
          
          <ResizableHandle className="w-1 bg-gray-800" />
          
          <ResizablePanel defaultSize={55} minSize={30}>
            <ChatPanel />
          </ResizablePanel>
          
          <ResizableHandle className="w-1 bg-gray-800" />
          
          <ResizablePanel defaultSize={25} minSize={15} maxSize={30}>
            <StudioPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;
