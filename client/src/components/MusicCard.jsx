import { Play } from "lucide-react";
import { useContext } from "react";
import { AudioContext } from "../Context/AudioContext";
import { Link } from 'react-router-dom';

const MusicCard = (props) => {
  // eslint-disable-next-line react/prop-types
  const { musicName, musicImage } = props;
  const { setSelectedAudio } = useContext(AudioContext);

  const handlePlayClick = () => {
    setSelectedAudio(props); // Set the selected audio in the context
  };

  return (
    <div className="bg-white/5 group rounded flex items-center gap-4 overflow-hidden hover:bg-white/20 transition-all">
      <img src={`http://localhost:5000/${musicImage}`} alt="cover" width={104} height={104} style={{minWidth: '104px', minHeight:'104px', objectFit: 'cover', maxWidth: '104px', maxHeight:'104px'}}/>
      <Link to={'/music/' + musicName}>
      <strong className="hover:underline">{musicName}</strong>
      </Link>
      <button
        onClick={handlePlayClick}
        className="flex items-center justify-center pl-4 p-3 rounded-full bg-green-600 text-black ml-auto mr-8 invisible group-hover:visible hover:scale-110 transition-all shadow hover:shadow-lg group"
      >
        <Play fill="black" size={25} />
      </button>
    </div>
  );
};

export default MusicCard;
