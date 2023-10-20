import { Play } from "lucide-react";
import { useContext } from "react";
import { AudioContext } from "../Context/AudioContext";

const MusicCard = (props) => {
  // eslint-disable-next-line react/prop-types
  const { musicName, musicPath } = props;
  const { setSelectedAudio } = useContext(AudioContext);

  const handlePlayClick = () => {
    setSelectedAudio(musicPath); // Set the selected audio in the context
  };

  return (
    <div className="bg-white/5 group rounded flex items-center gap-4 overflow-hidden hover:bg-white/20 transition-all">
      <img src="/img/download.jpeg" alt="cover" width={104} height={104} />
      <strong>{musicName}</strong>
      <button
        onClick={handlePlayClick}
        className="flex items-center justify-center pl-2.5 p-2 rounded-full bg-green-600 text-black ml-auto mr-8 invisible group-hover:visible hover:scale-110 transition-all shadow hover:shadow-lg group"
      >
        <Play fill="black" size={20} />
      </button>
    </div>
  );
};

export default MusicCard;
