"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  LayoutDashboard,
  Search,
  Bot,
  Compass,
  History,
  Bookmark,
  Activity,
  Settings,
  HelpCircle,
  UploadCloud,
  Layers,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  enabled?: boolean;
};

// Exact navigation items and routes preserved
const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, enabled: true },
  { label: "Standards Search", href: "/standard-search", icon: SearchIconWrapper, enabled: true },
  { label: "AI Assistant", href: "/ai", icon: Bot, enabled: true },
  { label: "Standards Explorer", href: "/standards-explorer", icon: Compass, enabled: true },
  { label: "Old Standards", href: "/old-standards", icon: History, enabled: true },
  { label: "Saved Standards", href: "/saved-standards", icon: Bookmark, enabled: true },
  { label: "Recent Activity", href: "/recent-activity", icon: Activity, enabled: true },
];

function SearchIconWrapper(props: { className?: string }) {
  return <Search {...props} />;
}

const footerNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings, enabled: true },
  { label: "Help", href: "/help", icon: HelpCircle, enabled: true },
];

function NavRow({
  item,
  isActive,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const baseClasses =
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

  if (!item.enabled) {
    return (
      <span
        aria-disabled="true"
        title="Coming soon"
        className={`${baseClasses} cursor-not-allowed text-muted-foreground/40`}
      >
        <span className="shrink-0">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <span className="truncate">{item.label}</span>
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={`${baseClasses} ${
        isActive
          ? "bg-primary text-primary-foreground shadow-xs font-semibold"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className="shrink-0">
        <Icon
          className={`h-4.5 w-4.5 transition-transform duration-150 ${
            isActive
              ? "text-primary-foreground"
              : "text-muted-foreground group-hover:text-foreground group-hover:scale-105"
          }`}
        />
      </span>
      <span className="truncate">{item.label}</span>
      {isActive && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground/80" />
      )}
    </Link>
  );
}

type SidebarProps = {
  onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-card">
      {/* Brand header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-5 border-b border-border/50">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-xs">
          <Layers className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-bold tracking-tight text-foreground">
            Maanak
          </p>
          <p className="truncate text-[11px] font-medium tracking-tight text-muted-foreground">
            AI Powered BIS Engine
          </p>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="px-4 pt-4 pb-2">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-150 hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <UploadCloud className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="flex flex-col gap-1">
          {mainNavItems.map((item) => (
            <li key={item.label}>
              <NavRow
                item={item}
                isActive={pathname === item.href}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer navigation */}
      <div className="border-t border-border px-3 py-3">
        <ul className="flex flex-col gap-1">
          {footerNavItems.map((item) => (
            <li key={item.label}>
              <NavRow
                item={item}
                isActive={pathname === item.href}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}