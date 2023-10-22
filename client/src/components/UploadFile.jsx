import { useRef, useState } from "react";
import { useUploadContext } from "../Context/UploadContext";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [artist, setArtist] = useState("");
  const [image, setImage] = useState(null);
  const { setIsFetching } = useUploadContext();
  const [isSubmit, SetIsSubmit] = useState(false);

  const fileRef = useRef(null);
  const fileNameRef = useRef(null);
  const fileArtistRef = useRef(null);
  const fileImageRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("music_file", file);
      formData.append("music_name", fileName);
      formData.append("music_artist", artist);
      formData.append("music_image", image);
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Methods": "POST",
        },
        body: formData,
      });
      SetIsSubmit(true);
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
    }
  };

  return (
    <>
      <div className="flex justify-center h-full mx-auto w-[600px] rounded-xl items-center bg-zinc-950 text-white">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-2"
        >
          <label htmlFor="music_file" className="text-xl">
            Upload Music
          </label>
          <input
            className="border-2 text-white"
            type="file"
            name="music_file"
            id="music_file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".mp3"
            ref={fileRef}
            required={true}
          />
          <label htmlFor="music_image">Upload Image</label>
          <input
            className="border-2 text-white"
            type="file"
            name="music_image"
            id="music_image"
            accept=".jpg, .jpeg, .png, .svg"
            onChange={(e) => setImage(e.target.files[0])}
            ref={fileImageRef}
            required={true}
          />
          <label htmlFor="music_name">Music Name</label>
          <input
            className="border-2 text-white"
            type="text"
            name="music_name"
            id="music_name"
            onChange={(e) => setFileName(e.target.value)}
            ref={fileNameRef}
            required={true}
          />
          <label htmlFor="music_artist">Artist Name</label>
          <input
            className="border-2 text-white"
            type="text"
            name="music_artist"
            id="music_artist"
            onChange={(e) => setArtist(e.target.value)}
            ref={fileArtistRef}
            required={true}
          />
          <button
            type="submit"
            className="bg-white text-black px-6 py-1 rounded-md"
            onClick={() => setIsFetching(true)}
          >
            Submit
          </button>
        </form>
      </div>
      <div
        id="toast-success"
        className={`${
          isSubmit ? "flex" : "hidden"
        } absolute bottom-40 right-0 items-center w-full h-16 max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-white dark:bg-green-500
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
          onClick={() => SetIsSubmit(false)}
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
    </>
  );
};

export default UploadFile;
