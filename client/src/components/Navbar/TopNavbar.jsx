import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "./DropDownMenu";
import { PropTypes } from "prop-types";

const TopNavbar = ({ children, className }) => {
  const navigate = useNavigate();

  const handleNavigation = (step) => {
    navigate(step);
  };

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-4">
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
  );
};

export default TopNavbar;

TopNavbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
