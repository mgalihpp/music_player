import { createContext, useContext, useEffect } from "react";
import { PropTypes } from "prop-types";
import { useUploadContext } from "./UploadContext";
import { useAuth } from "./AuthContext";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import { fetcher, api } from "../lib/utils";

const MusicContext = createContext();

export function useMusicContext() {
  return useContext(MusicContext);
}

const url = `${api}`;
export function MusicProvider({ children }) {
  const { isFetching, setIsFetching, isPFetching, setIsPFetching } =
    useUploadContext();
  const { user, token } = useAuth();

  const {
    data,
    isLoading: musicsLoading,
    mutate: musicsReFetch,
  } = useSWRImmutable(user && `${url}musics`, fetcher);

  const {
    data: playlistsData,
    isLoading: playlistLoading,
    mutate: playlistsReFetch,
  } = useSWR(user && `${url}playlists`, (url) => fetcher(url, token), {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (isFetching) {
      setTimeout(() => {
        musicsReFetch();
        setIsFetching(false);
      }, 5000);
    }
  }, [isFetching, setIsFetching, user, musicsReFetch]);

  useEffect(() => {
    if (isPFetching) {
      setTimeout(() => {
        playlistsReFetch();
        setIsPFetching(false);
      }, 1000);
    }
  }, [isPFetching, setIsPFetching, user, playlistsReFetch]);

  const musicsData = data?.musics;
  const playlistData = playlistsData?.playlists;
  const recomendationData = playlistsData?.recomendation;

  return (
    <MusicContext.Provider
      value={{
        musicsData,
        musicsLoading,
        playlistData,
        playlistLoading,
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
