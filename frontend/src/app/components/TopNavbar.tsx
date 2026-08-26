// app/components/TopNavbar.tsx
'use client';

import React from 'react';
import { LuBell, LuLayoutGrid } from 'react-icons/lu';

const navButtons = [
  { id: 'notifications', icon: LuBell, label: 'Notifications' },
  { id: 'apps', icon: LuLayoutGrid, label: 'Applications' },
];

export default function TopNavbar({ userInitials = 'JD' }: { userInitials?: string }) {
  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-end bg-slate-50/80 px-8 py-4 backdrop-blur-md">
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm">
        {navButtons.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            className="rounded-xl p-2 text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <div className="flex h-8 w-8 cursor-pointer select-none items-center justify-center rounded-xl bg-blue-600 text-xs font-semibold text-white shadow-sm shadow-sm transition-colors hover:bg-blue-700">
          {userInitials}
        </div>
      </div>
    </header>
  );
}