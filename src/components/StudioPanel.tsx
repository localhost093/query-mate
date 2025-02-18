
import { FileText, Clock, BookOpen } from "lucide-react";
import { Button } from "./ui/button";

const StudioPanel = () => {
  return (
    <div className="h-full p-4 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Studio</h2>
        <p className="text-gray-500 text-sm mt-1">Analyze and organize your research</p>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start bg-transparent hover:bg-gray-50 border-gray-200 text-gray-700"
        >
          <FileText className="mr-2 h-4 w-4" />
          Study guide
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start bg-transparent hover:bg-gray-50 border-gray-200 text-gray-700"
        >
          <Clock className="mr-2 h-4 w-4" />
          Timeline
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start bg-transparent hover:bg-gray-50 border-gray-200 text-gray-700"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Summary
        </Button>
      </div>

      {/* Notes Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-500">Notes</h3>
        <div className="space-y-2">
          {/* Note preview cards */}
          <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
            <h4 className="font-medium text-gray-900">Research Overview</h4>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              Key findings from the literature review...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioPanel;
