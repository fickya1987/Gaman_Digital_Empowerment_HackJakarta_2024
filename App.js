import { MeetingProvider } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import { useMeetingSetup } from "./hooks/useMeetingSetup"; // Example of a custom hook
import MeetingAppProvider from "./MeetingAppContextDef"; // Singular export
import MeetingContainer from "./meeting/MeetingContainer";
import LeaveScreen from "./components/screens/LeaveScreen";
import JoiningScreen from "./components/screens/JoiningScreen";

const isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;

function App() {
  const [meetingState, meetingActions] = useMeetingSetup();
  const { token, meetingId, participantName, micOn, webcamOn, customAudioStream,
    customVideoStream, isMeetingStarted, isMeetingLeft } = meetingState;
  const { setToken, setMeetingId, setParticipantName, setMicOn, setWebcamOn,
    setCustomAudioStream, setCustomVideoStream, setMeetingStarted, setIsMeetingLeft } = meetingActions;

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => "Are you sure you want to exit?";
    }
  }, [isMobile]);

  return (
    <MeetingAppProvider>
      {isMeetingStarted ? (
        <MeetingProvider
          config={{
            meetingId,
            micEnabled: micOn,
            webcamEnabled: webcamOn,
            name: participantName || "TestUser",
            multiStream: true,
            customCameraVideoTrack: customVideoStream,
            customMicrophoneAudioTrack: customAudioStream
          }}
          token={token}
          reinitialiseMeetingOnConfigChange={true}
          joinWithoutUserInteraction={true}
        >
          <MeetingContainer onMeetingLeave={() => meetingActions.resetMeeting()} />
        </MeetingProvider>
      ) : isMeetingLeft ? (
        <LeaveScreen setIsMeetingLeft={setIsMeetingLeft} />
      ) : (
        <JoiningScreen {...meetingState} {...meetingActions} />
      )}
    </MeetingAppProvider>
  );
}

export default App;
