import { useRef, useState } from "react";
import { useUploadContext } from "../Context/UploadContext";
import { Image, Play, Upload } from "lucide-react";
import LoadingBar from "react-top-loading-bar";
import { api } from "../utils";
import { Button } from "@radix-ui/themes";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [fileName, setFileName] = useState("");
  const [artist, setArtist] = useState("");
  const [image, setImage] = useState(null);
  const { setIsFetching } = useUploadContext();
  const [isSubmit, SetIsSubmit] = useState(false);
  const [toast, setToast] = useState(false);
  const [eToast, setEToast] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const fileRef = useRef(null);
  const fileNameRef = useRef(null);
  const fileArtistRef = useRef(null);
  const fileImageRef = useRef(null);
  const loadingRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    SetIsSubmit(true);
    loadingRef.current.continuousStart();

    try {
      const formData = new FormData();
      formData.append("music_file", file);
      formData.append("music_name", fileName);
      formData.append("music_artist", artist);
      formData.append("music_image", image);

      if (file && image) {
        const res = await fetch(`${api}upload`, {
          method: "POST",
          body: formData,
        });
        if (res.status === 201) {
          setIsFetching(true);
          setToast(true);
          return res;
        } else {
          setEToast(true);
          setIsFetching(false);
        }
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      setEToast(true);
      setIsFetching(false);
    } finally {
      fileRef.current.value = "";
      fileNameRef.current.value = "";
      fileArtistRef.current.value = "";
      fileImageRef.current.value = "";
      setFile(null);
      setImage(null);
      setFileName("");
      setArtist("");
      setPreviewImage(null);
      loadingRef.current.complete();
      setTimeout(() => {
        SetIsSubmit(false);
        setToast(false);
        setEToast(false);
      }, 5000);
    }
  };

  const handleFileButtonClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // Set the selected file to state
    setFile(selectedFile);
    // Display the selected file name
    setSelectedFileName(selectedFile?.name ?? "");
  };

  const handleImageButtonClick = () => {
    if (fileImageRef.current) {
      fileImageRef.current.click();
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
      <div className="px-6 pt-24">
        <div className="flex flex-row justify-center items-center sm:mt-0 mt-2">
          <div
            className={`flex sm:flex-row flex-col justify-center h-auto max-w-screen-sm sm:h-[500px] mx-auto ${
              previewImage ? "w-auto" : "w-[500px]"
            }  rounded-xl items-center bg-white/5 text-white`}
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-start justify-center gap-4 p-12"
            >
              <label htmlFor="music_file" className="text-base font-semibold">
                Upload Music
              </label>
              <input
                className="outline-none bg-zinc-900 p-2 w-full hidden"
                type="file"
                name="music_file"
                id="music_file"
                onChange={handleFileChange}
                accept=".mp3"
                ref={fileRef}
              />
              <div className="flex flex-row items-center justify-center gap-2">
                <Button
                  type="button"
                  color="grass"
                  onClick={handleFileButtonClick}
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
                {selectedFileName && (
                  <p className="text-xs whitespace-nowrap overflow-hidden overflow-ellipsis w-36">
                    Selected File: {selectedFileName}
                  </p>
                )}
              </div>
              <label htmlFor="music_image" className="text-base font-semibold">
                Upload Image
              </label>
              <input
                className="outline-none bg-zinc-900 p-2 w-full hidden"
                type="file"
                name="music_image"
                id="music_image"
                accept=".jpg, .jpeg, .png, .svg"
                onChange={handleImageChange}
                ref={fileImageRef}
              />
              <div className="flex flex-row items-center justify-center gap-2">
                <Button
                  type="button"
                  color="grass"
                  onClick={handleImageButtonClick}
                >
                  <Image className="w-4 h-4" />
                  Upload
                </Button>
                {image && (
                  <p className="text-xs whitespace-nowrap overflow-hidden overflow-ellipsis w-36">
                    Selected Image: {image.name}
                  </p>
                )}
              </div>
              <input
                className="text-white inline-flex h-12 w-full items-center justify-center rounded-[4px] px-[10px] text-sm sm:text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                type="text"
                name="music_name"
                id="music_name"
                placeholder="Music Name"
                autoComplete="off"
                autoFocus
                onChange={(e) => setFileName(e.target.value)}
                ref={fileNameRef}
                required
              />

              <input
                className="text-white inline-flex h-12 w-full items-center justify-center rounded-[4px] px-[10px] text-sm sm:text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                type="text"
                name="music_artist"
                id="music_artist"
                placeholder="Music Artist Name"
                onChange={(e) => setArtist(e.target.value)}
                ref={fileArtistRef}
                required
              />
              <button
                aria-label="submit"
                title="Upload"
                type="submit"
                className="bg-green-500 hover:bg-green-500/90 font-bold text-black px-6 py-2 rounded-md mx-auto mt-2"
                onClick={() => setIsFetching(true)}
                disabled={isSubmit}
              >
                Submit
              </button>
            </form>
            {previewImage && (
              <div className="sm:flex flex-col hidden justify-center h-[500px] w-[300px] rounded-xl items-center text-white">
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

          <div>
            <LoadingBar color="#00a827" shadow={true} ref={loadingRef} />
          </div>

          {toast && (
            <div
              id="toast-success"
              className={`flex absolute top-5 right-0 items-center w-full h-16 max-w-xs p-4 mb-4 text-white rounded-lg shadow bg-green-500
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
          )}
          {eToast && (
            <div
              id="toast-failed"
              className={`flex
                absolute top-5 right-0 items-center w-full h-16 max-w-xs p-4 mb-4 text-white bg-red-500 rounded-lg shadow 
        `}
              role="alert"
            >
              <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white bg-transparent rounded-lg">
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
              </div>
              <div className="ml-3 text-xs font-normal">
                Failed To Upload Music. <br /> Invalid File Format
              </div>
              <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 bg-white/20 text-white hover:text-black rounded-lg focus:ring-2 focus:ring-gray-300 p-1 hover:bg-white/50 inline-flex items-center justify-center h-7 w-7"
                data-dismiss-target="#toast-failed"
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
          )}
        </div>
      </div>
    </>
  );
};

export default UploadFile;
