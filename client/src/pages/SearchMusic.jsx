import { useEffect, useState } from "react";
import { Music, Search } from "lucide-react";
import TopNavbar from "../components/Navbar/TopNavbar";
import { Link } from "react-router-dom";
import { useMusicContext } from "../Context/MusicContext";
import SkelMusicCard from "../components/Skeleton/SkelMusicCard";
import MusicCard from "../components/MusicCard";

const SearchMusic = () => {
  const { searchResults, searchMusic, isLoading, setIsLoading } =
    useMusicContext();
  const [query, setQuery] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsLoading(true);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (e.target.value.length >= 2) {
      const newTimeoutId = setTimeout(() => {
        searchMusic(e.target.value);
      }, 1000); // Adjust the delay as needed

      setTimeoutId(newTimeoutId);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length === 0 || (query.length > 0 && query.length < 2)) {
        setIsLoading(false);
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [query, setIsLoading]);

  const renderMusicCards = () => {
    if (query.length === 0 || (query.length > 0 && query.length < 2)) {
      return (
        <Link
          to="/"
          className="flex items-center justify-center cursor-pointer w-[180px] flex-col text-base text-zinc-200 gap-3 rounded-md font-semibold bg-white/5 hover:bg-white/5 transition-all"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-[180px] bg-white/5 h-[180px] rounded-md p-4">
              <strong className="text-xl">All Musics</strong>
              <div className="absolute bottom-0 right-0">
                <Music size={75} rotate={90} />
              </div>
            </div>
          </div>
        </Link>
      );
    }

    if (isLoading) {
      return Array.from({ length: 6 }, (_, index) => (
        <SkelMusicCard key={index} />
      ));
    }

    if (searchResults?.length === 0) {
      return <h1 className="flex text-semibold text-xl whitespace-nowrap">No Music Found for {query}.</h1>;
    }

    return searchResults?.map((music, index) => (
      <div key={index}>
        <MusicCard
          musicName={music.musicName}
          musicPath={music.musicPath}
          musicArtist={music.musicArtist}
          musicImage={music.musicImage}
        />
      </div>
    ));
  };

  return (
    <div className="px-6 py-4">
      <TopNavbar>
        <div className="flex items-center justify-center bg-white/5 rounded-full p-2 relative focus-within:ring-2 ring-white">
          <Search className="text-gray-500" />
          <div className="relative w-72">
            <input
              type="search"
              name="search"
              id="search"
              autoComplete="off"
              autoFocus
              placeholder="Search for music"
              className="p-2 bg-transparent rounded-full w-full focus:outline-none"
              onKeyUp={handleInputChange}
            />
          </div>
        </div>
      </TopNavbar>

      <div className="flex items-start space-y-2 mt-6 mb-4">
        <h1 className="text-4xl font-semibold">
          {query.length === 0 || (query.length > 0 && query.length < 2)
            ? "Browse"
            : "Results"}
        </h1>
      </div>
      <div
        className={`grid xl:ml-2 lg:ml-6 
            xl:grid-cols-5 2xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4 mt-4
        `}
      >
        {renderMusicCards()}
      </div>
    </div>
  );
};

export default SearchMusic;
