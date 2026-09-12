import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative flex items-center h-9 px-3 rounded-xl border transition-all duration-200 select-none shadow-sm group focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/40 ${
        isDark 
          ? 'bg-[#11141A] hover:bg-[#1B2028] border-[#323A46] text-[#DFE6EF]' 
          : 'bg-[#FFFFFF] hover:bg-[#F1F5F9] border-[#CBD5E1] text-[#0F172A] shadow-inner'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode (White)' : 'Switch to Dark Mode (Black)'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      role="switch"
      aria-checked={!isDark}
    >
      <div className="flex items-center gap-2">
        <div className="relative w-4 h-4 flex items-center justify-center">
          {isDark ? (
            <Sun 
              className="w-4 h-4 text-[#F59E0B] group-hover:rotate-45 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
            />
          ) : (
            <Moon 
              className="w-4 h-4 text-[#0284C7] group-hover:-rotate-12 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(2,132,199,0.3)]" 
            />
          )}
        </div>
        <span className="text-xs font-bold font-heading tracking-wide">
          {isDark ? 'Light' : 'Dark'}
        </span>
      </div>
    </button>
  );
}

