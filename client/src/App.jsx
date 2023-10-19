import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/music", {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        const musicData = await res.json();
        setData(musicData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        data.map((music) => (
          <div key={music[0]}>
            {/* Render your music data here */}
            <p>ID: {music[0]}</p>
            <p>File Path: {music[1]}</p>
            <p>Artist: {music[2]}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
