import { useRef, useState } from "react";
import { useUploadContext } from "../Context/UploadContext";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [artist, setArtist] = useState("");
  const [image, setImage] = useState(null);
  const { setIsFetching } = useUploadContext();

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
        body: formData,
      });
      const data = await res.data;
      return data;
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
          className="border-2 text-black"
          type="text"
          name="music_name"
          id="music_name"
          onChange={(e) => setFileName(e.target.value)}
          ref={fileNameRef}
          required={true}
        />
        <label htmlFor="music_artist">Artist Name</label>
        <input
          className="border-2 text-black"
          type="text"
          name="music_artist"
          id="music_artist"
          onChange={(e) => setArtist(e.target.value)}
          ref={fileArtistRef}
          required={true}
        />
        <button
          type="submit"
          className="bg-black text-white p-2 rounded-md"
          onClick={() => setIsFetching(true)}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadFile;
