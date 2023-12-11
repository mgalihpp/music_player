import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { host } from "../../utils";

const PlaylistMusic = ({ children, image }) => {
  return (
    <Link
      to={`/playlist/${children}`}
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
          className="absolute flex items-center justify-center bottom-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 right-1 pl-3 p-2 rounded-full bg-green-500/80 text-black button-transition hover:scale-110 hover:bg-green-500"
        >
          <Play fill="black" />
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
