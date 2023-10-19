import { Home, PlusSquare, Search } from "lucide-react";

const Navbar = () => {
  return (
    <>
      <nav className="space-y-6">
        <a
          href=""
          className="flex items-center text-sm text-zinc-200 gap-3 font-semibold"
        >
          <Home /> Home
        </a>
        <a
          href=""
          className="flex items-center text-sm text-zinc-200 gap-3 font-semibold"
        >
          <Search /> Search
        </a>
        <a
          href=""
          className="flex items-center text-sm text-zinc-200 gap-3 font-semibold"
        >
          <PlusSquare /> Create
        </a>
      </nav>

      <hr className="border border-zinc-700 mt-5" />
    </>
  );
};

export default Navbar;
