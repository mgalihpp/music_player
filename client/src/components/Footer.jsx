import {
  Laptop2,
  LayoutList,
  Maximize2,
  Mic2,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume,
} from "lucide-react";

export const Footer = () => {
  return (
    <>
      <div className="flex items-center gap-3">
        <img src="/img/download.jpeg" alt="cover" width={56} height={56} />
        <div className="flex flex-col">
          <a href="">
            <strong className="font-normal hover:underline transition-all">
              Close The Sun
            </strong>
          </a>
          <span className="text-xs text-zinc-400">TheFatRat</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-6">
          <Shuffle size={20} className="text-zinc-200" />
          <SkipBack size={20} className="text-zinc-200" />
          <button
            aria-label="play"
            className="flex items-center justify-center pl-2.5 p-2 rounded-full bg-white text-black"
          >
            <Play className="fill-black" />
          </button>
          <SkipForward size={20} className="text-zinc-200" />
          <Repeat size={20} className="text-zinc-200" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">0:31</span>
          <div className="h-1 rounded-full w-96 bg-zinc-600">
            <div className="bg-zinc-200 w-48 h-1 rounded-full"></div>
          </div>
          <span className="text-xs text-zinc-500">2:31</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Mic2 size={20} />
        <LayoutList size={20} />
        <Laptop2 size={20} />
        <div className="flex items-center gap-2">
          <Volume size={20} />
          <div className="h-1 rounded-full w-24 bg-zinc-600">
            <div className="bg-zinc-200 w-16 h-1 rounded-full"></div>
          </div>
        </div>
        <Maximize2 size={20} />
      </div>
    </>
  );
};
