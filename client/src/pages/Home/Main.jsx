import { useEffect, useState } from "react";
import { Play, SortAsc, SortDesc } from "lucide-react";
import MusicCard from "../../components/MusicCard";
import SkelMusicCard from "../../components/Skeleton/SkelMusicCard";
import TopNavbar from "../../components/Navbar/TopNavbar";
import { useMusicContext } from "../../Context/MusicContext";
import LoadingBar from "react-top-loading-bar";
import { host } from "../../utils";
import { Link } from "react-router-dom";

const Main = () => {
  const { musicData, isLoading, playlistData } = useMusicContext();
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedMusicData, setSortedMusicData] = useState([]);
  const [isDisable, setDisable] = useState(false);
  const [progress, setprogress] = useState(0);
  const [compLoad, setComLoad] = useState(true);

  useEffect(() => {
    const sortMusicData = () => {
      return [...musicData].sort((a, b) => {
        return sortOrder === "asc"
          ? a.musicName.localeCompare(b.musicName)
          : b.musicName.localeCompare(a.musicName);
      });
    };
    setprogress(100);
    setTimeout(() => {
      setComLoad(false);
    }, 100);

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
    <>
      <TopNavbar />
      {compLoad ? (
        <LoadingBar color="#00a827" shadow={true} progress={progress} />
      ) : (
        <>
          <div className="flex flex-row items-center justify-between space-y-2 mt-6 mb-4">
            <h1 className="text-3xl font-semibold text-zinc-50">
              {getGreeting()}
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {playlistData.map((playlist) => (
              <div
                key={playlist._id}
                className={`
        bg-white/5 group rounded flex items-center gap-4 overflow-hidden hover:bg-white/20 transition-all
        `}
              >
                <img
                  title={playlist.playlistName}
                  loading="lazy"
                  src={`${host}playlist/img/${playlist.playlistImage}`}
                  alt="cover"
                  width={70}
                  height={70}
                  style={{
                    minWidth: "70px",
                    minHeight: "70px",
                    objectFit: "cover",
                    maxWidth: "70px",
                    maxHeight: "70px",
                  }}
                />
                <Link to={"/playlist/" + playlist.playlistName}>
                  <strong className="hover:underline">
                    {playlist.playlistName}
                  </strong>
                </Link>

                <button
                  title="Play Music?"
                  // onClick={handlePlayClick}
                  className={`items-center justify-center pl-4 p-3 rounded-full bg-green-500/80 hover:bg-green-500 text-black ml-auto mr-8 
                 hidden hover:scale-110 transition-all shadow hover:shadow-lg group`}
                >
                  <Play fill="black" size={25} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-row items-center justify-between space-y-2 mt-6 mb-4">
            <h1 className="text-3xl font-semibold text-zinc-50">
              Let&apos;s Play a Music!
            </h1>

            <button
              onClick={toggleSortingOrder}
              title="Sort Music"
              aria-label="Sort music"
              disabled={isDisable}
              className="bg-white/5 text-zinc-100 disabled:bg-transparent hover:bg-white/10 p-2.5 rounded-full flex items-center justify-center gap-2 font-semibold"
            >
              Sort{" "}
              {sortOrder === "asc" ? (
                <SortDesc className="h-5 w-5 text-zinc-200" />
              ) : (
                <SortAsc className="h-5 w-5 text-zinc-200" />
              )}
            </button>
          </div>

          <div
            className={`grid xl:grid-cols-5 2xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4 mt-4
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
                  className={`music-card ${
                    sortOrder === "asc" ? "asc" : "desc"
                  }`}
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
      )}
    </>
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
