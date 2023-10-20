import { ChevronLeft, ChevronRight } from "lucide-react";
import MusicCard from "./MusicCard";
import { useEffect, useState } from "react";

const Main = () => {
  const [musicData, setMusicData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5000/music"); // Replace with your Flask server URL and endpoint
        if (response.ok) {
          const data = await response.json();
          setMusicData(data);
          setIsLoading(false);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error: " + error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="flex items-center gap-4">
        <button className="p-1 rounded-full bg-black/20">
          <ChevronLeft />
        </button>
        <button className="p-1 rounded-full bg-black/20">
          <ChevronRight />
        </button>
      </div>

      <h1 className="text-4xl font-semibold mt-10">Let&apos;s Play a Music!</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          musicData.map((music, index) => (
            <div key={index}>
              <MusicCard musicName={music[2]} musicPath={music[1]}/>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Main;
