"use client";

import React from "react";
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  Info,
  CheckCircle2,
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
      <div className="w-full max-w-3xl rounded-3xl border border-border/80 bg-card/60 dark:bg-card/40 backdrop-blur-xl p-6 md:p-8 shadow-lg text-left my-4 space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-2xl" />
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
            Retrieving verified standard specifications from neural index...
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const currentConfidence =
    confidenceStyles[data.confidence.toLowerCase()] || confidenceStyles.high;

  return (
    <div className="w-full max-w-3xl rounded-3xl border border-primary/30 bg-card/80 dark:bg-card/60 backdrop-blur-2xl text-card-foreground p-6 md:p-8 shadow-xl text-left my-4 transition-all duration-300 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/25 text-primary shadow-xs">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase text-foreground">
              Recommended BIS Specification
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Neural AI verified compliance match</span>
            </span>
          </div>
        </div>

        {/* Confidence Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border capitalize shadow-2xs ${currentConfidence.badge}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${currentConfidence.dot} animate-pulse`}
          />
          <span>{data.confidence} confidence</span>
        </div>
      </div>

      {/* Answer Content */}
      <p className="text-sm sm:text-base text-foreground/95 leading-relaxed font-normal mb-6 relative z-10">
        {data.answer}
      </p>

      {/* Citations / Matched Standards */}
      {data.citations && data.citations.length > 0 ? (
        <div className="pt-4 border-t border-border/70 mb-2 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
            Authoritative Clauses &amp; IS Citations
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
                    ? `${Math.round(item.relevance * 100)}% Match`
                    : item.relevance
                  : null;

              return (
                <a
                  key={index}
                  href="https://standardsbis.bsbedge.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted/60 dark:bg-muted/40 border border-border/80 text-foreground text-xs font-medium hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all duration-150 shadow-2xs"
                >
                  <FileText className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-bold">{standardNumber}</span>
                  {relevance && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/15 text-primary font-semibold">
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
        <div className="pt-3 pb-1 border-t border-border/70 flex items-center gap-2 text-xs text-muted-foreground relative z-10">
          <Info className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
          <span>
            No specific standard citations matched in the current indexed scope.
          </span>
        </div>
      )}

      {/* Limitations */}
      {data.limitations && (
        <div className="mt-4 pt-3 border-t border-border/70 flex items-start gap-2.5 text-xs text-muted-foreground leading-normal relative z-10">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <span className="italic">{data.limitations}</span>
        </div>
      )}
    </div>
  );
}