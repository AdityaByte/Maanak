'use client';

import React from 'react';
import { LuFileText, LuSparkles, LuSend } from 'react-icons/lu';

interface HeroSearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  placeholder?: string;
}

export default function HeroSearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Ask about BIS standards or search by standard number, title, or topic...',
}: HeroSearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow px-4 py-2 flex items-center gap-3">
      {/* File Document Icon */}
      <div className="text-slate-400 pl-1 shrink-0">
        <LuFileText className="w-5 h-5" />
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
      />

      {/* Trailing AI Badge & Send Button */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg select-none">
          <LuSparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>AI Search</span>
        </div>

        <button
          type="button"
          onClick={onSearch}
          aria-label="Submit Search"
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-150 shadow-sm flex items-center justify-center"
        >
          <LuSend className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}