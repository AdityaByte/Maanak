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
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeType?: "ai" | "counter" | "archive";
  enabled?: boolean;
};

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, enabled: true },
  { label: "Standards Search", href: "/standard-search", icon: Search, enabled: true },
  { label: "All Categories", href: "/all-categories", icon: Grid2X2, badge: "12+", badgeType: "counter", enabled: true },
  { label: "AI Assistant", href: "/ai", icon: BotMessageSquare, badge: "AI", badgeType: "ai", enabled: true },
  { label: "Old Standards", href: "/old-standards", icon: History, badge: "Archive", badgeType: "archive", enabled: true },
];

const footerNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings, enabled: true },
  { label: "Help & Docs", href: "/help", icon: HelpCircle, enabled: true },
];

function isPathActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

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
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-muted-foreground/40 cursor-not-allowed select-none"
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="truncate">{item.label}</span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={`relative group flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all duration-200 ${
        isActive
          ? "text-primary font-semibold"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
      }`}
    >
      {/* Animated Active Background Pill */}
      {isActive && (
        <motion.div
          layoutId="activeNavBackground"
          className="absolute inset-0 rounded-2xl bg-primary/10 dark:bg-primary/15 border border-primary/25 shadow-2xs"
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
        />
      )}

      {/* Active Left Indicator Pip */}
      {isActive && (
        <motion.span
          layoutId="activeNavPip"
          className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary"
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
        />
      )}

      {/* Nav Icon */}
      <Icon
        className={`relative z-10 w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        }`}
      />

      {/* Label */}
      <span className="relative z-10 truncate">{item.label}</span>

      {/* Dynamic Badges */}
      {item.badge && (
        <div className="relative z-10 ml-auto flex items-center">
          {item.badgeType === "ai" ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-primary to-sky-500 text-white shadow-2xs">
              <Sparkles className="h-2.5 w-2.5" />
              <span>{item.badge}</span>
            </span>
          ) : item.badgeType === "counter" ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted border border-border/80 text-muted-foreground">
              {item.badge}
            </span>
          ) : (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </Link>
  );
});

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
    <aside className="flex flex-col h-full w-full bg-card/85 dark:bg-card/65 backdrop-blur-2xl border-r border-border text-foreground select-none overflow-hidden">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-5 border-b border-border/60">
        <div className="relative p-2 rounded-2xl bg-card/90 dark:bg-card/70 border border-border/80 shadow-xs group cursor-pointer">
          <Image
            src="/logo.svg"
            alt="Maanak Logo"
            width={34}
            height={34}
            className="h-8 w-8 shrink-0 object-contain transition-transform duration-200 group-hover:scale-105"
            priority
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate text-sm font-extrabold tracking-tight text-foreground">
              Maanak
            </h2>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              BIS
            </span>
          </div>
          <p className="truncate text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mt-0.5">
            Recommendation Engine
          </p>
        </div>
      </div>

      {/* Main Navigation Scroll Stream */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 scrollbar-none">
        {/* Discovery & Audit Group */}
        <div className="space-y-1">
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 flex items-center justify-between">
            <span>Platform Hub</span>
          </p>
          <ul className="space-y-1">
            {mainItemsWithState.map(({ item, isActive }) => (
              <li key={item.label}>
                <NavRow item={item} isActive={isActive} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Sidebar Footer Area */}
      <div className="p-3.5 border-t border-border/70 mt-auto space-y-3 bg-muted/20">
        {/* Preferences Links */}
        <div>
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            System &amp; Settings
          </p>
          <ul className="space-y-0.5">
            {footerItemsWithState.map(({ item, isActive }) => (
              <li key={item.label}>
                <NavRow item={item} isActive={isActive} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>

        {/* Live BIS Engine Status HUD Card */}
        <div className="rounded-2xl border border-border/70 bg-card/60 dark:bg-card/40 backdrop-blur-md p-3 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-bold text-foreground">Catalog Sync</span>
            </div>
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
              Live
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
            15,000+ Indian Standards indexed with neural clause citations.
          </p>
        </div>
      </div>
    </aside>
  );
}