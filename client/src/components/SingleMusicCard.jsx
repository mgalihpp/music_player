import { Link, useParams } from "react-router-dom";
import TopNavbar from "./Navbar/TopNavbar";
import {
  Heart,
  Loader2,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
} from "lucide-react";
import { useMusicContext } from "../Context/MusicContext";
import { useAudioContext } from "../Context/AudioContext";
import { useEffect } from "react";
import Color from "color-thief-react";
import { AlertDialog, Button, DropdownMenu, Flex } from "@radix-ui/themes";

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
  } = useAudioContext();

  console.log(playlistData);

  useEffect(() => {
    if (selectedAudio?.musicName === musicName) {
      setCurrentIndex(currentIndex);
    }
  }, [selectedAudio, musicName, currentIndex, setCurrentIndex]);

  const selectedMusic = musicData?.find(
    (music) => music.musicName === musicName
  );

  if (!selectedMusic) {
    return (
      <div>
        <Loader2 className="animate-spin" />
      </div>
    );
  }

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
      setCurrentIndex(
        musicData.findIndex((music) => music.musicName === musicName)
      );
    }
  };

  const IMAGE_URL = `http://127.0.0.1:5000/${selectedMusic?.musicImage}`;

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
            {
              /* const alpha = 0.7;
            const rgbaColor = data
              .replace("rgb", "rgba")
              .replace(")", `, ${alpha})`); */
            }
            const topAlpha = 0.75; // 100% opacity at the top
            const bottomAlpha = 0; // 70% opacity at the bottom

            // Convert the color to RGBA format
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
                  background: `linear-gradient(${topColor}, ${bottomColor})`, // Use the color obtained from Color, or default to white
                }}
              >
                <TopNavbar className="p-6" />

                <div className="flex flex-row items-start  pt-20 pb-4 px-6">
                  <div className="relative">
                    <img
                      src={`http://127.0.0.1:5000/${selectedMusic?.musicImage}`}
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
                      <DropdownMenu.Item>Add to Liked Songs</DropdownMenu.Item>
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
                                    <Button variant="ghost" color="gray" className="w-full" aria-label="toggle">
                                      {playlist.playlistName}
                                    </Button>
                                  </AlertDialog.Trigger>
                                  <AlertDialog.Content
                                    style={{ maxWidth: 450 }}
                                  >
                                    <AlertDialog.Title>
                                      Add Songs to {playlist.playlistName}{" "}
                                      ?
                                    </AlertDialog.Title>
                                    <AlertDialog.Description size="2">
                                      Are you sure?
                                    </AlertDialog.Description>

                                    <Flex gap="3" mt="4" justify="end">
                                      <AlertDialog.Cancel>
                                        <Button variant="soft" color="gray">
                                          Cancel
                                        </Button>
                                      </AlertDialog.Cancel>
                                      <AlertDialog.Action>
                                        <Button variant="solid" color="green">
                                          Add Songs
                                        </Button>
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
                <div className="px-6 py-3.5 flex flex-row items-center justify-start cursor-pointer bg-black/20 hover:bg-black/30 transition-all ease-in-out duration-300">
                  <div className="relative w-[80px] h-[80px]">
                    <img
                      src="/messi.png"
                      alt="profile"
                      className="object-cover rounded-full"
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
    </>
  );
};

export default SingleMusicCard;
