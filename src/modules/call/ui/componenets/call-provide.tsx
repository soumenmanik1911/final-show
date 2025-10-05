"use-client"
import { LoaderIcon } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import { CallConnect } from "./call-connect";

interface Props {
  meetingId: string;
  meetingName: string;
  isGuest?: boolean;
  guestId?: string;
  guestName?: string;
  guestToken?: string;
};

export const CallProvider = ({
  meetingId,
  meetingName,
  isGuest,
  guestId,
  guestName,
  guestToken
}: Props) => {
  if (isGuest) {
    // For guests, use provided guest info
    return (
      <CallConnect
        meetingId={meetingId}
        meetingName={meetingName}
        userId={guestId!}
        userName={guestName!}
        userImage={generateAvatarUri({ seed: guestName!, variant: "initials" })}
        isGuest={true}
        guestToken={guestToken}
      />
    );
  }

  const { data, isPending } = authClient.useSession();

  if (!data || isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  return (
   <CallConnect
   meetingId={meetingId}
   meetingName={meetingName}
   userId={data.user.id}
   userName={data.user.name}
   userImage={
     data.user.image ??
     generateAvatarUri({ seed: data.user.name, variant: "initials" })
   }
 />

  );
};
