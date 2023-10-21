import { Home, PlusSquare, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="space-y-6">
        <Link
          to='/'
          className="flex items-center text-sm text-zinc-200 gap-3 font-semibold"
        >
          <Home /> Home
        </Link>
        <Link
          to='/search'
          className="flex items-center text-sm text-zinc-200 gap-3 font-semibold"
        >
          <Search /> Search
        </Link>
        <Link
          to='/upload'
          className="flex items-center text-sm text-zinc-200 gap-3 font-semibold"
        >
          <PlusSquare /> Create
        </Link>
      </nav>

      <hr className="border border-zinc-700 mt-5" />
    </>
  );
};

export default Navbar;
