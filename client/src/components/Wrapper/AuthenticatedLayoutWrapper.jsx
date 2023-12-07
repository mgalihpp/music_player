import { Route, Routes } from "react-router-dom";
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
  FooterWrapper,
  AboutWrapper,
  ProfileWrapper,
} from ".";
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
          className="flex-1 rounded-t-md bg-white/5 overflow-x-auto justify-between relative scroll"
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
          <FooterWrapper />
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
      <Route path="/profile" element={<ProfileWrapper />} />
      <Route path="/about" element={<AboutWrapper />} />
      <Route
        path="*"
        element={
          <h1 className="flex items-center justify-center h-screen text-2xl mt-4">
            404 Not Found
          </h1>
        }
      />
    </Routes>
  );
};

export default AuthenticatedLayout;
