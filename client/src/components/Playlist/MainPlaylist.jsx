import { Play } from "lucide-react";
import { host } from "../../utils";
import { PropTypes } from "prop-types";
import { Link, useNavigate } from "react-router-dom";

const MainPlaylist = ({ id, name, image }) => {
  const navigate = useNavigate();
  return (
    <div
      key={id}
      onClick={() => navigate(`/playlist/${name}`)}
      className={` cursor-pointer
        bg-white/5 group rounded w-72 sm:w-64 flex items-center gap-2 overflow-hidden hover:bg-white/20 transition-all
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
          minWidth: "50px",
          minHeight: "50px",
          objectFit: "cover",
          maxWidth: "50px",
          maxHeight: "50px",
        }}
      />
      <Link to={"/playlist/" + name}>
        <strong className="hover:underline text-sm">{name}</strong>
      </Link>

      <button
        title="Play Music?"
        // onClick={handlePlayClick}
        className={`items-center justify-center w-8 h-8 rounded-full bg-green-500/80 hover:bg-green-500 text-black ml-auto mr-4 
                  opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow hover:shadow-lg group`}
      >
        <Play fill="black" size={17} className="flex ml-auto mr-1.5" />
      </button>
    </div>
  );
};

MainPlaylist.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  image: PropTypes.string,
};

export default MainPlaylist;
