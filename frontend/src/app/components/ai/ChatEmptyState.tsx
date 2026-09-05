"use client";

import React from "react";
import {
  BotMessageSquare,
  Sparkles,
  ShieldCheck,
  FileCheck,
  Cpu,
  Droplets,
  Building2,
  Zap,
  ArrowUpRight,
} from "lucide-react";

interface ChatEmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

const STARTER_PROMPTS = [
  {
    icon: Droplets,
    title: "Drinking Water Quality",
    prompt: "What are the permissible limits and key parameters defined under IS 10500 for drinking water?",
    tag: "IS 10500",
  },
  {
    icon: Building2,
    title: "Structural Steel & Cement",
    prompt: "Which BIS standards govern structural steel bars and mandatory certification for construction?",
    tag: "IS 1786 / IS 2062",
  },
  {
    icon: Zap,
    title: "Electronics & Safety",
    prompt: "What are the BIS Compulsory Registration Scheme (CRS) requirements for electronic power adapters and IT goods?",
    tag: "CRS / Safety",
  },
  {
    icon: ShieldCheck,
    title: "Packaged Drinking Water",
    prompt: "What are the mandatory testing and packaging requirements specified in IS 14543?",
    tag: "IS 14543",
  },
];

export default function ChatEmptyState({ onSelectPrompt }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center max-w-2xl mx-auto">
      {/* Bot Icon with Animated Glow */}
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20 text-primary shadow-sm">
        <BotMessageSquare className="h-8 w-8" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
          <Sparkles className="h-2.5 w-2.5" />
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2">
        How can Maanak AI assist you today?
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground font-normal max-w-md mb-8 leading-relaxed">
        Ask any question about Bureau of Indian Standards (BIS), retrieve exact standard numbers, check compliance clauses, or compare certification scopes.
      </p>

      {/* Suggested Prompt Cards */}
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {STARTER_PROMPTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt(item.prompt)}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 text-left shadow-xs hover:border-primary/40 hover:bg-primary/[0.02] hover:shadow-sm active:scale-[0.99] transition-all duration-150"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      {item.title}
                    </span>
                  </div>
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed group-hover:text-foreground/90 transition-colors">
                  {item.prompt}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-end text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[11px] font-medium mr-1">Ask this</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
