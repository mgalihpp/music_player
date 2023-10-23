import { Play } from "lucide-react";
import { useContext } from "react";
import { AudioContext } from "../Context/AudioContext";
import { Link } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import { PropTypes } from "prop-types";

const MusicCard = (props) => {
  const { musicName, musicImage, musicArtist } = props;
  const { selectedAudio, setSelectedAudio, isPause, setIsPause } =
    useContext(AudioContext);
  const { view } = useTheme();

  const handlePlayClick = () => {
    if (selectedAudio?.musicName === musicName) {
      setIsPause(!isPause); // Toggle the isPause state for the selected music
    } else {
      setSelectedAudio(props); // Set the selected audio in the context
      setIsPause(false);
    }
  };

  const isCurrentSelected = selectedAudio?.musicName === musicName;

  return (
    <>
      {view ? (
        <div
          className={`
          flex items-center justify-center p-4 group min-w-[150px] min-h-[150px] w-[180px] h-[250px] flex-col text-base text-zinc-200 gap-3 font-semibold rounded-md bg-white/5 hover:bg-white/10 transition-all`}
        >
          <div className="relative flex items-center justify-center">
            <img
              src={
                musicImage === ""
                  ? "/img/download.jpeg"
                  : `http://localhost:5000/${musicImage}`
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
              <p className="font-semibold hover:underline text-base whitespace-nowrap overflow-hidden overflow-ellipsis w-28">
                <strong title={musicName}>{musicName}</strong>
              </p>
            </Link>
            <p className="font-normal text-sm text-zinc-400 whitespace-nowrap overflow-hidden overflow-ellipsis w-32">
              {musicArtist}
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`
        bg-white/5 group rounded flex items-center gap-4 overflow-hidden hover:bg-white/20 transition-all
        `}
        >
          <img
            title={musicName}
            loading="lazy"
            src={
              musicImage === ""
                ? "/img/download.jpeg"
                : `http://localhost:5000/${musicImage}`
            }
            alt="cover"
            width={104}
            height={104}
            style={{
              minWidth: "104px",
              minHeight: "104px",
              objectFit: "cover",
              maxWidth: "104px",
              maxHeight: "104px",
            }}
          />
          <Link to={"/music/" + musicName}>
            <strong className="hover:underline">{musicName}</strong>
          </Link>

          <div
            className={`playing ml-auto mr-8 ${
              isCurrentSelected && !isPause ? "flex" : "hidden"
            }`}
          >
            <span className="playing__bar playing__bar1"></span>
            <span className="playing__bar playing__bar2"></span>
            <span className="playing__bar playing__bar3"></span>
          </div>

          <button
            title="Play Music?"
            onClick={handlePlayClick}
            className={`items-center justify-center pl-4 p-3 rounded-full bg-green-500/80 hover:bg-green-500 text-black ml-auto mr-8 hover:shadow-md ${
              isCurrentSelected && isPause
                ? "flex group-hover:flex"
                : isCurrentSelected
                ? "group-hover:hidden pl-3.5"
                : "flex group-hover:flex"
            } hidden hover:scale-110 transition-all shadow hover:shadow-lg group`}
          >
            <Play fill="black" size={25} />
          </button>
        </div>
      )}
    </>
  );
};

MusicCard.propTypes = {
  musicName: PropTypes.string,
  musicArtist: PropTypes.string,
  musicImage: PropTypes.string,
};

export default MusicCard;
