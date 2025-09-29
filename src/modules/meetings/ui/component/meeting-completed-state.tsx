import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

/**
 * MeetingCompletedState Component
 *
 * Displays the UI for a completed meeting state.
 * This component is self-contained and modular, designed for future enhancements.
 * It shows a color-coded card with an icon, title, and description indicating the meeting has been completed.
 *
 * Props:
 * - meeting: The meeting object containing details like id, name, status, etc.
 *   (Currently typed as any for flexibility; can be refined with proper types from schema)
 *
 * State Logic:
 * - Renders when meeting.status === "completed"
 * - Color scheme: Green tones for completed status
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

export const MeetingCompletedState = ({ meeting }: Props) => {
  return (
    <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 transition-all duration-300 ease-in-out">
      <CardContent className="flex items-center gap-3 p-4">
        <CheckCircle className="size-6 text-green-600" />
        <div>
          <p className="font-medium text-green-800 dark:text-green-200">Meeting Completed</p>
          <p className="text-sm text-green-600 dark:text-green-300">
            This meeting has been successfully completed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};