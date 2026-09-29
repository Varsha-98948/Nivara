"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("nivara-theme") as Theme | null;
    if (stored === "dark" || stored === "light") {
      setThemeState(stored);
      applyTheme(stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setThemeState(initial);
      applyTheme(initial);
    }
  }, []);

  const applyTheme = (t: Theme) => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (t === "dark") {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
      } else {
        root.classList.remove("dark");
        root.setAttribute("data-theme", "light");
      }
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("nivara-theme", newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className={`theme-toggle-btn interactive-tap ${className}`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      style={{
        width: 34,
        height: 34,
        borderRadius: 8,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
        cursor: "pointer",
        transition: "all 0.15s ease",
        boxShadow: "var(--shadow-xs)",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
      }}
    >
      {theme === "dark" ? (
        <Sun size={15} strokeWidth={2} />
      ) : (
        <Moon size={15} strokeWidth={2} />
      )}
    </button>
  );
}

