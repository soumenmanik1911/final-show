// components/meeting-loading.tsx
import { CalendarDaysIcon } from "lucide-react";

export const MeetingLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 space-y-4 text-center">
      <CalendarDaysIcon className="h-16 w-16 text-blue-600 animate-pulse" />
      <h2 className="text-2xl font-semibold text-blue-800">Loading Meetings</h2>
      <p className="text-lg text-blue-600">
        Please wait while we load your upcoming meetings...
      </p>
      <div className="flex space-x-2">
        <span className="h-3 w-3 rounded-full bg-blue-600 animate-bounce delay-150" />
        <span className="h-3 w-3 rounded-full bg-blue-600 animate-bounce delay-300" />
        <span className="h-3 w-3 rounded-full bg-blue-600 animate-bounce delay-450" />
      </div>
    </div>
  );
};
