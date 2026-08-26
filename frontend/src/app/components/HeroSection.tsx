'use client';

import React, { useState } from 'react';
import { LuSearch, LuUpload, LuGitCompare, LuLayoutGrid } from 'react-icons/lu';
import HeroSearchInput from './HeroSearchInput';
import ActionChip from './ActionChip';

interface ActionItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ACTION_ITEMS: ActionItem[] = [
  { id: 'search', label: 'Search Standards', icon: LuSearch },
  { id: 'upload', label: 'Upload a Document', icon: LuUpload },
  { id: 'compare', label: 'Compare Standards', icon: LuGitCompare },
  { id: 'categories', label: 'Explore Categories', icon: LuLayoutGrid },
];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleAction = (id: string) => {
    console.log('Action selected:', id);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  return (
    <section className="flex flex-col items-center justify-center pt-8 pb-10 px-4 text-center">
      {/* Brand Icon Box */}
      <div className="w-12 h-12 mb-3 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold shadow-sm">
        <span className="tracking-tighter text-lg leading-none">||||</span>
      </div>

      {/* Titles */}
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
        Maanak
      </h1>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
        AI POWERED BIS RECOMMENDATION ENGINE
      </p>
      <p className="text-sm text-slate-600 font-normal mb-8">
        Smarter Search. Accurate Standards. Better Decisions.
      </p>

      {/* Input Component */}
      <div className="w-full flex justify-center mb-6">
        <HeroSearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
        />
      </div>

      {/* Action Chips using .map() and Props */}
      <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl">
        {ACTION_ITEMS.map((item) => (
          <ActionChip
            key={item.id}
            icon={item.icon}
            label={item.label}
            onClick={() => handleAction(item.id)}
          />
        ))}
      </div>
    </section>
  );
}