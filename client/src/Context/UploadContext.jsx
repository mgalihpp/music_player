import { createContext, useContext, useState } from "react";
import { PropTypes } from "prop-types";

const UploadContext = createContext();

export function useUploadContext() {
  return useContext(UploadContext);
}

export function UploadProvider({ children }) {
  const [isFetching, setIsFetching] = useState(false);
  const [isPFetching, setIsPFetching] = useState(false);

  return (
    <UploadContext.Provider
      value={{ isFetching, setIsFetching, isPFetching, setIsPFetching }}
    >
      {children}
    </UploadContext.Provider>
  );
}

UploadProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
