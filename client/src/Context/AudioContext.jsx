import { createContext, useContext, useState } from "react";
import { PropTypes } from "prop-types";
import { useMusicContext } from "./MusicContext";

export const AudioContext = createContext();

export function useAudioContext() {
  return useContext(AudioContext);
}

export function AudioProvider({ children }) {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [isPause, setIsPause] = useState(true);

  // Initialize currentIndex and musicData
  const [currentIndex, setCurrentIndex] = useState(-1);
  const { musicData } = useMusicContext(); // Use musicData from useMusicContext

  const playNext = () => {
    if (currentIndex !== -1 && currentIndex < musicData.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextMusic = musicData[nextIndex];
      setSelectedAudio({ ...nextMusic, isPause: false });
      setCurrentIndex(nextIndex);
    }
    if (currentIndex >= musicData.length - 1) {
      const nextIndex = 0;
      const resetMusic = musicData[nextIndex];
      setSelectedAudio({ ...resetMusic, isPause: false });
      setCurrentIndex(nextIndex);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      const previousMusic = musicData[previousIndex];
      setSelectedAudio({ ...previousMusic, isPause: false });
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
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

AudioProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
