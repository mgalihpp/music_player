import { Link, useParams, useLocation } from "react-router-dom";
import { useMusicContext } from "../Context/MusicContext";
import { useEffect, useState } from "react";
import { Clock, Dot, Pause, Play } from "lucide-react";
import Color from "color-thief-react";
import LoadingBar from "react-top-loading-bar";
import { useAudioContext } from "../Context/AudioContext";
import { host } from "../utils";
import * as Toast from "@radix-ui/react-toast";
import Loading from "./../components/Loading";

const Playlist = () => {
  const { id } = useParams();
  const iD = Number(id); // convert to number
  const {
    getAllMusicAndPlaylist,
    musicPlaylistData,
    recomendationData,
    isMPLoading,
    setIsMPLoading,
  } = useMusicContext();
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [progress, setprogress] = useState(0);
  const [compLoad, setComLoad] = useState(true);
  const [open, setOpen] = useState(false);
  const [firstMusic, setFirstMusic] = useState("");
  const {
    selectedAudio,
    playAudio,
    pauseAudio,
    isPause,
    currentIndex,
    setCurrentIndex,
    setData,
    currentMusicPlayed,
    setCurrentMusicPlayed,
    setSelectedPlayedPlaylist,
    selectedPlayedPlaylist,
  } = useAudioContext();
  const { pathname } = useLocation();

  useEffect(() => {
    const pathParts = pathname.split("/");
    const playlistPath = pathParts[2];

    if (playlistPath === "playlist") {
      document.title = `${selectedPlaylist?.playlistName ?? ""} - Music Player`;
    }

    return () => (document.title = "Music Player");
  }, [pathname, selectedPlaylist]);

  useEffect(() => {
    if (selectedAudio?.musicName === (currentMusicPlayed !== null)) {
      setCurrentIndex(currentIndex);
    }
  }, [selectedAudio, currentMusicPlayed, currentIndex, setCurrentIndex]);

  useEffect(() => {
    const selectedPlaylist = recomendationData?.find(
      (playlist) => playlist.id === iD
    );

    if (selectedPlaylist && selectedPlaylist.id !== currentPlaylistId) {
      getAllMusicAndPlaylist(selectedPlaylist.id);
      setCurrentPlaylistId(selectedPlaylist.id);
      setSelectedPlaylist(selectedPlaylist);
      setIsMPLoading(true);
      setprogress(100);
      setComLoad(false);
    }
  }, [
    iD,
    recomendationData,
    currentPlaylistId,
    getAllMusicAndPlaylist,
    musicPlaylistData,
    setIsMPLoading,
  ]);

  useEffect(() => {
    if (musicPlaylistData?.musics && musicPlaylistData.musics.length > 0) {
      if (currentIndex >= 0 && currentIndex < musicPlaylistData.musics.length) {
        setFirstMusic(musicPlaylistData.musics[currentIndex].musicName);
      } else {
        setFirstMusic(musicPlaylistData.musics[0].musicName);
      }
    }
  }, [musicPlaylistData, currentIndex]);

  const handlePlayClick = (musicName) => {
    if (selectedAudio?.musicName === musicName) {
      if (isPause) {
        playAudio(selectedAudio);
      } else {
        pauseAudio();
      }
      setCurrentMusicPlayed(selectedAudio);
    } else {
      const selectedMusic = musicPlaylistData?.musics?.find(
        (music) => music.musicName === musicName
      );

      if (selectedMusic) {
        playAudio(selectedMusic);

        setCurrentIndex(musicPlaylistData?.musics?.indexOf(selectedMusic));
      }
      setCurrentMusicPlayed(selectedMusic);
    }

    setData("playlist");
    setSelectedPlayedPlaylist(selectedPlaylist);
  };

  // const handleDeletePlaylist = async (e) => {
  //   e.preventDefault();
  //   setOpen(true);
  //   setOpenDialog(false);
  //   try {
  //     const res = await fetch(`${api}playlist/${currentPlaylistId}`, {
  //       method: "DELETE",
  //     });
  //     return res;
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsPFetching(true);
  //     setTimeout(() => {
  //       setComLoad(true);
  //       setprogress(80);
  //     }, 500);
  //     setTimeout(() => {
  //       navigate("/");
  //     }, 1500);
  //   }
  // };

  const IMAGE_URL = `${
    host + "playlist/img/" + selectedPlaylist?.playlistImage
  }`;

  if (!id || !selectedPlaylist) {
    return (
      <>
        {isMPLoading ? (
          <Loading className="pt-12" />
        ) : (
          <div className="flex flex-col items-center justify-center h-[100%] p-6 gap-2">
            <h1 className="text-2xl text-center">Playlist Not Found</h1>
            <Link
              to="/"
              className="p-2 bg-black/50 rounded-md hover:bg-black transition-all hover:scale-105 duration-300 "
            >
              Go Home
            </Link>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {compLoad ? (
        <LoadingBar color="#00a827" shadow={true} progress={progress} />
      ) : (
        <Color src={IMAGE_URL} crossOrigin="anonymous" format="rgbString">
          {({ data, loading }) => {
            if (loading) {
              return (
                <LoadingBar color="#00a827" shadow={true} progress={100} />
              );
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
                  <div className="flex flex-col lg:flex-row items-start pt-20 pb-4 px-6 space-y-4">
                    <div className="relative">
                      <img
                        src={`${
                          host +
                          "playlist/img/" +
                          selectedPlaylist?.playlistImage
                        }`}
                        alt="cover"
                        loading="lazy"
                        className="object-cover min-w-[150px] rounded min-h-[150px] w-[250px] h-[250px] max-w-[250px] max-h-[250px]"
                      />
                    </div>
                    <div className="flex flex-col items-start px-6 justify-end mt-4 sm:mt-auto mb-0 gap-2">
                      <h4 className="font-semibold text-xs sm:text-sm text-zinc-200">
                        Playlist
                      </h4>
                      <h1 className="text-xl sm:text-7xl font-bold text-zinc-50">
                        {selectedPlaylist.playlistName}
                      </h1>
                      <h4 className="font-semibold text-xs sm:text-sm text-zinc-100 flex items-center justify-start">
                        {selectedPlaylist.username ?? ""} <Dot size={20} />{" "}
                        {musicPlaylistData?.musics?.length + " " + "Songs"}
                      </h4>
                    </div>
                  </div>
                  <div className="bg-black/20 flex flex-row items-center justify-start gap-2 p-4">
                    <button
                      title="Play"
                      aria-label="Play"
                      onClick={() => handlePlayClick(firstMusic)}
                      className={`flex items-center justify-center p-4 rounded-full bg-green-500/90 text-black button-transition hover:scale-110 hover:bg-green-500 hover:shadow-md`}
                    >
                      {selectedPlayedPlaylist?.id === selectedPlaylist?.id &&
                      currentMusicPlayed &&
                      selectedAudio &&
                      !isPause ? (
                        <Pause fill="black" />
                      ) : (
                        <Play fill="black" className="ml-1" />
                      )}
                    </button>
                    {/* <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button
                          variant="none"
                          color="gray"
                          aria-label="option"
                          title="More Options"
                          className="flex items-center justify-center p-4 text-zinc-400 hover:text-white transition-all ease-in-out duration-300  "
                        >
                          <MoreHorizontal size={35} />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content color="gray">
                        <div>
                          <AlertDialog.Root
                            open={openDialog}
                            onOpenChange={setOpenDialog}
                          >
                            <AlertDialog.Trigger>
                              <button
                                color="gray"
                                className="w-full p-2 hover:bg-gray-500/90 text-sm font-normal py-1.5 rounded"
                                aria-label="toggle"
                              >
                                Delete Playlist
                              </button>
                            </AlertDialog.Trigger>
                            <AlertDialog.Content style={{ maxWidth: 450 }}>
                              <AlertDialog.Title>
                                Delete Playlist {id} ?
                              </AlertDialog.Title>
                              <AlertDialog.Description size="2">
                                Are you sure?
                              </AlertDialog.Description>

                              <Flex gap="3" mt="4" justify="end">
                                <AlertDialog.Cancel>
                                  <button className="cursoir-pointer bg-gray-700 hover:bg-gray-700/90 text-sm text-zinc-100 flex items-center justify-center rounded-md px-2 py-2 outline-none focus:shadow-sm font-semibold">
                                    Cancel
                                  </button>
                                </AlertDialog.Cancel>
                                <AlertDialog.Action>
                                  <button
                                    className="cursoir-pointer bg-red-500 hover:bg-red-500/90 text-sm text-zinc-100 flex items-center justify-center rounded-md px-2 py-2 outline-none focus:shadow-sm font-semibold"
                                    onClick={handleDeletePlaylist}
                                  >
                                    Delete
                                  </button>
                                </AlertDialog.Action>
                              </Flex>
                            </AlertDialog.Content>
                          </AlertDialog.Root>
                        </div>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root> */}
                  </div>
                  <Toast.Provider swipeDirection="right">
                    <Toast.Root
                      className="bg-green-500 rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
                      open={open}
                      onOpenChange={setOpen}
                    >
                      <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
                        Success Delete {id}!
                      </Toast.Title>
                      <Toast.Action
                        className="[grid-area:_action]"
                        asChild
                        altText="Goto Playlist"
                      >
                        <Link
                          to={`/`}
                          className="inline-flex items-center justify-center rounded font-medium text-xs px-[10px] leading-[25px] h-[25px] bg-green2 text-green11 shadow-[inset_0_0_0_1px] shadow-green7 hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8"
                        >
                          Go
                        </Link>
                      </Toast.Action>
                    </Toast.Root>
                    <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
                  </Toast.Provider>
                  <div className="bg-black/20 sm:px-8 px-4">
                    <div className="overflow-x-hidden">
                      <div className="max-w-screen-xl">
                        <div className="flex flex-row px-4 border-b border-zinc-800 mb-4 gap-2">
                          <div className="w-8 lg:w-4">
                            <span className="text-zinc-400 text-sm">#</span>
                          </div>
                          <div className="w-72 lg:w-52 xl:w-96">
                            <span className="text-zinc-400 text-sm">Title</span>
                          </div>
                          <div className="w-72 hidden lg:block ml-auto">
                            <span className="text-zinc-400 text-sm">
                              Artist
                            </span>
                          </div>
                          <div className="w-12 ml-auto">
                            <span className="text-zinc-400">
                              <Clock className="w-5 h-5" />
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-between pb-4 border-b border-zinc-800 gap-2">
                          {isMPLoading ? (
                            <Loading />
                          ) : (
                            musicPlaylistData?.musics?.map((music, index) => (
                              <div
                                key={index}
                                className="flex flex-row items-center gap-2 w-full group px-4 rounded-md hover:bg-white/5"
                              >
                                <div className="w-8 h-8 lg:w-4 lg:h-4 relative group">
                                  <span
                                    className={`w-full ${
                                      currentMusicPlayed?.musicName ===
                                        music.musicName &&
                                      selectedAudio &&
                                      !isPause
                                        ? "hidden"
                                        : "flex"
                                    }  text-zinc-400 text-sm items-center justify-start h-full absolute top-0 left-0 opacity-100 group-hover:opacity-0 transition-opacity`}
                                  >
                                    {index + 1}
                                  </span>
                                  <div
                                    className={`playing-playlist ${
                                      currentMusicPlayed?.musicName ===
                                        music.musicName &&
                                      selectedAudio &&
                                      !isPause
                                        ? "visible"
                                        : "invisible"
                                    }`}
                                  >
                                    <span className="playing__bar playing__bar1"></span>
                                    <span className="playing__bar playing__bar2"></span>
                                    <span className="playing__bar playing__bar3"></span>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handlePlayClick(music.musicName)
                                    }
                                    className={`absolute ${
                                      currentMusicPlayed?.musicName ===
                                        music.musicName &&
                                      selectedAudio &&
                                      !isPause
                                        ? "hidden"
                                        : ""
                                    } flex items-center justify-start top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity`}
                                  >
                                    {currentMusicPlayed?.musicName ===
                                      music.musicName &&
                                    selectedAudio &&
                                    !isPause ? (
                                      <Pause
                                        fill="white"
                                        color="white"
                                        size={15}
                                      />
                                    ) : (
                                      <Play
                                        fill="white"
                                        color="white"
                                        size={15}
                                      />
                                    )}
                                  </button>
                                </div>
                                <div className="w-72 lg:w-52 xl:w-96">
                                  <figure className="flex flex-row items-center gap-4">
                                    <img
                                      src={`${
                                        host + "img/" + music.musicImage
                                      }`}
                                      alt="cover"
                                      className="object-cover min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-md"
                                    />
                                    <figcaption className="text-sm font-semibold text-zinc-200 w-24 xl:w-96 lg:whitespace-normal overflow-hidden overflow-ellipsis whitespace-nowrap">
                                      <Link
                                        className="hover:underline"
                                        to={`/music/${music.musicName}`}
                                      >
                                        {music.musicName}
                                      </Link>
                                      <span className="block lg:hidden text-xs text-zinc-400 font-normal ">
                                        {music.musicArtist}
                                      </span>
                                    </figcaption>
                                  </figure>
                                </div>
                                <div className="w-72 hidden lg:block ml-auto">
                                  <span className="text-zinc-400 text-sm">
                                    {music.musicArtist}
                                  </span>
                                </div>
                                <div className="w-12 ml-auto">
                                  <span className="text-zinc-400 text-sm">
                                    {music.duration}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="bg-black/20 px-2 sm:px-8 py-4">
                    <div className="overflow-x-hidden sm:overflow-x-auto">
                      <table className="min-w-full divide-y divide-zinc-700">
                        <thead className="w-full">
                          <tr className="bg-black/10 flex flex-row">
                            <th className="px-4 py-2 text-left w-[40px]">#</th>
                            <th className="px-4 py-2 text-left w-[300px]">
                              Title
                            </th>
                            <th className="px-4 py-2 hidden sm:block ml-auto text-start w-[500px]">
                              Artist
                            </th>
                            <th className="px-4 py-2 hidden sm:block text-center ml-auto w-[200px]">
                              Duration
                            </th>
                          </tr>
                        </thead>
                        <tbody className="w-full">
                          {isMPLoading ? (
                            <tr>
                              <td>
                                <Loading />
                              </td>
                            </tr>
                          ) : (
                            musicPlaylistData?.musics?.map((music, index) => (
                              <tr
                                key={index}
                                className="hover:bg-white/5 h-14 flex flex-row"
                              >
                                <td className="px-4 py-2 relative group w-[40px]">
                                  <span className="w-full flex items-center justify-center h-full absolute top-0 left-0 opacity-100 group-hover:opacity-0 transition-opacity">
                                    {index + 1}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handlePlayClick(music.musicName)
                                    }
                                    className="absolute flex items-center justify-center top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    {selectedMusic === music.musicName &&
                                    selectedAudio &&
                                    !isPause ? (
                                      <Pause
                                        fill="white"
                                        color="white"
                                        size={15}
                                      />
                                    ) : (
                                      <Play
                                        fill="white"
                                        color="white"
                                        size={15}
                                      />
                                    )}
                                  </button>
                                </td>
                                <td className="flex items-start justify-start pl-4 w-full sm:w-[300px]">
                                  <figure className="flex flex-row items-center gap-4">
                                    <img
                                      src={`${
                                        host + "img/" + music.musicImage
                                      }`}
                                      alt="cover"
                                      className="object-cover w-10 h-10"
                                    />
                                    <figcaption className="text-sm font-semibold hover:underline">
                                      <Link to={`/music/${music.musicName}`}>
                                        {music.musicName}
                                      </Link>
                                    </figcaption>
                                  </figure>{" "}
                                </td>
                                <td className="px-4 py-2 hidden sm:block ml-auto text-start w-[500px]">
                                  {music.musicArtist}
                                </td>
                                <td className="px-4 py-2 hidden sm:block ml-auto text-center w-[200px]">
                                  {music.duration}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div> */}
                </div>
              );
            }
          }}
        </Color>
      )}
    </>
  );
};

export default Playlist;
