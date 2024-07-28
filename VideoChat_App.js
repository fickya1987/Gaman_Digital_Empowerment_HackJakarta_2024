import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

// Creating context to be used throughout the application for managing video chat state.
export const VideoChatContext = createContext();

// Custom hook to streamline the consumption of our VideoChatContext in the component tree.
export const useVideoChatContext = () => useContext(VideoChatContext);

// Hook for managing device selection state and updates.
const useDevice = (initialDevice) => {
  const [device, setDevice] = useState(initialDevice);
  const selectDevice = device => setDevice(device);
  return [device, selectDevice];
};

// Hook to handle permission states with initial checks.
const usePermissionStatus = () => {
  const [status, setStatus] = useState({ camera: false, microphone: false });

  useEffect(() => {
    // Simulated permission check (to be replaced with actual permission API calls)
    setStatus({ camera: true, microphone: true });
  }, []);

  return [status, setStatus];
};

// Managing and tracking participants with raised hands.
const useParticipantTracking = () => {
  const participantsRef = useRef([]);
  const [participants, setParticipants] = useState([]);

  const raiseHand = (id) => {
    const timestamp = new Date().getTime();
    const updatedParticipants = participantsRef.current.filter(p => p.id !== id);
    updatedParticipants.push({ id, raisedAt: timestamp });
    setParticipants(updatedParticipants);
  };

  // Cleanup function to prune old raised hand statuses.
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const activeParticipants = participantsRef.current.filter(p => now - p.raisedAt <= 15000);
      setParticipants(activeParticipants);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return [participants, raiseHand];
};

// Main context provider component
export const VideoChatProvider = ({ children }) => {
  const [mic, selectMic] = useDevice({ id: null, label: 'Default Microphone' });
  const [webcam, selectWebcam] = useDevice({ id: null, label: 'Default Webcam' });
  const [speaker, selectSpeaker] = useDevice({ id: null, label: 'Default Speaker' });
  const [permissionStatus, setPermissionStatus] = usePermissionStatus();
  const [participantsWithHandsRaised, raiseHand] = useParticipantTracking();
  const [sidebarVisible, setSidebarVisibility] = useState(false);
  const [pictureInPictureEnabled, setPictureInPicture] = useState(false);

  // Providing state and methods through context to be consumed in components.
  const contextValue = {
    mic,
    webcam,
    speaker,
    permissionStatus,
    participantsWithHandsRaised,
    sidebarVisible,
    pictureInPictureEnabled,
    actions: {
      selectMic,
      selectWebcam,
      selectSpeaker,
      setPermissionStatus,
      raiseHand,
      setSidebarVisibility,
      setPictureInPicture
    }
  };

  return (
    <VideoChatContext.Provider value={contextValue}>
      {children}
    </VideoChatContext.Provider>
  );
};
