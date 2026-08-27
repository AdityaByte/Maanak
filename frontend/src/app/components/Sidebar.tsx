"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType;
  enabled?: boolean;
};

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const DashboardIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const SearchIcon = () => (
  <svg {...iconProps}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const AssistantIcon = () => (
  <svg {...iconProps}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CompassIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <polygon points="16 8 14 14 8 16 10 10 16 8" />
  </svg>
);

const HistoryIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 14" />
  </svg>
);

const BookmarkIcon = () => (
  <svg {...iconProps}>
    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
  </svg>
);

const ActivityIcon = () => (
  <svg {...iconProps}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const SettingsIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const HelpIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.33c-.77.32-1.4.99-1.4 1.92V14" />
    <line x1="12" y1="17.5" x2="12" y2="17.5" />
  </svg>
);

const UploadIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

// All items set to enabled: true with exact routes
const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: DashboardIcon, enabled: true },
  { label: "Standards Search", href: "/standard-search", icon: SearchIcon, enabled: true },
  { label: "AI Assistant", href: "/ai", icon: AssistantIcon, enabled: true },
  { label: "Standards Explorer", href: "/standards-explorer", icon: CompassIcon, enabled: true },
  { label: "Old Standards", href: "/old-standards", icon: HistoryIcon, enabled: true },
  { label: "Saved Standards", href: "/saved-standards", icon: BookmarkIcon, enabled: true },
  { label: "Recent Activity", href: "/recent-activity", icon: ActivityIcon, enabled: true },
];

const footerNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: SettingsIcon, enabled: true },
  { label: "Help", href: "/help", icon: HelpIcon, enabled: true },
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
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";

  if (!item.enabled) {
    return (
      <span
        aria-disabled="true"
        title="Coming soon"
        className={`${baseClasses} cursor-not-allowed text-muted-foreground/50`}
      >
        <span className="shrink-0">
          <Icon />
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
          ? "bg-primary/10 font-medium text-primary"
          : "text-foreground/80 hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className="shrink-0">
        <Icon />
      </span>
      <span className="truncate">{item.label}</span>
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
      <div className="flex items-center gap-3 px-5 pt-6 pb-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <DashboardIcon />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-foreground">Maanak</p>
          <p className="truncate text-[11px] leading-tight text-muted-foreground">
            AI Powered BIS Recommendation Engine
          </p>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="px-5 pb-5">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <UploadIcon />
          Upload Document
        </button>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto px-3">
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