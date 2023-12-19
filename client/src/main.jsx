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
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Theme } from "@radix-ui/themes";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/service-worker.js")
//       .then((registration) => {
//         // Force the service worker to activate immediately after registration
//         registration.addEventListener("updatefound", () => {
//           const newWorker = registration.installing;
//           if (newWorker) {
//             newWorker.addEventListener("statechange", () => {
//               if (newWorker.state === "installed") {
//                 // Ensure the service worker is activated
//                 newWorker.postMessage({ action: "SKIP_WAITING" });
//               }
//             });
//           }
//         });
//       })
//       .catch((error) => {
//         console.error("Service Worker registration failed:", error);
//       });
//   });
// }

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
                <SpeedInsights />
                <Analytics />
              </Theme>
            </AudioProvider>
          </MusicProvider>
        </UploadProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
