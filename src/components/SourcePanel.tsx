
import { Plus, ChevronDown, File } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { Input } from "./ui/input";

interface SourcePanelProps {
  sources: string[];
  onSourceAdd: (source: string) => void;
}

const SourcePanel = ({ sources, onSourceAdd }: SourcePanelProps) => {
  const [newSource, setNewSource] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const handleSourceAdd = () => {
    if (newSource.trim()) {
      onSourceAdd(newSource.trim());
      setNewSource("");
      setShowAddForm(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedSources.length === sources.length) {
      setSelectedSources([]);
    } else {
      setSelectedSources([...sources]);
    }
  };

  const toggleSource = (source: string) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter(s => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">Sources</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {showAddForm ? (
          <div className="space-y-2">
            <Input
              placeholder="Enter source name"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              className="bg-background"
            />
            <div className="flex gap-2">
              <Button 
                variant="default" 
                className="flex-1"
                onClick={handleSourceAdd}
              >
                Add
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full border-dashed bg-transparent hover:bg-muted"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add source
          </Button>
        )}

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="all-sources" 
              checked={selectedSources.length === sources.length}
              onCheckedChange={toggleSelectAll}
            />
            <label htmlFor="all-sources" className="text-sm text-muted-foreground">
              Select all sources
            </label>
          </div>
          
          {sources.map((source, index) => (
            <div 
              key={index}
              className="flex items-center space-x-2 p-2 rounded hover:bg-muted transition-colors cursor-pointer"
              onClick={() => toggleSource(source)}
            >
              <Checkbox 
                id={`source-${index}`}
                checked={selectedSources.includes(source)}
              />
              <File className="h-4 w-4 text-blue-400" />
              <label htmlFor={`source-${index}`} className="text-sm text-foreground">
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
