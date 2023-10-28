import { useParams } from "react-router-dom";

const Playlist = () => {
  const { playlistName } = useParams();

  return <div>{playlistName}</div>;
};

export default Playlist;
