import { HiSun, HiMoon } from 'react-icons/hi';
import { useDarkMode } from '@/hooks/useDarkMode';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <button
      type="button"
      onClick={() => setIsDark(!isDark)}
      className="inline-flex min-h-10 items-center gap-2 rounded-full px-2.5 text-slate-500 transition hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-slate-300 dark:hover:bg-slate-700"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
    >
      <HiSun className={`h-[18px] w-[18px] ${isDark ? 'text-slate-400' : 'text-amber-500'}`} aria-hidden="true" />
      <span className={`relative inline-flex h-[28px] w-[52px] items-center rounded-full p-[3px] transition-colors ${isDark ? 'justify-end bg-violet-600' : 'justify-start bg-slate-200 dark:bg-slate-600'}`} aria-hidden="true">
        <span className={`flex h-[22px] w-[22px] items-center justify-center rounded-full shadow-sm transition-colors ${isDark ? 'bg-violet-500 text-white' : 'bg-white text-slate-500'}`}>
          {isDark ? <HiMoon className="h-4 w-4" /> : <HiSun className="h-4 w-4" />}
        </span>
      </span>
    </button>
  );
};

export default DarkModeToggle;
