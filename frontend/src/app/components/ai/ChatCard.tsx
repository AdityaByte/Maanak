"use client";

import React, { useState } from "react";
import {
  Bot,
  User,
  Sparkles,
  FileText,
  ExternalLink,
  AlertTriangle,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
} from "lucide-react";
import type { ChatMessage } from "@/types/chat";

interface ChatCardProps {
  message: ChatMessage;
  onRetry?: (content: string) => void;
  userInitials?: string;
}

const confidenceStyles: Record<string, { badge: string; dot: string; label: string }> = {
  high: {
    badge: "bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "High confidence",
  },
  medium: {
    badge: "bg-amber-500/10 border-amber-500/25 text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    label: "Medium confidence",
  },
  low: {
    badge: "bg-rose-500/10 border-rose-500/25 text-rose-700 dark:text-rose-400",
    dot: "bg-rose-500",
    label: "Low confidence",
  },
};

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatCard({
  message,
  onRetry,
  userInitials = "JD",
}: ChatCardProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API fails
    }
  };

  if (isUser) {
    return (
      <div className="flex w-full justify-end gap-3 py-3 group">
        <div className="flex max-w-[85%] md:max-w-[75%] flex-col items-end">
          {/* User Bubble */}
          <div className="relative rounded-2xl rounded-tr-xs bg-primary px-4 py-3 text-sm text-primary-foreground shadow-xs transition-all">
            <p className="whitespace-pre-wrap leading-relaxed break-words font-normal">
              {message.content}
            </p>
          </div>

          {/* User Meta / Time */}
          <div className="mt-1 flex items-center gap-2 px-1 text-[11px] text-muted-foreground/70 opacity-80 transition-opacity group-hover:opacity-100">
            <span>{formatTimestamp(message.timestamp)}</span>
            <button
              type="button"
              onClick={handleCopy}
              title="Copy message"
              className="rounded p-0.5 hover:text-foreground transition-colors"
            >
              {copied ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>

        {/* User Avatar */}
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-primary/20 text-xs font-bold text-primary shadow-2xs">
          {userInitials}
        </div>
      </div>
    );
  }

  // Assistant Message
  const confStyle = message.confidence
    ? confidenceStyles[message.confidence.toLowerCase()] || confidenceStyles.high
    : null;

  return (
    <div className="flex w-full gap-3.5 py-4 group">
      {/* Bot Avatar */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-2xs transition-transform group-hover:scale-105">
        <Bot className="h-4.5 w-4.5" />
      </div>

      {/* Assistant Content Card */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="w-full rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs text-card-foreground transition-all">
          {/* Header Row: Title & Confidence Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Maanak AI</span>
              </span>
            </div>

            {confStyle && (
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${confStyle.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${confStyle.dot} animate-pulse`} />
                <span>{confStyle.label}</span>
              </div>
            )}
          </div>

          {/* Main Answer Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed text-sm sm:text-base space-y-3">
            {message.content.split("\n\n").map((paragraph, pIdx) => {
              if (paragraph.startsWith("- ") || paragraph.startsWith("* ")) {
                const items = paragraph.split("\n").map((item) => item.replace(/^[-*]\s+/, ""));
                return (
                  <ul key={pIdx} className="list-disc pl-5 space-y-1 my-2">
                    {items.map((item, iIdx) => (
                      <li key={iIdx} className="text-foreground/90">
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={pIdx} className="whitespace-pre-line leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Citations & Matched Standards */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-5 pt-4 border-t border-border/70">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2.5">
                Referenced BIS Standards & Citations
              </span>
              <div className="flex flex-wrap gap-2">
                {message.citations.map((cite, idx) => (
                  <a
                    key={idx}
                    href="https://standardsbis.bsbedge.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="group/cite inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/60 border border-border text-foreground text-xs font-medium hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-150 shadow-2xs"
                  >
                    <FileText className="h-3.5 w-3.5 text-primary group-hover/cite:scale-105 transition-transform" />
                    <span className="font-semibold">{cite.standard_number}</span>
                    {cite.relevance && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-semibold truncate max-w-[200px]">
                        {cite.relevance}
                      </span>
                    )}
                    <ExternalLink className="h-3 w-3 text-muted-foreground group-hover/cite:text-primary transition-colors ml-0.5" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Limitations Callout */}
          {message.limitations && (
            <div className="mt-4 pt-3 border-t border-border/70 flex items-start gap-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold text-amber-600 dark:text-amber-400 block mb-0.5">
                  Scope & Context Limitations
                </span>
                <span className="italic leading-normal text-foreground/80">
                  {message.limitations}
                </span>
              </div>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="text-[11px] text-muted-foreground/70">
              {formatTimestamp(message.timestamp)}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-muted hover:text-foreground transition-colors"
                title="Copy response"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <div className="h-3 w-px bg-border mx-1" />

              <button
                type="button"
                onClick={() => setFeedback(feedback === "like" ? null : "like")}
                aria-label="Helpful"
                className={`rounded-lg p-1.5 transition-colors ${
                  feedback === "like"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "hover:bg-muted hover:text-foreground"
                }`}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setFeedback(feedback === "dislike" ? null : "dislike")}
                aria-label="Unhelpful"
                className={`rounded-lg p-1.5 transition-colors ${
                  feedback === "dislike"
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    : "hover:bg-muted hover:text-foreground"
                }`}
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </button>

              {onRetry && (
                <>
                  <div className="h-3 w-px bg-border mx-1" />
                  <button
                    type="button"
                    onClick={() => onRetry(message.content)}
                    aria-label="Regenerate response"
                    title="Regenerate"
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    <span>Retry</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
