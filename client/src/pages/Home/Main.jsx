import { Suspense, lazy, useEffect, useState } from "react";
import { SortAsc, SortDesc } from "lucide-react";
import TopNavbar from "../../components/Navbar/TopNavbar";
import { useMusicContext } from "../../Context/MusicContext";
import Loading from "../../components/Loading";
const SkelMusicCard = lazy(() =>
  import("../../components/Skeleton/SkelMusicCard")
);
const SkelPlayCard = lazy(() =>
  import("./../../components/Skeleton/SkelPlayCard")
);
const MusicCard = lazy(() => import("../../components/MusicCard"));
const MainPlaylist = lazy(() =>
  import("../../components/Playlist/MainPlaylist")
);

const Main = () => {
  const { musicData, isLoading, playlistData, isPLoading } = useMusicContext();
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
    <div className="p-6 mx-auto">
      <TopNavbar />
      <div className="flex flex-row items-center justify-between space-y-2 mt-6 mb-4">
        <h1 className="text-md md:text-3xl font-semibold text-zinc-50">
          {getGreeting()}
        </h1>
      </div>
      <Suspense fallback={<Loading />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isPLoading ? (
            Array.from({ length: 3 }, (_, index) => (
              <div key={index}>
                <SkelPlayCard />
              </div>
            ))
          ) : playlistData.length === 0 ? (
            <div>
              {/* <h1>
                No Playlist Found.{" "}
                <Link
                  className="underline underline-offset-2"
                  to="/create/playlist"
                >
                  Want to Create?
                </Link>
              </h1> */}
            </div>
          ) : (
            playlistData.map((playlist) => (
              <MainPlaylist
                key={playlist.id}
                name={playlist.playlistName}
                image={playlist.playlistImage}
              />
            ))
          )}
        </div>
      </Suspense>

      <div className="flex flex-row items-center justify-between space-y-2 mt-6 mb-4">
        <h1 className="text-md md:text-3xl font-semibold text-zinc-50">
          Let&apos;s Play a Music!
        </h1>

        <button
          onClick={toggleSortingOrder}
          title="Sort Music"
          aria-label="Sort music"
          disabled={isDisable}
          className="bg-white/5 text-zinc-100 disabled:bg-transparent hover:bg-white/10 p-1.5 text-xs  sm:text-md sm:p-2.5 rounded-full flex items-center justify-center gap-2 font-semibold"
        >
          Sort{" "}
          {sortOrder === "asc" ? (
            <SortDesc className="h-3 w-3 sm:h-5 sm:w-5 text-zinc-200" />
          ) : (
            <SortAsc className="h-3 w-3 sm:h-5 sm:w-5 text-zinc-200" />
          )}
        </button>
      </div>

      <Suspense fallback={<Loading />}>
        <div
          className={`flex flex-row flex-wrap items-start justify-center gap-4 mt-4
        `}
        >
          {isLoading ? (
            Array.from({ length: 6 }, (_, index) => (
              <div key={index}>
                <SkelMusicCard />
              </div>
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
      </Suspense>
    </div>
  );
};

function getGreeting() {
  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour >= 6 && currentHour < 12) {
    return "Good Morning!";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Good Afternoon!";
  } else {
    return "Good Night!";
  }
}

export default Main;
