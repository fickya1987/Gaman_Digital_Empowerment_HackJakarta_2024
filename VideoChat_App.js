import { useContext, createContext, useState, useEffect, useRef } from "react";

export const MeetingAppContext = createContext();

export const useMeetingAppContext = () => useContext(MeetingAppContext);

function useDeviceSelection(defaultDevice) {
    const [device, setDevice] = useState(defaultDevice);

    const updateDevice = (newDevice) => {
        setDevice(newDevice);
    };

    return [device, updateDevice];
}

function usePermission(defaultPermission) {
    const [permission, setPermission] = useState(defaultPermission);

    const updatePermission = (newPermission) => {
        setPermission(newPermission);
    };

    useEffect(() => {
        // imagined permission check flow
    }, []);

    return [permission, updatePermission];
}

function useRaisedHandsTracking() {
    const raisedHandsParticipantsRef = useRef([]);
    const [raisedHandsParticipants, setRaisedHandsParticipants] = useState([]);

    const participantRaisedHand = (participantId) => {
        const currentItem = { participantId, raisedHandOn: new Date().getTime() };
        const updatedList = raisedHandsParticipantsRef.current.filter(item => item.participantId !== participantId);
        updatedList.push(currentItem);
        setRaisedHandsParticipants(updatedList);
    };

    const removeStaleEntries = () => {
        const now = new Date().getTime();
        const validEntries = raisedHandsParticipantsRef.current.filter(item => now - item.raisedHandOn <= 15000);
        setRaisedHandsParticipants(validEntries);
    };

    useEffect(() => {
        raisedHandsParticipantsRef.current = raisedHandsParticipants;
    }, [raisedHandsParticipants]);

    useEffect(() => {
        const interval = setInterval(removeStaleEntries, 1000);
        return () => clearInterval(interval);
    }, []);

    return [raisedHandsParticipants, participantRaisedHand];
}

export const MeetingAppProvider = ({ children }) => {
    const [selectedMic, setSelectedMic] = useDeviceSelection({ id: null, label: null });
    const [selectedWebcam, setSelectedWebcam] = useDeviceSelection({ id: null, label: null });
    const [selectedSpeaker, setSelectedSpeaker] = useDeviceSelection({ id: null, label: null });
    const [isCameraPermissionAllowed, setIsCameraPermissionAllowed] = usePermission(null);
    const [isMicrophonePermissionAllowed, setIsMicrophonePermissionAllowed] = usePermission(null);
    const [raisedHandsParticipants, participantRaisedHand] = useRaisedHandsTracking();
    const [sideBarMode, setSideBarMode] = useState(null);
    const [pipMode, setPipMode] = useState(false);

    return (
        <MeetingAppContext.Provider
            value={{
                selectedMic,
                selectedWebcam,
                selectedSpeaker,
                isCameraPermissionAllowed,
                isMicrophonePermissionAllowed,
                raisedHandsParticipants,
                sideBarMode,
                pipMode,
                setSelectedMic,
                setSelectedWebcam,
                setSelectedSpeaker,
                setIsCameraPermissionAllowed,
                setIsMicrophonePermissionAllowed,
                setSideBarMode,
                setPipMode,
                participantRaisedHand
            }}
        >
        </MeetingAppContext.Provider>
    );
};
