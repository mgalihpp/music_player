import Navbar from "./components/Navbar";
import Main from "./components/Main";
import { Footer } from "./components/Footer";
import AudioPlayerComponent from './components/AudioPlayerComponents';

function App() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-zinc-950 p-6">
          <Navbar />
        </aside>
        <main className="flex-1 p-6 overflow-x-auto">
          <Main />
        </main>
      </div>
      <footer className="bg-zinc-900 border-t border-zinc-700 p-6 flex items-center justify-between">
        <AudioPlayerComponent/>
      </footer>
    </div>
  );
}

export default App;
