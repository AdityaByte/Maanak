"use client";

import React from "react";
import { Bot, Sparkles } from "lucide-react";

export default function ChatLoadingIndicator() {
  return (
    <div className="flex w-full gap-3.5 py-4">
      {/* Bot Avatar */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-2xs">
        <Bot className="h-4.5 w-4.5 animate-pulse" />
      </div>

      {/* Assistant Loading Card */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="w-full rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs text-card-foreground">
          <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Maanak AI</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs text-primary">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              <span className="font-medium text-[11px]">Thinking</span>
            </div>
          </div>

          {/* Skeleton Lines */}
          <div className="space-y-2.5 py-1">
            <div className="h-4 w-5/6 rounded-md bg-muted animate-pulse" />
            <div className="h-4 w-full rounded-md bg-muted/80 animate-pulse" />
            <div className="h-4 w-3/4 rounded-md bg-muted/60 animate-pulse" />
          </div>

          <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-2">
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-xs text-muted-foreground font-medium">
              Searching BIS knowledge base & generating response...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
