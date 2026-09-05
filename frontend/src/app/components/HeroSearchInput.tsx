"use client";

import React, { useRef } from "react";
import { Search, Sparkles, ArrowRight, X, Command } from "lucide-react";
import { motion } from "framer-motion";

export interface HeroSearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function HeroSearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "Ask about Indian Standards (e.g., 'IS 1786 steel bar clauses', 'drinking water HDPE pipe specs')...",
  disabled = false,
}: HeroSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      onSearch();
    }
  };

  const handleClear = () => {
    const syntheticEvent = {
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    inputRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`group relative w-full max-w-3xl rounded-2xl p-[1px] bg-gradient-to-b from-border/90 via-border/50 to-primary/20 shadow-lg hover:shadow-xl hover:from-primary/40 hover:to-primary/30 transition-all duration-300 ${
        disabled ? "opacity-75 pointer-events-none" : ""
      }`}
    >
      <div className="relative flex w-full items-center gap-2.5 sm:gap-3 rounded-[15px] bg-card/85 dark:bg-card/75 backdrop-blur-xl px-3.5 py-2.5 sm:px-4 sm:py-3 transition-all">
        {/* Search Icon with subtle animated pulse */}
        <div className="shrink-0 text-muted-foreground transition-colors group-focus-within:text-primary pl-0.5">
          <Search className="h-5 w-5" />
        </div>

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs sm:text-sm md:text-base font-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />

        {/* Clear Button */}
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear input"
            className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Keyboard shortcut hint (hidden on small mobile) */}
        {!value && (
          <div className="hidden sm:flex items-center gap-1 rounded-md border border-border/80 bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground select-none">
            <span className="font-mono">Enter</span>
            <span className="text-xs">↵</span>
          </div>
        )}

        {/* AI Action Submit Button */}
        <motion.button
          type="button"
          onClick={onSearch}
          disabled={disabled || !value.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Submit Search"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 sm:px-4 sm:py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none disabled:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search</span>
          <ArrowRight className="h-3.5 w-3.5 hidden sm:inline" />
        </motion.button>
      </div>
    </motion.div>
  );
}