import {
  Camera,
  Loader2,
  MoreHorizontal,
  Pen,
  User2,
  XIcon,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { useMusicContext } from "../Context/MusicContext";
import * as Dialog from "@radix-ui/react-dialog";
import { host, api } from "../utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, DropdownMenu } from "@radix-ui/themes";
import MusicCard from "../components/MusicCard";
import MainPlaylist from "../components/Playlist/MainPlaylist";

const Settings = () => {
  const { userInfo, userId, setIsLoading } = useAuth();
  const { playlistData } = useMusicContext();
  const [userImage, setUserImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [open, setIsOpen] = useState(false);
  const [disable, setDisable] = useState(false);
  const [musicData, setMusicData] = useState([]);

  const [isUsernameChanged, setIsUsernameChanged] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const imageRef = useRef();

  const getUserMostPlayedMusic = useCallback(async () => {
    try {
      const res = await fetch(`${api}mostmusics?id=${userId}`, {
        method: "GET",
      });
      const data = await res.json();
      setMusicData(data.musics);
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  console.log(musicData);

  useEffect(() => {
    if (userId !== null) {
      getUserMostPlayedMusic();
    }
  }, [getUserMostPlayedMusic, userId]);

  useEffect(() => {
    if (userInfo.username) {
      setUserName(userInfo.username);
    }
  }, [userInfo.username]);

  const updateUser = async (e) => {
    e.preventDefault();
    setDisable(true);
    try {
      const formData = new FormData();
      formData.append("username", isUsernameChanged ? userName : "");
      formData.append("profile_image", isImageChanged ? userImage : "");

      // Check if either username or profile image has been changed
      if (isUsernameChanged || isImageChanged) {
        const res = await fetch(`${api}user?id=${userId}`, {
          method: "PUT",
          body: formData,
        });
        return res;
      } else {
        console.log("No changes to update.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(true);
      setDisable(false);
      setIsOpen(false);
    }
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setUserImage(selectedImage);

    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(selectedImage);
      setIsImageChanged(true);
    }
  };

  const handleUsernameChange = (e) => {
    setUserName(e.target.value);
    setIsUsernameChanged(true); // Mark username as changed
  };

  const handleImageClick = () => {
    // Trigger file input when the image is clicked
    document.getElementById("file-input").click();
  };

  return (
    <div className="mx-auto pt-12">
      <div
        className="flex flex-col sm:flex-row items-center pt-10 pb-4 px-6 cursor-pointer bg-black/5"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative w-40 h-40">
          <div className="absolute top-0 left-0 cursor-default w-full h-full opacity-0 rounded-full transition-opacity duration-300 bg-black bg-opacity-50 flex items-center justify-center text-white hover:opacity-100">
            <span className="flex flex-col items-center justify-center">
              Choose Photo
              <Camera className="w-8 h-8" />
            </span>
          </div>
          {userInfo.profile &&
          userInfo.profile !== null &&
          userInfo.profile !== undefined &&
          userInfo.profile !== "" ? (
            <img
              src={`${host}img/profile/${userInfo.profile}`}
              alt="profile"
              className="object-cover rounded-full w-40 h-40 max-w-[160px] max-h-[160px]"
            />
          ) : (
            <User2
              alt="profile"
              className="object-cover rounded-full w-full h-full bg-zinc-800 p-0.5"
            />
          )}
        </div>
        <div className="flex flex-col items-start px-6 justify-end mt-4 sm:mt-auto mb-0 gap-2">
          <h4 className="font-semibold text-xs sm:text-sm text-zinc-200">
            Profile
          </h4>
          <h1 className="text-xl sm:text-7xl font-bold text-zinc-50 sm:mb-6">
            {userInfo.username ?? ""}
          </h1>
          <h4 className="font-semibold text-xs sm:text-sm text-zinc-100 flex items-center justify-start">
            {playlistData?.length + " " + "Playlists"}
          </h4>
        </div>
      </div>
      <div className="bg-black/5 px-2 sm:px-8 py-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button
              variant="none"
              color="gray"
              aria-label="option"
              title="More Options"
              className="flex items-center justify-center p-4 text-zinc-400 hover:text-white transition-all ease-in-out duration-300  "
            >
              <MoreHorizontal size={30} />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content color="gray">
            <button
              color="gray"
              className="w-full flex p-2 hover:bg-gray-500/90 text-sm font-normal py-1.5 rounded"
              aria-label="toggle"
              onClick={() => setIsOpen(true)}
            >
              <Pen className="m-auto w-3 h-3 mr-2" /> Edit Profile
            </button>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div className="flex flex-col px-2 sm:px-8 py-4 gap-4 space-y-4 h-full">
        <section className="space-y-2">
          <h1 className="text-2xl font-bold">Top played musics</h1>
          <div className="flex flex-col flex-wrap sm:flex-row items-center justify-start gap-4">
            {musicData.length !== 0 &&
              musicData.map((music) => (
                <div key={music.id}>
                  <MusicCard
                    musicName={music.musicName}
                    musicArtist={music.musicArtist}
                    musicImage={music.musicImage}
                    musicPath={music.musicPath}
                  />
                </div>
              ))}
          </div>
        </section>
        <section className="space-y-2">
          <h1 className="text-2xl font-bold">Public Playlists</h1>
          <div className="flex flex-col flex-wrap sm:flex-row items-center justify-start gap-4">
            {playlistData.length !== 0 &&
              playlistData.map((playlist) => (
                <MainPlaylist
                  key={playlist.id}
                  name={playlist.playlistName}
                  image={playlist.playlistImage}
                />
              ))}
          </div>
        </section>
      </div>
      <>
        <Dialog.Root open={open} onOpenChange={setIsOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/20 data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-zinc-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <Dialog.Title className="text-white m-0 text-[17px] font-medium">
                Edit profile
              </Dialog.Title>

              <form
                onSubmit={updateUser}
                className="flex flex-col items-center mt-5"
              >
                <div className="flex flex-row items-center gap-4 w-full">
                  <fieldset className="mb-[15px] flex items-center gap-5">
                    <div className="relative w-24 h-24 sm:w-36 sm:h-36">
                      <div
                        onClick={handleImageClick}
                        className="absolute top-0 left-0 cursor-pointer w-full h-full opacity-0 rounded-full transition-opacity duration-300 bg-black bg-opacity-50 flex items-center justify-center text-white hover:opacity-100"
                      >
                        <span className="flex flex-col items-center justify-center text-xs sm:text-base">
                          Choose Photo
                          <Camera className="sm:w-8 sm:h-8 w-6 h-6" />
                        </span>
                      </div>
                      {userInfo.profile &&
                      userInfo.profile !== null &&
                      userInfo.profile !== undefined &&
                      userInfo.profile !== "" ? (
                        <img
                          src={
                            imageSrc !== null
                              ? imageSrc
                              : `${host}img/profile/${userInfo.profile}`
                          }
                          alt="profile"
                          className="object-cover w-24 h-24 sm:w-36 sm:h-36 rounded-full max-w-[144px] max-h-[144px]"
                        />
                      ) : imageSrc ? (
                        <img
                          src={
                            imageSrc !== null
                              ? imageSrc
                              : `${host}img/profile/${userInfo.profile}`
                          }
                          alt="profile"
                          className="object-cover w-full h-full rounded-full"
                        />
                      ) : (
                        <User2
                          alt="profile"
                          className="object-cover rounded-full w-full h-full bg-zinc-800 p-0.5"
                        />
                      )}
                    </div>

                    <input
                      type="file"
                      id="file-input"
                      className="hidden"
                      ref={imageRef}
                      accept=".jpeg, .jpg, .png, .svg"
                      onChange={handleImageChange}
                    />
                  </fieldset>

                  <fieldset className="mb-[15px] w-full h-[70px] flex flex-col ml-auto items-start gap-1">
                    <label
                      className="text-white w-[90px] text-center text-sm sm:text-[15px]"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <input
                      className="text-white inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-sm sm:text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                      id="username"
                      value={userName}
                      maxLength={10}
                      onChange={handleUsernameChange}
                    />
                  </fieldset>
                </div>
                <div className="mt-[20px] flex justify-end">
                  <Dialog.Description className="text-white my-1 text-xs sm:text-[15px] leading-normal">
                    Make changes to your profile here. Click save when
                    you&apos;re done.
                  </Dialog.Description>
                  <button
                    type="submit"
                    className="bg-green-500 text-black hover:bg-green-500/75 focus:shadow-green-500 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-bold leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                  >
                    {disable ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </form>
              <Dialog.Close asChild>
                <button
                  className="text-zinc-300 hover:bg-zinc-300/10 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                  aria-label="Close"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    </div>
  );
};

export default Settings;
