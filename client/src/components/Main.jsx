import { useEffect, useState } from "react";
import { SortAsc, SortDesc } from "lucide-react";
import MusicCard from "./MusicCard";
import SkelMusicCard from "./Skeleton/SkelMusicCard";
import TopNavbar from "./TopNavbar";
import { useMusicContext } from "../Context/MusicContext";

const Main = () => {
  const { musicData, isLoading } = useMusicContext();
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedMusicData, setSortedMusicData] = useState([]);
  const [isDisable, setDisable] = useState(false);

  useEffect(() => {
    const sortMusicData = () => {
      return [...musicData].sort((a, b) => {
        return sortOrder === "asc"
          ? a.musicName.localeCompare(b.musicName)
          : b.musicName.localeCompare(a.musicName);
      });
    };

    if (musicData.length > 0 && sortedMusicData.length === 0) {
      // Initialize sortedMusicData when component mounts in ascending order
      setSortedMusicData(sortMusicData());
    }
  }, [isLoading, musicData, sortOrder, sortedMusicData]);

  const toggleSortingOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    const sortedData = [...sortedMusicData].sort((a, b) => {
      return newSortOrder === "asc"
        ? a.musicName.localeCompare(b.musicName)
        : b.musicName.localeCompare(a.musicName);
    });
    setDisable(true);
    setSortOrder(newSortOrder);
    animateTransition(sortedData);
  };

  const animateTransition = (newData) => {
    const musicCards = document.querySelectorAll(".music-card");

    musicCards.forEach((card, index) => {
      card.style.transform = `translateX(${
        sortOrder === "asc" ? -index - 2 : -index - 2
      }00%)`;
    });

    setTimeout(() => {
      setSortedMusicData(newData);
      setDisable(false);
      musicCards.forEach((card) => {
        card.style.transform = "translateX(0)";
      });
    }, 1000); // Adjust the duration as needed
  };

  return (
    <>
      <TopNavbar />

      <div className="flex flex-row items-center justify-between space-y-2 mt-6 mb-4">
        <h1 className="text-4xl font-semibold">Let&apos;s Play a Music!</h1>

        <button
          onClick={toggleSortingOrder}
          title="Sort Music"
          aria-label="Sort music"
          disabled={isDisable}
          className="bg-white/5 disabled:bg-transparent hover:bg-white/10 p-2.5 rounded-full flex items-center justify-center gap-2 font-semibold"
        >
          Sort{" "}
          {sortOrder === "asc" ? (
            <SortDesc className="h-5 w-5" />
          ) : (
            <SortAsc className="h-5 w-5" />
          )}
        </button>
      </div>

      <div
        className={`grid xl:ml-2 lg:ml-6 xl:grid-cols-5 2xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4 mt-4
        `}
      >
        {isLoading ? (
          Array.from({ length: 12 }, (_, index) => (
            <SkelMusicCard key={index} />
          ))
        ) : musicData.length === 0 ? (
          <h1>No Musics Found</h1>
        ) : (
          sortedMusicData.map((music, index) => (
            <div
              key={index}
              className={`music-card ${sortOrder === "asc" ? "asc" : "desc"}`}
            >
              <MusicCard
                musicName={music.musicName}
                musicPath={music.musicPath}
                musicArtist={music.musicArtist}
                musicImage={music.musicImage}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Main;
