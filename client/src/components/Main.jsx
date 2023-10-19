import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const Main = () => {
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

      <h1 className="text-4xl font-semibold mt-10">Good Night!</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
        <div className="bg-white/5 group rounded flex items-center gap-4 overflow-hidden hover:bg-white/20 transition-all">
          <img src="/img/download.jpeg" alt="cover" width={104} height={104} />
          <strong>Close The Sun</strong>
          <button className="flex items-center justify-center pl-2.5 p-2 rounded-full bg-green-600 text-black ml-auto mr-8 invisible group-hover:visible hover:scale-105 transition-all group">
            <Play />
          </button>
        </div>
        <div className="bg-white/5 group rounded flex items-center gap-4 overflow-hidden hover:bg-white/20 transition-all">
          <img src="/img/download.jpeg" alt="cover" width={104} height={104} />
          <strong>Close The Sun</strong>
          <button className="flex items-center justify-center pl-2.5 p-2 rounded-full bg-green-600 text-black ml-auto mr-8 invisible group-hover:visible hover:scale-105 transition-all group">
            <Play />
          </button>
        </div>
        <div className="bg-white/5 group rounded flex items-center gap-4 overflow-hidden hover:bg-white/20 transition-all">
          <img src="/img/download.jpeg" alt="cover" width={104} height={104} />
          <strong>Close The Sun</strong>
          <button className="flex items-center justify-center pl-2.5 p-2 rounded-full bg-green-600 text-black ml-auto mr-8 invisible group-hover:visible hover:scale-105 transition-all group">
            <Play />
          </button>
        </div>
        <div className="bg-white/5 group rounded flex items-center gap-4 overflow-hidden hover:bg-white/20 transition-all">
          <img src="/img/download.jpeg" alt="cover" width={104} height={104} />
          <strong>Close The Sun</strong>
          <button className="flex items-center justify-center pl-2.5 p-2 rounded-full bg-green-600 text-black ml-auto mr-8 invisible group-hover:visible hover:scale-105 transition-all group">
            <Play />
          </button>
        </div>
      </div>

      <h1 className="font-semibold text-2xl mt-10">Hello World!</h1>

      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 mt-4">
        <div className="bg-white/5 p-2 rounded-md hover:bg-white/10 flex flex-col gap-2">
          <img
            src="/img/download.jpeg"
            className="w-full"
            alt="cover"
            width={120}
            height={120}
          />
          <strong className="font-semibold">Close The Sun</strong>
          <span className="text-xs text-zinc-400">TheFatRat</span>
        </div>
      </div>
    </>
  );
};

export default Main;
