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

  const [currentIndex, setCurrentIndex] = useState(-1);
  const { musicData } = useMusicContext();

  const playAudio = useCallback((audio) => {
    setSelectedAudio(audio);
    setIsPause(false);
  }, []);

  const pauseAudio = useCallback(() => {
    setIsPause(true);
  }, []);

  const playNext = () => {
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
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      const previousMusic = musicData[previousIndex];
      playAudio(previousMusic);
      setCurrentIndex(previousIndex);
    }
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
        currentIndex,
        setCurrentIndex,
        playAudio,
        pauseAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

AudioProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
