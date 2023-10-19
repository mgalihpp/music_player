import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
// import 'react-h5-audio-player/lib/styles.less' Use LESS
// import 'react-h5-audio-player/src/styles.scss' Use SASS

const AudioPlayerComponent = () => (
  <div className="flex items-center gap-3 w-full">
    <div className="w-72 flex items-center gap-2">
      <img src="/img/download.jpeg" alt="cover" width={56} height={56} />
      <div className="flex flex-col">
        <a href="">
          <strong className="font-normal hover:underline transition-all">
            Close The Sun
          </strong>
        </a>
        <span className="text-xs text-zinc-400">TheFatRat</span>
      </div>
    </div>
    <AudioPlayer
      className="w-full"
      autoPlay
      src="https://files.gospeljingle.com/uploads/music/2023/02/TheFatRat_Anjulie_-_Close_To_The_Sun.mp3"
      onPlay={(e) => console.log("onPlay")}
      // other props here
    />
  </div>
);

export default AudioPlayerComponent;
