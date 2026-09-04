"use client";

import React from "react";
import { FileText, Sparkles, Send, X } from "lucide-react";

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
  placeholder = "Ask about BIS standards or search by standard number, title, or topic...",
  disabled = false,
}: HeroSearchInputProps) {
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
  };

  return (
    <div
      className={`group relative flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-border bg-card px-4 py-2.5 shadow-xs transition-all duration-200 hover:border-border/80 hover:shadow-md focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 ${
        disabled ? "opacity-75 pointer-events-none" : ""
      }`}
    >
      {/* File Document Icon */}
      <div className="shrink-0 pl-1 text-muted-foreground transition-colors group-focus-within:text-primary">
        <FileText className="h-5 w-5" />
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
      />

      {/* Clear Button (if value exists) */}
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search input"
          className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Trailing AI Badge & Send Button */}
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground select-none">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>AI Search</span>
        </div>

        <button
          type="button"
          onClick={onSearch}
          disabled={disabled || !value.trim()}
          aria-label="Submit Search"
          className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-all duration-150 hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}