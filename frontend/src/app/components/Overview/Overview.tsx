"use client";

import React, { useEffect, useState } from "react";
import SavedCategories, {
  Category,
} from "../SavedCategories/SavedCategories";
import Skeleton from "../ui/Skeleton";
import { ArrowRight, Inbox, AlertCircle } from "lucide-react";

type Standard = {
  standard_number: string;
  relevance: string;
};

/*
 * Temporary category data.
 *
 * This will be replaced with Redux categories
 * in the Saved Categories task.
 */
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Civil Engineering",
  },
  {
    id: "2",
    name: "Electrical Engineering",
  },
  {
    id: "3",
    name: "Mechanical Engineering",
  },
  {
    id: "4",
    name: "Chemical Engineering",
  },
];

const TABS = ["Overview", "Old Standards", "Saved Categories"] as const;

export default function Overview() {
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>("Overview");

  const [searchResults, setSearchResults] = useState<Standard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLatestSearchResults = () => {
    try {
      setIsLoading(true);
      setError(null);

      const storedSearches = localStorage.getItem("searchResults");

      // No searches have been stored yet
      if (!storedSearches) {
        setSearchResults([]);
        return;
      }

      const searchHistory = JSON.parse(storedSearches);

      // Make sure stored data is an array
      if (!Array.isArray(searchHistory)) {
        setSearchResults([]);
        return;
      }

      const standards: Standard[] = [];
      const seenStandards = new Set<string>();

      /*
       * searchHistory is stored newest-first.
       *
       * Example:
       *
       * [
       *   {
       *     query: "pet food standards",
       *     response: {
       *       citations: [...]
       *     },
       *     searchedAt: "..."
       *   }
       * ]
       *
       * We extract standards from response.citations.
       */
      for (const search of searchHistory) {
        const citations = search?.response?.citations;

        if (!Array.isArray(citations)) {
          continue;
        }

        for (const citation of citations) {
          const standardNumber = citation?.standard_number;

          if (
            standardNumber &&
            !seenStandards.has(standardNumber)
          ) {
            seenStandards.add(standardNumber);

            standards.push({
              standard_number: standardNumber,
              relevance: citation.relevance || "",
            });
          }

          // Dashboard only needs 5 standards
          if (standards.length === 5) {
            break;
          }
        }

        // Stop once we have 5 standards
        if (standards.length === 5) {
          break;
        }
      }

      setSearchResults(standards);
    } catch (err) {
      console.error("Failed to load latest search results:", err);
      setError("Unable to load latest search results.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLatestSearchResults();
  }, []);

  return (
    <section className="w-full bg-background px-4 sm:px-6 lg:px-8 py-6 text-foreground">
      {/* Tabs */}
      <div className="border-b border-border/80">
        <div className="flex gap-6 sm:gap-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                activeTab === tab
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}

              <span
                className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-primary"
                    : "bg-transparent"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {activeTab === "Overview" && (
        <div className="mt-6">
          {/* Heading */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground">
                Latest Search Results
              </h2>

              <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
                Your most recently searched standards
              </p>
            </div>

            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium text-primary hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 py-2 border-b border-border/40 last:border-0"
                  >
                    <Skeleton className="h-5 w-28 rounded-md" />

                    <Skeleton className="h-5 flex-1 rounded-md" />

                    <Skeleton className="h-6 w-16 rounded-lg" />
                  </div>
                ))}
              </div>

              <p className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground font-medium">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />

                Loading latest search results...
              </p>
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-8 text-center shadow-xs">
              <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />

              <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                {error}
              </p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading &&
            !error &&
            searchResults.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-xs">
                <Inbox className="h-8 w-8 text-muted-foreground/60 mb-2" />

                <p className="text-sm text-muted-foreground">
                  No recent search results found.
                </p>
              </div>
            )}

          {/* Table */}
          {!isLoading &&
            !error &&
            searchResults.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Standard
                        </th>

                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Relevance
                        </th>

                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-border/60">
                      {searchResults.map((item) => (
                        <tr
                          key={item.standard_number}
                          className="group transition-colors hover:bg-muted/40"
                        >
                          {/* Standard Number */}
                          <td className="px-5 py-3.5 text-sm font-semibold text-foreground font-mono">
                            {item.standard_number}
                          </td>

                          {/* Relevance */}
                          <td className="px-5 py-3.5 text-sm text-muted-foreground">
                            {item.relevance}
                          </td>

                          {/* Action */}
                          <td className="px-5 py-3.5 text-right text-sm">
                            <button
                              type="button"
                              className="rounded-lg px-2.5 py-1 text-xs font-semibold text-primary transition-all duration-150 group-hover:bg-primary/10 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </div>
      )}

      {/* Old Standards */}
      {activeTab === "Old Standards" && (
        <div className="mt-6">
          {/* Implementation will be done later. */}
        </div>
      )}

      {/* Saved Categories */}
      {activeTab === "Saved Categories" && (
        <div className="mt-6">
          <div className="mb-5">
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Saved Categories
            </h2>

            <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
              Browse categories available in the standards database
            </p>
          </div>

          {/* Temporary mock data - will be replaced with Redux */}
          <SavedCategories categories={mockCategories} />
        </div>
      )}
    </section>
  );
}