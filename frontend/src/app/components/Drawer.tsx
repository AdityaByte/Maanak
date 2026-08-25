"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

const MenuIcon = () => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Drawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full shrink-0 md:hidden">
      {/* Mobile top bar */}
      <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-muted"
        >
          <MenuIcon />
        </button>

        <span className="text-sm font-semibold text-foreground">
          Maanak
        </span>
      </header>

      {/* Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-foreground/40"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[272px] max-w-[85vw] bg-card shadow-xl transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex h-12 items-center justify-end border-b border-border px-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Sidebar */}
        <div className="h-[calc(100%-3rem)]">
          <Sidebar onNavigate={() => setIsOpen(false)} />
        </div>
      </aside>
    </div>
  );
}