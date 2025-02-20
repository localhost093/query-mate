
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp, Maximize2, Minimize2 } from "lucide-react";

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

const MarkdownEditor = ({ 
  content, 
  onChange, 
  isFullScreen, 
  onToggleFullScreen 
}: MarkdownEditorProps) => {
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            Preview
          </Button>
        </div>
        {onToggleFullScreen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFullScreen}
          >
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <div className={`flex-1 flex ${showPreview ? 'flex-col md:flex-row' : 'flex-col'} divide-y md:divide-x md:divide-y-0`}>
        <div className={`${showPreview ? 'flex-1' : 'flex-1'}`}>
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full p-4 bg-background resize-none focus:outline-none text-foreground font-mono"
            placeholder="Start writing... Use Markdown syntax for formatting:
# Heading 1
## Heading 2
**Bold text**
*Italic text*
- List item
1. Numbered list
[Link text](url)
`Code block`"
          />
        </div>
        {showPreview && (
          <div className="flex-1 p-4 prose prose-sm max-w-none dark:prose-invert prose-p:text-foreground prose-headings:text-foreground overflow-y-auto bg-muted/30">
            <ReactMarkdown className="prose dark:prose-invert">
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
