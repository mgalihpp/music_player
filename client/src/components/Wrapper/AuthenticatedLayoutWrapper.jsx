import { Route, Routes } from "react-router-dom";
import {
  NavbarWrapper,
  AllMusicsWrapper,
  AudioPlayerComponentWrapper,
  CategoryWrapper,
  CreatePlaylistWrapper,
  PlaylistWrapper,
  SearchMusicWrapper,
  SingleMusicCardWrapper,
  UploadFileWrapper,
  AboutWrapper,
  ProfileWrapper,
  HomeWrapper,
  RecomendationWrapper,
} from ".";
import TopNavbar from "../Navbar/TopNavbar";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import AudioPlayerComponent from "../AudioPlayerComponents";
import { useTheme } from "../../Context/ThemeContext";

const AuthenticatedLayout = () => {
  const [scrollPos, setScrollPos] = useState(0);
  const { pathname } = useLocation();
  const isDesktop = useMediaQuery({ minWidth: 650 });
  const { currentTheme } = useTheme();
  const scrollRef = useRef();

  const handleScroll = () => {
    const { scrollTop } = scrollRef.current;
    setScrollPos(scrollTop);
  };

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTo({
        top: 0,
      });
  }, [pathname]);

  return (
    <div className="h-screen flex p-0 lg:p-2 flex-col justify-between overflow-y-hidden max-w-screen-xxll w-full box-border">
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 p-0 pr-2 sm:block hidden">
          <NavbarWrapper />
        </aside>
        <div
          className="flex-1 rounded-t-md bg-white/5 overflow-x-auto justify-between relative scroll"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          <main className="max-w-screen-xl h-auto w-full mb-32">
            {pathname !== "/search" && (
              <TopNavbar
                className="px-6 py-2 absolute w-inherit"
                position={scrollPos}
              />
            )}

            <Router />
          </main>
        </div>
      </div>
      <div
        className={`${
          currentTheme === "dark" ? "bg-zinc-900" : "bg-white/5"
        } w-full z-[999] border-t fixed bottom-0 left-0 sm:flex border-zinc-700 p-0 items-center justify-between rounded-b-md`}
        style={
          currentTheme === "dark"
            ? { backdropFilter: "blur(5px)" }
            : { backdropFilter: "blur(10px)" }
        }
      >
        {isDesktop ? (
          <AudioPlayerComponentWrapper />
        ) : (
          <AudioPlayerComponent showJumpControls={false} />
        )}
      </div>
    </div>
  );
};

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeWrapper />} />
      <Route path="/all-musics" element={<AllMusicsWrapper />} />
      <Route path="/upload" element={<UploadFileWrapper />} />
      <Route path="/music/:musicName" element={<SingleMusicCardWrapper />} />
      <Route path="/search" element={<SearchMusicWrapper />} />
      <Route path="/create/playlist" element={<CreatePlaylistWrapper />} />
      <Route path="/playlist/:playlistName" element={<PlaylistWrapper />} />
      <Route path="/user/playlist/:id" element={<RecomendationWrapper />} />
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
