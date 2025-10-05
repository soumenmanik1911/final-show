import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Download, Play, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const router = useRouter();
  const trpc = useTRPC();
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const { data: guests } = useSuspenseQuery(
    trpc.meetings.getGuests.queryOptions({ meetingId: meeting.id })
  );

  const updateGuest = useMutation(
    trpc.meetings.updateGuest.mutationOptions({
      onSuccess: () => {
        setShowGuestDialog(false);
        setSelectedGuest(null);
        setGuestName("");
        setGuestEmail("");
      },
    })
  );

  const incompleteGuests = guests.filter((guest: any) => !guest.email);

  const handleEditGuest = (guest: any) => {
    setSelectedGuest(guest);
    setGuestName(guest.name);
    setGuestEmail(guest.email || "");
    setShowGuestDialog(true);
  };

  const handleSaveGuest = () => {
    if (selectedGuest) {
      updateGuest.mutate({
        id: selectedGuest.id,
        name: guestName,
        email: guestEmail || undefined,
      });
    }
  };

  return (
    <div className="space-y-4">
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

      {meeting.recordingUrl ? (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Play className="size-5 text-blue-600" />
              <p className="font-medium text-blue-800 dark:text-blue-200">Meeting Recording</p>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-300 mb-3">
              Your meeting has been recorded and is available for download.
            </p>
            <Button
              onClick={() => window.open(meeting.recordingUrl, '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Recording
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Play className="size-5 text-yellow-600" />
              <p className="font-medium text-yellow-800 dark:text-yellow-200">Recording Processing</p>
            </div>
            <p className="text-sm text-yellow-600 dark:text-yellow-300 mb-3">
              Your meeting recording is being processed. It will be available for download shortly.
            </p>
            <div className="text-xs text-yellow-500">
              Status: {meeting.status} | Recording URL: {meeting.recordingUrl ? 'Set' : 'Not set yet'}
            </div>
          </CardContent>
        </Card>
      )}

      {meeting.transcriptUrl && (
        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="size-5 text-purple-600" />
              <p className="font-medium text-purple-800 dark:text-purple-200">Meeting Summary</p>
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-300 mb-3">
              AI-generated summary and Q&A from your meeting transcript.
            </p>
            <Button
              onClick={() => router.push(`/summary/${meeting.id}`)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              View Summary
            </Button>
          </CardContent>
        </Card>
      )}

      {guests.length > 0 && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Users className="size-5 text-blue-600" />
              <p className="font-medium text-blue-800 dark:text-blue-200">Meeting Guests</p>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-300 mb-3">
              {guests.length} guest{guests.length !== 1 ? 's' : ''} participated in this meeting.
            </p>
            {incompleteGuests.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-yellow-600 dark:text-yellow-300">
                  {incompleteGuests.length} guest{incompleteGuests.length !== 1 ? 's' : ''} missing email information.
                </p>
                <div className="space-y-2">
                  {incompleteGuests.map((guest: any) => (
                    <div key={guest.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                      <span className="text-sm">{guest.name}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditGuest(guest)}
                      >
                        Add Email
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Guest Information</DialogTitle>
            <DialogDescription>
              Add or update the guest's email address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="guest-name">Name</Label>
              <Input
                id="guest-name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Guest name"
              />
            </div>
            <div>
              <Label htmlFor="guest-email">Email (optional)</Label>
              <Input
                id="guest-email"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="guest@example.com"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowGuestDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveGuest} disabled={updateGuest.isPending}>
                {updateGuest.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};