"use client";

import React from "react";
import {
  BotMessageSquare,
  Plus,
  Trash2,
  Sparkles,
  Layers,
} from "lucide-react";

interface ChatHeaderProps {
  sessionId: string | null;
  messageCount: number;
  onNewChat: () => void;
  onClearMessages: () => void;
  loading?: boolean;
}

export default function ChatHeader({
  sessionId,
  messageCount,
  onNewChat,
  onClearMessages,
  loading = false,
}: ChatHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5 mt-5">
      {/* Title & Description */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-xs">
          <BotMessageSquare className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              AI Assistant
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
              <Sparkles className="h-2.5 w-2.5" />
              <span>v1.0 RAG</span>
            </span>
          </div>
          <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
            Contextual Q&A, standard citations, and multi-turn recommendation system.
          </p>
        </div>
      </div>

      {/* Session State & Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Session Status Pill */}
        <div className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-2xs">
          <span
            className={`h-2 w-2 rounded-full ${
              sessionId ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
            }`}
          />
          <span className="font-mono text-[11px]">
            {sessionId ? `Session: ${sessionId.slice(0, 8)}...` : "New Session"}
          </span>
        </div>

        {/* Clear Messages (if messages present) */}
        {messageCount > 0 && (
          <button
            type="button"
            onClick={onClearMessages}
            disabled={loading}
            title="Clear current messages"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-all shadow-2xs disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline cursor-pointer">Clear</span>
          </button>
        )}

        {/* New Chat Button */}
        <button
          type="button"
          onClick={onNewChat}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Chat</span>
        </button>
      </div>
    </div>
  );
}
