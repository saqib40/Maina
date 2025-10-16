import React, { useEffect, useState } from "react";
import SdpTextarea from "../components/SdpTextArea";
import VideoPlayer from "../components/VideoPlayer";
import { useNavigate } from "react-router-dom";
import useWebRTC from "../hooks/useWebRTC";

const CreateCallPage: React.FC = () => {
  const { 
    localStream, 
    remoteStream, 
    offerSdp, 
    iceCandidates, 
    createOffer, 
    setRemoteAnswer, 
    addIceCandidates, 
    hangUp 
  } = useWebRTC();

  const [answer, setAnswer] = useState('');
  const [remoteCandidates, setRemoteCandidates] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Start the connection process when the component mounts
    createOffer();
    // Clean up the connection when the component unmounts
    return () => {
      hangUp();
    };
  }, [createOffer, hangUp]);
  
  // A small helper to safely check if the candidates string has content
  const hasIceCandidates = (): boolean => {
    try {
      return JSON.parse(iceCandidates || '[]').length > 0;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col gap-6">
      <button onClick={() => navigate('/')} className="self-start text-indigo-400 hover:text-indigo-300 mb-2">
        &larr; Back to Home
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VideoPlayer stream={localStream} muted label="Your Video" />
        <VideoPlayer stream={remoteStream} label="Friend's Video" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex flex-col gap-4">
            <SdpTextarea 
                label="1. Your Offer Code" 
                instructions="Copy this and send it to your friend." 
                sdp={offerSdp} 
                hasContent={!!offerSdp} 
                placeholder="Generating Offer..."
            />
            <SdpTextarea 
                label="3. Your Connection Candidates" 
                instructions="Copy these and send them to your friend." 
                sdp={iceCandidates} 
                hasContent={hasIceCandidates()} 
                placeholder="Gathering candidates..."
            />
        </div>
        <div className="flex flex-col gap-4">
            <SdpTextarea 
                label="2. Friend's Answer Code" 
                instructions="Paste your friend's answer code here." 
                sdp={answer} 
                onSdpChange={e => setAnswer(e.target.value)} 
                placeholder="Paste answer here..." 
                buttonText="Set Answer" 
                onButtonClick={() => setRemoteAnswer(answer)}
            />
            <SdpTextarea 
                label="4. Friend's Connection Candidates" 
                instructions="Paste your friend's candidates here." 
                sdp={remoteCandidates} 
                onSdpChange={e => setRemoteCandidates(e.target.value)} 
                placeholder="Paste candidates here..." 
                buttonText="Add Candidates" 
                onButtonClick={() => addIceCandidates(remoteCandidates)}
            />
        </div>
      </div>
    </div>
  );
};

export default CreateCallPage;
