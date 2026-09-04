"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X, Layers } from "lucide-react";

export default function Drawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full shrink-0 md:hidden">
      {/* Mobile top bar */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground">
              Maanak
            </span>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-black/50 backdrop-blur-xs transition-opacity duration-200"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] bg-card shadow-2xl transition-transform duration-250 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sidebar */}
        <div className="h-[calc(100%-3.5rem)]">
          <Sidebar onNavigate={() => setIsOpen(false)} />
        </div>
      </aside>
    </div>
  );
}