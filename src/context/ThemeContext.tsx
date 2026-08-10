import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '../types';
import { ORIGINAL_THEMES, getThemeById } from '../lib/themes';

interface ThemeContextType {
  activeTheme: Theme;
  setThemeById: (id: string) => void;
  updateCustomTheme: (theme: Theme) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themes, setThemes] = useState<Theme[]>(ORIGINAL_THEMES);
  const [activeTheme, setActiveTheme] = useState<Theme>(ORIGINAL_THEMES[0]);

  useEffect(() => {
    const savedThemeId = localStorage.getItem('gitforge_theme_id');
    if (savedThemeId) {
      const found = themes.find((t) => t.id === savedThemeId);
      if (found) setActiveTheme(found);
    }
  }, []);

  const setThemeById = (id: string) => {
    const found = getThemeById(id);
    setActiveTheme(found);
    localStorage.setItem('gitforge_theme_id', found.id);
  };

  const updateCustomTheme = (customTheme: Theme) => {
    setActiveTheme(customTheme);
    setThemes((prev) => {
      const idx = prev.findIndex((t) => t.id === customTheme.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = customTheme;
        return next;
      }
      return [customTheme, ...prev];
    });
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, setThemeById, updateCustomTheme, themes }}>
      <div
        style={{
          backgroundColor: activeTheme.bg,
          color: activeTheme.text,
          minHeight: '100vh',
          fontFamily: activeTheme.font,
        }}
        className="transition-colors duration-300 antialiased"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
