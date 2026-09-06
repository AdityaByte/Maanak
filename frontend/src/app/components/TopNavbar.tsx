// app/components/TopNavbar.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Sun,
  Moon,
  Search,
  ChevronRight,
  LayoutDashboard,
  SearchIcon,
  Grid2X2,
  BotMessageSquare,
  History,
  Settings,
  HelpCircle,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
  User,
  LogOut,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";

// ─── Page meta map ────────────────────────────────────────────────────────────
const PAGE_META: Record<string, { label: string; icon: React.ElementType; description: string }> = {
  "/": { label: "Dashboard", icon: LayoutDashboard, description: "Overview & insights" },
  "/standard-search": { label: "Standards Search", icon: SearchIcon, description: "Discover BIS standards" },
  "/all-categories": { label: "All Categories", icon: Grid2X2, description: "Browse by category" },
  "/ai": { label: "AI Assistant", icon: BotMessageSquare, description: "Neural compliance advisor" },
  "/old-standards": { label: "Old Standards", icon: History, description: "Archived & superseded" },
  "/settings": { label: "Settings", icon: Settings, description: "Preferences & configuration" },
  "/help": { label: "Help & Docs", icon: HelpCircle, description: "Guides & documentation" },
};

// ─── Sample notifications ─────────────────────────────────────────────────────
const NOTIFICATIONS = [
  {
    id: "n1",
    type: "info" as const,
    title: "Catalog Sync Complete",
    body: "15,432 BIS standards updated in the neural index.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "success" as const,
    title: "AI Model Ready",
    body: "Recommendation engine upgraded to v2.4 — enhanced clause citations.",
    time: "18 min ago",
    read: false,
  },
  {
    id: "n3",
    type: "alert" as const,
    title: "3 Standards Superseded",
    body: "IS 1367, IS 2062, IS 808 have updated revisions available.",
    time: "1 hr ago",
    read: true,
  },
  {
    id: "n4",
    type: "info" as const,
    title: "New Categories Added",
    body: "Electronics & Energy sectors expanded with 240+ new standards.",
    time: "3 hrs ago",
    read: true,
  },
];

const NOTIF_ICON = {
  info: <Info className="h-3.5 w-3.5 text-sky-400" />,
  success: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
  alert: <AlertCircle className="h-3.5 w-3.5 text-amber-400" />,
};

