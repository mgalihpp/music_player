import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { AudioProvider } from "./Context/AudioContext.jsx";
import { MusicProvider } from "./Context/MusicContext.jsx";
import { UploadProvider } from "./Context/UploadContext.jsx";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import { Analytics } from "@vercel/analytics/react";
import { Theme } from "@radix-ui/themes";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <UploadProvider>
          <MusicProvider>
            <AudioProvider>
              <Theme>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
                <Analytics />
              </Theme>
            </AudioProvider>
          </MusicProvider>
        </UploadProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
