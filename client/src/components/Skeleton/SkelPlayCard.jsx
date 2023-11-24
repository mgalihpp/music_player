const SkelPlayCard = () => {
  return (
    <div
      aria-label="skeleton"
      className="bg-white/5 animate-pulse w-80 h-20 rounded flex items-center justify-between gap-4 overflow-hidden transition-all"
    >
      <div className="animate-pulse bg-white/20 w-20 h-20 mr-2 p-0 rounded-sm flex items-center justify-center" />
      <div className="animate-pulse bg-white/20 w-40 h-8 mr-auto rounded-lg flex items-center justify-center" />
    </div>
  );
};

export default SkelPlayCard;
