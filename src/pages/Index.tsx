
import { useState } from "react";
import SourcePanel from "../components/SourcePanel";
import ChatPanel from "../components/ChatPanel";
import StudioPanel from "../components/StudioPanel";
import SettingsDialog from "../components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Settings, PanelLeftClose, PanelRightClose } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { cn } from "@/lib/utils";
import MarkdownEditor from "../components/MarkdownEditor";

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | undefined>();
  const [selectedNote, setSelectedNote] = useState<string | undefined>();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [sources, setSources] = useState<string[]>([
    "Getting Started with NotebookLM",
    "NotebookLM Features",
    "NotebookLM Glossary",
    "NotebookLM Troubleshooting",
    "Using NotebookLM As A Help Center",
    "Using NotebookLM For Research",
    "Using NotebookLM with Meeting/Interview Transcripts"
  ]);

  const handleNoteSelect = (noteId: string) => {
    setSelectedNote(noteId);
  };

  const handleBackToChat = () => {
    setSelectedNote(undefined);
    setSelectedSource(undefined);
  };

  const handleSourceDelete = (source: string) => {
    setSources(sources.filter(s => s !== source));
    if (selectedSource === source) {
      setSelectedSource(undefined);
    }
  };

  const handleSourceRename = (oldName: string, newName: string) => {
    setSources(sources.map(s => s === oldName ? newName : s));
    if (selectedSource === oldName) {
      setSelectedSource(newName);
    }
  };

  return (
    <div className={`h-screen w-full ${theme === "dark" ? "bg-[#22262b]" : "bg-[#edeffa]"} transition-colors duration-200 overflow-hidden`}>
      {/* Header */}
      <div className={`h-12 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"} flex items-center justify-between px-4 transition-colors duration-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}>
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
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
            <Settings className={`h-5 w-5 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-48px)] p-4">
        <div className="relative h-full flex gap-4">
          {/* Left Sidebar */}
          <div className={cn(
            "w-80 shrink-0 transition-all duration-300 relative",
            leftSidebarOpen ? "translate-x-0" : "-translate-x-full",
            "absolute lg:relative left-0 z-40",
            "lg:translate-x-0",
            !leftSidebarOpen && "lg:w-0"
          )}>
            <div className="h-full glass-panel p-2 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-3 top-2 z-50 bg-background/80 backdrop-blur-sm shadow-md rounded-full"
                onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
              <SourcePanel 
                sources={sources} 
                onSourceAdd={(source) => setSources([...sources, source])}
                onSourceSelect={setSelectedSource}
                onSourceDelete={handleSourceDelete}
                onSourceRename={handleSourceRename}
                onBackToChat={handleBackToChat}
              />
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 glass-panel">
            {selectedNote ? (
              <MarkdownEditor
                content={selectedNote}
                onChange={setSelectedNote}
                isFullScreen={false}
                onToggleFullScreen={() => {}}
              />
            ) : (
              <ChatPanel 
                selectedSource={selectedSource} 
                selectedNote={selectedNote}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className={cn(
            "w-80 shrink-0 transition-all duration-300 relative",
            rightSidebarOpen ? "translate-x-0" : "translate-x-full",
            "absolute lg:relative right-0 z-40",
            "lg:translate-x-0",
            !rightSidebarOpen && "lg:w-0"
          )}>
            <div className="h-full glass-panel p-2 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -left-3 top-2 z-50 bg-background/80 backdrop-blur-sm shadow-md rounded-full"
                onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              >
                <PanelRightClose className="h-4 w-4" />
              </Button>
              <StudioPanel 
                onNoteSelect={handleNoteSelect}
                isFullScreen={false}
                onToggleFullScreen={() => {}}
              />
            </div>
          </div>
        </div>
      </div>

      <SettingsDialog 
        open={showSettings} 
        onOpenChange={setShowSettings}
      />
    </div>
  );
};

export default Index;
