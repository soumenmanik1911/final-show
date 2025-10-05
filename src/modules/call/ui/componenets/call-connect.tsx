"use client";
import Vapi from "@vapi-ai/web";
interface Props {
  meetingId: string;
  meetingName: string;
  meetingData?: any;
  userId: string;
  userName: string;
  userImage: string;
  isGuest?: boolean;
  guestToken?: string;
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
  meetingData,
  userId,
  userName,
  userImage,
  isGuest,
  guestToken
}: Props) => {
  console.log('CallConnect component rendered for meeting:', meetingId);

  const trpc = useTRPC();
  const { mutateAsync: generateToken } = useMutation(
    trpc.meetings.genarateToken.mutationOptions(),
  );
  const [client, setClient] = useState<StreamVideoClient>();
  useEffect(() => {
    console.log('Creating StreamVideoClient for user:', userId, 'isGuest:', isGuest);
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
      token: isGuest ? guestToken : undefined,
      tokenProvider: isGuest ? undefined : () => {
        console.log('Generating token for user:', userId);
        return generateToken().then(token => {
          console.log('Token generated successfully for user:', userId);
          return token;
        }).catch(error => {
          console.error('Failed to generate token for user:', userId, error);
          throw error;
        });
      }
    });
    console.log('StreamVideoClient created, setting client');
    setClient(_client);
    return () => {
      console.log('Disconnecting StreamVideoClient for user:', userId);
      _client.disconnectUser();
      setClient(undefined);
    };
  }, [userId, userName, userImage, isGuest, guestToken, generateToken]);

 // useState and useEffect for client and call
 // const [client, setClient] = useState<StreamVideoClient>();
 const [call, setCall] = useState<Call>();
 const [vapiClient, setVapiClient] = useState<Vapi>();
 const [isAiActive, setIsAiActive] = useState(false);

useEffect(() => {
  if (!client) {
    console.log('No client available for call creation');
    return;
  }
  if (!meetingId) {
    console.log('No meetingId available for call creation');
    return;
  }

  console.log('Creating call for meetingId:', meetingId);
  const _call = client.call("default", meetingId);
  _call.camera.disable();
  _call.microphone.disable();
  console.log('Call created, setting call state');
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
    try {
      _vapiClient?.stop();
    } catch (error) {
      console.error('Error stopping Vapi on cleanup:', error);
    }
    setVapiClient(undefined);
  };
}, [client, meetingId]);

useEffect(() => {
  return () => {
    if (client) {
      client.disconnectUser();
      setClient(undefined);
    }
    if (vapiClient) {
      try {
        vapiClient.stop();
      } catch (error) {
        console.error('Error stopping Vapi on disconnect:', error);
      }
      setVapiClient(undefined);
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
  }
};

// Function to stop VAPI manually
const stopAi = () => {
  if (vapiClient) {
    try {
      console.log('Stopping VAPI assistant');
      vapiClient.stop();
      console.log('VAPI assistant stopped');
    } catch (error) {
      console.error('Failed to stop Vapi:', error);
    }
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

// Error state for guest token issues
if (isGuest && !guestToken) {
  return (
    <section
      className="flex min-h-screen items-center justify-center bg-red-50 p-4"
      aria-live="polite"
      aria-label="Connection error"
    >
      <div className="text-center space-y-4 max-w-md">
        <div className="p-4 bg-red-100 rounded-full w-fit mx-auto">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-600">
          Invalid or expired guest access token. Please request a new invitation from the meeting host.
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Go Back
        </button>
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
          <CallUI meetingName={meetingName} meetingData={meetingData} isAiActive={isAiActive} startAi={startAi} stopAi={stopAi} isGuest={isGuest} />
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
