import { useState } from "react";
import { StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { CallLobby } from "./call-lobby";
import { CallAcctive } from "./cal-active";
import { CallEnded } from "./call-ended";

interface Props {
  meetingName: string;
  isAiActive: boolean;
  startAi?: () => void;
  stopAi?: () => void;
}

export const CallUI = ({ meetingName, isAiActive, startAi, stopAi }: Props) => {
  const call = useCall();
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");

  const handleJoin = async () => {
    if (!call) return;
    await call.join();
    setShow("call");
  };

  const handleLeave = () => {
    if (!call) return;
    call.endCall();
    setShow("ended");
  };

  return (
    // Enhanced: Added semantic main element for better accessibility and structure
    // Enhanced: Ensured full viewport height with min-h-screen for responsive design across devices
    // Enhanced: Added smooth transitions between call states for improved user experience
    <main className="min-h-screen w-full">
      <StreamTheme className="h-full w-full">
        <div className="relative h-full w-full transition-all duration-300 ease-in-out">
          {show === "lobby" && <CallLobby onJoin={handleJoin} />}
          {show === "call" && <CallAcctive onLeave={handleLeave} meetingName={meetingName} isAiActive={isAiActive} startAi={startAi} stopAi={stopAi} />}
          {show === "ended" && <CallEnded />}
        </div>
      </StreamTheme>
    </main>
  );
};
