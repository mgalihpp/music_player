import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../Context/ThemeContext";
import { LogOut, Palette, User2 } from "lucide-react";
import { PropTypes } from "prop-types";
import { useAuth } from "../../Context/AuthContext";

const DropdownMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = useRef(null);
  const { toggleTheme } = useTheme();
  const { setUser } = useAuth();

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
        title="Toggle"
        onClick={toggleMenu}
      >
        <User2
          alt="profile"
          className="object-cover rounded-full w-full h-full bg-zinc-800 p-0.5"
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
          <div>
            <MenuButton
              title="Logout"
              onClick={() => {
                setUser(false);
                localStorage.clear("user_id");
                window.location.reload();
              }}
              label="Logout"
              icon={<LogOut className="w-5 h-5" />}
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
    className="p-2.5 w-full text-zinc-200 font-normal flex items-center justify-center gap-2 rounded-sm bg-zinc-900 hover:bg-white/10"
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
