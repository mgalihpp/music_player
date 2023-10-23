import { useEffect } from "react";
import { useTheme } from "./Context/ThemeContext";
import Main from "./components/Main";

function App() {
  const { currentTheme } = useTheme();

  useEffect(() => {
    document.documentElement.className = currentTheme;
  }, [currentTheme]);

  return (
    <div className="p-6">
      <Main />
    </div>
  );
}

export default App;
