import { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import { useAudioContext } from "../Context/AudioContext";
import { Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import { host } from "../utils";

const AudioPlayerComponent = ({ showJumpControls }) => {
  const {
    selectedAudio,
    setIsPause,
    isPause,
    playNext,
    playPrevious,
    playShuffle,
  } = useAudioContext();
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
    <div className="flex items-center gap-3 w-full px-4 p-2">
      <div className="w-72 items-center gap-2 sm:flex hidden">
        <img
          src={
            selectedAudio
              ? `${host + "img/" + selectedAudio.musicImage}`
              : `${host}img/default_icon.jpeg`
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
              ? `${host + "stream_audio/" + selectedAudio.musicPath}`
              : ""
          }
          showSkipControls
          showJumpControls={showJumpControls}
          onClickNext={playNext}
          onClickPrevious={playPrevious}
        />
        <div>
          <button aria-label="shuffle" onClick={playShuffle}>
            <Shuffle className="sm:w-6 sm:h-6 w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerComponent;
