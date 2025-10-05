import Link from "next/link";
import Image from "next/image";
import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";
import { useState, useEffect } from "react";
import { GeneratedAvatar } from "@/components/genrated-avatar";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

 interface Props{
     onLeave :()=> void;
     meetingName : string;
     isAiActive: boolean;
     startAi?: () => void;
     stopAi?: () => void;
  }

  export const CallAcctive = ({onLeave,meetingName, isAiActive, startAi, stopAi}:Props) =>{
    return(
        <div className="flex flex-col h-full justify-between text-teal-50">
            <div className="flex items-center gap-4 m-4">
                <div className="bg-black rounded-full w-10 h-10 flex items-center justify-center">
                    <Link href="/"  className="flex items-center justify-center rounded-full w-fit">
                    <Image src="/global.svg" alt="logo" width={30} height={30} className="rounded-full"/>
                    </Link>
                </div>
                <h3 className="text-2xl font-bold">
                    {meetingName}
                </h3>
                {isAiActive && (
                    <div className="flex items-center gap-2">
                        <GeneratedAvatar seed="AI Assistant" variant="botttsNeutral" size={40} />
                        <span className="text-sm text-white">AI Assistant Active</span>
                    </div>
                )}
                {!isAiActive && startAi && (
                    <Button
                        onClick={startAi}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                        size="sm"
                    >
                        <Bot className="w-4 h-4" />
                        Start AI Assistant
                    </Button>
                )}
                {isAiActive && stopAi && (
                    <Button
                        onClick={stopAi}
                        className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                        size="sm"
                    >
                        <Bot className="w-4 h-4" />
                        Stop AI Assistant
                    </Button>
                )}
            </div>
            <SpeakerLayout/>
            <div className=" bg-black rounded-full">
                  <CallControls onLeave={onLeave}
                  />
                  </div>



        </div>
    )
 }