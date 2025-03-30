import React, { createContext, useContext, useState } from 'react';
import { Appearance } from 'react-native';

type Theme = {
  background: string;
  text: string;
  buttonBackground: string;
  buttonText: string;
  modalBackground: string;
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const lightTheme: Theme = {
  background: '#FFFFFF',
  text: '#000000',
  buttonBackground: '#007AFF',
  buttonText: '#FFFFFF',
  modalBackground: '#F2F2F2',
};

const darkTheme: Theme = {
  background: '#1E1E1E',
  text: '#FFFFFF',
  buttonBackground: '#4B4B4B',
  buttonText: '#FFFFFF',
  modalBackground: '#2E2E2E',
};