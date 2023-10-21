import { Play } from "lucide-react";
import { useContext } from "react";
import { AudioContext } from "../Context/AudioContext";
import { Link } from "react-router-dom";

const MusicCard = (props) => {
  // eslint-disable-next-line react/prop-types
  const { musicName, musicImage } = props;
  const { selectedAudio, setSelectedAudio, isPause, setIsPause } =
    useContext(AudioContext);

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
    <div className="bg-white/5 group rounded flex items-center gap-4 overflow-hidden hover:bg-white/20 transition-all">
      <img
        loading="lazy"
        src={`http://localhost:5000/${musicImage}`}
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
        onClick={handlePlayClick}
        className={`items-center justify-center pl-4 p-3 rounded-full bg-green-600 text-black ml-auto mr-8 ${
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
  );
};

export default MusicCard;
