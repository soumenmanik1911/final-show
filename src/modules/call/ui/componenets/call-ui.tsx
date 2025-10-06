import { useState } from "react";
import { StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { CallLobby } from "./call-lobby";
import { CallAcctive } from "./cal-active";
import { CallEnded } from "./call-ended";

interface Props {
  meetingName: string;
  meetingData?: any;
  isAiActive: boolean;
  startAi?: () => void;
  stopAi?: () => void;
  isGuest?: boolean;
}

export const CallUI = ({ meetingName, meetingData, isAiActive, startAi, stopAi, isGuest }: Props) => {
  const call = useCall();
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");

  const handleJoin = async () => {
    if (!call) return;
    // Fix: Check if already joined to prevent "Illegal State: call.join() shall be called only once" error
    // This prevents multiple join calls that can occur due to re-renders or component remounting
    if (call.state.callingState === 'joined') {
      setShow("call");
      return;
    }
    await call.join();
    setShow("call");
  };

  const handleLeave = () => {
    if (!call) return;

    // For guests, use leave() to exit without ending the call for others
    // For hosts, use endCall() to end the meeting for everyone
    if (isGuest) {
      call.leave();
    } else {
      call.endCall();
    }

    setShow("ended");
  };

  return (
    // Enhanced: Added semantic main element for better accessibility and structure
    // Enhanced: Ensured full viewport height with min-h-screen for responsive design across devices
    // Enhanced: Added smooth transitions between call states for improved user experience
    <main className="min-h-screen w-full">
      <StreamTheme className="h-full w-full">
        <div className="relative h-full w-full transition-all duration-300 ease-in-out">
          {show === "lobby" && (
            <CallLobby
              onJoin={handleJoin}
              meetingName={meetingName}
              meetingId={meetingData?.id || ""}
              hostName={meetingData?.user?.name || "Host"}
              isGuest={isGuest}
            />
          )}
          {show === "call" && <CallAcctive onLeave={handleLeave} meetingName={meetingName} isAiActive={isAiActive} startAi={startAi} stopAi={stopAi} isGuest={isGuest} />}
          {show === "ended" && <CallEnded meetingData={meetingData} isGuest={isGuest} />}
        </div>
      </StreamTheme>
    </main>
  );
};
