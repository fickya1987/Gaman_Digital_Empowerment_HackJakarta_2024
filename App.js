import React, { useEffect } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { useMediaQuery } from './hooks/useMediaQuery'; // Custom hook for media query
import { useMeeting } from './hooks/useMeeting'; // Redefined custom hook
import { MeetingContextProvider } from './contexts/MeetingContext'; // Context provider
import MeetingLayout from './components/MeetingLayout'; // Main meeting UI component
import { ScreenManager } from './components/ScreenManager'; // Manages different screens

function App() {
  const isMobile = useMediaQuery('(max-width: 768px)'); // Using custom hook for media queries
  const { meetingContext, setMeetingContext, actions } = useMeeting();

  useEffect(() => {
    // Handling exit confirmation on mobile devices
    window.onbeforeunload = isMobile ? () => "Are you sure you want to exit?" : null;
  }, [isMobile]);

  return (
    <MeetingContextProvider value={{ meetingContext, setMeetingContext }}>
      <ScreenManager>
        <MeetingLayout
          config={{
            meetingId: meetingContext.meetingId,
            micEnabled: meetingContext.micOn,
            webcamEnabled: meetingContext.webcamOn,
            name: meetingContext.participantName || "Anonymous",
            multiStream: true,
            customVideoTrack: meetingContext.customVideoStream,
            customAudioTrack: meetingContext.customAudioStream,
          }}
          token={meetingContext.token}
          onLeave={actions.resetMeeting}
          meetingStatus={meetingContext}
        />
      </ScreenManager>
    </MeetingContextProvider>
  );
}

export default App;
