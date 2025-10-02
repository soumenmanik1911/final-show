import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, VideoIcon } from "lucide-react";
import Link from "next/link";


/**
 * MeetingUpcomingState Component
 *
 * Displays the UI for an upcoming meeting state.
 * This component is self-contained and modular, designed for future enhancements.
 * It shows a color-coded card with an icon, title, description, and action buttons specific to the upcoming state.
 *
 * Props:
 * - meeting: The meeting object containing details like id, name, status, etc.
 *   (Currently typed as any for flexibility; can be refined with proper types from schema)
 *
 * State Logic:
 * - Renders when meeting.status === "upcoming"
 * - Color scheme: Blue tones for upcoming status
 * - Includes a "Start Meeting" button for user action (functionality not implemented yet)
 *
 * Integration Points:
 * - Integrated into MeetingIdView for conditional rendering based on meeting status
 * - Supports responsive design with Tailwind CSS
 * - Includes smooth transitions for state changes
 */
interface Props {
  meeting: any; // TODO: Replace with proper Meeting type from schema
}

export const MeetingUpcomingState = ({ meeting }: Props) => {
  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 transition-all duration-300 ease-in-out">
      <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
        <div className="flex items-center gap-3 flex-1">
          <Calendar className="size-6 text-blue-600" />
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-200">Upcoming Meeting</p>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              This meeting is scheduled for the future. You can start it when ready.
            </p>
          </div>
        </div>
        <Link href={`/call/${meeting.id}`}>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <VideoIcon className="size-4 mr-2" />
            Start Meeting
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};