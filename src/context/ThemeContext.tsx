import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultPalette, isValidPalette, availablePalettes } from '@/config/settings-registry';

export type Theme = 'light' | 'dark';
// Derive Palette type from the registry's available palettes
export type Palette = string;
export type Direction = 'ltr' | 'rtl';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  palette: Palette;
  setPalette: (palette: Palette) => void;
  direction: Direction;
  setDirection: (direction: Direction) => void;
  toggleDirection: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  theme: 'admin-theme',
  palette: 'admin-palette',
  direction: 'admin-direction',
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.theme) as Theme;
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [palette, setPaletteState] = useState<Palette>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.palette);
      if (stored && isValidPalette(stored)) return stored;
      return defaultPalette.id;
    }
    return defaultPalette.id;
  });

  const [direction, setDirectionState] = useState<Direction>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(STORAGE_KEYS.direction) as Direction) || 'ltr';
    }
    return 'ltr';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-palette', palette);
    localStorage.setItem(STORAGE_KEYS.palette, palette);
  }, [palette]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('dir', direction);
    localStorage.setItem(STORAGE_KEYS.direction, direction);
  }, [direction]);

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);
  const toggleTheme = () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  const setPalette = (newPalette: Palette) => setPaletteState(newPalette);
  const setDirection = (newDirection: Direction) => setDirectionState(newDirection);
  const toggleDirection = () => setDirectionState((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'));

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        palette,
        setPalette,
        direction,
        setDirection,
        toggleDirection,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
