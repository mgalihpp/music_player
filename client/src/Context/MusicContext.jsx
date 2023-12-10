import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { PropTypes } from "prop-types";
import { useUploadContext } from "./UploadContext";
import { api } from "../utils";
import { useAuth } from "./AuthContext";

const MusicContext = createContext();

export function useMusicContext() {
  return useContext(MusicContext);
}

const url = `${api}`;
export function MusicProvider({ children }) {
  const [musicData, setMusicData] = useState([]);
  const [playlistData, setPlaylistData] = useState([]);
  const [musicPlaylistData, setMusicPlaylistData] = useState([]);
  const [recomendationData, setRecomendationData] = useState([]);
  const [isMPLoading, setIsMPLoading] = useState(true);
  const [isPLoading, setIsPLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { isFetching, setIsFetching, isPFetching, setIsPFetching } =
    useUploadContext();
  const [searchResults, setSearchResults] = useState([]);
  const { user, token } = useAuth();

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
      const response = await fetch(`${url}musics?n=${query}`, {
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
      const response = await fetch(`${url}playlists`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPlaylistData(data.playlist);
        setIsPLoading(false);
      } else {
        console.error("Failed To Fetch User Playlist");
      }
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const getAllMusicAndPlaylist = async (playlist_id) => {
    try {
      const response = await fetch(
        `${url}playlist/music?GOSSondaAKovmVkjrodankkiwS=${playlist_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMusicPlaylistData(data.playlist);
        setIsMPLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRecomendationData = () => {
    fetch(`${api}recomendation`, {
      method: "GET",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        setRecomendationData(data.playlist);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error fetching recommendation data:", error);
      });
  };

  useEffect(() => {
    if (musicData.length === 0 && isLoading && !isFetching && user) {
      fetchData();
    }
  }, [musicData.length, fetchData, isFetching, isLoading, user]);

  useEffect(() => {
    if (isFetching && user) {
      setTimeout(() => {
        fetchData();
        setIsFetching(false);
      }, 5000);
    }
  }, [isFetching, setIsFetching, fetchData, user]);

  useEffect(() => {
    if (musicData.length !== 0 && isPLoading && user) {
      getPlaylist();
      getRecomendationData();
    }
    if (isPFetching && user) {
      setTimeout(() => {
        getPlaylist();
        setIsPFetching(false);
      }, 1000);
    }
  }, [musicData, isPLoading, isPFetching, setIsPFetching, getPlaylist, user]);

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
        recomendationData,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

MusicProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
