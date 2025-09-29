import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

/**
 * MeetingCancelledState Component
 *
 * Displays the UI for a cancelled meeting state.
 * This component is self-contained and modular, designed for future enhancements.
 * It shows a color-coded card with an icon, title, and description indicating the meeting has been cancelled.
 *
 * Props:
 * - meeting: The meeting object containing details like id, name, status, etc.
 *   (Currently typed as any for flexibility; can be refined with proper types from schema)
 *
 * State Logic:
 * - Renders when meeting.status === "cancelled"
 * - Color scheme: Red tones for cancelled status
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

export const MeetingCancelledState = ({ meeting }: Props) => {
  return (
    <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 transition-all duration-300 ease-in-out">
      <CardContent className="flex items-center gap-3 p-4">
        <X className="size-6 text-red-600" />
        <div>
          <p className="font-medium text-red-800 dark:text-red-200">Meeting Cancelled</p>
          <p className="text-sm text-red-600 dark:text-red-300">
            This meeting has been cancelled.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};