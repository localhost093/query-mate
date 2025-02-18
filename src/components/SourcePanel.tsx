
import { Plus } from "lucide-react";
import { Button } from "./ui/button";

interface SourcePanelProps {
  sources: string[];
  onSourceAdd: (source: string) => void;
}

const SourcePanel = ({ sources, onSourceAdd }: SourcePanelProps) => {
  return (
    <div className="h-full p-4 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Sources</h2>
      
      <Button 
        variant="outline" 
        className="w-full border-dashed bg-transparent hover:bg-gray-50 border-gray-300 text-gray-600"
        onClick={() => onSourceAdd("New Source")}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add source
      </Button>

      <div className="space-y-2">
        {sources.map((source, index) => (
          <div 
            key={index}
            className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
          >
            {source}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourcePanel;
