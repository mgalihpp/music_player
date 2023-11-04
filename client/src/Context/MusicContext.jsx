import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { PropTypes } from "prop-types";
import { useUploadContext } from "./UploadContext";
import host from "../utils";

const MusicContext = createContext();

export function useMusicContext() {
  return useContext(MusicContext);
}

const url = `${host}`;
export function MusicProvider({ children }) {
  const [musicData, setMusicData] = useState([]);
  const [playlistData, setPlaylistData] = useState([]);
  const [musicPlaylistData, setMusicPlaylistData] = useState([]);
  const [isMPLoading, setIsMPLoading] = useState(true);
  const [isPLoading, setIsPLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { isFetching, setIsFetching, isPFetching, setIsPFetching } =
    useUploadContext();
  const [searchResults, setSearchResults] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${url}musics`, {
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

  const getPlaylist = useCallback(async () => {
    try {
      const response = await fetch(`${url}/playlist`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPlaylistData(data.playlist);
        setIsPLoading(false);
      } else {
        console.error("Failed To Search Music");
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getAllMusicAndPlaylist = async (playlist_id) => {
    try {
      const response = await fetch(`${url}/playlist/music/${playlist_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "GET",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMusicPlaylistData(data.playlist);
        setIsMPLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    if (musicData.length !== 0 && isPLoading) {
      getPlaylist();
    }
    if (isPFetching) {
      setTimeout(() => {
        getPlaylist();
        setIsPFetching(false);
      }, 1000);
    }
  }, [musicData, isPLoading, isPFetching, setIsPFetching, getPlaylist]);

  return (
    <MusicContext.Provider
      value={{
        musicData,
        searchResults,
        isLoading,
        setIsLoading,
        fetchData,
        searchMusic,
        getPlaylist,
        playlistData,
        isPLoading,
        getAllMusicAndPlaylist,
        musicPlaylistData,
        setMusicPlaylistData,
        isMPLoading,
        setIsMPLoading,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

MusicProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
