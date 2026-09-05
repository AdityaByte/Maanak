"use client";

import Link from "next/link";
import { ShieldCheck, ExternalLink } from "lucide-react";

const quickLinks = [
  { href: "https://www.bis.gov.in", label: "BIS Portal", external: true },
  { href: "/help", label: "Documentation", external: false },
  { href: "/privacy", label: "Privacy Policy", external: false },
  { href: "/terms", label: "Terms of Service", external: false },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="w-full border-t border-border bg-card/50 text-xs text-muted-foreground py-4 px-6 mt-auto"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Disclaimer */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-center sm:text-left">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
          <span className="font-semibold text-foreground">Maanak</span>
          <span aria-hidden="true">•</span>
          <span>BIS Technical Specifications &amp; Compliance Reference Tool</span>
        </div>

        {/* Right: Quick Links */}
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-4">
          {quickLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:underline transition-colors"
              >
                <span>{link.label}</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                <span className="sr-only">(opens in new tab)</span>
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:underline transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
          <span>© {year} Maanak</span>
        </nav>
      </div>
    </footer>
  );
}