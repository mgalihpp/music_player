// MusicContext.js
import { createContext, useContext, useState } from "react";
import { PropTypes } from "prop-types";

const MusicContext = createContext();

export function useMusicContext() {
  return useContext(MusicContext);
}

const timestamp = Date.now();
const url = `http://localhost:5000/music?t=${timestamp}`;

export function MusicProvider({ children }) {
  const [musicData, setMusicData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMusicData(data);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error: " + error);
    }
  }

  return (
    <MusicContext.Provider value={{ musicData, isLoading, fetchData }}>
      {children}
    </MusicContext.Provider>
  );
}

MusicProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
