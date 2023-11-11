import { Link, useParams, useNavigate } from "react-router-dom";
import { useMusicContext } from "../Context/MusicContext";
import { useEffect, useState } from "react";
import { Dot, MoreHorizontal, Pause, Play } from "lucide-react";
import Color from "color-thief-react";
import LoadingBar from "react-top-loading-bar";
import TopNavbar from "../components/Navbar/TopNavbar";
import { useAudioContext } from "../Context/AudioContext";
import { host } from "../utils";
import { AlertDialog, Button, DropdownMenu, Flex } from "@radix-ui/themes";
import * as Toast from "@radix-ui/react-toast";
import { useUploadContext } from "../Context/UploadContext";
import Loading from "./../components/Loading";

const Playlist = () => {
  const { playlistName } = useParams();
  const {
    getAllMusicAndPlaylist,
    musicPlaylistData,
    playlistData,
    isMPLoading,
    setIsMPLoading,
  } = useMusicContext();
  const { setIsPFetching } = useUploadContext();
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [musicName, setMusicName] = useState("");
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [progress, setprogress] = useState(0);
  const [compLoad, setComLoad] = useState(true);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
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
    if (playlistData && playlistData.length !== 0) {
      const selectedPlaylist = playlistData.find(
        (playlist) => playlist.playlistName === playlistName
      );

      if (selectedPlaylist && selectedPlaylist.id !== currentPlaylistId) {
        getAllMusicAndPlaylist(selectedPlaylist.id);
        setCurrentPlaylistId(selectedPlaylist.id);
        setSelectedPlaylist(selectedPlaylist);
        setIsMPLoading(true);
        setprogress(100);
        setComLoad(false);
      }
    }
  }, [
    playlistName,
    playlistData,
    currentPlaylistId,
    getAllMusicAndPlaylist,
    musicPlaylistData,
    setIsMPLoading,
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
      const selectedMusic = musicPlaylistData?.musics?.find(
        (music) => music.musicName === musicName
      );

      if (selectedMusic) {
        playAudio(selectedMusic);
        setData("playlist");

        setCurrentIndex(musicPlaylistData?.musics?.indexOf(selectedMusic));
      }
      setSelectedMusic(musicName);
    }
  };

  const handleDeletePlaylist = async (e) => {
    e.preventDefault();
    setOpen(true);
    setOpenDialog(false);
    try {
      const res = await fetch(`${host}playlist/${currentPlaylistId}`, {
        method: "DELETE",
      });
      return res;
    } catch (error) {
      console.error(error);
    } finally {
      setIsPFetching(true);
      setTimeout(() => {
        setComLoad(true);
        setprogress(80);
      }, 500);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  const getFirstMusic =
    musicPlaylistData?.musics && musicPlaylistData.musics.length > 0
      ? musicPlaylistData.musics[0].musicName
      : "error";

  const IMAGE_URL = `${
    host + "playlist/img/" + selectedPlaylist?.playlistImage
  }`;

  return (
    <>
      {compLoad ? (
        <LoadingBar color="#00a827" shadow={true} progress={progress} />
      ) : (
        <Color
          src={IMAGE_URL}
          crossOrigin="anonymous"
          format="rgbString"
          quality={10}
        >
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
                  <TopNavbar className="p-6" />

                  <div className="flex flex-row items-start  pt-10 pb-4 px-6">
                    <div className="relative">
                      <img
                        src={`${
                          host +
                          "playlist/img/" +
                          selectedPlaylist?.playlistImage
                        }`}
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
                        {musicPlaylistData?.musics?.length + " " + "Songs"}
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
                    <DropdownMenu.Root>
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
                                Delete Playlist {playlistName} ?
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
                    </DropdownMenu.Root>
                  </div>
                  <Toast.Provider swipeDirection="right">
                    <Toast.Root
                      className="bg-green-500 rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
                      open={open}
                      onOpenChange={setOpen}
                    >
                      <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
                        Success Delete {playlistName}!
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
                  <div className="bg-black/20 flex flex-col items-center justify-normal px-8 py-4">
                    <div className="flex flex-row items-center justify-between gap-12 w-full px-4 py-2 rounded-md">
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
                    {isMPLoading ? (
                      <Loading />
                    ) : (
                      musicPlaylistData?.musics?.map((music, index) => (
                        <div
                          key={index}
                          className="flex flex-row items-center justify-between hover:bg-white/5 gap-12 w-full px-4 py-2 rounded-md"
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
                                src={`${host + "img/" + music.musicImage}`}
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
                      ))
                    )}
                  </div>
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
