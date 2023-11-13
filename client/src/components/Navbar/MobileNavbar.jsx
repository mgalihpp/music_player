import { Home, Menu, PlusSquare, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

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
    <div className="block sm:hidden">
      <button onClick={toggleMenu}>
        <Menu />
      </button>

      <div
        ref={ref}
        className={`${
          open ? "left-0" : "left-[-200%]"
        } w-[80%] h-screen absolute bg-black z-[999] p-0 m-0 top-0`}
        style={{ transitionDuration: "0.3s" }}
      >
        {navLink("Home", "/", <Home className="w-7 h-7" />)}
        {navLink("Search", "/search", <Search className="w-7 h-7" />)}
        {navLink("Upload", "/upload", <PlusSquare className="w-7 h-7" />)}
      </div>
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

export default MobileNavbar;
