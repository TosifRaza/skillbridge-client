import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    // 1. Check localStorage first
    const savedTheme = localStorage.getItem('skillbridge_theme');
    if (savedTheme) return savedTheme === 'dark';
    
    // 2. Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('skillbridge_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('skillbridge_theme', 'light');
    }
  }, [isDark]);

  return [isDark, setIsDark];
};