import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="flex flex-row justify-between px-4 sm:px-8 pt-24 pb-32">
      <div className="flex flex-col items-start justify-center gap-2">
        <h1 className="text-lg font-bold">This Page</h1>
        <Link
          to="/about"
          className="text-zinc-400 text-sm font-semibold hover:underline hover:text-zinc-100 transition-all"
        >
          About
        </Link>
        <Link
          target="_blank"
          to="https://github.com/mgalihpp/music_player"
          className="text-zinc-400 text-sm font-semibold hover:underline hover:text-zinc-100 transition-all"
        >
          Github
        </Link>
      </div>
      <div className="flex flex-col items-end justify-center">
        <h1>&copy; mgpp</h1>
      </div>
    </footer>
  );
};

export default Footer;
