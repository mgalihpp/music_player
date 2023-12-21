import { Pause, Play } from "lucide-react";
import { host } from "../../lib/utils";
import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";
import { useAudioContext } from "../../Context/AudioContext";

const MainPlaylist = ({ id, name, image }) => {
  const { selectedPlayedPlaylist, isPause, setUserPlaylists } =
    useAudioContext();
  const currentPlaylist =
    selectedPlayedPlaylist && selectedPlayedPlaylist.id === id;
  return (
    <Link
      to={`/playlist/${id}`}
      onClick={() => setUserPlaylists(true)}
      className={` cursor-pointer
        bg-white/5 group rounded hhh flex items-center gap-2 overflow-hidden hover:bg-white/20 transition-all
        `}
    >
      <img
        title={name}
        loading="lazy"
        src={`${host}playlist/img/${image}`}
        alt="cover"
        width={50}
        height={50}
        style={{
          minWidth: "48px",
          minHeight: "48px",
          objectFit: "cover",
          maxWidth: "48px",
          maxHeight: "48px",
        }}
      />
      <Link to={`/playlist/${id}`}>
        <strong className="hover:underline text-sm">{name}</strong>
      </Link>

      <button
        title="Play Music?"
        className={`items-center justify-center w-8 h-8 rounded-full bg-green-500/80 hover:bg-green-500 text-black ml-auto mr-4 
                  ${
                    currentPlaylist ? "opacity-100" : "opacity-0"
                  } group-hover:opacity-100 hover:scale-110 transition-all shadow hover:shadow-lg group`}
      >
        {currentPlaylist && !isPause ? (
          <Pause fill="black" size={17} className="flex mx-auto" />
        ) : (
          <Play fill="black" size={17} className="flex mx-auto ml-[9px]" />
        )}
      </button>
    </Link>
  );
};

MainPlaylist.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  image: PropTypes.string,
};

export default MainPlaylist;
