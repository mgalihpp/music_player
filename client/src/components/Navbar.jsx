import { Home, PlusSquare, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="space-y-4">
        <Link
          title="Home"
          to='/'
          className="flex items-center text-base text-zinc-200 gap-3 font-semibold rounded-md p-3.5 hover:bg-white/5"
        >
          <Home /> Home
        </Link>
        <Link
          title="Search?"
          to='/search'
          className="flex items-center text-base text-zinc-200 gap-3 font-semibold rounded-md p-3.5 hover:bg-white/5"
        >
          <Search /> Search
        </Link>
        <Link
          title="Upload Music?"
          to='/upload'
          className="flex items-center text-base text-zinc-200 gap-3 font-semibold rounded-md p-3.5 hover:bg-white/5"
        >
          <PlusSquare /> Upload
        </Link>
      </nav>

      <hr className="border border-zinc-700 mt-5" />
    </>
  );
};

export default Navbar;
