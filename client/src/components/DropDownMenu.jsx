import { useEffect, useRef, useState } from "react";
import { useTheme } from "../Context/ThemeContext";
import { Palette } from "lucide-react";
import { PropTypes } from "prop-types";

const DropdownMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = useRef(null);
  const { toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        className="relative w-9 h-9 rounded-full hover:scale-105"
        aria-label="Toggle menu"
        title="Messi"
        onClick={toggleMenu}
      >
        <img
          src="/messi.png"
          alt="profile"
          className="object-cover rounded-full w-full h-full"
        />
      </button>
      {isMenuOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-zinc-900 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-0.5 flex flex-col items-end">
            <MenuButton
              title="Switch Theme to Gradient or Dark"
              onClick={toggleTheme}
              label="Switch"
              icon={<Palette className="w-5 h-5" />}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const MenuButton = ({ title, onClick, label, icon }) => (
  <button
    title={title}
    onClick={onClick}
    className="p-2.5 w-full flex items-center justify-center gap-2 rounded-sm bg-zinc-900 hover:bg-white/10"
    aria-label="right"
  >
    {icon}
    {label}
  </button>
);

export default DropdownMenu;

MenuButton.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.any,
  label: PropTypes.any,
  icon: PropTypes.any,
};
