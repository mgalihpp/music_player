import { Play } from "lucide-react";
import { useEffect } from "react";
import { useAudioContext } from "../Context/AudioContext";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { useMusicContext } from "../Context/MusicContext";

const MusicCard = (props) => {
  const { musicName, musicImage, musicArtist } = props;
  const {
    selectedAudio,
    setSelectedAudio,
    isPause,
    currentIndex,
    setCurrentIndex,
  } = useAudioContext();
  const { musicData } = useMusicContext();

  useEffect(() => {
    if (selectedAudio?.musicName === musicName) {
      setCurrentIndex(currentIndex);
    }
  }, [selectedAudio, musicName, currentIndex, setCurrentIndex]);

  const handlePlayClick = () => {
    if (selectedAudio?.musicName === musicName) {
      if (selectedAudio.isPause) {
        setSelectedAudio({ ...selectedAudio, isPause: false });
      } else {
        setSelectedAudio({ ...selectedAudio, isPause: true });
      }
    } else {
      setSelectedAudio({ ...props, isPause: false });
      setCurrentIndex(
        musicData.findIndex((music) => music.musicName === musicName)
      );
    }
  };

  const isCurrentSelected = selectedAudio?.musicName === musicName;

  return (
    <>
      <div
        className={` cursor-pointer
          flex items-center justify-center p-4 group min-w-[150px] min-h-[150px] w-[180px] h-[250px] flex-col text-base text-zinc-200 gap-3 font-semibold rounded-md bg-white/5 hover:bg-white/10 transition-all`}
      >
        <div className="relative flex items-center justify-center">
          <img
            src={
              musicImage
                ? `http://127.0.0.1:5000/${musicImage}`
                : "/img/download.jpeg"
            }
            className="rounded-lg object-cover min-w-[150px] min-h-[150px] w-[150px] h-[150px]"
          />
          <div
            className={`playing-ui ${
              isCurrentSelected && !isPause ? "visible" : "invisible"
            }`}
          >
            <span className="playing__bar playing__bar1"></span>
            <span className="playing__bar playing__bar2"></span>
            <span className="playing__bar playing__bar3"></span>
          </div>
          <button
            title="Play"
            aria-label="Play"
            onClick={handlePlayClick}
            className={`absolute flex items-center justify-center bottom-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 right-2 p-4 rounded-full bg-green-500/80 text-black button-transition hover:scale-110 hover:bg-green-500 hover:shadow-md 
          ${
            isCurrentSelected && isPause
              ? "flex group-hover:flex"
              : isCurrentSelected
              ? "group-hover:hidden pl-3.5"
              : "flex group-hover:flex"
          }
          `}
          >
            <Play fill="black" className="ml-1" />
          </button>
        </div>
        <div className="flex flex-col items-start">
          <Link to={"/music/" + musicName}>
            <p className="font-semibold hover:underline text-sm whitespace-nowrap overflow-hidden overflow-ellipsis w-32">
              <strong title={musicName}>{musicName}</strong>
            </p>
          </Link>
          <p className="font-normal text-xs text-zinc-400 whitespace-nowrap overflow-hidden overflow-ellipsis w-32">
            {musicArtist}
          </p>
        </div>
      </div>
    </>
  );
};

MusicCard.propTypes = {
  musicName: PropTypes.string,
  musicArtist: PropTypes.string,
  musicImage: PropTypes.string,
};

export default MusicCard;
