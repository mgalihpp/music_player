import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { PropTypes } from "prop-types";
import { useMusicContext } from "./MusicContext";
import { useAuth } from "./AuthContext";
import { api } from "../lib/utils";

export const AudioContext = createContext();

export function useAudioContext() {
  return useContext(AudioContext);
}

export function AudioProvider({ children }) {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [selectedPlayedPlaylist, setSelectedPlayedPlaylist] = useState(null);
  const [isPause, setIsPause] = useState(true);
  const [currentMusicPlayed, setCurrentMusicPlayed] = useState(null);
  const [data, setData] = useState("default");
  const [userPlaylists, setUserPlaylists] = useState(true);
  const { token } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(-1);
  const { musicsData } = useMusicContext();

  const playAudio = useCallback(
    (audio) => {
      setSelectedAudio(audio);
      setIsPause(false);
      if (data === "default") {
        setCurrentMusicPlayed(null);
      } else {
        setCurrentMusicPlayed(audio);
      }
    },
    [data]
  );

  const pauseAudio = useCallback(() => {
    setIsPause(true);
  }, []);

  const playNext = () => {
    if (data === "default") {
      if (currentIndex !== -1 && currentIndex < musicsData.length - 1) {
        const nextIndex = currentIndex + 1;
        const nextMusic = musicsData[nextIndex];
        playAudio(nextMusic);
        setCurrentIndex(nextIndex);
      } else if (currentIndex >= musicsData.length - 1) {
        const nextIndex = 0;
        const resetMusic = musicsData[nextIndex];
        playAudio(resetMusic);
        setCurrentIndex(nextIndex);
      }
    } else if (data === "playlist") {
      if (
        currentIndex !== -1 &&
        currentIndex < selectedPlayedPlaylist.musics.length - 1
      ) {
        const nextIndex = currentIndex + 1;
        const nextMusic = selectedPlayedPlaylist.musics[nextIndex];
        playAudio(nextMusic);
        setCurrentMusicPlayed(nextMusic);
        setCurrentIndex(nextIndex);
      }
      if (currentIndex >= selectedPlayedPlaylist.musics.length - 1) {
        const nextIndex = 0;
        const resetMusic = selectedPlayedPlaylist.musics[nextIndex];
        playAudio(resetMusic);
        setCurrentMusicPlayed(resetMusic);
        setCurrentIndex(nextIndex);
      }
    }
  };

  const playPrevious = () => {
    if (data === "default") {
      if (currentIndex > 0) {
        const previousIndex = currentIndex - 1;
        const previousMusic = musicsData[previousIndex];
        playAudio(previousMusic);
        setCurrentIndex(previousIndex);
      }
    } else if (data === "playlist")
      if (currentIndex > 0) {
        const previousIndex = currentIndex - 1;
        const previousMusic = selectedPlayedPlaylist.musics[previousIndex];
        playAudio(previousMusic);
        setCurrentMusicPlayed(previousMusic);
        setCurrentIndex(previousIndex);
      }
  };

  const playShuffle = () => {
    const randomIndex = Math.floor(Math.random() * musicsData?.length);
    const shuffleIndex = randomIndex;
    const shuffleMusic = musicsData[shuffleIndex];
    setCurrentIndex(shuffleIndex);
    playAudio(shuffleMusic);
  };

  const postEvent = useCallback(async () => {
    try {
      const res = await fetch(`${api}event`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          musicName: selectedAudio.musicName,
        }),
      });

      if (res.ok) {
        return res;
      }
    } catch (error) {
      console.error(error);
    }
  }, [selectedAudio, token]);

  useEffect(() => {
    if (selectedAudio !== null) {
      postEvent();
    }
  }, [selectedAudio, postEvent]);

  return (
    <AudioContext.Provider
      value={{
        selectedAudio,
        setSelectedAudio,
        isPause,
        setIsPause,
        musicsData,
        playNext,
        playPrevious,
        playShuffle,
        currentIndex,
        setCurrentIndex,
        playAudio,
        pauseAudio,
        setData,
        currentMusicPlayed,
        setCurrentMusicPlayed,
        setSelectedPlayedPlaylist,
        selectedPlayedPlaylist,
        userPlaylists,
        setUserPlaylists,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

AudioProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
