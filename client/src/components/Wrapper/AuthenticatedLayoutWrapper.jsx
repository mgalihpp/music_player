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
} from ".";

const AuthenticatedLayout = () => (
  <div className="h-screen flex p-2 flex-col overflow-hidden w-screen">
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-72 p-0 pr-2">
        <NavbarWrapper />
      </aside>
      <main className="flex-1 rounded-t-md bg-white/5 overflow-x-auto relative">
        <Routes>
          <Route path="/" element={<MainWrapper />} />
          <Route path="/upload" element={<UploadFileWrapper />} />
          <Route
            path="/music/:musicName"
            element={<SingleMusicCardWrapper />}
          />
          <Route path="/search" element={<SearchMusicWrapper />} />
          <Route path="/playlist/create" element={<CreatePlaylistWrapper />} />
          <Route path="/playlist/:playlistName" element={<PlaylistWrapper />} />
          <Route path="/category/:name" element={<CategoryWrapper />} />
        </Routes>
      </main>
    </div>
    <footer className="bg-white/5 border-t border-zinc-700 p-0 flex items-center justify-between rounded-b-md">
      <AudioPlayerComponentWrapper />
    </footer>
  </div>
);

export default AuthenticatedLayout;
