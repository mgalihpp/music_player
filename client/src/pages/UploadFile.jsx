import { useRef, useState } from "react";
import { useUploadContext } from "../Context/UploadContext";
import TopNavbar from "../components/Navbar/TopNavbar";
import { Play } from "lucide-react";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [artist, setArtist] = useState("");
  const [image, setImage] = useState(null);
  const { setIsFetching } = useUploadContext();
  const [isSubmit, SetIsSubmit] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const fileRef = useRef(null);
  const fileNameRef = useRef(null);
  const fileArtistRef = useRef(null);
  const fileImageRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    SetIsSubmit(true);
    setIsFetching(true);

    try {
      const formData = new FormData();
      formData.append("music_file", file);
      formData.append("music_name", fileName);
      formData.append("music_artist", artist);
      formData.append("music_image", image);
      const res = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Methods": "POST",
        },
        body: formData,
      });
      return res;
    } catch (error) {
      console.log(error);
    } finally {
      fileRef.current.value = "";
      fileNameRef.current.value = "";
      fileArtistRef.current.value = "";
      fileImageRef.current.value = "";
      setFile(null);
      setImage(null);
      setFileName("");
      setArtist("");
      setIsFetching(false);
      setPreviewImage(null);
      setTimeout(() => {
        SetIsSubmit(false);
      }, 2000);
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);
      setPreviewImage(imageUrl);
    }
  };

  return (
    <>
      <div className="p-6">
        <TopNavbar />
        <div className="flex flex-row justify-center items-center">
          <div className="flex justify-center h-[500px] mx-auto w-[500px] rounded-xl items-center bg-white/5 text-white">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center justify-center gap-4 p-6"
            >
              <label htmlFor="music_file" className="text-xl font-semibold">
                Upload Music
              </label>
              <input
                className="border-2 p-2 bg-transparent rounded-full w-full focus:outline-none"
                type="file"
                name="music_file"
                id="music_file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".mp3"
                ref={fileRef}
                required={true}
              />
              <label htmlFor="music_image" className="text-xl font-semibold">
                Upload Image
              </label>
              <input
                className="border-2 p-2 bg-transparent rounded-full w-full focus:outline-none"
                type="file"
                name="music_image"
                id="music_image"
                accept=".jpg, .jpeg, .png, .svg"
                onChange={handleImageChange}
                ref={fileImageRef}
                required={true}
              />
              <label htmlFor="music_name" className="text-xl font-semibold">
                Music Name
              </label>
              <input
                className="border-2 p-2 bg-transparent rounded-full w-full focus:outline-none"
                type="text"
                name="music_name"
                id="music_name"
                placeholder="Music Name"
                autoComplete="off"
                autoFocus
                onChange={(e) => setFileName(e.target.value)}
                ref={fileNameRef}
                required={true}
              />
              <label htmlFor="music_artist" className="text-xl font-semibold">
                Artist Name
              </label>
              <input
                className="border-2 p-2 bg-transparent rounded-full w-full focus:outline-none"
                type="text"
                name="music_artist"
                id="music_artist"
                placeholder="Music Artist Name"
                onChange={(e) => setArtist(e.target.value)}
                ref={fileArtistRef}
                required={true}
              />
              <button
                aria-label="submit"
                title="Upload"
                type="submit"
                className="bg-white hover:bg-white/90 font-bold text-black px-6 py-2 rounded-md"
                onClick={() => setIsFetching(true)}
                disabled={isSubmit}
              >
                Submit
              </button>
            </form>
          </div>
          <div
            id="toast-success"
            className={`${
              isSubmit ? "flex" : "hidden"
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
              Music Uploaded Successfully
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
          {previewImage && (
            <div className="flex flex-col justify-center h-[500px] mx-auto w-[300px] rounded-xl items-center bg-white/5 text-white">
              <h1 className="text-2xl font-semibold">Preview</h1>
              <div
                className={`mt-6 cursor-pointer
          flex items-center justify-center p-4 group min-w-[150px] min-h-[150px] w-[180px] flex-col text-base text-zinc-200 gap-3 font-semibold rounded-md bg-white/5 hover:bg-white/10 transition-all`}
              >
                <div className="relative flex items-center justify-center">
                  <img
                    src={previewImage}
                    className="rounded-lg object-cover min-w-[150px] min-h-[150px] w-[150px] h-[150px]"
                  />
                  <button
                    title="Play"
                    aria-label="Play"
                    className={`absolute flex items-center justify-center bottom-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 right-2 p-4 rounded-full bg-green-500/80 text-black button-transition hover:scale-110 hover:bg-green-500 hover:shadow-md 
          
          }
          `}
                  >
                    <Play fill="black" className="ml-1" />
                  </button>
                </div>
                <div className="flex flex-col items-start">
                  <div>
                    <p className="font-semibold hover:underline text-sm whitespace-nowrap overflow-hidden overflow-ellipsis w-32">
                      <strong title={fileName}>{fileName}</strong>
                    </p>
                  </div>
                  <p className="font-normal text-xs text-zinc-400 whitespace-nowrap overflow-hidden overflow-ellipsis w-32">
                    {artist}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadFile;
