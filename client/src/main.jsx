import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "@radix-ui/themes/styles.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import { AudioProvider } from "./Context/AudioContext.jsx";
import AudioPlayerComponent from "./components/AudioPlayerComponents.jsx";
import { MusicProvider } from "./Context/MusicContext.jsx";
import { UploadProvider } from "./Context/UploadContext.jsx";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import UploadFile from "./pages/UploadFile.jsx";
import SearchMusic from "./pages/SearchMusic";
import SingleMusicCard from "./components/SingleMusicCard";
import Playlist from "./pages/Playlist.jsx";
import CreatePlaylist from "./components/Playlist/CreatePlaylist";
import { Theme } from "@radix-ui/themes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <UploadProvider>
        <MusicProvider>
          <AudioProvider>
            <BrowserRouter>
              <Theme>
                <div className="h-screen flex p-2 flex-col overflow-hidden">
                  <div className="flex flex-1 overflow-hidden">
                    <aside className="w-72 p-0 pr-2">
                      <Navbar />
                    </aside>
                    <main className="flex-1 rounded-t-md bg-white/5 overflow-x-auto relative">
                      <Routes>
                        <Route path="/" Component={App} />
                        <Route path="/upload" Component={UploadFile} />
                        <Route
                          path="/music/:musicName"
                          Component={SingleMusicCard}
                        />
                        <Route path="/search" Component={SearchMusic} />
                        <Route
                          path="/playlist/create"
                          Component={CreatePlaylist}
                        />
                        <Route
                          path="/playlist/:playlistName"
                          Component={Playlist}
                        />
                      </Routes>
                    </main>
                  </div>
                  <footer className="bg-white/5 border-t border-zinc-700 p-0 flex items-center justify-between rounded-b-md">
                    <AudioPlayerComponent />
                  </footer>
                </div>
              </Theme>
            </BrowserRouter>
          </AudioProvider>
        </MusicProvider>
      </UploadProvider>
    </ThemeProvider>
  </React.StrictMode>
);
