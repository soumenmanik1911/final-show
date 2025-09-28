import { AlertCircleIcon, Bot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon
}: Props) => {
  return (
    <div className="flex flex-1 items-center justify-center py-12 px-4">
      <div className="flex flex-col items-center justify-center gap-y-8 max-w-md mx-auto text-center">
        {/* Icon/Illustration */}
        <div className="relative">
          {icon || (
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Bot className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex flex-col gap-y-4">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
        
        {/* Action Button */}
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};