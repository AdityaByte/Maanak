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
    badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500 dark:bg-emerald-400",
  },
  medium: {
    badge: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
  low: {
    badge: "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400",
    dot: "bg-rose-500 dark:bg-rose-400",
  },
};

export default function SuggestedStandard({ data, loading }: SuggestedStandardProps) {
  if (loading) {
    return (
      <div className="w-full max-w-3xl bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center my-6 shadow-sm">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3.5" />
        <p className="text-sm text-muted-foreground font-medium">
          Retrieving standard specifications from vector index...
        </p>
      </div>
    );
  }

  if (!data) return null;

  const currentConfidence =
    confidenceStyles[data.confidence.toLowerCase()] || confidenceStyles.high;

  return (
    <div className="w-full max-w-3xl bg-card text-card-foreground border border-border rounded-2xl p-6 md:p-8 shadow-sm text-left my-6 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground">
              Suggested BIS Standard
            </h3>
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> AI-powered semantic match
            </span>
          </div>
        </div>

        {/* Confidence Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border capitalize ${currentConfidence.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${currentConfidence.dot} animate-pulse`} />
          <span>{data.confidence} confidence</span>
        </div>
      </div>

      {/* Answer Content */}
      <p className="text-sm md:text-base text-foreground/90 leading-relaxed font-normal mb-6">
        {data.answer}
      </p>

      {/* Citations / Matched Standards */}
      {data.citations && data.citations.length > 0 ? (
        <div className="pt-4 border-t border-border mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">
            Citations & Matched Standards
          </span>
          <div className="flex flex-wrap gap-2.5">
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
                  className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs font-medium hover:border-primary/50 hover:bg-primary/5 transition-all duration-150"
                >
                  <FileText className="w-3.5 h-3.5 text-primary group-hover:scale-105 transition-transform" />
                  <span>{standardNumber}</span>
                  {relevance && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                      {relevance}
                    </span>
                  )}
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors ml-0.5" />
                </a>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="pt-3 pb-1 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="w-3.5 h-3.5 text-muted-foreground/70 flex-shrink-0" />
          <span>No specific standard citations matched in the current indexed scope.</span>
        </div>
      )}

      {/* Limitations */}
      {data.limitations && (
        <div className="mt-4 pt-3 border-t border-border flex items-start gap-2 text-xs text-muted-foreground italic leading-normal">
          <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground/70 flex-shrink-0 mt-0.5" />
          <span>{data.limitations}</span>
        </div>
      )}
    </div>
  );
}