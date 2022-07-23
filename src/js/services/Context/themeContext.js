import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useStore, UseStore } from "./StoreContext";

const getLocalStoredDarkModeValue = () => {
  const themeFromLocalStorage = localStorage.getItem("darkMode");
  return createTheme({
    palette: {
      mode: Number(themeFromLocalStorage) === 1 ? "dark" : "light",
    },
  });
};

const GlobalCustomThemeContext = ({ children }) => {
  const { darkMode } = useStore()[0];
  const [theme, setTheme] = useState(getLocalStoredDarkModeValue());

  useEffect(() => {
    // fix for when u refresh the value resets
    if (darkMode === undefined || darkMode === null) return;
    setTheme(
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      })
    );
    // update the old value in local browser
    localStorage.setItem("darkMode", Number(darkMode));
  }, [darkMode]);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default GlobalCustomThemeContext;
