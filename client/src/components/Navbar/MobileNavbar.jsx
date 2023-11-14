import { Home, Library, Menu, Plus, PlusSquare, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const MobileNavbar = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        e.target.tagName !== "BUTTON"
      ) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    // Add or remove 'overflow-hidden' class based on the 'open' state
    const mainElement = document.getElementsByTagName("main")[0];

    if (mainElement) {
      mainElement.style.overflow = open ? "hidden" : "";
    }

    return () => {
      // Remove 'overflow-hidden' style when component is unmounted
      if (mainElement) {
        mainElement.style.overflow = "";
      }
    };
  }, [open]);

  return (
    <div className="block sm:hidden z-[999]">
      <button onClick={toggleMenu}>
        <Menu />
      </button>

      <nav
        ref={ref}
        className={`${
          open ? "left-0" : "left-[-200%]"
        } w-[80%] h-screen absolute bg-black z-[999] p-0 m-0 top-0`}
        style={{ transitionDuration: "0.3s" }}
      >
        {navLink("Home", "/", <Home className="w-7 h-7" />)}
        {navLink("Search", "/search", <Search className="w-7 h-7" />)}
        {navLink("Upload", "/upload", <PlusSquare className="w-7 h-7" />)}
        <div className={`p-1 rounded-t-md bg-black mt-2 `}>
          <div className="flex items-center justify-between text-zinc-400 gap-2 mb-5 ml-1 px-4 py-1">
            {playlistHeader("Create Playlist")}
            {createPlaylistButton()}
          </div>
        </div>
      </nav>
    </div>
  );
};

const navLink = (title, to, icon) => (
  <NavLink
    title={title}
    to={to}
    className={({ isActive, isPending, isTransitioning }) =>
      [
        isPending ? "pending" : "",
        isActive ? "bg-white/5  transition-all ease-in-out duration-300" : "",
        isTransitioning ? "transitioning" : "",
      ].join(
        " flex items-center text-base text-zinc-400 hover:text-zinc-100 gap-4 transition-all ease-in-out duration-300 font-bold rounded-md p-3.5 hover:bg-white/5 "
      )
    }
  >
    {icon} {title}
  </NavLink>
);

const playlistHeader = (title) => (
  <div className="flex items-center justify-center gap-2">
    <Library className="w-7 h-7" />
    <h1 className="text-lg font-bold">{title}</h1>
  </div>
);

const createPlaylistButton = () => (
  <div className="flex items-center justify-center">
    <Link
      to="/playlist/create"
      aria-label="Create"
      className="rounded-full bg-white/5 group p-2"
      title="Create a Playlist?"
    >
      <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white transition-all ease-in-out" />
    </Link>
  </div>
);

export default MobileNavbar;
