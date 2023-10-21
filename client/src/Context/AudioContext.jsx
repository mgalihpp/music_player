import { createContext, useState } from "react";

export const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [isPause, setIsPause] = useState(true);

  return (
    <AudioContext.Provider value={{ selectedAudio, setSelectedAudio, isPause, setIsPause }}>
      {children}
    </AudioContext.Provider>
  );
}
