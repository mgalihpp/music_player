import { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import { useAudioContext } from "../Context/AudioContext";
import { Link } from "react-router-dom";
import { SkipBack, SkipForward } from "lucide-react";

const AudioPlayerComponent = () => {
  const { selectedAudio, setIsPause, isPause, playNext, playPrevious } =
    useAudioContext();
  const audioRef = useRef(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

  useEffect(() => {
    if (selectedAudio && !isPause) {
      if (isAudioReady) {
        audioRef.current.audio.current.play();
        setIsPause(false);
      }
    } else {
      audioRef.current.audio.current.pause();
    }
  }, [selectedAudio, setIsPause, isPause, isAudioReady]);

  const handleAudioReady = () => {
    setIsAudioReady(true);
  };

  const musicName = selectedAudio?.musicName || "-";
  const musicArtist = selectedAudio?.musicArtist || "-";

  return (
    <div className="flex items-center gap-3 w-full p-6">
      <div className="w-72 flex items-center gap-2">
        <img
          src={
            selectedAudio
              ? `http://127.0.0.1:5000/${selectedAudio.musicImage}`
              : "/img/download.jpeg"
          }
          alt="cover"
          width={56}
          height={56}
          className="rounded-md"
          style={{
            objectFit: "cover",
            minHeight: "56px",
            minWidth: "56px",
            maxWidth: "104px",
            maxHeight: "104px",
          }}
        />
        <div className="flex flex-col">
          <Link to={selectedAudio ? `/music/${musicName}` : ""}>
            <strong className="font-semibold hover:underline text-sm transition-all">
              {musicName}
            </strong>
          </Link>
          <span className="text-xs text-zinc-400">{musicArtist}</span>
        </div>
      </div>
      <div className="w-full flex flex-row justify-center items-center gap-2">
        <AudioPlayer
          ref={audioRef}
          className="w-full"
          autoPlay={true}
          onPlay={() => setIsPause(false)}
          onPause={() => setIsPause(true)}
          onEnded={playNext}
          onLoadedData={handleAudioReady}
          src={
            selectedAudio
              ? `http://127.0.0.1:5000/${selectedAudio.musicPath}`
              : ""
          }
        />
        <div className="flex flex-row items-center justify-center">
          <button
            onClick={playPrevious}
            className="w-10 h-6 my-auto p-1"
            aria-label="back"
            title="Previous"
          >
            <SkipBack fill="white" />
          </button>
          <button
            onClick={playNext}
            className="w-10 h-6 my-auto p-1 "
            aria-label="next"
            title="Next"
          >
            <SkipForward fill="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerComponent;
