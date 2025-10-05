import Link from "next/link";
import { LogInIcon, Users, Calendar, User, Mic, MicOff, Video, VideoOff, Settings } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
  // ParticipantCount
} from "@stream-io/video-react-sdk";

import { generateAvatarUri } from "@/lib/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import "@stream-io/video-react-sdk/dist/css/styles.css";

interface Props {
  onJoin: () => void;
  meetingName?: string;
  meetingId?: string;
  hostName?: string;
  isGuest?: boolean;
};

 const DisableVideoPreview = () =>{
  const {data} = authClient.useSession();

  return(
    <DefaultVideoPlaceholder
    participant={
      {
        name : data?.user?.name ?? "",
        image : data?.user?.image ??
         generateAvatarUri({
          seed: data?.user?.name ?? "",
          variant:"initials"
         })
       
      }as StreamVideoParticipant
    }
    />
  )
 }

 const  AllBrowserPermissions = () =>{
  return(
    <p className="text-xl">
      please grant your browser permissions to join the call
    </p>
  )
};
export const CallLobby = ({
  onJoin,
  meetingName = "Meeting",
  meetingId = "",
  hostName = "Host",
  isGuest = false
}: Props) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();

  const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 lg:p-6">
      {/* Main Content - Improved responsive layout with better spacing */}
      <div className="flex-1 flex flex-col items-center justify-center lg:justify-start lg:pt-12">
        <div className="w-full max-w-4xl space-y-8">
          {/* Meeting Info Header - Enhanced design with better typography and spacing */}
          <Card className="bg-slate-800/60 border-slate-700 shadow-2xl backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                    <Video className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl lg:text-3xl text-white font-bold leading-tight">{meetingName}</CardTitle>
                    <p className="text-slate-300 font-medium mt-1">Hosted by {hostName}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-600 text-white px-4 py-2 text-sm font-semibold shadow-md">
                  <Users className="w-4 h-4 mr-2" />
                  Waiting Room
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Video Preview - Redesigned with better responsive sizing and visual hierarchy */}
          <Card className="bg-slate-800/60 border-slate-700 shadow-2xl backdrop-blur-sm">
            <CardContent className="p-6 lg:p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">Camera Preview</h3>
                <p className="text-slate-300 text-base leading-relaxed">Adjust your settings before joining the meeting</p>
              </div>

              <div className="flex justify-center mb-8">
                <div className="relative max-w-md w-full">
                  <VideoPreview
                    className="w-full aspect-video rounded-xl overflow-hidden border-2 border-slate-600 shadow-xl"
                    DisabledVideoPreview={
                      hasBrowserMediaPermission
                        ? DisableVideoPreview
                        : AllBrowserPermissions
                    }
                  />
                  {!hasBrowserMediaPermission && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/90 rounded-xl backdrop-blur-sm">
                      <div className="text-center text-white p-4">
                        <Settings className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                        <p className="text-lg font-semibold mb-2">Permissions Required</p>
                        <p className="text-sm text-slate-300">Please enable camera and microphone access</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Controls - Redesigned with better button styling and responsive layout */}
              <div className="flex justify-center gap-6 lg:gap-8 mb-8">
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-4 rounded-full bg-slate-700 hover:bg-slate-600 transition-all duration-200 hover:scale-105 shadow-lg inline-flex">
                    <ToggleAudioPreviewButton />
                  </div>
                  <span className="text-sm text-slate-300 font-medium">
                    {hasMicPermission ? "Mic On" : "Mic Off"}
                  </span>
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-4 rounded-full bg-slate-700 hover:bg-slate-600 transition-all duration-200 hover:scale-105 shadow-lg inline-flex">
                    <ToggleVideoPreviewButton />
                  </div>
                  <span className="text-sm text-slate-300 font-medium">
                    {hasCameraPermission ? "Cam On" : "Cam Off"}
                  </span>
                </div>
              </div>

              {/* Join Button - Enhanced with better styling and responsive design */}
              <div className="flex justify-center">
                <Button
                  onClick={onJoin}
                  size="lg"
                  className="px-10 py-4 bg-green-600 hover:bg-green-500 disabled:bg-slate-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                  disabled={!hasBrowserMediaPermission}
                >
                  <LogInIcon className="mr-3 h-6 w-6" />
                  Join Meeting
                </Button>
              </div>

              {!hasBrowserMediaPermission && (
                <div className="text-center mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-400 font-medium">
                    Please allow camera and microphone access to join the meeting
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sidebar - Redesigned for better mobile experience and visual consistency */}
      <div className="w-full lg:w-96 bg-slate-800/40 border-t lg:border-t-0 lg:border-l border-slate-700 mt-8 lg:mt-0">
        <div className="p-6 space-y-6">
          {/* Meeting Details - Enhanced with better spacing and icons */}
          <Card className="bg-slate-800/60 border-slate-700 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-lg font-bold">Meeting Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 text-base">
                <Calendar className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300 font-medium">ID: {meetingId.slice(0, 8)}...</span>
              </div>
              <div className="flex items-center space-x-3 text-base">
                <User className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300 font-medium">Host: {hostName}</span>
              </div>
              {isGuest && (
                <Badge variant="outline" className="text-sm border-blue-500 text-blue-400 px-3 py-1 font-semibold">
                  Guest Access
                </Badge>
              )}
            </CardContent>
          </Card>


          {/* Cancel Button - Redesigned with better styling and accessibility */}
          <div className="pt-6">
            <Link href="/meetings">
              <Button
                variant="ghost"
                className="w-full text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-600 rounded-lg py-3 font-medium transition-all duration-200"
              >
                Cancel & Return to Meetings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
