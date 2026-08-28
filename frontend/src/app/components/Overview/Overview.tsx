"use client";

import React, { useEffect, useState } from "react";
import SavedCategories, {
  Category,
} from "../SavedCategories/SavedCategories";

type Standard = {
  standard: string;
  title: string;
  domain: string;
  published: string;
  status: "Active" | "Withdrawn" | "Superseded";
};

const mockLatestSearchResults: Standard[] = [
  {
    standard: "IS 456 : 2000",
    title: "Plain and Reinforced Concrete - Code of Practice",
    domain: "Civil Engineering",
    published: "Oct 2000",
    status: "Active",
  },
  {
    standard: "IS 800 : 2007",
    title: "General Construction in Steel - Code of Practice",
    domain: "Civil Engineering",
    published: "Dec 2007",
    status: "Active",
  },
  {
    standard: "IS 1893 : Part 1 : 2016",
    title: "Criteria for Earthquake Resistant Design of Structures",
    domain: "Civil Engineering",
    published: "Dec 2016",
    status: "Withdrawn",
  },
  {
    standard: "IS 13920 : 2016",
    title: "Ductile Design and Detailing of Reinforced Concrete",
    domain: "Civil Engineering",
    published: "Nov 2016",
    status: "Superseded",
  },
];

/*
 * Temporary data source.
 *
 * For now, this returns mock data so the Overview can be developed
 * independently of the backend.
 *
 * Later, this function will fetch the latest search results from
 * the backend cache.
 */
async function fetchLatestSearchResults(): Promise<Standard[]> {
  return mockLatestSearchResults;
}

/*
 * Temporary category data.
 *
 * For now, these categories are hardcoded so the Saved Categories
 * UI can be developed independently of the backend.
 *
 * Later, this will be replaced with the categories returned by
 * the backend from the Vector DB.
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

const STATUS_STYLES: Record<Standard["status"], string> = {
  Active:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
  Withdrawn:
    "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-400 dark:ring-rose-400/20",
  Superseded:
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20",
};

function StatusDot({ status }: { status: Standard["status"] }) {
  const dotColor =
    status === "Active"
      ? "bg-emerald-500"
      : status === "Withdrawn"
        ? "bg-rose-500"
        : "bg-amber-500";

  return <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />;
}

export default function Overview() {
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>("Overview");
  const [searchResults, setSearchResults] = useState<Standard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLatestSearchResults = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const results = await fetchLatestSearchResults();
        setSearchResults(results);
      } catch (err) {
        console.error("Failed to load latest search results:", err);
        setError("Unable to load latest search results.");
      } finally {
        setIsLoading(false);
      }
    };

    loadLatestSearchResults();
  }, []);

  return (
    <section className="w-full bg-background px-6 py-8 text-foreground sm:px-8">
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative px-1 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                activeTab === tab
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              <span
                className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full transition-colors ${
                  activeTab === tab ? "bg-primary" : "bg-transparent"
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
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Latest Search Results
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Your most recently searched standards
              </p>
            </div>

            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              View all
              <span aria-hidden="true">→</span>
            </button>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center rounded-xl border border-border bg-card p-10 text-center shadow-sm">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
                Loading latest search results...
              </p>
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="rounded-xl border border-border bg-card p-10 text-center shadow-sm">
              <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
                {error}
              </p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && searchResults.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No recent search results found.
              </p>
            </div>
          )}

          {/* Table */}
          {!isLoading && !error && searchResults.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/60 text-left">
                      <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Standard
                      </th>
                      <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Title
                      </th>
                      <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Domain
                      </th>
                      <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Published
                      </th>
                      <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {searchResults.map((item, index) => (
                      <tr
                        key={item.standard}
                        className={`group border-b border-border transition-colors last:border-b-0 hover:bg-muted/50 ${
                          index % 2 === 1 ? "bg-muted/20" : ""
                        }`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          {item.standard}
                        </td>

                        <td className="px-6 py-4 text-sm text-foreground/80">
                          {item.title}
                        </td>

                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {item.domain}
                        </td>

                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {item.published}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                              STATUS_STYLES[item.status]
                            }`}
                          >
                            <StatusDot status={item.status} />
                            {item.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right text-sm">
                          <button
                            type="button"
                            className="rounded-md px-2.5 py-1 font-medium text-primary opacity-0 transition-all group-hover:opacity-100 hover:bg-primary/10 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
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
          {/* Intentionally left blank.
              Implementation will be done later. */}
        </div>
      )}

      {/* Saved Categories */}
      {activeTab === "Saved Categories" && (
        <div className="mt-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Saved Categories
            </h2>

            <p className="mt-0.5 text-sm text-muted-foreground">
              Browse categories available in the standards database
            </p>
          </div>

          <SavedCategories categories={mockCategories} />
        </div>
      )}
    </section>
  );
}