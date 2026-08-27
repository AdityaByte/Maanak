// app/components/TopNavbar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  LuBell,
  LuLayoutGrid,
  LuMoon,
  LuSun,
} from 'react-icons/lu';

const navButtons = [
  { id: 'notifications', icon: LuBell, label: 'Notifications' },
  { id: 'apps', icon: LuLayoutGrid, label: 'Applications' },
];

export default function TopNavbar({
  userInitials = 'JD',
}: {
  userInitials?: string;
}) {
  const [isDark, setIsDark] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';

    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);

    document.documentElement.classList.toggle(
      'dark',
      newTheme === 'dark'
    );
  };

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-end bg-slate-50/80 px-8 py-4 backdrop-blur-md dark:bg-slate-900/80">
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">

        {/* Notifications and Apps */}
        {navButtons.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            className="rounded-xl p-2 text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            isDark ? 'Switch to light mode' : 'Switch to dark mode'
          }
          className="rounded-xl p-2 text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          {isDark ? (
            <LuSun className="h-4 w-4" />
          ) : (
            <LuMoon className="h-4 w-4" />
          )}
        </button>

        {/* User Profile */}
        <div className="flex h-8 w-8 cursor-pointer select-none items-center justify-center rounded-xl bg-blue-600 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
          {userInitials}
        </div>
      </div>
    </header>
  );
}