'use client';

import React from 'react';
import { IconType } from 'react-icons';

export interface ActionChipProps {
  icon: IconType;
  label: string;
  onClick: () => void;
}

export default function ActionChip({ icon: Icon, label, onClick }: ActionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150 active:scale-[0.98]"
    >
      <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
      <span>{label}</span>
    </button>
  );
}