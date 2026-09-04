"use client";

import React from "react";

export interface ActionChipProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}

export default function ActionChip({
  icon: Icon,
  label,
  onClick,
}: ActionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs sm:text-sm font-medium text-foreground/80 shadow-2xs transition-all duration-150 hover:bg-muted hover:text-foreground hover:border-border/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <Icon className="h-3.5 w-3.5 text-muted-foreground transition-colors" />
      <span>{label}</span>
    </button>
  );
}