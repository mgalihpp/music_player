import { createContext, useContext, useState } from "react";
import { PropTypes } from "prop-types";

export function useTheme() {
  return useContext(ThemeContext);
}

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [view, setView] = useState(false);

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) =>
      prevTheme === "gradient" ? "dark" : "gradient"
    );
  };

  const toggleView = () => {
    setView((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{ currentTheme, toggleTheme, view, toggleView }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
