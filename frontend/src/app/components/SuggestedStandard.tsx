"use client";

import React from "react";
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  Info,
} from "lucide-react";
import Skeleton from "./ui/Skeleton";

export interface CitationItem {
  standard_number?: string;
  relevance?: number | string;
  [key: string]: any;
}

export interface SuggestedStandardData {
  answer: string;
  citations: (string | CitationItem)[];
  confidence: "high" | "medium" | "low" | string;
  limitations?: string;
}

interface SuggestedStandardProps {
  data: SuggestedStandardData | null;
  loading?: boolean;
}

const confidenceStyles: Record<string, { badge: string; dot: string }> = {
  high: {
    badge:
      "bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  medium: {
    badge:
      "bg-amber-500/10 border-amber-500/25 text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  low: {
    badge:
      "bg-rose-500/10 border-rose-500/25 text-rose-700 dark:text-rose-400",
    dot: "bg-rose-500",
  },
};

export default function SuggestedStandard({
  data,
  loading,
}: SuggestedStandardProps) {
  if (loading) {
    return (
      <div className="w-full max-w-3xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs text-left my-6 space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-44 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>

        <div className="space-y-2.5 py-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-11/12 rounded-md" />
          <Skeleton className="h-4 w-4/5 rounded-md" />
        </div>

        <div className="pt-3 border-t border-border/60 flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground font-medium">
            Retrieving standard specifications from vector index...
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const currentConfidence =
    confidenceStyles[data.confidence.toLowerCase()] || confidenceStyles.high;

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-border bg-card text-card-foreground p-6 md:p-8 shadow-sm text-left my-6 transition-all duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-2xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase text-foreground">
              Suggested BIS Standard
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>AI-powered semantic match</span>
            </span>
          </div>
        </div>

        {/* Confidence Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${currentConfidence.badge}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${currentConfidence.dot} animate-pulse`}
          />
          <span>{data.confidence} confidence</span>
        </div>
      </div>

      {/* Answer Content */}
      <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-normal mb-6">
        {data.answer}
      </p>

      {/* Citations / Matched Standards */}
      {data.citations && data.citations.length > 0 ? (
        <div className="pt-4 border-t border-border/70 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
            Citations & Matched Standards
          </span>
          <div className="flex flex-wrap gap-2">
            {data.citations.map((item, index) => {
              const standardNumber =
                typeof item === "string"
                  ? item
                  : item.standard_number || JSON.stringify(item);

              const relevance =
                typeof item === "object" && item.relevance
                  ? typeof item.relevance === "number"
                    ? `${Math.round(item.relevance * 100)}%`
                    : item.relevance
                  : null;

              return (
                <a
                  key={index}
                  href="https://standardsbis.bsbedge.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/70 border border-border text-foreground text-xs font-medium hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-150 shadow-2xs"
                >
                  <FileText className="h-3.5 w-3.5 text-primary group-hover:scale-105 transition-transform" />
                  <span className="font-semibold">{standardNumber}</span>
                  {relevance && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-semibold">
                      {relevance}
                    </span>
                  )}
                  <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors ml-0.5" />
                </a>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="pt-3 pb-1 border-t border-border/70 flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
          <span>
            No specific standard citations matched in the current indexed scope.
          </span>
        </div>
      )}

      {/* Limitations */}
      {data.limitations && (
        <div className="mt-4 pt-3 border-t border-border/70 flex items-start gap-2.5 text-xs text-muted-foreground leading-normal">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <span className="italic">{data.limitations}</span>
        </div>
      )}
    </div>
  );
}