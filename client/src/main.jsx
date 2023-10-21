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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UploadProvider>
      <MusicProvider>
        <AudioProvider>
          <BrowserRouter>
            <div className="h-screen flex flex-col overflow-hidden">
              <div className="flex flex-1 overflow-hidden">
                <aside className="w-72 bg-zinc-950 p-6">
                  <Navbar />
                </aside>
                <main className="flex-1 p-6 overflow-x-auto">
                  <Routes>
                    <Route path="/" Component={App} />
                    <Route path="/upload" Component={UploadFile} />
                    <Route
                      path="/music/:musicName"
                      Component={SingleMusicCard}
                    />
                  </Routes>
                </main>
              </div>
              <footer className="bg-zinc-900 border-t border-zinc-700 p-6 flex items-center justify-between">
                <AudioPlayerComponent />
              </footer>
            </div>
          </BrowserRouter>
        </AudioProvider>
      </MusicProvider>
    </UploadProvider>
  </React.StrictMode>
);
