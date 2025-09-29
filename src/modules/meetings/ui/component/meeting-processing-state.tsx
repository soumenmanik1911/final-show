import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

/**
 * MeetingProcessingState Component
 *
 * Displays the UI for a processing meeting state.
 * This component is self-contained and modular, designed for future enhancements.
 * It shows a color-coded card with an icon, title, and description indicating the meeting is being processed.
 *
 * Props:
 * - meeting: The meeting object containing details like id, name, status, etc.
 *   (Currently typed as any for flexibility; can be refined with proper types from schema)
 *
 * State Logic:
 * - Renders when meeting.status === "processing"
 * - Color scheme: Yellow tones for processing status
 * - No action buttons; informational only
 *
 * Integration Points:
 * - Integrated into MeetingIdView for conditional rendering based on meeting status
 * - Supports responsive design with Tailwind CSS
 * - Includes smooth transitions for state changes
 */
interface Props {
  meeting: any; // TODO: Replace with proper Meeting type from schema
}

export const MeetingProcessingState = ({ meeting }: Props) => {
  return (
    <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 transition-all duration-300 ease-in-out">
      <CardContent className="flex items-center gap-3 p-4">
        <Clock className="size-6 text-yellow-600" />
        <div>
          <p className="font-medium text-yellow-800 dark:text-yellow-200">Processing</p>
          <p className="text-sm text-yellow-600 dark:text-yellow-300">
            This meeting is currently being processed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};