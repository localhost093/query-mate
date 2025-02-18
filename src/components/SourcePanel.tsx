
import { Plus } from "lucide-react";
import { Button } from "./ui/button";

interface SourcePanelProps {
  sources: string[];
  onSourceAdd: (source: string) => void;
}

const SourcePanel = ({ sources, onSourceAdd }: SourcePanelProps) => {
  return (
    <div className="h-full p-4 space-y-4">
      <h2 className="text-lg font-semibold">Sources</h2>
      
      <Button 
        variant="outline" 
        className="w-full border-dashed bg-transparent hover:bg-gray-800 border-gray-700 text-gray-400"
        onClick={() => onSourceAdd("New Source")}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add source
      </Button>

      <div className="space-y-2">
        {sources.map((source, index) => (
          <div 
            key={index}
            className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {source}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourcePanel;
