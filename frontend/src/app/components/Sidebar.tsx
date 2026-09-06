"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Search,
  BotMessageSquare,
  History,
  Grid2X2,
  Settings,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileSearch,
  ChevronRight,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────
type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeType?: "ai" | "counter" | "archive" | "new";
  description?: string;
  enabled?: boolean;
};

// ─── Nav data ──────────────────────────────────────────────────────────────────
const mainNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Overview & insights",
    enabled: true,
  },
  {
    label: "Standards Search",
    href: "/standard-search",
    icon: Search,
    description: "Discover BIS standards",
    enabled: true,
  },
  {
    label: "All Categories",
    href: "/all-categories",
    icon: Grid2X2,
    badge: "12+",
    badgeType: "counter",
    description: "Browse by sector",
    enabled: true,
  },
  {
    label: "AI Assistant",
    href: "/ai",
    icon: BotMessageSquare,
    badge: "AI",
    badgeType: "ai",
    description: "Neural compliance advisor",
    enabled: true,
  },
  {
    label: "Old Standards",
    href: "/old-standards",
    icon: History,
    badge: "Archive",
    badgeType: "archive",
    description: "Superseded references",
    enabled: true,
  },
];

const footerNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings, description: "Preferences & config", enabled: true },
  { label: "Help & Docs", href: "/help", icon: HelpCircle, description: "Guides & API docs", enabled: true },
];

// ─── Quick stats strip ─────────────────────────────────────────────────────────
const QUICK_STATS = [
  { label: "Standards", value: "15K+", icon: FileSearch },
  { label: "Sectors", value: "48", icon: Grid2X2 },
  { label: "Updated", value: "Today", icon: TrendingUp },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function isPathActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// ─── Stagger variants ──────────────────────────────────────────────────────────
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 380, damping: 28 } },
};

