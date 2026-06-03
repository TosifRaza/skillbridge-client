import { HiSun, HiMoon } from 'react-icons/hi';
import { useDarkMode } from '@/hooks/useDarkMode';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors focus:outline-none"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <HiSun className="w-5 h-5 text-yellow-400 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <HiMoon className="w-5 h-5 text-surface-600 transition-transform duration-300 rotate-0 scale-100" />
      )}
    </button>
  );
};

export default DarkModeToggle;