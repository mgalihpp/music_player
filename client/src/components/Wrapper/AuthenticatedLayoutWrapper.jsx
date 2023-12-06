import { Link, Route, Routes } from "react-router-dom";
import {
  NavbarWrapper,
  MainWrapper,
  AudioPlayerComponentWrapper,
  CategoryWrapper,
  CreatePlaylistWrapper,
  PlaylistWrapper,
  SearchMusicWrapper,
  SingleMusicCardWrapper,
  UploadFileWrapper,
} from ".";
import Settings from "../../pages/Settings";
import About from "../../pages/About";
import TopNavbar from "../Navbar/TopNavbar";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const AuthenticatedLayout = () => {
  const [scrollPos, setScrollPos] = useState(0);
  const location = useLocation();

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    setScrollPos(scrollTop);
  };

  return (
    <div className="h-screen flex p-2 flex-col overflow-hidden max-w-screen-2xl w-full">
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 p-0 pr-2 sm:block hidden">
          <NavbarWrapper />
        </aside>
        <div
          className="flex-1 rounded-t-md bg-white/5 overflow-x-auto relative scroll"
          onScroll={handleScroll}
        >
          <main className="max-w-screen-xl w-full">
            {location.pathname !== "/search" && (
              <TopNavbar
                className="px-6 py-2 absolute w-inherit"
                position={scrollPos}
              />
            )}

            <Router />
          </main>
          <Footer />
        </div>
      </div>
      <div className="bg-white/5 border-t border-zinc-700 p-0 flex items-center justify-between rounded-b-md">
        <AudioPlayerComponentWrapper />
      </div>
    </div>
  );
};

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<MainWrapper />} />
      <Route path="/upload" element={<UploadFileWrapper />} />
      <Route path="/music/:musicName" element={<SingleMusicCardWrapper />} />
      <Route path="/search" element={<SearchMusicWrapper />} />
      <Route path="/create/playlist" element={<CreatePlaylistWrapper />} />
      <Route path="/playlist/:playlistName" element={<PlaylistWrapper />} />
      <Route path="/category/:name" element={<CategoryWrapper />} />
      <Route path="/setting" element={<Settings />} />
      <Route path="/about" element={<About />} />
      <Route
        path="*"
        element={
          <h1 className="flex items-center justify-center h-[90%] text-2xl mt-4">
            404 Not Found
          </h1>
        }
      />
    </Routes>
  );
};

const Footer = () => {
  return (
    <footer className="flex flex-row justify-between px-4 sm:px-8 pt-24 pb-4 bg-zinc-900">
      <div className="flex flex-col items-start justify-center gap-2">
        <h1 className="text-lg font-bold">This Page</h1>
        <Link
          to="/about"
          className="text-zinc-400 text-sm font-semibold hover:underline hover:text-zinc-100 transition-all"
        >
          About
        </Link>
        <Link
          target="_blank"
          to="https://github.com/mgalihpp/music_player"
          className="text-zinc-400 text-sm font-semibold hover:underline hover:text-zinc-100 transition-all"
        >
          Github
        </Link>
      </div>
      <div className="flex flex-col items-end justify-center">
        <h1>&copy; mgpp</h1>
      </div>
    </footer>
  );
};

export default AuthenticatedLayout;