// ─── NavRow ────────────────────────────────────────────────────────────────────
const NavRow = React.memo(function NavRow({
  item,
  isActive,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  if (!item.enabled) {
    return (
      <div
        aria-disabled="true"
        title="Coming soon"
        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium text-muted-foreground/30 cursor-not-allowed select-none"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-muted/40">
          <Icon className="w-3.5 h-3.5 shrink-0" />
        </span>
        <span className="truncate">{item.label}</span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={`relative group flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium transition-all duration-200 ${
        isActive
          ? "text-primary font-semibold"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {/* Animated active background */}
      {isActive && (
        <motion.div
          layoutId="activeNavBackground"
          className="absolute inset-0 rounded-2xl bg-primary/10 dark:bg-primary/[0.12] border border-primary/20"
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      )}

      {/* Hover background */}
      {!isActive && (
        <span className="absolute inset-0 rounded-2xl bg-transparent group-hover:bg-muted/50 transition-colors duration-150" />
      )}

      {/* Left accent pip */}
      {isActive && (
        <motion.span
          layoutId="activeNavPip"
          className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full bg-primary shadow-[0_0_8px_var(--color-primary)]"
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      )}

      {/* Icon container */}
      <span
        className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-primary/15 shadow-[0_0_12px_rgba(37,99,235,0.25)]"
            : "bg-muted/50 group-hover:bg-muted"
        }`}
      >
        <Icon
          className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${
            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          }`}
        />
      </span>

      {/* Label + description */}
      <span className="relative z-10 flex flex-col min-w-0 flex-1">
        <span className="truncate leading-none">{item.label}</span>
        {item.description && (
          <span className="truncate text-[10px] text-muted-foreground/60 mt-0.5 leading-none font-normal">
            {item.description}
          </span>
        )}
      </span>

      {/* Badge */}
      {item.badge && (
        <span className="relative z-10 ml-auto shrink-0">
          {item.badgeType === "ai" ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-primary to-sky-500 text-white shadow-sm shadow-primary/30">
              <Sparkles className="h-2.5 w-2.5" />
              {item.badge}
            </span>
          ) : item.badgeType === "counter" ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
              {item.badge}
            </span>
          ) : item.badgeType === "new" ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/25">
              {item.badge}
            </span>
          ) : (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {item.badge}
            </span>
          )}
        </span>
      )}

      {/* Active chevron */}
      {isActive && (
        <ChevronRight className="relative z-10 h-3 w-3 shrink-0 text-primary/60 ml-0.5" />
      )}
    </Link>
  );
});

// ─── Sidebar ───────────────────────────────────────────────────────────────────
interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const mainItemsWithState = useMemo(
    () =>
      mainNavItems.map((item) => ({
        item,
        isActive: isPathActive(pathname, item.href),
      })),
    [pathname]
  );

  const footerItemsWithState = useMemo(
    () =>
      footerNavItems.map((item) => ({
        item,
        isActive: pathname === item.href,
      })),
    [pathname]
  );

  return (
    <aside className="relative flex flex-col h-full w-full overflow-hidden select-none">
      {/* Glassmorphic background layers */}
      <div className="absolute inset-0 bg-card/80 dark:bg-[#0b1120]/85 backdrop-blur-2xl" />
      <div className="absolute inset-0 border-r border-border/60" />
      {/* Subtle radial glow at top */}
      <div className="pointer-events-none absolute -top-16 -left-8 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 rounded-full bg-sky-500/5 blur-2xl" />

      {/* ── Brand header ── */}
      <div className="relative z-10 flex items-center gap-3 px-5 pt-5 pb-4 border-b border-border/50">
        {/* Animated logo wrapper */}
        <motion.div
          whileHover={{ scale: 1.06, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="relative p-2 rounded-2xl bg-gradient-to-br from-primary/10 to-sky-500/10 border border-primary/20 shadow-sm cursor-pointer group"
        >
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Image
            src="/logo.svg"
            alt="Maanak Logo"
            width={32}
            height={32}
            className="relative h-8 w-8 shrink-0 object-contain"
            priority
          />
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-extrabold tracking-tight text-foreground leading-none">
              Maanak
            </h2>
            {/* Live BIS badge */}
            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 leading-none">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              BIS
            </span>
          </div>
          <p className="text-[10px] uppercase font-semibold tracking-widest text-muted-foreground/60 mt-1 leading-none">
            Recommendation Engine
          </p>
        </div>

        {/* Version chip */}
        <span className="shrink-0 text-[9px] font-bold text-muted-foreground/40 border border-border/50 rounded-lg px-1.5 py-0.5">
          v1
        </span>
      </div>

      {/* ── Quick stats strip ── */}
      <div className="relative z-10 mx-3.5 mt-3 grid grid-cols-3 gap-1.5">
        {QUICK_STATS.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center gap-0.5 rounded-xl border border-border/50 bg-muted/30 py-2 px-1 text-center"
          >
            <Icon className="h-3 w-3 text-primary/70" />
            <span className="text-[11px] font-bold text-foreground leading-none">{value}</span>
            <span className="text-[9px] text-muted-foreground/60 leading-none">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Main navigation ── */}
      <nav className="relative z-10 flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
        <div className="space-y-1">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 flex items-center gap-2">
            <Zap className="h-2.5 w-2.5" />
            Platform Hub
          </p>
          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="space-y-0.5"
          >
            {mainItemsWithState.map(({ item, isActive }) => (
              <motion.li key={item.label} variants={itemVariants}>
                <NavRow item={item} isActive={isActive} onNavigate={onNavigate} />
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </nav>

      {/* ── Footer ── */}
      <div className="relative z-10 border-t border-border/50 bg-muted/10">
        {/* System & Settings links */}
        <div className="px-3 pt-3 pb-2">
          <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            System & Config
          </p>
          <ul className="space-y-0.5">
            {footerItemsWithState.map(({ item, isActive }) => (
              <li key={item.label}>
                <NavRow item={item} isActive={isActive} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>

        {/* Live Catalog Status Card */}
        <div className="mx-3 mb-3 rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-muted/30 dark:from-card/50 dark:to-muted/10 backdrop-blur-md p-3 space-y-2.5 shadow-xs">
          {/* Status header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <ShieldCheck className="h-3 w-3 text-primary" />
              </span>
              <span className="text-[11px] font-bold text-foreground">Catalog Sync</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] text-muted-foreground/60">
              <span>Neural index coverage</span>
              <span className="font-semibold text-primary/70">98.4%</span>
            </div>
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "98.4%" }}
                transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-sky-500"
              />
            </div>
          </div>

          {/* Footer stat */}
          <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
            15,000+ Indian Standards indexed with neural clause citations.
          </p>
        </div>
      </div>
    </aside>
  );
}