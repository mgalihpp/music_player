import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "./DropDownMenu";
import { PropTypes } from "prop-types";
import MobileNavbar from "./MobileNavbar";
import Navigation from "react-sticky-nav";
import { useTheme } from "../../Context/ThemeContext";

const TopNavbar = ({ children, className, position }) => {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  const handleNavigation = (step) => {
    navigate(step);
  };

  return (
    <Navigation className="z-[1]">
      <div
        className={`flex items-center justify-between gap-4 z-[1] ${
          position >= 20
            ? `${currentTheme === "dark" ? "bg-zinc-900" : ""} `
            : "transparent"
        } ${className}`}
        style={{
          transition: "background-color 0.3s ease-in-out", // Smooth transition
        }}
      >
        <div className="flex items-center gap-4">
          <MobileNavbar />
          <button
            onClick={() => handleNavigation(-1)}
            title="Go Back"
            className="p-1 rounded-full bg-white/5 hover:bg-white/10"
            aria-label="left"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => handleNavigation(1)}
            title="Go Next"
            className="p-1 rounded-full bg-white/5 hover:bg-white/10"
            aria-label="right"
          >
            <ChevronRight />
          </button>
          {children}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu />
        </div>
      </div>
    </Navigation>
  );
};

export default TopNavbar;

TopNavbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  position: PropTypes.any,
};
