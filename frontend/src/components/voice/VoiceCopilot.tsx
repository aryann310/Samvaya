import React, { useState, useEffect, useCallback } from 'react';
import { LiveKitRoom, RoomAudioRenderer, VoiceAssistantControlBar, BarVisualizer, useVoiceAssistant } from '@livekit/components-react';
import '@livekit/components-styles';
import { Mic, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBusiness } from '../../contexts/BusinessContext';

const VOICE_API_URL = '/api/voice/token';

export default function VoiceCopilot() {
  const { isAuthenticated } = useAuth();
  const { businessId } = useBusiness();
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // In a real app we'd pass auth headers here
      const res = await fetch(`${VOICE_API_URL}?room=room-${businessId || 'default'}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch voice token');
      }
      
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setToken(data.token);
      setUrl(data.url);
    } catch (err: any) {
      setError(err.message || 'Could not connect to voice assistant');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (isOpen && !token) {
      fetchToken();
    }
  }, [isOpen, token, fetchToken]);

  if (!isAuthenticated) return null;

  return (
    <>
      {/* FAB Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 hover:shadow-primary/25 hover:shadow-xl"
          aria-label="Open Voice Assistant"
        >
          <Mic className="w-6 h-6" />
        </button>
      )}

      {/* Voice Assistant Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 bg-card border border-glass-border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-semibold text-sm">Samvaya Voice Copilot</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 flex flex-col items-center justify-center min-h-[200px] relative">
            {isLoading && (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xs">Connecting to Agent...</span>
              </div>
            )}
            
            {error && (
              <div className="text-center text-red-500 text-xs">
                {error}
                <button 
                  onClick={fetchToken}
                  className="block mt-2 mx-auto px-3 py-1 bg-red-500/10 rounded-full hover:bg-red-500/20 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {token && url && !isLoading && !error && (
              <LiveKitRoom
                serverUrl={url}
                token={token}
                connect={true}
                audio={true}
                video={false}
                className="flex flex-col items-center w-full"
              >
                <VoiceAssistantUI />
                <RoomAudioRenderer />
              </LiveKitRoom>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Separate component so we can use useVoiceAssistant hook (must be inside LiveKitRoom)
function VoiceAssistantUI() {
  const { state, audioTrack } = useVoiceAssistant();
  
  return (
    <div className="flex flex-col items-center w-full gap-6">
      <div className="h-16 w-full flex items-center justify-center">
        {audioTrack ? (
          <BarVisualizer 
            state={state} 
            barCount={5} 
            trackRef={audioTrack} 
            className="h-12 w-24 text-primary" 
          />
        ) : (
          <div className="text-muted-foreground text-xs animate-pulse">
            {state === 'connecting' ? 'Connecting...' : 'Listening...'}
          </div>
        )}
      </div>
      
      <VoiceAssistantControlBar controls={{ leave: false, microphone: true }} className="bg-transparent shadow-none" />
    </div>
  );
}
