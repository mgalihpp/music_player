import { useRef, useState } from "react";
import TopNavbar from "../Navbar/TopNavbar";
import { useUploadContext } from "../../Context/UploadContext";
import LoadingBar from "react-top-loading-bar";
import host from "../../utils";

const CreatePlaylist = () => {
  const [playlistImage, setPlaylistImage] = useState(null);
  const [playlistName, setPlaylistName] = useState("");
  const [isSubmit, SetIsSubmit] = useState(false);
  const [toast, setToast] = useState(false);
  const [imageSrc, setImageSrc] = useState("/img/download.jpeg");
  const { setIsPFetching } = useUploadContext();

  const playlistImageRef = useRef(null);
  const playlistNameRef = useRef(null);
  const loadingRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    SetIsSubmit(true);
    loadingRef.current.continuousStart();

    try {
      const formData = new FormData();
      formData.append("playlist_name", playlistName);
      formData.append("playlist_image", playlistImage);
      const res = await fetch(`${host}playlist/add`, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Methods": "POST",
        },
        body: formData,
      });
      setIsPFetching(true);
      return res;
    } catch (error) {
      console.error(error);
    } finally {
      playlistImageRef.current.value = "";
      playlistNameRef.current.value = "";
      setImageSrc("/img/download.jpeg");
      setPlaylistImage(null);
      setPlaylistName("");
      setToast(true);
      loadingRef.current.complete();
      setTimeout(() => {
        SetIsSubmit(false);
        setToast(false);
      }, 5000);
    }
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setPlaylistImage(selectedImage);

    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleImageClick = () => {
    // Trigger file input when the image is clicked
    document.getElementById("file-input").click();
  };

  const handleRemoveFile = () => {
    // Clear the selected file and reset the image source
    setPlaylistImage(null);
    setImageSrc("/img/download.jpeg");
  };

  return (
    <>
      <div className="p-6 m-auto">
        <TopNavbar />

        <div className="flex items-center justify-center mt-24 h-full">
          <div className="w-[500px] space-x-2 space-y-2 bg-white/5 rounded-md p-4 flex flex-col justify-center items-center mx-auto">
            <h1 className="text-2xl font-bold">Create Playlist</h1>

            <form
              onSubmit={handleSubmit}
              className="p-4 flex flex-col items-center justify-center"
            >
              <div className="flex flex-row items-center justify-center">
                <div className="flex flex-col items-center justify-center min-w-[150px] min-h-[150px] w-[180px]">
                  <div className="relative flex flex-col items-center justify-center">
                    <span className="text-sm mb-4">Playlist Image :</span>
                    <img
                      src={imageSrc}
                      className="rounded-lg object-cover w-36 h-36 cursor-pointer"
                      onClick={handleImageClick}
                    />
                    <div className="flex flex-col items-center">
                      <input
                        type="file"
                        id="file-input"
                        className="hidden"
                        ref={playlistImageRef}
                        required={true}
                        accept=".jpeg, .jpg, .png, .svg"
                        onChange={handleImageChange}
                      />
                      {playlistImage && (
                        <button
                          onClick={handleRemoveFile}
                          className="bg-red-500 p-2 rounded-md cursor-pointer text-white mt-2"
                        >
                          Remove File
                        </button>
                      )}
                      {!playlistImage && (
                        <div className="text-red-600 text-sm font-semibold mt-2 text-center">
                          Please select an image for your playlist.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4 flex flex-col space-y-2">
                  <input
                    type="text"
                    id="playlist_name"
                    onChange={(e) => setPlaylistName(e.target.value)}
                    ref={playlistNameRef}
                    required={true}
                    autoFocus
                    autoComplete="off"
                    placeholder="Playlist Name"
                    className="rounded-md p-2 bg-zinc-900 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex ml-auto">
                <button
                  aria-label="submit"
                  title="Create"
                  type="submit"
                  disabled={isSubmit}
                  className="bg-green-500 hover:bg-green-500/90 font-semibold text-black rounded-full px-5 py-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          <div>
            <LoadingBar color="#00a827" shadow={true} ref={loadingRef} />
          </div>
          <div
            id="toast-success"
            className={`${
              toast ? "flex" : "hidden"
            } absolute top-5 right-0 items-center w-full h-16 max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-white dark:bg-green-500
        `}
            role="alert"
          >
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white bg-transparent rounded-lg">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span className="sr-only">Check icon</span>
            </div>
            <div className="ml-3 text-sm font-normal">
              Playlist Created Successfully
            </div>
            <button
              type="button"
              className="ml-auto -mx-1.5 -my-1.5 bg-white/20 text-white hover:text-black rounded-lg focus:ring-2 focus:ring-gray-300 p-1 hover:bg-white/50 inline-flex items-center justify-center h-7 w-7"
              data-dismiss-target="#toast-success"
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePlaylist;
