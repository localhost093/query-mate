
import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import SourcePanel from "../components/SourcePanel";
import ChatPanel from "../components/ChatPanel";
import StudioPanel from "../components/StudioPanel";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Settings } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const [sources, setSources] = useState<string[]>([
    "Getting Started with NotebookLM",
    "NotebookLM Features",
    "NotebookLM Glossary",
    "NotebookLM Troubleshooting",
    "Using NotebookLM As A Help Center",
    "Using NotebookLM For Research",
    "Using NotebookLM with Meeting/Interview Transcripts"
  ]);

  return (
    <div className={`h-screen w-full ${theme === "dark" ? "bg-[#1a1b1e]" : "bg-white"} text-gray-100 transition-colors duration-200 overflow-hidden`}>
      {/* Header */}
      <div className={`h-12 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"} flex items-center justify-between px-4 transition-colors duration-200`}>
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/72e3b36f-557c-4941-95ef-868bae28e5a3.png" alt="NotebookLM" className="h-6 w-6" />
          <h1 className={`text-lg font-medium ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
            Introduction to NotebookLM
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? 
              <Sun className="h-5 w-5 text-gray-100" /> : 
              <Moon className="h-5 w-5 text-gray-900" />
            }
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className={`h-5 w-5 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-48px)]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <SourcePanel sources={sources} onSourceAdd={(source) => setSources([...sources, source])} />
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-gray-800" />
          
          <ResizablePanel defaultSize={55} minSize={30}>
            <ChatPanel />
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-gray-800" />
          
          <ResizablePanel defaultSize={25} minSize={15} maxSize={30}>
            <StudioPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;
