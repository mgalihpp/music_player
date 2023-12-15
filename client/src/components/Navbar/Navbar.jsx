import { Suspense, lazy } from "react";
import { Home, Library, Search, Plus, PlusSquare } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useMusicContext } from "../../Context/MusicContext";
const PlaylistMusic = lazy(() => import("../Playlist/PlaylistMusic"));
const SkelPlaylistCard = lazy(() => import("../Skeleton/SkelPlaylistCard"));
import Loading from "../Loading";

const Navbar = () => {
  const { playlistData, isPLoading } = useMusicContext();

  return (
    <>
      <nav className={`rounded-md bg-white/5`}>
        {navLink("Home", "/", <Home className="w-7 h-7" />)}
        {navLink("Search", "/search", <Search className="w-7 h-7" />)}
        {navLink("Upload", "/upload", <PlusSquare className="w-7 h-7" />)}
      </nav>

      <div className={`p-1 rounded-t-md bg-white/5 mt-2 `}>
        <div className="flex items-center justify-between text-zinc-400 gap-2 mb-5 ml-1 px-4 py-1">
          {playlistHeader("My Playlists")}
          {createPlaylistButton()}
        </div>

        {playlistItems(playlistData, isPLoading)}
      </div>
    </>
  );
};

const navLink = (title, to, icon) => (
  <NavLink
    title={title}
    to={to}
    className={({ isActive, isPending, isTransitioning }) =>
      [
        isPending ? "pending" : "",
        isActive
          ? "bg-white/10  transition-all ease-in-out duration-300 text-zinc-100"
          : "",
        isTransitioning ? "transitioning" : "",
      ].join(
        " flex items-center text-base hover:text-zinc-100 gap-4 transition-all ease-in-out duration-300 font-bold rounded-md p-3.5 hover:bg-white/10 "
      )
    }
  >
    {icon} {title}
  </NavLink>
);

const playlistHeader = (title) => (
  <div className="flex items-center justify-center gap-2">
    <Library className="w-7 h-7" color="white" />
    <h1 className="text-lg font-bold text-zinc-200">{title}</h1>
  </div>
);

const createPlaylistButton = () => (
  <div className="flex items-center justify-center">
    <Link
      to="/create/playlist"
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
    <Suspense fallback={<Loading />}>
      <nav
        className="flex flex-row flex-wrap p-1 mx-auto overflow-invisible hover:overflow-y-auto"
        style={{ maxHeight: "430px", overflowX: "hidden" }}
      >
        {isLoading
          ? Array.from({ length: 6 }, (_, index) => (
              <SkelPlaylistCard key={index} />
            ))
          : data.map((playlist) => (
              <PlaylistMusic
                key={playlist.id}
                id={playlist.id}
                image={playlist.playlistImage}
              >
                {playlist.playlistName}
              </PlaylistMusic>
            ))}
      </nav>
    </Suspense>
  );
};

export default Navbar;
