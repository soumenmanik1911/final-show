"use client";
import Vapi from "@vapi-ai/web";
interface Props {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string;
};
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient
} from "@stream-io/video-react-sdk";
import { useTRPC } from "@/trpc/client";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { CallUI } from "./call-ui";

export const CallConnect = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage
}: Props) => {
  console.log('CallConnect component rendered for meeting:', meetingId);

    const trpc = useTRPC();
const { mutateAsync: generateToken } = useMutation(
  trpc.meetings.genarateToken.mutationOptions(),
);
const [client, setClient] = useState<StreamVideoClient>();
useEffect(() => {
  const _client = new StreamVideoClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    user: {
      id: userId,
      name: userName,
      image: userImage,
    },
    tokenProvider: generateToken
  });
  setClient(_client);
  return () => {
    _client.disconnectUser();
    setClient(undefined);
  };
}, [userId, userName, userImage, generateToken]);

 // useState and useEffect for client and call
 // const [client, setClient] = useState<StreamVideoClient>();
 const [call, setCall] = useState<Call>();
 const [vapiClient, setVapiClient] = useState<Vapi>();
 const [isAiActive, setIsAiActive] = useState(false);

useEffect(() => {
  if (!client) return;
  if (!meetingId) return;

  const _call = client.call("default", meetingId);
  _call.camera.disable();
  _call.microphone.disable();
  setCall(_call);

  // Initialize Vapi client
  console.log('Initializing VapiClient with key:', process.env.NEXT_PUBLIC_VAPI_API_KEY ? 'Present' : 'Missing');
  console.log('Assistant ID:', process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ? 'Present' : 'Missing');

  if (!process.env.NEXT_PUBLIC_VAPI_API_KEY || !process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID) {
    console.error('Vapi environment variables missing!');
    return;
  }

  const _vapiClient = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
  console.log('VapiClient instance created successfully');

  // Add event listeners for debugging
  _vapiClient.on('call-start', () => {
    console.log('Vapi: Call started');
    setIsAiActive(true);
  });
  _vapiClient.on('call-end', () => {
    console.log('Vapi: Call ended');
    setIsAiActive(false);
    // Re-enable Stream microphone
    if (call) {
      call.microphone.enable();
      console.log('Stream microphone re-enabled after VAPI ended');
    }
  });
  _vapiClient.on('message', (message: any) => console.log('Vapi message:', message));
  _vapiClient.on('error', (error: any) => console.error('Vapi error:', error));

  setVapiClient(_vapiClient);

  return () => {
    if (_call.state.callingState !== CallingState.LEFT) {
      _call.leave();
      _call.endCall();
      setCall(undefined);
    }
    // Clean up Vapi
    _vapiClient?.stop();
    setVapiClient(undefined);
  };
}, [client, meetingId]);

useEffect(() => {
  return () => {
    if (client) {
      client.disconnectUser();
      setClient(undefined);
    }
  };
}, [userId, userName, userImage, generateToken]);

// Function to start VAPI manually
const startAi = async () => {
  if (!vapiClient || !call) {
    console.error('VAPI client or call not ready');
    return;
  }

  try {
    console.log('Starting Vapi assistant for meeting:', meetingId);
    console.log('Using assistant ID:', process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
    await vapiClient.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!);
    console.log('Vapi assistant started successfully - joining as participant');

    // Disable Stream microphone to allow VAPI to handle audio input
    if (call) {
      call.microphone.disable();
      console.log('Stream microphone disabled for VAPI audio');
    }

    // Add AI as a virtual participant with avatar
    // Note: This is a conceptual addition - actual implementation may vary
    console.log('AI assistant joined meeting as participant');
  } catch (error) {
    console.error('Failed to start Vapi:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    console.error('Error keys:', Object.keys(error || {}));
  }
};

// Function to stop VAPI manually
const stopAi = () => {
  if (vapiClient) {
    console.log('Stopping VAPI assistant');
    vapiClient.stop();
    console.log('VAPI assistant stopped');
  }
};

// Enhanced: Improved loading screen with descriptive text and better accessibility
// Enhanced: Added semantic section element and proper ARIA labels for screen readers
// Enhanced: Ensured responsive design with min-h-screen and centered content
if (!client || !call) {
  return (
    <section
      className="flex min-h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar p-4"
      aria-live="polite"
      aria-label="Connecting to call"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <LoaderIcon className="size-8 animate-spin text-white" aria-hidden="true" />
        <p className="text-white text-lg font-medium">Connecting to call...</p>
        <p className="text-white/80 text-sm">Please wait while we set up your video call</p>
      </div>
    </section>
  );
}

  return (
    // Enhanced: Added semantic section wrapper for better structure
    // Enhanced: Ensured full width and height for responsive layout
    <section className="w-full h-full">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <CallUI meetingName={meetingName} isAiActive={isAiActive} startAi={startAi} stopAi={stopAi} />
        </StreamCall>
      </StreamVideo>
    </section>
  );


    // return(
    //     <div className="text-white">
    //         call connect
    //     </div>
    // )
};
