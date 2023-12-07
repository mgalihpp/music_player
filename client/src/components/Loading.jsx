const Loading = ({ className }) => {
  return (
    <div className={`loader ${className}`}>
      <span className="blob1 blob"></span>
      <span className="blob2 blob"></span>
      <span className="blob3 blob"></span>
    </div>
  );
};

export default Loading;
