import { useState } from "react";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [artist, setArtist] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("music_file", file);
      formData.append("music_name", fileName);
      formData.append("music_artist", artist);
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-96 items-center justify-center"
      >
        <label>Upload Music</label>
        <input
          className="border-2"
          type="file"
          name="music_file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label>File Name</label>
        <input
          className="border-2"
          type="text"
          name="music_name"
          onChange={(e) => setFileName(e.target.value[0])}
        />
        <label>Artist Name</label>
        <input
          className="border-2"
          type="text"
          name="music_artist"
          onChange={(e) => setArtist(e.target.value[0])}
        />
        <button type="submit" className="bg-black text-white p-2 rounded-md">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadFile;
