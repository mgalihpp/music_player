import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import AudioPlayerComponent from "./components/AudioPlayerComponents.jsx";
import UploadFile from "./pages/UploadFile.jsx";
import SearchMusic from "./pages/SearchMusic";
import SingleMusicCard from "./components/SingleMusicCard";
import Playlist from "./pages/Playlist.jsx";
import CreatePlaylist from "./components/Playlist/CreatePlaylist";
import Category from "./pages/Category.jsx";
import Login from "./pages/Auth/Login.jsx";
import Main from "./pages/Home/Main";
import { useAuth } from "./Context/AuthContext.jsx";
import { useEffect } from "react";

const AuthenticatedLayout = () => (
  <div className="h-screen flex p-2 flex-col overflow-hidden w-screen">
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-72 p-0 pr-2">
        <Navbar />
      </aside>
      <main className="flex-1 rounded-t-md bg-white/5 overflow-x-auto relative">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/upload" element={<UploadFile />} />
          <Route path="/music/:musicName" element={<SingleMusicCard />} />
          <Route path="/search" element={<SearchMusic />} />
          <Route path="/playlist/create" element={<CreatePlaylist />} />
          <Route path="/playlist/:playlistName" element={<Playlist />} />
          <Route path="/category/:name" element={<Category />} />
        </Routes>
      </main>
    </div>
    <footer className="bg-white/5 border-t border-zinc-700 p-0 flex items-center justify-between rounded-b-md">
      <AudioPlayerComponent />
    </footer>
  </div>
);

function App() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");

    if (storedUserId) {
      // If there's a user ID in local storage, set the user as logged in
      setUser(true);
    }

    if (user && window.location.pathname === "/login") {
      // If the user is logged in, navigate to the home page
      navigate("/");
    } else if (!user) {
      // If the user is not logged in, navigate to the login page
      navigate("/login");
    }
  }, [user, setUser, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<AuthenticatedLayout />} />
    </Routes>
  );
}

export default App;
