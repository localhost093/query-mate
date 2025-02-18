
import { Plus, ChevronDown, File } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

interface SourcePanelProps {
  sources: string[];
  onSourceAdd: (source: string) => void;
}

const SourcePanel = ({ sources, onSourceAdd }: SourcePanelProps) => {
  return (
    <div className="h-full flex flex-col bg-[#1a1b1e]">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-medium">Sources</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <Button 
          variant="outline" 
          className="w-full border-dashed bg-transparent hover:bg-gray-800 border-gray-700 text-gray-400"
          onClick={() => onSourceAdd("New Source")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add source
        </Button>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="all-sources" />
            <label htmlFor="all-sources" className="text-sm text-gray-300">
              Select all sources
            </label>
          </div>
          
          {sources.map((source, index) => (
            <div 
              key={index}
              className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <Checkbox id={`source-${index}`} />
              <File className="h-4 w-4 text-blue-400" />
              <label htmlFor={`source-${index}`} className="text-sm text-gray-300">
                {source}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SourcePanel;
