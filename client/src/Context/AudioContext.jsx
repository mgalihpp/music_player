import { createContext, useState } from "react";

export const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [selectedAudio, setSelectedAudio] = useState(null);

  return (
    <AudioContext.Provider value={{ selectedAudio, setSelectedAudio }}>
      {children}
    </AudioContext.Provider>
  );
}
