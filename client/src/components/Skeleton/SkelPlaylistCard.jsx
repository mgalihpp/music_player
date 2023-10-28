const SkelPlaylistCard = () => {
  return (
    <div className="flex items-start justify-center w-[120px] flex-col gap-2 font-semibold rounded p-3 transition-all">
      <div className="relative space-y-2">
        <div className="bg-white/5 w-[100px] h-[100px] animate-pulse rounded-md"></div>
      <div className="bg-white/5 h-4 w-full rounded-md"></div>
      </div>
    </div>
  );
};

export default SkelPlaylistCard;
