import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

const styles = {
  segmentLabelFontSize: 20,
  fontSize: 18,
};

const lightTheme = {
  backgroundColor: "#f0f0f0",
  foregroundColor: "#fff",
  fontColor: "#000",
  buttonTextColor: "#007bff",
  ...styles,
};

const darkTheme = {
  backgroundColor: "#121212",
  foregroundColor: "#1C1C1E",
  fontSize: 18,
  fontColor: "#B0B0B0",
  buttonTextColor: "#675e91",
  ...styles,
};

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(darkTheme);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setDarkMode(savedTheme === 'dark');
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    setCurrentTheme(darkMode ? darkTheme : lightTheme);
    saveTheme();
  }, [darkMode]);

  const saveTheme = async () => {
    try {
      await AsyncStorage.setItem('theme', darkMode ? 'dark' : 'light');
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  const hexToRgb = (hex, opacity) => {
    let r = 0, g = 0, b = 0;

    // 3 digits
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 digits
    else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`; // Default opacity is 1
  };

  const value = { darkMode, setDarkMode, currentTheme, hexToRgb };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export { ThemeProvider, ThemeContext };
