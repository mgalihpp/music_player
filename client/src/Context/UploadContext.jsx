import { createContext, useContext, useState } from "react";

const UploadContext = createContext();

export function useUploadContext() {
  return useContext(UploadContext);
}

export function UploadProvider({ children }) {
  const [isFetching, setIsFetching] = useState(false);

  return (
    <UploadContext.Provider value={{ isFetching, setIsFetching }}>
      {children}
    </UploadContext.Provider>
  );
}
