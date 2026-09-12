import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState, useRef, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-xl bg-card/70 backdrop-blur-md border border-glass-border flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm transition-all hover:bg-card"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Sun className="w-4 h-4" />
        ) : theme === "dark" ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Monitor className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl bg-card/90 backdrop-blur-xl border border-glass-border shadow-lg overflow-hidden z-50 flex flex-col py-1">
          <button
            onClick={() => {
              setTheme("light");
              setIsOpen(false);
            }}
            className={`flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors hover:bg-muted ${
              theme === "light" ? "text-primary font-medium bg-muted/50" : "text-muted-foreground"
            }`}
          >
            <Sun className="w-4 h-4" /> Light
          </button>
          <button
            onClick={() => {
              setTheme("dark");
              setIsOpen(false);
            }}
            className={`flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors hover:bg-muted ${
              theme === "dark" ? "text-primary font-medium bg-muted/50" : "text-muted-foreground"
            }`}
          >
            <Moon className="w-4 h-4" /> Dark
          </button>
          <button
            onClick={() => {
              setTheme("system");
              setIsOpen(false);
            }}
            className={`flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors hover:bg-muted ${
              theme === "system" ? "text-primary font-medium bg-muted/50" : "text-muted-foreground"
            }`}
          >
            <Monitor className="w-4 h-4" /> System
          </button>
        </div>
      )}
    </div>
  );
}
