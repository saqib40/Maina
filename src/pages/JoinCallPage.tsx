import { useEffect, useState } from "react";
import useWebRTC from "../hooks/useWebRTC";
import VideoPlayer from "../components/VideoPlayer";
import SdpTextarea from "../components/SdpTextArea";
import { useNavigate } from "react-router-dom";


const JoinCallPage = () => {
  const { localStream, remoteStream, answerSdp, iceCandidates, createAnswer, addIceCandidates, hangUp } = useWebRTC();
  const [offer, setOffer] = useState('');
  const [remoteCandidates, setRemoteCandidates] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    return () => hangUp();
  }, [hangUp]);


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
            <SdpTextarea label="1. Friend's Offer Code" instructions="Paste your friend's offer code to start." sdp={offer} onSdpChange={e => setOffer(e.target.value)} placeholder="Paste offer here..." buttonText="Create Answer" onButtonClick={() => createAnswer(offer)}/>
            <SdpTextarea label="3. Friend's Connection Candidates" instructions="Finally, paste your friend's candidates here." sdp={remoteCandidates} onSdpChange={e => setRemoteCandidates(e.target.value)} placeholder="Paste candidates here..." buttonText="Add Candidates" onButtonClick={() => addIceCandidates(remoteCandidates)}/>
        </div>
        <div className="flex flex-col gap-4">
            <SdpTextarea label="2. Your Answer Code" instructions="Copy this and send it back to your friend." sdp={answerSdp} hasContent={!!answerSdp} placeholder="Answer will be generated here..."/>
            <SdpTextarea label="4. Your Connection Candidates" instructions="Copy these and send them to your friend." sdp={iceCandidates} hasContent={JSON.parse(iceCandidates || '[]').length > 0} placeholder="Gathering candidates..."/>
        </div>
      </div>
    </div>
  );
};

export default JoinCallPage;