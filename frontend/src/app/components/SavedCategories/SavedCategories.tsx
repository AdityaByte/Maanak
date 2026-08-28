"use client";

import React from "react";

export type Category = {
  id: string;
  name: string;
};

type SavedCategoriesProps = {
  categories: Category[];
  isLoading?: boolean;
  error?: string | null;
};

export default function SavedCategories({
  categories,
  isLoading = false,
  error = null,
}: SavedCategoriesProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border bg-card p-10 text-center shadow-sm">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
          Loading categories...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center shadow-sm">
        <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
          {error}
        </p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">No categories found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className="group flex flex-col items-start rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <div className="flex w-full items-center justify-between gap-3">
            <h3 className="font-medium text-foreground transition-colors group-hover:text-primary">
              {category.name}
            </h3>
            <span
              aria-hidden="true"
              className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
            >
              →
            </span>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Browse standards
          </p>
        </button>
      ))}
    </div>
  );
}