'use client';

import React, { useState } from 'react';
import HeroSearchInput from './HeroSearchInput';
import ActionChip from './ActionChip';
import { LuSearch, LuUpload, LuGitCompare, LuLayoutGrid } from 'react-icons/lu';

const ACTION_ITEMS = [
  { id: 'search', label: 'Search Standards', icon: LuSearch },
  { id: 'upload', label: 'Upload a Document', icon: LuUpload },
  { id: 'compare', label: 'Compare Standards', icon: LuGitCompare },
  { id: 'categories', label: 'Explore Categories', icon: LuLayoutGrid },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/query';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!res.ok) throw new Error(`Status: ${res.status}`);

      const data = await res.json();
      console.log('Search response data:', data);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Error communicating with backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center pt-8 pb-10 px-4 text-center">
      <div className="w-12 h-12 mb-3 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold shadow-sm">
        <span className="tracking-tighter text-lg leading-none">||||</span>
      </div>

      <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Maanak</h1>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
        AI POWERED BIS RECOMMENDATION ENGINE
      </p>
      <p className="text-sm text-muted-foreground font-normal mb-8">
        Smarter Search. Accurate Standards. Better Decisions.
      </p>

      <div className="w-full flex justify-center mb-6">
        <HeroSearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
          disabled={loading}
        />
      </div>

      {loading && <p className="text-sm text-blue-600 animate-pulse mb-3">Searching standards...</p>}
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl">
        {ACTION_ITEMS.map((item) => (
          <ActionChip key={item.id} icon={item.icon} label={item.label} />
        ))}
      </div>
    </section>
  );
}