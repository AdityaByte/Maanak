"use client";

import type { SearchResponse } from "@/types/search";

interface SearchResultProps {
  result: SearchResponse | null;
}

export default function SearchResult({
  result,
}: SearchResultProps) {
  if (!result) return null;

  return (
    <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
      
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Search Result
        </h2>

        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
          {result.confidence} confidence
        </span>
      </div>

      {/* Answer */}
      <div className="rounded-lg bg-muted p-4">
        <p className="whitespace-pre-line text-sm leading-6 text-foreground">
          {result.answer}
        </p>
      </div>

      {/* Citations */}
      {result.citations.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Related Standards
          </h3>

          <div className="space-y-3">
            {result.citations.map(
              (citation, index) => (
                <div
                  key={`${citation.standard_number}-${index}`}
                  className="rounded-lg border border-border bg-muted/50 p-4"
                >
                  <p className="text-sm font-medium text-primary">
                    {citation.standard_number}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {citation.relevance}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Limitations */}
      {result.limitations && (
        <div className="mt-5 rounded-lg border border-border bg-muted p-4">
          <p className="text-xs font-medium text-foreground">
            Limitations
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {result.limitations}
          </p>
        </div>
      )}
    </div>
  );
}