"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import HeroSearchInput from "./HeroSearchInput";
import ActionChip from "./ActionChip";
import SuggestedStandard, { SuggestedStandardData } from "./SuggestedStandard";
import {
  Search,
  Sparkles,
  ShieldCheck,
  Building2,
  FileCheck2,
  Layers,
  AlertCircle,
  RotateCw,
  Zap,
  Flame,
} from "lucide-react";

const SUGGESTED_QUERIES = [
  { id: "steel", label: "IS 1786 TMT Steel Rebar", icon: Zap, badge: "MTD" },
  { id: "concrete", label: "IS 456 Concrete Clauses", icon: Building2, badge: "CED" },
  { id: "pipes", label: "IS 4984 HDPE Water Pipes", icon: ShieldCheck, badge: "CED" },
  { id: "electronics", label: "IS 13252 IT Safety (CRS)", icon: Sparkles, badge: "LITD" },
  { id: "qco", label: "Mandatory Quality Control Orders", icon: FileCheck2, badge: "QCO" },
];

const METRICS_BAR = [
  { label: "15,000+ Active Standards", desc: "Formulated & Reaffirmed" },
  { label: "12 Technical Divisions", desc: "CED, ETD, CHD, TXD & more" },
  { label: "Neural RAG Search", desc: "Exact Clause & Table Match" },
  { label: "Mandatory QCO Tracker", desc: "Scheme I (ISI) & Scheme II (CRS)" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SuggestedStandardData | null>(null);

  const executeSearch = async (queryToSearch?: string) => {
    const query = (queryToSearch !== undefined ? queryToSearch : searchQuery).trim();
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/query/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error(`Status: ${res.status}`);

      const data: SuggestedStandardData = await res.json();

      // Store in localStorage history
      const storedSearches = localStorage.getItem("searchResults");
      let searchHistory: {
        query: string;
        response: SuggestedStandardData;
        searchedAt: string;
      }[] = [];

      try {
        const parsed = storedSearches ? JSON.parse(storedSearches) : [];
        if (Array.isArray(parsed)) {
          searchHistory = parsed;
        }
      } catch (err) {
        console.error("Failed to parse stored search history:", err);
      }

      searchHistory.unshift({
        query,
        response: data,
        searchedAt: new Date().toISOString(),
      });

      localStorage.setItem("searchResults", JSON.stringify(searchHistory.slice(0, 20)));
      setResult(data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Unable to retrieve standard specifications from backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (label: string) => {
    setSearchQuery(label);
    executeSearch(label);
  };

  return (
    <section className="relative flex flex-col items-center justify-center pt-8 pb-12 px-4 text-center overflow-hidden">
      {/* Background Atmosphere & Radial Glow Grid */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        {/* Subtle dot matrix grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)]" />
        
        {/* Floating Ambient Color Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[280px] bg-primary/15 dark:bg-primary/20 rounded-full blur-[110px]" />
        <div className="absolute top-28 right-1/4 w-[280px] h-[180px] bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-[90px]" />
        <div className="absolute top-28 left-1/4 w-[280px] h-[180px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[90px]" />
      </div>

      {/* Top Animated Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-card/60 dark:bg-card/40 backdrop-blur-xl shadow-xs mb-6 select-none"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-semibold text-foreground/90">
          Bureau of Indian Standards (BIS) Intelligence
        </span>
        <span className="text-border">|</span>
        <span className="text-xs font-medium text-primary flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          <span>AI Engine</span>
        </span>
      </motion.div>

      {/* Main Hero Emblem & Titles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4 max-w-4xl mx-auto"
      >
        {/* Logo Emblem */}
        <div className="flex justify-center mb-2">
          <div className="relative p-2.5 rounded-3xl bg-card/70 dark:bg-card/40 border border-border/80 backdrop-blur-xl shadow-sm hover:border-primary/40 transition-all duration-300">
            <Image
              src="/logo.svg"
              alt="Maanak Logo"
              width={72}
              height={72}
              className="h-16 w-16 sm:h-18 sm:w-18 object-contain transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          Smarter Search. Accurate Standards.{" "}
          <span className="bg-gradient-to-r from-primary via-sky-500 to-primary bg-clip-text text-transparent">
            Better Decisions.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-normal max-w-2xl mx-auto leading-relaxed">
          Explore over 15,000+ Indian Standards (IS), decode mandatory Quality Control Orders (QCO), and query verified clauses with neural AI recommendations.
        </p>
      </motion.div>

      {/* Glassmorphic Search Bar */}
      <div className="w-full flex justify-center mt-8 mb-6 z-10">
        <HeroSearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={() => executeSearch()}
          disabled={loading}
        />
      </div>

      {/* Suggested Query Action Chips */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-3xl mb-10 z-10"
      >
        <span className="text-[11px] font-semibold text-muted-foreground/80 mr-1 hidden sm:inline">
          Popular Queries:
        </span>
        {SUGGESTED_QUERIES.map((item) => (
          <ActionChip
            key={item.id}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            onClick={() => handleChipClick(item.label)}
          />
        ))}
      </motion.div>

      {/* Antigravity HUD Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-3xl border border-border/80 bg-card/40 dark:bg-card/30 backdrop-blur-xl shadow-xs text-left mb-6"
      >
        {METRICS_BAR.map((metric, i) => (
          <div
            key={i}
            className="p-3 sm:p-3.5 rounded-2xl bg-card/60 dark:bg-card/40 border border-border/60 hover:border-primary/40 transition-colors space-y-1"
          >
            <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
              {metric.label}
            </h4>
            <p className="text-[11px] text-muted-foreground truncate">
              {metric.desc}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Error Feedback with Retry */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="my-4 flex w-full max-w-2xl items-center justify-between gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-left shadow-xs overflow-hidden"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
              <p className="text-xs sm:text-sm font-medium text-rose-700 dark:text-rose-300 truncate">
                {error}
              </p>
            </div>
            <button
              type="button"
              onClick={() => executeSearch()}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-rose-700 active:scale-95 transition-all"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggested Standard Output Container */}
      <AnimatePresence>
        {(loading || result) && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.4 }}
            className="w-full flex justify-center mt-2 z-20"
          >
            <SuggestedStandard data={result} loading={loading} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}