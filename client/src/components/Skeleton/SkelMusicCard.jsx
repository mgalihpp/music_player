const SkelMusicCard = () => {
  return (
    <>
      <div
        aria-label="skeleton"
        className="bg-white/5 animate-pulse p-2 responsive-card flex items-center flex-col gap-2 justify-center rounded-md"
      >
        <div className="bg-white/10 responsive-card-img rounded-md"></div>
        <div className="bg-white/10 animate-pulse w-full h-3 rounded-md"></div>
        <div className="bg-white/10 animate-pulse w-full h-3 rounded-md"></div>
      </div>
    </>
  );
};

export default SkelMusicCard;
