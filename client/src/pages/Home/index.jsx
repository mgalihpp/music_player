import { Suspense } from "react";
import Loading from "../../components/Loading";
import SkelPlayCard from "../../components/Skeleton/SkelPlayCard";
import MainPlaylist from "../../components/Playlist/MainPlaylist";
import { useMusicContext } from "../../Context/MusicContext";
import SkelMusicCard from "../../components/Skeleton/SkelMusicCard";
import MusicCard from "../../components/MusicCard";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";

const Home = () => {
  const { playlistLoading, playlistData, musicsData, musicsLoading } =
    useMusicContext();
  const isXxl = useMediaQuery({ minWidth: 1440 });
  const isXl = useMediaQuery({ minWidth: 1280 });
  const isLg = useMediaQuery({ minWidth: 1024 });
  const isSm = useMediaQuery({ minWidth: 500 });

  let recentMusicCount = 6;

  if (isXxl) {
    recentMusicCount = 6;
  } else if (isXl) {
    recentMusicCount = 5;
  } else if (isLg) {
    recentMusicCount = 4;
  } else if (isSm) {
    recentMusicCount = 2;
  } else {
    recentMusicCount = 6;
  }

  const RecentMusics = musicsData?.slice(-recentMusicCount).reverse();

  return (
    <div className="px-4 py-8 flex flex-col gap-4">
      <div className="flex items-start justify-between flex-col gap-2 pt-8 w-fit max-w-screen-xl mx-dynamic">
        <h1 className="text-sm sm:text-lg lg:text-2xl xl:text-3xl font-semibold text-zinc-50 mr-auto text-start">
          {getGreeting()}
          {"!"}
        </h1>
        {PlaylistHeader(playlistLoading, playlistData, recentMusicCount)}
      </div>
      {RecentAdded(musicsLoading, recentMusicCount, musicsData, RecentMusics)}
      <Recomendation
        isLoading={playlistLoading}
        recentMusicCount={recentMusicCount}
      />
    </div>
  );
};

function getGreeting() {
  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour >= 6 && currentHour < 12) {
    return "Good morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Good afternoon";
  } else {
    return "Good night";
  }
}

const PlaylistHeader = (isLoading, playlistData, recentMusicCount) => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-wrap mx-auto flex-row items-center justify-center sm:justify-start gap-4 w-fit max-w-screen-xl">
        {isLoading ? (
          Array.from({ length: recentMusicCount }, (_, index) => (
            <div key={index}>
              <SkelPlayCard />
            </div>
          ))
        ) : playlistData?.length === 0 ? (
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
          playlistData?.map((playlist) => (
            <MainPlaylist
              key={playlist.id}
              id={playlist.id}
              name={playlist.playlistName}
              image={playlist.playlistImage}
            />
          ))
        )}
      </div>
    </Suspense>
  );
};

const RecentAdded = (isLoading, recentMusicCount, musicsData, RecentMusics) => {
  return (
    <div className="flex items-start justify-start flex-col w-fit max-w-screen-xl mx-dynamic">
      <div className="flex flex-row items-center justify-between space-y-2 mt-6 mb-2 w-full">
        <h1 className="text-md md:text-2xl font-semibold text-zinc-50">
          Recently added
        </h1>
        <Link
          to="/all-musics"
          className="hover:underline text-zinc-400 text-xs font-semibold"
        >
          Show all
        </Link>
      </div>
      <Suspense fallback={<Loading />}>
        <div
          className={`flex flex-row flex-wrap sm:flex-nowrap items-center justify-center gap-3 mt-4 max-w-screen-xl
        `}
        >
          {isLoading ? (
            Array.from({ length: recentMusicCount }, (_, index) => (
              <div key={index}>
                <SkelMusicCard />
              </div>
            ))
          ) : musicsData?.length === 0 ? (
            <h1>No Musics Found</h1>
          ) : (
            RecentMusics?.map((music, index) => (
              <div key={index}>
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

const Recomendation = ({ isLoading, recentMusicCount }) => {
  const { recomendationData } = useMusicContext();
  console.log(recomendationData);

  return (
    <div className="flex items-start justify-start flex-col w-fit mx-dynamic">
      <div className="flex flex-row items-center justify-between space-y-2 mt-6 mb-2 w-full">
        <h1 className="text-md md:text-2xl font-semibold text-zinc-50">
          For you
        </h1>
        <Link
          to="/category"
          className="hover:underline hidden text-zinc-400 text-xs font-semibold"
        >
          Show all
        </Link>
      </div>
      <Suspense fallback={<Loading />}>
        <div
          className={`flex flex-row flex-wrap sm:flex-nowrap items-center justify-center gap-3 mt-4 max-w-screen-xl
        `}
        >
          {isLoading ? (
            Array.from({ length: recentMusicCount }, (_, index) => (
              <div key={index}>
                <SkelMusicCard />
              </div>
            ))
          ) : recomendationData?.length === 0 ? (
            <h1>No Recomendation Found</h1>
          ) : (
            recomendationData
              ?.slice(0, recentMusicCount)
              .map((playlist, index) => (
                <div key={index}>
                  <MusicCard
                    musicName={playlist.playlistName}
                    musicArtist={playlist.username}
                    playlistImage={playlist.playlistImage}
                    playlistId={playlist.id}
                    playlist
                  />
                </div>
              ))
          )}
        </div>
      </Suspense>
    </div>
  );
};

export default Home;
