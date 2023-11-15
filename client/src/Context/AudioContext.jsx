import { createContext, useCallback, useContext, useState } from "react";
import { PropTypes } from "prop-types";
import { useMusicContext } from "./MusicContext";

export const AudioContext = createContext();

export function useAudioContext() {
  return useContext(AudioContext);
}

export function AudioProvider({ children }) {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [isPause, setIsPause] = useState(true);
  const [data, setData] = useState("default");

  const [currentIndex, setCurrentIndex] = useState(-1);
  const { musicData, musicPlaylistData } = useMusicContext();

  const playAudio = useCallback((audio) => {
    setSelectedAudio(audio);
    setIsPause(false);
  }, []);

  const pauseAudio = useCallback(() => {
    setIsPause(true);
  }, []);

  const playNext = () => {
    if (data === "default") {
      if (currentIndex !== -1 && currentIndex < musicData.length - 1) {
        const nextIndex = currentIndex + 1;
        const nextMusic = musicData[nextIndex];
        playAudio(nextMusic);
        setCurrentIndex(nextIndex);
      }
      if (currentIndex >= musicData.length - 1) {
        const nextIndex = 0;
        const resetMusic = musicData[nextIndex];
        playAudio(resetMusic);
        setCurrentIndex(nextIndex);
      }
    }
    if (data === "playlist") {
      if (
        currentIndex !== -1 &&
        currentIndex < musicPlaylistData.musics.length - 1
      ) {
        const nextIndex = currentIndex + 1;
        const nextMusic = musicPlaylistData.musics[nextIndex];
        playAudio(nextMusic);
        setCurrentIndex(nextIndex);
      }
      if (currentIndex >= musicPlaylistData.musics.length - 1) {
        const nextIndex = 0;
        const resetMusic = musicPlaylistData.musics[nextIndex];
        playAudio(resetMusic);
        setCurrentIndex(nextIndex);
      }
    }
  };

  const playPrevious = () => {
    if (data === "default") {
      if (currentIndex > 0) {
        const previousIndex = currentIndex - 1;
        const previousMusic = musicData[previousIndex];
        playAudio(previousMusic);
        setCurrentIndex(previousIndex);
      }
    }
    if (data === "playlist")
      if (currentIndex > 0) {
        const previousIndex = currentIndex - 1;
        const previousMusic = musicPlaylistData.musics[previousIndex];
        playAudio(previousMusic);
        setCurrentIndex(previousIndex);
      }
  };

  const playShuffle = () => {
    const randomIndex = Math.floor(Math.random() * musicData?.length);
    const shuffleIndex = randomIndex;
    const shuffleMusic = musicData[shuffleIndex];
    setCurrentIndex(shuffleIndex);
    playAudio(shuffleMusic);
  };
  
  return (
    <AudioContext.Provider
      value={{
        selectedAudio,
        setSelectedAudio,
        isPause,
        setIsPause,
        musicData,
        playNext,
        playPrevious,
        playShuffle,
        currentIndex,
        setCurrentIndex,
        playAudio,
        pauseAudio,
        setData,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

AudioProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
