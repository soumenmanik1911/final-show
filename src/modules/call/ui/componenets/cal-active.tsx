import Link from "next/link";
import Image from "next/image";
import { CallControls, SpeakerLayout, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useState, useEffect } from "react";
import { GeneratedAvatar } from "@/components/genrated-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageCircle, Grid, Users, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { CallChat } from "./call-chat";

 interface Props{
      onLeave :()=> void;
      meetingName : string;
      isAiActive: boolean;
      startAi?: () => void;
      stopAi?: () => void;
      isGuest?: boolean;
   }

export const CallAcctive = ({ onLeave, meetingName, isAiActive, startAi, stopAi, isGuest }: Props) => {
    const { useParticipantCount, useParticipants } = useCallStateHooks();
    const participants = useParticipants();
    const participantCount = useParticipantCount();

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'speaker' | 'grid'>('speaker');
    const [chatMessages, setChatMessages] = useState([
        {
            id: '1',
            sender: 'System',
            content: 'Welcome to the meeting!',
            timestamp: new Date(),
            isSystem: true
        }
    ]);

    const handleSendMessage = (message: string) => {
        const newMessage = {
            id: Date.now().toString(),
            sender: 'You', // In real app, get from user context
            content: message,
            timestamp: new Date(),
            isSystem: false
        };
        setChatMessages(prev => [...prev, newMessage]);
    };

   return (
       <div className="flex flex-col min-h-screen bg-slate-900 text-white relative">
           {/* Header - Redesigned with better spacing and responsive layout */}
           <div className="flex items-center justify-between p-4 lg:p-6 bg-slate-800/60 border-b border-slate-700 backdrop-blur-sm">
               <div className="flex items-center gap-4 lg:gap-6">
                   <div className="bg-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                       <Link href="/" className="flex items-center justify-center rounded-full w-fit">
                           <Image src="/global.svg" alt="logo" width={32} height={32} className="rounded-full"/>
                       </Link>
                   </div>
                   <div>
                       <h3 className="text-2xl lg:text-3xl font-bold leading-tight">{meetingName}</h3>
                       <div className="flex items-center gap-2 text-base text-slate-300 mt-1">
                           <Users className="w-5 h-5" />
                           <span className="font-medium">{participantCount} participants</span>
                       </div>
                   </div>
               </div>

               <div className="flex items-center gap-3 lg:gap-4">
                   {/* AI Assistant - Enhanced styling */}
                   {isAiActive && (
                       <div className="flex items-center gap-3 bg-green-600/20 px-4 py-2 rounded-full border border-green-500/30 shadow-md">
                           <GeneratedAvatar seed="AI Assistant" variant="botttsNeutral" size={28} />
                           <span className="text-sm font-semibold text-green-400">AI Active</span>
                       </div>
                   )}

                   {/* View Mode Toggle - Improved button design */}
                   <Button
                       onClick={() => setViewMode(viewMode === 'speaker' ? 'grid' : 'speaker')}
                       variant="ghost"
                       size="sm"
                       className="text-slate-300 hover:text-white hover:bg-slate-700/50 p-3 rounded-lg transition-all duration-200"
                   >
                       {viewMode === 'speaker' ? <Grid className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                   </Button>

                   {/* Chat Toggle - Enhanced with better badge positioning */}
                   <Button
                       onClick={() => setIsChatOpen(!isChatOpen)}
                       variant="ghost"
                       size="sm"
                       className="text-slate-300 hover:text-white hover:bg-slate-700/50 p-3 rounded-lg transition-all duration-200 relative"
                   >
                       <MessageCircle className="w-5 h-5" />
                       {chatMessages.length > 1 && (
                           <Badge
                               variant="destructive"
                               className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs font-bold shadow-lg"
                           >
                               {chatMessages.length - 1}
                           </Badge>
                       )}
                   </Button>
               </div>
           </div>

           {/* Main Content - Enhanced with better layout and responsive design */}
           <div className="flex-1 relative overflow-hidden">
               {/* Video Layout - Improved container styling */}
               <div className="h-full w-full">
                   {viewMode === 'speaker' ? (
                       <SpeakerLayout />
                   ) : (
                       <div className="flex items-center justify-center h-full bg-slate-800/20">
                           <div className="text-center text-slate-400 p-8">
                               <Users className="w-20 h-20 mx-auto mb-6 opacity-60" />
                               <p className="text-xl font-semibold mb-2">Grid view coming soon</p>
                               <p className="text-base text-slate-500">Use speaker view for now</p>
                           </div>
                       </div>
                   )}
               </div>

               {/* AI Controls Overlay - Redesigned with better positioning and styling */}
               {!isGuest && (
                   <div className="absolute top-6 left-6 space-y-3 z-10">
                       {!isAiActive && startAi && (
                           <Button
                               onClick={startAi}
                               className="bg-blue-600 hover:bg-blue-500 text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 font-semibold px-4 py-2 rounded-lg"
                               size="sm"
                           >
                               <Bot className="w-5 h-5 mr-2" />
                               Start AI Assistant
                           </Button>
                       )}
                       {isAiActive && stopAi && (
                           <Button
                               onClick={stopAi}
                               className="bg-red-600 hover:bg-red-500 text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 font-semibold px-4 py-2 rounded-lg"
                               size="sm"
                           >
                               <Bot className="w-5 h-5 mr-2" />
                               Stop AI Assistant
                           </Button>
                       )}
                   </div>
               )}

           </div>

           {/* Controls - Enhanced footer with better styling and spacing */}
           <div className="bg-slate-800/60 border-t border-slate-700 p-6 backdrop-blur-sm">
               <div className="flex justify-center">
                   <CallControls onLeave={onLeave} />
               </div>
           </div>

           {/* Chat Component */}
           <CallChat
               isOpen={isChatOpen}
               onToggle={() => setIsChatOpen(!isChatOpen)}
               messages={chatMessages}
               onSendMessage={handleSendMessage}
               participantCount={participantCount}
           />
       </div>
   );
 }