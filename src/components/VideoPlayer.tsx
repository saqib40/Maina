interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  label: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ stream, muted = false, label }) => (
  <div className="bg-black/50 rounded-lg overflow-hidden relative shadow-lg">
    <video
      ref={(video: HTMLVideoElement | null) => {
        if (video) {
            // Assign the stream to the video element's srcObject
            video.srcObject = stream;
        }
      }}
      autoPlay
      playsInline
      muted={muted}
      className="w-full h-full object-cover"
    />
    <div className="absolute bottom-2 left-3 bg-black/50 text-white text-sm px-2 py-1 rounded">
      {label}
    </div>
  </div>
);

export default VideoPlayer;