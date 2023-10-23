import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import UploadFile from "./components/UploadFile.jsx";
import SingleMusicCard from "./components/SingleMusicCard.jsx";
import Navbar from "./components/Navbar.jsx";
import { AudioProvider } from "./Context/AudioContext.jsx";
import AudioPlayerComponent from "./components/AudioPlayerComponents.jsx";
import { MusicProvider } from "./Context/MusicContext.jsx";
import { UploadProvider } from "./Context/UploadContext.jsx";
import SearchMusic from "./components/SearchMusic.jsx";
import { ThemeProvider } from "./Context/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <UploadProvider>
        <MusicProvider>
          <AudioProvider>
            <BrowserRouter>
              <div className="h-screen flex p-2 flex-col overflow-hidden">
                <div className="flex flex-1 overflow-hidden">
                  <aside className="w-72 p-0 pr-2">
                    <Navbar />
                  </aside>
                  <main className="flex-1 rounded-md bg-white/5 overflow-x-auto relative">
                    {/* <div className="gradient-aa absolute top-0 w-screen h-screen opacity-20"/> */}
                    <Routes>
                      <Route path="/" Component={App} />
                      <Route path="/upload" Component={UploadFile} />
                      <Route
                        path="/music/:musicName"
                        Component={SingleMusicCard}
                      />
                      <Route path="/search" Component={SearchMusic} />
                    </Routes>
                  </main>
                </div>
                <footer className="bg-white/5 border-t border-zinc-700 p-0 flex items-center justify-between">
                  <AudioPlayerComponent />
                </footer>
              </div>
            </BrowserRouter>
          </AudioProvider>
        </MusicProvider>
      </UploadProvider>
    </ThemeProvider>
  </React.StrictMode>
);
