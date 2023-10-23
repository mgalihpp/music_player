import { Home, Library, Plus, PlusSquare, Search } from "lucide-react";
import { Link } from "react-router-dom";
import PlaylistMusic from "./PlaylistMusic";

const Navbar = () => {
  return (
    <>
      <nav className="space-y-1 rounded-md bg-white/5">
        <Link
          title="Home"
          to="/"
          className="flex items-center text-base text-zinc-200 gap-4 font-bold rounded-md p-3.5 hover:bg-white/5"
        >
          <Home fill="white" className="text-black w-7 h-7" /> Home
        </Link>
        <Link
          title="Search?"
          to="/search"
          className="flex items-center text-base text-zinc-200 gap-4 font-bold rounded-md p-3.5 hover:bg-white/5"
        >
          <Search className="w-7 h-7" /> Search
        </Link>
        <Link
          title="Upload Music?"
          to="/upload"
          className="flex items-center text-base text-zinc-200 gap-4 font-bold rounded-md p-3.5 hover:bg-white/5"
        >
          <PlusSquare className="w-7 h-7" /> Upload
        </Link>
      </nav>

      <div className="p-1 rounded-md bg-white/5 mt-2">
        <div className="flex items-center justify-between text-zinc-400 gap-2 mb-5 ml-1 px-4 py-1">
          <div className="flex items-center justify-center gap-2">
            <Library className="w-7 h-7" />
            <h1 className="text-lg font-bold">Your Playlist</h1>
          </div>
          <div className="flex items-center justify-center">
            <button
            className="rounded-full bg-white/5 group p-2"
            title="Create a Playlist?">
              <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white transition-all" />
            </button>
          </div>
        </div>
        <nav
          className="grid grid-cols-2 p-1 mx-auto overflow-invisible hover:overflow-y-auto"
          style={{ maxHeight: "390px", overflowX: "hidden" }}
        >
          <PlaylistMusic>Favorite Musics</PlaylistMusic>
          <PlaylistMusic>My Playlist</PlaylistMusic>
          <PlaylistMusic>Favorite Musics</PlaylistMusic>
          <PlaylistMusic>My Playlist</PlaylistMusic>
          <PlaylistMusic>Favorite Musics</PlaylistMusic>
          <PlaylistMusic>My Playlist</PlaylistMusic>
          <PlaylistMusic>Favorite Musics</PlaylistMusic>
          <PlaylistMusic>My Playlist</PlaylistMusic>
          <PlaylistMusic>Favorite Musics</PlaylistMusic>
          <PlaylistMusic>My Playlist</PlaylistMusic>
          <PlaylistMusic>Favorite Musics</PlaylistMusic>
          <PlaylistMusic>My Playlist</PlaylistMusic>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
