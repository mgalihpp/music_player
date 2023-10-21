import { useContext } from "react";
import AudioPlayer from "react-h5-audio-player";
import { AudioContext } from "../Context/AudioContext";
import { Link } from "react-router-dom";
// import "react-h5-audio-player/lib/styles.css";
// import 'react-h5-audio-player/lib/styles.less' Use LESS
// import 'react-h5-audio-player/src/styles.scss' Use SASS

const AudioPlayerComponent = () => {
  const { selectedAudio, setIsPause } = useContext(AudioContext);

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="w-72 flex items-center gap-2">
        <img
          src={
            selectedAudio
              ? `http://localhost:5000/${selectedAudio.musicImage}`
              : "/img/download.jpeg"
          }
          alt="cover"
          width={56}
          height={56}
          style={{
            objectFit: "cover",
            minHeight: "56px",
            minWidth: "56px",
            maxWidth: "104px",
            maxHeight: "104px",
          }}
        />
        <div className="flex flex-col">
          <Link to={selectedAudio ? `/music${selectedAudio.musicName}` : ""}>
            <strong className="font-normal hover:underline transition-all">
              {selectedAudio ? selectedAudio.musicName : "Music"}
            </strong>
          </Link>
          <span className="text-xs text-zinc-400">
            {selectedAudio ? selectedAudio.musicArtist : "-"}
          </span>
        </div>
      </div>
      <AudioPlayer
        className="w-full"
        autoPlay
        onPlay={() => setIsPause(false)}
        onPause={() => setIsPause(true)}
        onEnded={() => setIsPause(true)}
        src={
          selectedAudio
            ? `http://localhost:5000/${selectedAudio.musicPath}`
            : ""
        }
        // other props here
      />
    </div>
  );
};

export default AudioPlayerComponent;
