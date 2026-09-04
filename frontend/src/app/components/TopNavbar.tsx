// app/components/TopNavbar.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Bell, LayoutGrid, Moon, Sun } from "lucide-react";

const navButtons = [
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "apps", icon: LayoutGrid, label: "Applications" },
];

export default function TopNavbar({
  userInitials = "JD",
}: {
  userInitials?: string;
}) {
  const [isDark, setIsDark] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";

    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);

    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-end border-b border-border/60 bg-background/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-card p-1 shadow-xs">
        {/* Notifications and Apps */}
        {navButtons.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            className="flex h-8.5 w-8.5 items-center justify-center rounded-xl text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            isDark ? "Switch to light mode" : "Switch to dark mode"
          }
          className="flex h-8.5 w-8.5 items-center justify-center rounded-xl text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600" />
          )}
        </button>

        <div className="h-4 w-px bg-border mx-0.5" />

        {/* User Profile */}
        <div
          title={`User: ${userInitials}`}
          className="flex h-8 w-8 cursor-pointer select-none items-center justify-center rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-xs transition-all duration-150 hover:opacity-90 active:scale-95"
        >
          {userInitials}
        </div>
      </div>
    </header>
  );
}