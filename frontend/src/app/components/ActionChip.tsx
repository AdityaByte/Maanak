"use client";

import React from "react";
import { motion } from "framer-motion";

export interface ActionChipProps {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  badge?: string;
}

export default function ActionChip({
  icon: Icon,
  label,
  onClick,
  badge,
}: ActionChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="group relative inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-medium text-foreground/85 shadow-2xs hover:border-primary/50 hover:bg-card/90 hover:text-foreground hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors"
    >
      {Icon && (
        <Icon className="h-3.5 w-3.5 text-primary transition-transform group-hover:scale-110" />
      )}
      <span className="truncate">{label}</span>
      {badge && (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          {badge}
        </span>
      )}
    </motion.button>
  );
}