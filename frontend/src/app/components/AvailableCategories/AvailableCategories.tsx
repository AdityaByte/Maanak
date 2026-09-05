"use client";

import React from "react";
import { ArrowRight, Inbox, AlertCircle } from "lucide-react";
import Skeleton from "../ui/Skeleton";

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-md" />
            </div>
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2.5 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-8 text-center shadow-xs">
        <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
        <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
          {error}
        </p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-xs">
        <Inbox className="h-8 w-8 text-muted-foreground/60 mb-2" />
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
          className="group flex flex-col items-start rounded-2xl border border-border bg-card p-5 text-left shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <div className="flex w-full items-center justify-between gap-3">
            <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
              {category.name}
            </h3>
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 text-muted-foreground transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-primary"
            />
          </div>

          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Browse standards
          </p>
        </button>
      ))}
    </div>
  );
}