import { Link, useParams } from "react-router-dom";
import TopNavbar from "./Navbar/TopNavbar";
import {
  Heart,
  Loader2,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  User2,
} from "lucide-react";
import { useMusicContext } from "../Context/MusicContext";
import { useAudioContext } from "../Context/AudioContext";
import { useEffect, useState } from "react";
import Color from "color-thief-react";
import { AlertDialog, Button, DropdownMenu, Flex } from "@radix-ui/themes";
import * as Toast from "@radix-ui/react-toast";
import LoadingBar from "react-top-loading-bar";
import { host } from "../utils";

const SingleMusicCard = () => {
  const { musicName } = useParams();
  const { musicData, playlistData, isPLoading } = useMusicContext();
  const {
    selectedAudio,
    isPause,
    pauseAudio,
    playAudio,
    currentIndex,
    setCurrentIndex,
    setData,
  } = useAudioContext();
  const [open, setOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("Liked Songs");
  const [progress, setprogress] = useState(0);
  const [compLoad, setComLoad] = useState(true);

  const selectedMusic = musicData?.find(
    (music) => music.musicName === musicName
  );
  const IMAGE_URL = `${host + "img/" + selectedMusic?.musicImage}`;

  useEffect(() => {
    if (selectedAudio?.musicName === musicName) {
      setCurrentIndex(currentIndex);
    }
  }, [selectedAudio, musicName, currentIndex, setCurrentIndex]);

  useEffect(() => {
    if (selectedMusic) {
      setprogress(100);
      setComLoad(false);
    }
  }, [selectedMusic]);

  const isCurrentSelected = selectedAudio?.musicName === musicName;

  const handlePlayClick = () => {
    if (selectedAudio?.musicName === musicName) {
      if (isPause) {
        playAudio(selectedAudio);
      } else {
        pauseAudio();
      }
    } else {
      playAudio({ ...selectedMusic });
      setData("default");
      setCurrentIndex(
        musicData.findIndex((music) => music.musicName === musicName)
      );
    }
  };

  const handleAddToPlaylist = async (e) => {
    setOpen(true);
    const music_id = e.currentTarget.dataset.musicId;
    const playlist_id = e.currentTarget.dataset.playlistId;
    setPlaylistName(e.currentTarget.dataset.playlistName);

    try {
      const res = await fetch(
        `${host}playlist/addmusic/${music_id}/${playlist_id}`,
        {
          method: "POST",
        }
      );
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToLikedSongs = async () => {
    setOpen(true);
    const music_id = selectedMusic?.id;
    const playlist_id = "1";

    try {
      const res = await fetch(
        `${host}playlist/addmusic/${music_id}/${playlist_id}`,
        {
          method: "POST",
        }
      );
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {compLoad ? (
        <LoadingBar color="#00a827" shadow={true} progress={progress} />
      ) : (
        <Color
          src={`${IMAGE_URL}`}
          crossOrigin=""
          format="rgbString"
          quality={10}
        >
          {({ data, loading, error }) => {
            if (loading) {
              return (
                <LoadingBar color="#00a827" shadow={true} progress={progress} />
              );
            }
            if (error) {
              console.log(error);
              return <h1>ERROR</h1>;
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

                  <div className="flex flex-row items-start  pt-20 pb-4 px-6">
                    <div className="relative">
                      <img
                        src={`${IMAGE_URL}`}
                        alt="cover"
                        className="object-cover min-w-[150px] rounded min-h-[150px] w-[250px] h-[250px] max-w-[250px] max-h-[250px]"
                      />
                    </div>
                    <div className="flex flex-col items-start px-6 justify-end mt-auto mb-0 gap-2">
                      <h4 className="font-semibold text-zinc-200">Song</h4>
                      <h1 className="text-7xl font-bold text-zinc-50">
                        {selectedMusic.musicName}
                      </h1>
                      <h4 className="font-normal text-sm text-zinc-100">
                        {selectedMusic.musicArtist}
                      </h4>
                    </div>
                  </div>
                  <div className="bg-black/20 flex flex-row items-center justify-start gap-2 p-4">
                    <button
                      title="Play"
                      aria-label="Play"
                      onClick={handlePlayClick}
                      className={`flex items-center justify-center p-4 rounded-full bg-green-500/90 text-black button-transition hover:scale-110 hover:bg-green-500 hover:shadow-md
          `}
                    >
                      {isCurrentSelected ? (
                        isPause ? (
                          <Play fill="black" className="ml-1" />
                        ) : (
                          <Pause fill="black" />
                        )
                      ) : (
                        <Play fill="black" className="ml-1" />
                      )}
                    </button>
                    <button
                      aria-label="love"
                      title="Add to Liked Songs"
                      onClick={handleAddToLikedSongs}
                      className="flex items-center justify-center p-4 text-zinc-400 hover:text-white transition-all ease-in-out duration-300  "
                    >
                      <Heart size={35} />
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
                        <DropdownMenu.Item onClick={handleAddToLikedSongs}>
                          Add to Liked Songs
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Sub>
                          <DropdownMenu.SubTrigger>
                            Add to Playlist
                          </DropdownMenu.SubTrigger>
                          <DropdownMenu.SubContent>
                            <Link to="/playlist/create">
                              <DropdownMenu.Item className="gap-2 justify-start">
                                <Plus size={15} /> Create a Playlist
                              </DropdownMenu.Item>
                            </Link>
                            <DropdownMenu.Separator />
                            {isPLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : playlistData?.length === 0 ? (
                              <DropdownMenu.Item>
                                No Playlist Found
                              </DropdownMenu.Item>
                            ) : (
                              playlistData.map((playlist, index) => (
                                <div key={index} className="mt-1">
                                  <AlertDialog.Root>
                                    <AlertDialog.Trigger>
                                      <button
                                        color="gray"
                                        className="w-full hover:bg-gray-500/90 text-sm font-normal py-1.5 rounded"
                                        aria-label="toggle"
                                      >
                                        {playlist.playlistName}
                                      </button>
                                    </AlertDialog.Trigger>
                                    <AlertDialog.Content
                                      style={{ maxWidth: 450 }}
                                    >
                                      <AlertDialog.Title>
                                        Add Songs to {playlist.playlistName} ?
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
                                            className="cursoir-pointer bg-green-500 hover:bg-green-500/90 text-sm text-zinc-100 flex items-center justify-center rounded-md px-2 py-2 outline-none focus:shadow-sm font-semibold"
                                            data-music-id={selectedMusic?.id}
                                            data-playlist-id={playlist?.id}
                                            data-playlist-name={
                                              playlist?.playlistName
                                            }
                                            onClick={handleAddToPlaylist}
                                          >
                                            Add Songs
                                          </button>
                                        </AlertDialog.Action>
                                      </Flex>
                                    </AlertDialog.Content>
                                  </AlertDialog.Root>
                                </div>
                              ))
                            )}
                          </DropdownMenu.SubContent>
                        </DropdownMenu.Sub>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item>Share</DropdownMenu.Item>
                        <DropdownMenu.Item>Add to favorites</DropdownMenu.Item>
                        <DropdownMenu.Separator />
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
                        Added {selectedMusic.musicName} To {playlistName}!
                      </Toast.Title>
                      <Toast.Action
                        className="[grid-area:_action]"
                        asChild
                        altText="Goto Playlist"
                      >
                        <Link
                          to={`/playlist/${playlistName}`}
                          className="inline-flex items-center justify-center rounded font-medium text-xs px-[10px] leading-[25px] h-[25px] bg-green2 text-green11 shadow-[inset_0_0_0_1px] shadow-green7 hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8"
                        >
                          Go
                        </Link>
                      </Toast.Action>
                    </Toast.Root>
                    <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
                  </Toast.Provider>

                  <div className="px-6 py-3.5 flex flex-row items-center justify-start cursor-pointer bg-black/20 hover:bg-black/30 transition-all ease-in-out duration-300">
                    <div className="relative w-[80px] h-[80px]">
                      <User2
                        alt="profile"
                        className="object-cover rounded-full p-1 w-full h-full bg-zinc-900"
                      />
                    </div>
                    <div className="flex flex-col items-start justify-start p-4 gap-1">
                      <h6 className="font-semibold text-sm">Artist</h6>
                      <h4 className="font-bold text-base hover:underline">
                        {selectedMusic.musicArtist}
                      </h4>
                    </div>
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

export default SingleMusicCard;
