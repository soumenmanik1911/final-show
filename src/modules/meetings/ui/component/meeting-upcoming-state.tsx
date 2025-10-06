import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, VideoIcon, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";


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
  const [copied, setCopied] = useState(false);
  const joinUrl = `${window.location.origin}/join/${meeting.id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="space-y-4">
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

      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <VideoIcon className="size-5 text-green-600" />
            <p className="font-medium text-green-800 dark:text-green-200">Share Meeting Link</p>
          </div>
          <p className="text-sm text-green-600 dark:text-green-300 mb-3">
            Anyone with this link can join your meeting. Share it with participants.
          </p>
          <div className="flex gap-2">
            <Input
              value={joinUrl}
              readOnly
              className="flex-1 bg-white"
            />
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="px-3"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {meeting.guests && meeting.guests.length > 0 && (
        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {meeting.guests.length}
              </div>
              <p className="font-medium text-purple-800 dark:text-purple-200">Invited Guests</p>
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-300 mb-3">
              These guests will receive email notifications when the meeting ends.
            </p>
            <div className="space-y-2">
              {meeting.guests.map((guest: any) => (
                <div key={guest.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                  <span className="text-sm font-medium">{guest.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{guest.email}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};