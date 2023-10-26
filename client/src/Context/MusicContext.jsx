import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { PropTypes } from "prop-types";
import { useUploadContext } from "./UploadContext";

const MusicContext = createContext();

export function useMusicContext() {
  return useContext(MusicContext);
}

const url = `http://127.0.0.1:5000`;
export function MusicProvider({ children }) {
  const [musicData, setMusicData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isFetching, setIsFetching } = useUploadContext();
  const [searchResults, setSearchResults] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${url}/musics`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMusicData(data.musics);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error: " + error);
    }
  }, []);

  async function searchMusic(query) {
    try {
      const response = await fetch(`${url}/search/music?n=${query}`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
        setIsLoading(false);
      } else {
        console.error("Failed To Search Music");
      }
    } catch (error) {
      console.error("Error: " + error);
    }
  }

  useEffect(() => {
    if (musicData.length === 0 && isLoading && !isFetching) {
      fetchData();
    }
  }, [musicData, fetchData, isFetching, isLoading]);

  useEffect(() => {
    if (isFetching) {
      setTimeout(() => {
        fetchData();
        setIsFetching(false);
      }, 1000);
    }
  }, [isFetching, setIsFetching, fetchData]);

  return (
    <MusicContext.Provider
      value={{
        musicData,
        searchResults,
        isLoading,
        setIsLoading,
        fetchData,
        searchMusic,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

MusicProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
