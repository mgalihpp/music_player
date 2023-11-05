import { Link, useParams } from "react-router-dom";
import { useMusicContext } from "../Context/MusicContext";
import { useEffect, useState } from "react";
import { Dot, Loader2, Pause, Play } from "lucide-react";
import Color from "color-thief-react";
import TopNavbar from "../components/Navbar/TopNavbar";
import { useAudioContext } from "../Context/AudioContext";

const Playlist = () => {
  const { playlistName } = useParams();
  const { getAllMusicAndPlaylist, musicPlaylistData, playlistData } =
    useMusicContext();
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [musicName, setMusicName] = useState("");
  const [selectedMusic, setSelectedMuisc] = useState(null);
  const {
    selectedAudio,
    playAudio,
    pauseAudio,
    isPause,
    currentIndex,
    setCurrentIndex,
    setData,
  } = useAudioContext();

  useEffect(() => {
    if (selectedAudio?.musicName === musicName) {
      setCurrentIndex(currentIndex);
    }
  }, [selectedAudio, musicName, currentIndex, setCurrentIndex]);

  useEffect(() => {
    if (playlistData.length !== 0) {
      const selectedPlaylist = playlistData.find(
        (playlist) => playlist.playlistName === playlistName
      );

      if (selectedPlaylist && selectedPlaylist._id !== currentPlaylistId) {
        getAllMusicAndPlaylist(selectedPlaylist._id);
        setCurrentPlaylistId(selectedPlaylist._id);
        setSelectedPlaylist(selectedPlaylist);
      }
    }
  }, [
    playlistName,
    playlistData,
    currentPlaylistId,
    getAllMusicAndPlaylist,
    musicPlaylistData,
  ]);

  const handlePlayClick = (musicName) => {
    setMusicName(musicName);

    if (selectedAudio?.musicName === musicName) {
      if (isPause) {
        playAudio(selectedAudio);
      } else {
        pauseAudio();
      }
    } else {
      const selectedMusic = musicPlaylistData.find(
        (music) => music.musicName === musicName
      );

      if (selectedMusic) {
        playAudio(selectedMusic);
        setData("playlist");

        setCurrentIndex(musicPlaylistData.indexOf(selectedMusic));
      }
      setSelectedMuisc(musicName);
    }
  };

  if (!currentPlaylistId) {
    return <Loader2 className="w-4 h-4 animate-spin" />;
  }

  const getFirstMusic = musicPlaylistData[0]?.musicName;

  const IMAGE_URL = `${selectedPlaylist?.playlistImage}`;

  return (
    <>
      <Color
        src={IMAGE_URL}
        crossOrigin="anonymous"
        format="rgbString"
        quality={10}
      >
        {({ data, loading }) => {
          if (loading) {
            return <Loader2 className="w-4 h-4 animate-spin" />;
          } else {
            const topAlpha = 0.75;
            const bottomAlpha = 0;

            const topColor = data
              .replace("rgb", "rgba")
              .replace(")", `, ${topAlpha})`);
            const bottomColor = data
              .replace("rgb", "rgba")
              .replace(")", `, ${bottomAlpha})`);

            return (
              <div
                className="mx-auto"
                style={{
                  background: `linear-gradient(${topColor}, ${bottomColor})`,
                }}
              >
                <TopNavbar className="p-6" />

                <div className="flex flex-row items-start  pt-10 pb-4 px-6">
                  <div className="relative">
                    <img
                      src={`${selectedPlaylist?.playlistImage}`}
                      alt="cover"
                      className="object-cover min-w-[150px] rounded min-h-[150px] w-[250px] h-[250px] max-w-[250px] max-h-[250px]"
                    />
                  </div>
                  <div className="flex flex-col items-start px-6 justify-end mt-auto mb-0 gap-2">
                    <h4 className="font-semibold text-zinc-200">Playlist</h4>
                    <h1 className="text-7xl font-bold text-zinc-50">
                      {selectedPlaylist.playlistName}
                    </h1>
                    <h4 className="font-semibold text-sm text-zinc-100 flex items-center justify-start">
                      {"user"} <Dot size={20} />{" "}
                      {musicPlaylistData.length + " " + "Songs"}
                    </h4>
                  </div>
                </div>
                <div className="bg-black/20 flex flex-row items-center justify-start gap-2 p-4">
                  <button
                    title="Play"
                    aria-label="Play"
                    onClick={() => handlePlayClick(getFirstMusic)}
                    className={`flex items-center justify-center p-4 rounded-full bg-green-500/90 text-black button-transition hover:scale-110 hover:bg-green-500 hover:shadow-md`}
                  >
                    <Play fill="black" className="ml-1" />
                  </button>
                </div>
                <div className="bg-black/20 flex flex-col items-center justify-normal px-8 py-4">
                  <div className="flex flex-row items-center justify-start gap-12 w-full px-4 py-2 rounded-md">
                    <div className="flex flex-row items-center justify-start gap-6 w-96">
                      <h1>#</h1>
                      <h1>Title</h1>
                    </div>
                    <div className="flex flex-row items-center justify-between w-96">
                      <h1>Artist</h1>
                      <h1>Duration</h1>
                    </div>
                  </div>
                  <hr className="border-b border-zinc-700 w-full mb-4" />
                  {musicPlaylistData.map((music, index) => (
                    <div
                      key={music._id}
                      className="flex flex-row items-center justify-start hover:bg-white/5 gap-12 w-full px-4 py-2 rounded-md"
                    >
                      <div className="flex flex-row items-center justify-start gap-6 w-96 group">
                        <div className="block group-hover:hidden w-4">
                          {index + 1}
                        </div>
                        <button
                          onClick={() => handlePlayClick(music.musicName)}
                          className="hidden group-hover:block w-4"
                        >
                          {selectedMusic === music.musicName &&
                          selectedAudio &&
                          !isPause ? (
                            <Pause fill="white" color="white" size={15} />
                          ) : (
                            <Play fill="white" color="white" size={15} />
                          )}
                        </button>
                        <figure className="flex flex-row items-center justify-center gap-4">
                          <img
                            src={`${music.musicImage}`}
                            alt="cover"
                            className="object-cover w-10 h-10"
                          />
                          <figcaption className="text-sm font-semibold hover:underline">
                            <Link to={`/music/${music.musicName}`}>
                              {music.musicName}
                            </Link>
                          </figcaption>
                        </figure>
                      </div>
                      <div className="flex flex-row items-center justify-between w-96">
                        <p className="text-sm font-semibold">
                          {music.musicArtist}
                        </p>
                        <p className="text-sm font-semibold text-center">
                          {music.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        }}
      </Color>
    </>
  );
};

export default Playlist;
