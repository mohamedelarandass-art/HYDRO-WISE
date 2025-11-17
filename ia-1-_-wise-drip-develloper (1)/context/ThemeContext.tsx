import React, { createContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { themes, Theme } from '../data/themes';

type ThemeContextType = {
  themeName: string;
  setThemeName: (name: string) => void;
  currentTheme: Theme;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<string>(() => {
    try {
      const savedTheme = window.localStorage.getItem('theme');
      return savedTheme && themes[savedTheme] ? savedTheme : 'blueberry';
    } catch (error) {
      console.error("Could not read theme from localStorage", error);
      return 'blueberry';
    }
  });

  useEffect(() => {
    const theme = themes[themeName];
    if (theme) {
      const root = document.documentElement;
      Object.entries(theme.palette).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      try {
        window.localStorage.setItem('theme', themeName);
      } catch (error) {
        console.error("Could not save theme to localStorage", error);
      }
    }
  }, [themeName]);

  const value = useMemo(() => ({
    themeName,
    setThemeName,
    currentTheme: themes[themeName],
  }), [themeName]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
