import { Play } from "lucide-react";
import { host } from "../../utils";
import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";

const MainPlaylist = ({ id, name, image }) => {
  return (
    <div
      key={id}
      className={`
        bg-white/5 group rounded w-64 flex items-center gap-4 overflow-hidden hover:bg-white/20 transition-all
        `}
    >
      <img
        title={name}
        loading="lazy"
        src={`${host}playlist/img/${image}`}
        alt="cover"
        width={70}
        height={70}
        style={{
          minWidth: "70px",
          minHeight: "70px",
          objectFit: "cover",
          maxWidth: "70px",
          maxHeight: "70px",
        }}
      />
      <Link to={"/playlist/" + name}>
        <strong className="hover:underline">{name}</strong>
      </Link>

      <button
        title="Play Music?"
        // onClick={handlePlayClick}
        className={`items-center justify-center pl-4 p-3 rounded-full bg-green-500/80 hover:bg-green-500 text-black ml-auto mr-8 
                 hidden hover:scale-110 transition-all shadow hover:shadow-lg group`}
      >
        <Play fill="black" size={25} />
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
