// MusicContext.js
import { createContext, useContext, useState } from 'react';

const MusicContext = createContext();

export function useMusicContext() {
  return useContext(MusicContext);
}

const timestamp = Date.now();
const url = `http://localhost:5000/music?timestamp=${timestamp}`;


export function MusicProvider({ children }) {
  const [musicData, setMusicData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMusicData(data);
        setIsLoading(false);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error: ' + error);
    }
  }

  return (
    <MusicContext.Provider value={{ musicData, isLoading, fetchData }}>
      {children}
    </MusicContext.Provider>
  );
}
