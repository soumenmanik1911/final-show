import Link from "next/link";
import { LogInIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview
} from "@stream-io/video-react-sdk";


import { generateAvatarUri } from "@/lib/avatar";


import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Button } from "@/components/ui/button";

interface Props {
  onJoin: () => void;
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
      pleas grant your browser permissions to join the call
    </p>
  )
 };
export const CallLobby = ({ onJoin }: Props) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();

  const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;


  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background p-10 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">Ready to join?</h6>
            <p className="text-sm">Set up your call before joining</p>
          </div>
          <VideoPreview
          DisabledVideoPreview={
            hasBrowserMediaPermission 
            ?DisableVideoPreview
            :AllBrowserPermissions
            
          }
          />
        </div>
        <div className="flex gap-x-2">
          <ToggleAudioPreviewButton/>
          <ToggleVideoPreviewButton />
        </div>
        <div className="flex gap-x-2 justify-between">
          <Button variant="ghost" >
            <Link href="/meetings" >
            cancel
            </Link>
          </Button>
          <Button onClick={onJoin}>
            <LogInIcon className="mr-2 h-4 w-4" />
            Join Call

          </Button>
        </div>
      </div>
    </div>
  );
};
