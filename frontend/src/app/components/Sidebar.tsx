"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  BotMessageSquare,
  Compass,
  History,
  Grid2X2, // Added for Categories
  Bookmark,
  Activity,
  Settings,
  HelpCircle,
  Layers,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  enabled?: boolean;
};

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, enabled: true },
  { label: "Standards Search", href: "/standard-search", icon: Search, enabled: true },
  { label: "All Categories", href: "/all-categories", icon: Grid2X2, enabled: true },
  { label: "AI Assistant", href: "/ai", icon: BotMessageSquare, enabled: true },
  { label: "Standards Explorer", href: "/standards-explorer", icon: Compass, enabled: true },
  { label: "Old Standards", href: "/old-standards", icon: History, enabled: true },
  // { label: "Saved Standards", href: "/saved-standards", icon: Bookmark, enabled: true },
  // { label: "Recent Activity", href: "/recent-activity", icon: Activity, enabled: true },
];

function SearchIconWrapper(props: { className?: string }) {
  return <Search {...props} />;
}

const footerNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings, enabled: true },
  { label: "Help & Docs", href: "/help", icon: HelpCircle, enabled: true },
];

// Single source of truth for "is this href active" — handles the
// root-path special case and prefix matching in one place.
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
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-muted-foreground/40 cursor-not-allowed select-none"
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
      className={`relative group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
        isActive
          ? "bg-primary/10 text-primary font-semibold shadow-xs"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary" />
      )}
      <Icon
        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        }`}
      />
      <span className="truncate">{item.label}</span>
      {isActive && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground/80" />
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
    <aside className="flex flex-col h-full w-full bg-card border-r border-border text-foreground select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-5">
        <Image
          src="/logo.svg"
          alt="Maanak Logo"
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 object-contain"
          priority
        />
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold tracking-tight text-foreground">
            Maanak
          </h2>
          <p className="truncate text-[10px] uppercase font-medium tracking-wider text-muted-foreground">
            BIS Recommendation Engine
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1 scrollbar-none">
        <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Platform
        </p>
        <ul className="space-y-0.5">
          {mainItemsWithState.map(({ item, isActive }) => (
            <li key={item.label}>
              <NavRow item={item} isActive={isActive} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-border mt-auto">
        <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Preferences
        </p>
        <ul className="space-y-0.5">
          {footerItemsWithState.map(({ item, isActive }) => (
            <li key={item.label}>
              <NavRow item={item} isActive={isActive} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}