import { ChevronLeft, ChevronRight, SortAsc, SortDesc } from "lucide-react";
import MusicCard from "./MusicCard";
import { useEffect, useState } from "react";
import SkelMusicCard from "./Skeleton/SkelMusicCard";
import { useMusicContext } from "../Context/MusicContext";
import { useUploadContext } from "../Context/UploadContext";
import { useTheme } from "../Context/ThemeContext";

const Main = () => {
  const { musicData, isLoading, fetchData } = useMusicContext();
  const { isFetching, setIsFetching } = useUploadContext();
  const { toggleTheme, view, toggleView } = useTheme();
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedMusicData, setSortedMusicData] = useState([]);
  const [isDisable, setDisable] = useState(false);

  useEffect(() => {
    if (isFetching || isLoading) {
      fetchData();
      setIsFetching(false);
    } else {
      // Initialize sortedMusicData when component mounts in ascending order
      const initialSortedData = [...musicData].sort((a, b) => {
        return a[2].localeCompare(b[2]);
      });
      setSortedMusicData(initialSortedData);
    }
  }, [isFetching, setIsFetching, isLoading, fetchData, musicData]);

  const toggleSortingOrder = () => {
    // Toggle sorting order (ascending or descending)
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";

    // Sort the data
    const sortedData = [...sortedMusicData].sort((a, b) => {
      if (newSortOrder === "asc") {
        return a[2].localeCompare(b[2]);
      } else {
        return b[2].localeCompare(a[2]);
      }
    });
    setDisable(true);
    setSortOrder(newSortOrder);
    // Animate the transition
    animateTransition(sortedData);
  };

  const animateTransition = (newData) => {
    const musicCards = document.querySelectorAll(".music-card");

    // Animate from current position to the final position
    musicCards.forEach((card, index) => {
      if (index === 0) {
        card.style.transform = `translateX(${
          sortOrder === "asc" ? -index - 2 : -index - 2
        }00%)`;
      } else {
        card.style.transform = `translateX(${
          sortOrder === "asc" ? -index - 2 : -index - 2
        }00%)`;
      }
    });

    // After animation, update the view with the sorted data
    setTimeout(() => {
      setSortedMusicData(newData);
      setDisable(false);
      // Reset the card positions
      musicCards.forEach((card) => {
        card.style.transform = "translateX(0)";
      });
    }, 800); // Adjust the duration as needed
  };

  return (
    <>
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center justify-center gap-4">
          <button className="p-1 rounded-full bg-black/20" aria-label="left">
            <ChevronLeft />
          </button>
          <button className="p-1 rounded-full bg-black/20" aria-label="right">
            <ChevronRight />
          </button>
          <img src="/vite.svg" alt="logo" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            title="Switch View to New UI or Old UI"
            onClick={toggleView}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10"
            aria-label="right"
          >
            Switch View
          </button>
          <button
            title="Switch Theme to Gradient or Dark"
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10"
            aria-label="right"
          >
            Switch Theme
          </button>
        </div>
      </div>

      <div className="flex flex-col items-start justify-center space-y-2 mt-6 mb-4">
        <h1 className="text-4xl font-semibold">Let&apos;s Play a Music!</h1>

        <button
          onClick={toggleSortingOrder}
          title="Sort Music"
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
        className={`grid grid-cols-2 ${
          view
            ? "xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mt-4"
            : "lg:grid-cols-3 sm:grid-cols-2 gap-4"
        } `}
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
