import { Pause, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { host } from "../../lib/utils";
import { useAudioContext } from "../../Context/AudioContext";

const PlaylistMusic = ({ id, children, image }) => {
  const { selectedPlayedPlaylist, isPause, setUserPlaylists } =
    useAudioContext();
  const currentPlaylist =
    selectedPlayedPlaylist && selectedPlayedPlaylist.id === id;
  return (
    <Link
      to={`/playlist/${id}`}
      onClick={() => setUserPlaylists(true)}
      className="flex items-center justify-center group w-[120px] flex-col text-base text-zinc-200 gap-3 font-semibold rounded p-3 hover:bg-white/10 transition-all"
    >
      <div className="relative">
        <img
          src={`${host + "playlist/img/" + image}`}
          alt="cover"
          loading="lazy"
          className="rounded object-cover min-w-[100px] min-h-[100px] max-w-[100px] max-h-[100px] w-[100px] h-[100px]"
        />
        <button
          aria-label="Play"
          className={`absolute flex items-center justify-center bottom-2 transform  ${
            currentPlaylist
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          } group-hover:translate-y-0 group-hover:opacity-100 right-1 p-2 rounded-full bg-green-500/80 text-black button-transition hover:scale-110 hover:bg-green-500`}
        >
          {currentPlaylist && !isPause ? (
            <Pause fill="black" />
          ) : (
            <Play fill="black" className="ml-1" />
          )}
        </button>
      </div>
      <p className="font-semibold text-sm whitespace-nowrap overflow-hidden overflow-ellipsis w-24">
        {children}
      </p>
    </Link>
  );
};

PlaylistMusic.propTypes = {
  children: PropTypes.node.isRequired,
  image: PropTypes.string,
};

export default PlaylistMusic;
