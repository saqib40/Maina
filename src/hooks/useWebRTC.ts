import { useState, useRef, useCallback } from 'react';

// Configuration for the ICE servers
const iceConfig: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

// --- Custom Hook for WebRTC Logic (Refactored for Trickle ICE) ---
const useWebRTC = () => {
  // Refs for stable references to objects that don't trigger re-renders
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  // State for values that trigger UI re-renders
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [offerSdp, setOfferSdp] = useState<string>('');
  const [answerSdp, setAnswerSdp] = useState<string>('');
  // Store candidates as an array of objects
  const [iceCandidates, setIceCandidates] = useState<RTCIceCandidate[]>([]);

  // Function to initialize the PeerConnection
  const initializePeerConnection = useCallback(async () => {
    // Create and store the peer connection
    const pc = new RTCPeerConnection(iceConfig);
    pcRef.current = pc;

    // Get user media and add tracks to the connection
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      localStreamRef.current = stream;
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
    } catch (error) {
      console.error("Error getting user media.", error);
    }
    
    // Listen for ICE candidates and add them to the state array
    pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      const candidate = event.candidate;
      if (candidate) {
        setIceCandidates(prev => [...prev, candidate]);
      }
    };

    // Listen for the remote user's stream
    pc.ontrack = (event: RTCTrackEvent) => {
      const [stream] = event.streams;
      setRemoteStream(stream);
      remoteStreamRef.current = stream;
    };
    
    return pc;
  }, []);
  
  // Create an Offer SDP
  const createOffer = useCallback(async () => {
    const pc = await initializePeerConnection();
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      setOfferSdp(JSON.stringify(offer));
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  }, [initializePeerConnection]);

  // Create an Answer SDP
  const createAnswer = useCallback(async (receivedOfferSdp: string) => {
    const pc = await initializePeerConnection();
    try {
      const offer: RTCSessionDescriptionInit = JSON.parse(receivedOfferSdp);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      setAnswerSdp(JSON.stringify(answer));
    } catch (error) {
      console.error("Error creating answer:", error);
    }
  }, [initializePeerConnection]);

  // Set the remote Answer SDP
  const setRemoteAnswer = useCallback(async (receivedAnswerSdp: string) => {
    const pc = pcRef.current;
    if (pc && receivedAnswerSdp) {
      try {
        const answer: RTCSessionDescriptionInit = JSON.parse(receivedAnswerSdp);
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("Remote answer set!");
      } catch (error) {
        console.error("Error setting remote answer:", error);
      }
    }
  }, []);

  // Add incoming ICE candidates from the remote peer
  const addIceCandidates = useCallback((candidatesJson: string) => {
    const pc = pcRef.current;
    if (pc && candidatesJson) {
      try {
        // Parse the string back into an array of candidate objects
        const candidates: RTCIceCandidateInit[] = JSON.parse(candidatesJson);
        candidates.forEach(candidate => {
            if (candidate) {
                pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });
        console.log("ICE candidates added!");
      } catch (error) {
        console.error("Error adding ICE candidates", error);
      }
    }
  }, []);

  // Clean up and close the connection
  const hangUp = useCallback(() => {
    if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
    }
    if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
        setLocalStream(null);
    }
    if (remoteStreamRef.current) {
        remoteStreamRef.current = null;
        setRemoteStream(null);
    }
    // Reset all state for a new call
    setOfferSdp('');
    setAnswerSdp('');
    setIceCandidates([]);
  }, []);

  return {
    localStream,
    remoteStream,
    offerSdp,
    answerSdp,
    // Return candidates as a string, ready for signaling
    iceCandidates: JSON.stringify(iceCandidates),
    createOffer,
    createAnswer,
    setRemoteAnswer,
    addIceCandidates,
    hangUp
  };
};

export default useWebRTC;
