"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCategories, fetchOldStandards } from "@/redux/standardsSlice";
import SavedCategories, {
  Category,
} from "../AvailableCategories/AvailableCategories";
import Skeleton from "../ui/Skeleton";
import { ArrowRight, Inbox, AlertCircle } from "lucide-react";

type Standard = {
  standard_number: string;
  relevance: string;
};

const TABS = [
  "Overview",
  "Old Standards",
  "Available Categories",
] as const;

export default function Overview() {
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>("Overview");

  // --------------------------------------------------
  // Search Results State
  // --------------------------------------------------

  const [searchResults, setSearchResults] = useState<Standard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --------------------------------------------------
  // Redux
  // --------------------------------------------------

  const dispatch = useDispatch<AppDispatch>();

  const {
    categories,
    categoriesLoading,
    categoriesError,

    oldStandards,
    oldStandardsLoading,
    oldStandardsError,
  } = useSelector(
    (state: RootState) => state.standards
  );

  // --------------------------------------------------
  // Load Recent Search Results
  // --------------------------------------------------

  const loadLatestSearchResults = () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get stored search history
      const storedSearches = localStorage.getItem("searchResults");

      // No searches have been stored yet
      if (!storedSearches) {
        setSearchResults([]);
        return;
      }

      // Parse localStorage data
      const searchHistory = JSON.parse(storedSearches);

      // Make sure stored data is an array
      if (!Array.isArray(searchHistory) || searchHistory.length === 0) {
        setSearchResults([]);
        return;
      }

      const recentStandards: Standard[] = [];

      for (const search of searchHistory) {
        const citations = search?.response?.citations;

        if (!Array.isArray(citations)) {
          continue;
        }

        for (const citation of citations) {
          if (
            citation &&
            typeof citation.standard_number === "string" &&
            citation.standard_number.trim() !== ""
          ) {
            recentStandards.push({
              standard_number: citation.standard_number,
              relevance: citation.relevance || "",
            });
          }

          if (recentStandards.length === 5) {
            break;
          }
        }

        if (recentStandards.length === 5) {
          break;
        }
      }

      setSearchResults(recentStandards);
    } catch (err) {
      console.error("Failed to load recent search results:", err);
      setError("Unable to load recent search results.");
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------
  // Load Search Results on Mount
  // --------------------------------------------------

  useEffect(() => {
    loadLatestSearchResults();
  }, []);

  // --------------------------------------------------
  // Fetch Dashboard Data on Mount
  // --------------------------------------------------

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchOldStandards());
  }, [dispatch]);

  // --------------------------------------------------
  // Show ONLY 9 Categories
  // --------------------------------------------------

  const categoryData: Category[] = categories
    .slice(0, 9)
    .map((category, index) => ({
      id: `${index + 1}`,
      name: category,
    }));

  return (
    <section className="w-full bg-background px-4 sm:px-6 lg:px-8 py-6 text-foreground">

      {/* ==================================================
          TABS
      ================================================== */}

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
                  activeTab === tab ? "bg-primary" : "bg-transparent"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ==================================================
          OVERVIEW
      ================================================== */}

      {activeTab === "Overview" && (
        <div className="mt-6">

          {/* Heading */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground">
                Latest Search Results
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
                Your 5 most recently searched standards
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

          {/* LOADING SKELETON */}
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
                    <Skeleton className="h-5 w-28 rounded-md hidden md:block" />
                    <Skeleton className="h-5 w-20 rounded-md hidden sm:block" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                ))}
              </div>
              <p className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground font-medium">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Loading latest search results...
              </p>
            </div>
          )}

          {/* ERROR */}
          {!isLoading && error && (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-8 text-center shadow-xs">
              <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                {error}
              </p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!isLoading && !error && searchResults.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-xs">
              <Inbox className="h-8 w-8 text-muted-foreground/60 mb-2" />
              <p className="text-sm text-muted-foreground">
                No recent search results found.
              </p>
            </div>
          )}

          {/* TABLE */}
          {!isLoading && !error && searchResults.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left">
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Standard Number
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
                    {searchResults.map((item, index) => (
                      <tr
                        key={`${item.standard_number}-${index}`}
                        className="group transition-colors hover:bg-muted/40"
                      >
                        <td className="px-5 py-3.5 text-sm font-semibold text-foreground font-mono">
                          {item.standard_number}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-muted-foreground">
                          {item.relevance || "Standard match"}
                        </td>
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

      {/* ==================================================
          OLD STANDARDS
      ================================================== */}

      {activeTab === "Old Standards" && (
        <div className="mt-6">
          {/* Intentionally handled on its dedicated page or tab */}
        </div>
      )}

      {/* ==================================================
          AVAILABLE CATEGORIES
      ================================================== */}

      {activeTab === "Available Categories" && (
        <div className="mt-6">
          <div className="mb-5">
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Available Categories
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
              Browse categories available in the standards database
            </p>
          </div>
          <SavedCategories categories={categoryData} />
        </div>
      )}
    </section>
  );
}