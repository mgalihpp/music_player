import { ChevronLeft, ChevronRight } from "lucide-react";
import MusicCard from "./MusicCard";
import { useEffect } from "react";
import SkelMusicCard from "./Skeleton/SkelMusicCard";
import { useMusicContext } from "../Context/MusicContext";
import { useUploadContext } from "../Context/UploadContext";

const Main = () => {
  const { musicData, isLoading, fetchData } = useMusicContext();
  const { isFetching, setIsFetching } = useUploadContext();

  useEffect(() => {
    if (isFetching || isLoading) {
      fetchData();
      setIsFetching(false);
    }
  }, [isFetching, setIsFetching, isLoading, fetchData]);

  const sortedMusicData = [...musicData].sort((a, b) => a[2].localeCompare(b[2]));

  return (
    <>
      <div className="flex items-center gap-4">
        <button className="p-1 rounded-full bg-black/20" aria-label="left">
          <ChevronLeft />
        </button>
        <button className="p-1 rounded-full bg-black/20" aria-label="right">
          <ChevronRight />
        </button>
        <img src="/vite.svg" alt="logo" />
      </div>

      <h1 className="text-4xl font-semibold mt-10">Let&apos;s Play a Music!</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
        {isLoading ? (
          <>
            <SkelMusicCard />
            <SkelMusicCard />
            <SkelMusicCard />
            <SkelMusicCard />
            <SkelMusicCard />
            <SkelMusicCard />
            <SkelMusicCard />
            <SkelMusicCard />
            <SkelMusicCard />
          </>
        ) : musicData.length === 0 ? (
          <h1>No Musics Found</h1>
        ) : (
          sortedMusicData.map((music, index) => (
            <div key={index}>
              <MusicCard
                musicName={music[2]}
                musicPath={music[1]}
                musicArtist={music[3]}
                musicImage={music[4]}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Main;
