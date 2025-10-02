import Link from "next/link";
import { LogInIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
// const { useCall, useCallStateHooks } = useStreamVideoClient();






import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Button } from "@/components/ui/button";


export const CallEnded = () => {
 


  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background p-10 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium"> You have ended the call</h6>
            <p className="text-sm">summary will appear in few minutes </p>
          </div>
        
        </div>
       
        <div className="flex gap-x-2 justify-between">
          <Button variant="ghost" >
            <Link href="/meetings" >
            back to meetings
            </Link>
         </Button>
        </div>
      </div>
    </div>
  );
};
