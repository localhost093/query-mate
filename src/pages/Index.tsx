
import { useState } from "react";
import SourcePanel from "../components/SourcePanel";
import ChatPanel from "../components/ChatPanel";
import StudioPanel from "../components/StudioPanel";

const Index = () => {
  const [sources, setSources] = useState<string[]>([]);

  return (
    <div className="h-screen w-full bg-[#1a1b1e] text-white overflow-hidden">
      <div className="flex h-full">
        {/* Sources Panel */}
        <div className="w-[320px] border-r border-gray-800">
          <SourcePanel sources={sources} onSourceAdd={(source) => setSources([...sources, source])} />
        </div>

        {/* Chat Panel */}
        <div className="flex-1 border-r border-gray-800">
          <ChatPanel />
        </div>

        {/* Studio Panel */}
        <div className="w-[400px]">
          <StudioPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
