"use client";

import { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VapiTestPage() {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState<Array<{role: string, text: string}>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('VapiTestPage: Initializing Vapi');

    if (!process.env.NEXT_PUBLIC_VAPI_API_KEY || !process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID) {
      setError('Vapi environment variables not configured');
      return;
    }

    try {
      const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
      console.log('VapiTestPage: Vapi instance created');

      // Event listeners
      vapiInstance.on('call-start', () => {
        console.log('VapiTestPage: Call started');
        setIsConnected(true);
        setIsLoading(false);
        setError(null);
      });

      vapiInstance.on('call-end', () => {
        console.log('VapiTestPage: Call ended');
        setIsConnected(false);
        setIsLoading(false);
      });

      vapiInstance.on('message', (message) => {
        console.log('VapiTestPage: Message received', message);
        if (message.type === 'transcript' && message.transcript) {
          setTranscript(prev => [...prev, {
            role: message.role || 'unknown',
            text: message.transcript
          }]);
        }
      });

      vapiInstance.on('error', (error) => {
        console.error('VapiTestPage: Error', error);
        setError(`Vapi error: ${error?.message || 'Unknown error'}`);
        setIsLoading(false);
      });

      setVapi(vapiInstance);
    } catch (err) {
      console.error('VapiTestPage: Initialization error', err);
      setError(`Initialization error: ${err}`);
    }
  }, []);

  const startCall = async () => {
    if (!vapi) {
      setError('Vapi not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTranscript([]);

    try {
      console.log('VapiTestPage: Starting call with assistant ID:', process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
    } catch (err) {
      console.error('VapiTestPage: Start call error', err);
      setError(`Start call error: ${err}`);
      setIsLoading(false);
    }
  };

  const endCall = () => {
    if (vapi) {
      console.log('VapiTestPage: Ending call');
      vapi.stop();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Ask your query here</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status */}
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                Status: {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              {isLoading && <span className="text-sm text-blue-600">Loading...</span>}
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-4">
              <Button
                onClick={startCall}
                disabled={isConnected || isLoading || !vapi}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Starting...' : 'Start Voice Call'}
              </Button>

              <Button
                onClick={endCall}
                disabled={!isConnected}
                variant="destructive"
              >
                End Call
              </Button>
            </div>

            {/* Transcript */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Conversation Transcript</h3>
              <div className="max-h-96 overflow-y-auto bg-gray-100 p-4 rounded-lg">
                {transcript.length === 0 ? (
                  <p className="text-gray-500 text-sm">No conversation yet. Start a call to see transcripts.</p>
                ) : (
                  transcript.map((msg, i) => (
                    <div
                      key={i}
                      className={`mb-2 p-2 rounded ${
                        msg.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-green-100 mr-8'
                      }`}
                    >
                      <span className="text-xs font-semibold text-gray-600 uppercase">
                        {msg.role}:
                      </span>
                      <p className="text-sm mt-1">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 text-2xl"> Instructions:</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>1. Click "Start Voice Call" to begin</li>
                <li>2. Allow microphone permissions when prompted</li>
                <li>3. Speak to the AI assistant</li>
                <li>4. Check the transcript above for responses</li>
                <li>5. Click "End Call" to stop</li>
              </ul>
            </div>

        
          </CardContent>
        </Card>
      </div>
    </div>
  );
}