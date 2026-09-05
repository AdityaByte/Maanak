"use client";

import React, { useState } from "react";
import Image from "next/image";
import HeroSearchInput from "./HeroSearchInput";
import ActionChip from "./ActionChip";
import SuggestedStandard, { SuggestedStandardData } from "./SuggestedStandard";
import {
  Search,
  UploadCloud,
  GitCompare,
  LayoutGrid,
  AlertCircle,
  RotateCw,
} from "lucide-react";

const ACTION_ITEMS = [
  { id: "search", label: "Search Standards", icon: Search },
  { id: "upload", label: "Upload a Document", icon: UploadCloud },
  { id: "compare", label: "Compare Standards", icon: GitCompare },
  { id: "categories", label: "Explore Categories", icon: LayoutGrid },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SuggestedStandardData | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/query/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!res.ok) throw new Error(`Status: ${res.status}`);

      const data: SuggestedStandardData = await res.json();
      console.log("Search response data:", data);

       // Store the search result in localStorage 
       // Get previously stored searches
    const storedSearches = localStorage.getItem("searchResults");

    let searchHistory: {
      query: string;
      response: SuggestedStandardData;
      searchedAt: string;
    }[] = [];

    try {
      const parsed = storedSearches
        ? JSON.parse(storedSearches)
        : [];

      if (Array.isArray(parsed)) {
        searchHistory = parsed;
      }
    } catch (error) {
      console.error("Failed to parse stored search results:", error);
    }

    // Add newest search at the beginning
    searchHistory.unshift({
      query: searchQuery.trim(),
      response: data,
      searchedAt: new Date().toISOString(),
    });

    // Save search history
    localStorage.setItem(
      "searchResults",
      JSON.stringify(searchHistory)
    );
      
       setResult(data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Error communicating with backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center pt-6 pb-8 px-4 text-center">
      {/* Brand Emblem */}
      <div className="mb-4 flex items-center justify-center">
        <Image
          src="/logo.svg"
          alt="Maanak Logo"
          width={84}
          height={84}
          className="h-20 w-20 sm:h-22 sm:w-22 object-contain transition-transform duration-300 hover:scale-105"
          priority
        />
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-1.5">
        Maanak
      </h1>
      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
        AI POWERED BIS RECOMMENDATION ENGINE
      </p>
      <p className="text-sm sm:text-base text-muted-foreground font-normal mb-8 max-w-md">
        Smarter Search. Accurate Standards. Better Decisions.
      </p>

      {/* Search Input */}
      <div className="w-full flex justify-center mb-6">
        <HeroSearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
          disabled={loading}
        />
      </div>

      {/* Action Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mb-6">
        {ACTION_ITEMS.map((item) => (
          <ActionChip
            key={item.id}
            icon={item.icon}
            label={item.label}
            onClick={() => setSearchQuery(item.label)}
          />
        ))}
      </div>

      {/* Error Feedback with Retry */}
      {error && (
        <div className="my-4 flex w-full max-w-2xl items-center justify-between gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-left shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <p className="text-xs sm:text-sm font-medium text-rose-700 dark:text-rose-300 truncate">
              {error}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-rose-700 active:scale-95 transition-all"
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Suggested Standard Output */}
      <div className="w-full flex justify-center">
        <SuggestedStandard data={result} loading={loading} />
      </div>
    </section>
  );
}