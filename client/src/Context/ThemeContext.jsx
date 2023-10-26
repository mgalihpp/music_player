import { createContext, useContext, useEffect, useState } from "react";
import { PropTypes } from "prop-types";

export function useTheme() {
  return useContext(ThemeContext);
}

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState("dark");

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) =>
      prevTheme === "gradient" ? "dark" : "gradient"
    );
  };

  useEffect(() => {
    document.documentElement.className = currentTheme;
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
