import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Video } from "lucide-react";

/**
 * MeetingActiveState Component
 *
 * Displays the UI for an active/in-progress meeting state.
 * This component is self-contained and modular, designed for future enhancements.
 * It shows a color-coded card with an icon, title, description, and interactive buttons for joining or cancelling the meeting.
 *
 * Props:
 * - meeting: The meeting object containing details like id, name, status, etc.
 *   (Currently typed as any for flexibility; can be refined with proper types from schema)
 *
 * State Logic:
 * - Renders when meeting.status === "active"
 * - Color scheme: Green tones for active status
 * - Includes a video icon button that toggles display of "Cancel" and "Join" options
 * - Uses local state to manage button visibility for better UX
 *
 * Integration Points:
 * - Integrated into MeetingIdView for conditional rendering based on meeting status
 * - Supports responsive design with Tailwind CSS
 * - Includes smooth transitions for state changes
 * - Buttons are UI-only; functionality not implemented yet
 */
interface Props {
  meeting: any; // TODO: Replace with proper Meeting type from schema
}

export const MeetingActiveState = ({ meeting }: Props) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 transition-all duration-300 ease-in-out">
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-3">
          <Play className="size-6 text-green-600" />
          <div>
            <p className="font-medium text-green-800 dark:text-green-200">Meeting Active</p>
            <p className="text-sm text-green-600 dark:text-green-300">
              This meeting is currently in progress. You can join or cancel it.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center gap-2"
          >
            <Video className="size-4" />
            Join Meeting
          </Button>
          {showOptions && (
            <div className="flex gap-2 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <Button variant="destructive" size="sm">
                Cancel
              </Button>
              <Button size="sm">
                Join
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};