const NOTIF_BG = {
  info: "bg-sky-500/10 border-sky-500/20",
  success: "bg-emerald-500/10 border-emerald-500/20",
  alert: "bg-amber-500/10 border-amber-500/20",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function TopNavbar({ userInitials = "JD" }: { userInitials?: string }) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter((n) => !n.read).length;

  // Find best-matching page meta
  const pageMeta = (() => {
    if (PAGE_META[pathname]) return PAGE_META[pathname];
    const match = Object.entries(PAGE_META)
      .filter(([key]) => key !== "/" && pathname.startsWith(key))
      .sort((a, b) => b[0].length - a[0].length)[0];
    return match ? match[1] : { label: "Maanak", icon: LayoutDashboard, description: "BIS Recommendation Engine" };
  })();

  const PageIcon = pageMeta.icon;

  // ── Theme ──
  useEffect(() => {
    const applyTheme = () => {
      const saved = localStorage.getItem("theme");
      const dark =
        saved === "dark" ||
        (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches) ||
        (saved === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", dark);
      setIsDark(dark);
    };
    applyTheme();
    const onThemeChange = (e: Event) => {
      const theme = (e as CustomEvent)?.detail?.theme ?? localStorage.getItem("theme");
      if (theme === "dark") { document.documentElement.classList.add("dark"); setIsDark(true); }
      else if (theme === "light") { document.documentElement.classList.remove("dark"); setIsDark(false); }
      else { const p = window.matchMedia("(prefers-color-scheme: dark)").matches; document.documentElement.classList.toggle("dark", p); setIsDark(p); }
    };
    window.addEventListener("maanak-theme-change", onThemeChange);
    window.addEventListener("storage", applyTheme);
    return () => { window.removeEventListener("maanak-theme-change", onThemeChange); window.removeEventListener("storage", applyTheme); };
  }, []);

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setIsDark(!isDark);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    window.dispatchEvent(new CustomEvent("maanak-theme-change", { detail: { theme: next } }));
  };

  // ── Close on outside click ──
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const popoverVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 380, damping: 28 } },
    exit: { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.15 } },
  };

  return (
    <header className="sticky top-0 z-30 w-full">
      {/* Glass bar */}
      <div className="relative flex h-[60px] items-center justify-between border-b border-border/50 bg-background/70 px-5 backdrop-blur-2xl">

        {/* Subtle animated top-line shimmer */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-60" />

        {/* ── LEFT: Page identity ── */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Breadcrumb chip */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground/40 tracking-wide uppercase text-[10px]">Maanak</span>
            <ChevronRight className="h-3 w-3 opacity-40" />
          </div>

          {/* Page name pill */}
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center gap-2"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-sm">
              <PageIcon className="h-3.5 w-3.5 text-primary" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground leading-none">{pageMeta.label}</p>
              <p className="hidden sm:block text-[10px] text-muted-foreground mt-0.5 truncate">{pageMeta.description}</p>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: Action cluster ── */}
        <div className="flex items-center gap-1.5">

          {/* Search trigger */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            aria-label="Quick search"
            className="hidden sm:flex items-center gap-2 h-8 rounded-xl border border-border/70 bg-muted/60 px-3 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search…</span>
            <kbd className="ml-1 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground/80">⌘K</kbd>
          </motion.button>

          {/* Icon pill */}
          <div className="flex items-center gap-0.5 rounded-2xl border border-border/60 bg-card/70 dark:bg-card/50 backdrop-blur-md p-1 shadow-sm">

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                type="button"
                id="notif-toggle"
                aria-label="Notifications"
                onClick={() => { setShowNotif((v) => !v); setShowProfile(false); }}
                className="relative flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Bell className="h-4 w-4" />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white ring-1 ring-background"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Notification popover */}
              <AnimatePresence>
                {showNotif && (
                  <motion.div
                    variants={popoverVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 top-[calc(100%+10px)] w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border/70 bg-card/90 shadow-2xl backdrop-blur-2xl overflow-hidden z-50"
                    style={{ transformOrigin: "top right" }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Bell className="h-3.5 w-3.5 text-primary" />
                        <span className="text-sm font-bold">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">{unreadCount} new</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-[11px] text-primary hover:underline">Mark all read</button>
                        )}
                        <button onClick={() => setShowNotif(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Notification list */}
                    <ul className="max-h-[320px] overflow-y-auto divide-y divide-border/40 scrollbar-hide">
                      {notifs.map((n) => (
                        <li
                          key={n.id}
                          className={`flex gap-3 px-4 py-3 text-xs transition-colors hover:bg-muted/40 ${!n.read ? "bg-primary/[0.03]" : ""}`}
                        >
                          <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border ${NOTIF_BG[n.type]}`}>
                            {NOTIF_ICON[n.type]}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className={`font-semibold truncate ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                            <p className="mt-0.5 text-muted-foreground leading-snug line-clamp-2">{n.body}</p>
                            <p className="mt-1 text-muted-foreground/60">{n.time}</p>
                          </div>
                          {!n.read && (
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          )}
                        </li>
                      ))}
                    </ul>

                    {/* Footer */}
                    <div className="border-t border-border/60 px-4 py-2.5 text-center">
                      <button className="text-xs text-primary hover:underline">View all activity</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDark ? "sun" : "moon"}
                  initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* Divider */}
            <div className="h-4 w-px bg-border/80 mx-0.5" />

            {/* User avatar + profile popover */}
            <div ref={profileRef} className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                id="profile-toggle"
                aria-label="User profile"
                onClick={() => { setShowProfile((v) => !v); setShowNotif(false); }}
                className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-500 text-[11px] font-bold text-white shadow-sm ring-2 ring-transparent hover:ring-primary/30 transition-all duration-200"
              >
                {userInitials}
                {/* Online dot */}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
              </motion.button>

              {/* Profile popover */}
              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    variants={popoverVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 top-[calc(100%+10px)] w-[220px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border/70 bg-card/90 shadow-2xl backdrop-blur-2xl overflow-hidden z-50"
                    style={{ transformOrigin: "top right" }}
                  >
                    {/* User card */}
                    <div className="px-4 pt-4 pb-3 border-b border-border/60">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-sky-500 text-sm font-bold text-white shadow-md">
                          {userInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">BIS Engineer</p>
                          <p className="text-[10px] text-muted-foreground truncate">engineer@maanak.ai</p>
                        </div>
                      </div>
                      <div className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Pro · Active Session</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <ul className="p-1.5 space-y-0.5">
                      {[
                        { icon: User, label: "Profile", href: "/settings" },
                        { icon: SlidersHorizontal, label: "Preferences", href: "/settings" },
                        { icon: Sparkles, label: "AI Settings", href: "/settings" },
                      ].map(({ icon: Icon, label, href }) => (
                        <li key={label}>
                          <Link
                            href={href}
                            onClick={() => setShowProfile(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-border/60 p-1.5">
                      <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10">
                        <LogOut className="h-3.5 w-3.5" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}