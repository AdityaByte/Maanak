"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import Sidebar from "./Sidebar";

export default function Drawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full shrink-0 md:hidden">
      {/* ── Mobile top bar ─────────────────────────────────────────────────────── */}
      <header className="relative flex h-14 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-2xl px-4">
        {/* Top shimmer line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="flex items-center gap-3">
          {/* Hamburger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-foreground hover:bg-muted transition-colors"
          >
            <Menu className="h-4 w-4" />
          </motion.button>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="relative p-1.5 rounded-xl bg-gradient-to-br from-primary/10 to-sky-500/10 border border-primary/20">
              <Image
                src="/logo.svg"
                alt="Maanak Logo"
                width={24}
                height={24}
                className="h-6 w-6 shrink-0 object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold tracking-tight text-foreground">
                Maanak
              </span>
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                BIS
              </span>
            </div>
          </div>
        </div>

        {/* AI badge on far right */}
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-primary/10 to-sky-500/10 text-primary border border-primary/20">
          <Sparkles className="h-2.5 w-2.5" />
          AI Powered
        </span>
      </header>

      {/* ── Overlay ─────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="button"
            tabIndex={0}
            aria-label="Close navigation menu"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* ── Slide-in Drawer ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className="fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] shadow-2xl"
          >
            {/* Drawer header */}
            <div className="relative flex h-14 items-center justify-between border-b border-border/50 bg-card/90 dark:bg-[#0b1120]/90 backdrop-blur-2xl px-4">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Navigation
              </span>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Sidebar content */}
            <div className="h-[calc(100%-3.5rem)] overflow-hidden">
              <Sidebar onNavigate={() => setIsOpen(false)} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}