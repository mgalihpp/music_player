import { Home, Library, PlusSquare, Search, Plus } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import PlaylistMusic from "../Playlist/PlaylistMusic";
import { useMusicContext } from "../../Context/MusicContext";
import SkelPlaylistCard from "../Skeleton/SkelPlaylistCard";

const Navbar = () => {
  const { playlistData, isPLoading } = useMusicContext();

  return (
    <>
      <nav className="space-y-1 rounded-md bg-white/5">
        {navLink("Home", "/", <Home className="w-7 h-7" />)}
        {navLink("Search", "/search", <Search className="w-7 h-7" />)}
        {navLink("Upload", "/upload", <PlusSquare className="w-7 h-7" />)}
      </nav>

      <div className="p-1 rounded-t-md bg-white/5 mt-2">
        <div className="flex items-center justify-between text-zinc-400 gap-2 mb-5 ml-1 px-4 py-1">
          {playlistHeader("Your Playlist")}
          {createPlaylistButton()}
        </div>
        <nav
          className="grid grid-cols-2 p-1 mx-auto overflow-invisible hover:overflow-y-auto"
          style={{height: '390px', maxHeight: "390px", overflowX: "hidden" }}
        >
          {playlistItems(playlistData, isPLoading)}
        </nav>
      </div>
    </>
  );
};

// `flex items-center text-base text-zinc-100 gap-4 font-bold rounded-md p-3.5 hover:bg-white/5`

const navLink = (title, to, icon) => (
  <NavLink
    title={title}
    to={to}
    className={({ isActive, isPending, isTransitioning }) =>
      [
        isPending ? "pending" : "",
        isActive ? "bg-white/5  transition-all ease-in-out duration-300" : "",
        isTransitioning ? "transitioning" : "",
      ].join(
        " flex items-center text-base text-zinc-400 hover:text-zinc-100 gap-4 transition-all ease-in-out duration-300 font-bold rounded-md p-3.5 hover:bg-white/5 "
      )
    }
  >
    {icon} {title}
  </NavLink>
);

const playlistHeader = (title) => (
  <div className="flex items-center justify-center gap-2">
    <Library className="w-7 h-7" />
    <h1 className="text-lg font-bold">{title}</h1>
  </div>
);

const createPlaylistButton = () => (
  <div className="flex items-center justify-center">
    <Link
      to="/playlist/create"
      aria-label="Create"
      className="rounded-full bg-white/5 group p-2"
      title="Create a Playlist?"
    >
      <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white transition-all ease-in-out" />
    </Link>
  </div>
);

const playlistItems = (data, isLoading) => {
  return (
    <>
      {isLoading
        ? Array.from({ length: 6 }, (_, index) => (
            <SkelPlaylistCard key={index} />
          ))
        : data.map((playlist, index) => (
            <PlaylistMusic key={index} image={playlist.playlistImage}>
              {playlist.playlistName}
            </PlaylistMusic>
          ))}
    </>
  );
};

export default Navbar;
