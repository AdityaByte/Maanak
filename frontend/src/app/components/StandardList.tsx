"use client";

import { useSelector } from "react-redux";

import type { RootState } from "@/redux/store";

import StandardCard from "./StandardCard";

export default function StandardList() {
  const {
    standards,
    selectedCategory,
    searchQuery,
  } = useSelector(
    (state: RootState) => state.standards
  );

  const filteredStandards =
    standards.filter((standard) => {

      // Category filter
      const matchesCategory =
        selectedCategory === "All" ||
        standard.category === selectedCategory;

      // Search filter
      const query =
        searchQuery.trim().toLowerCase();

      const matchesSearch =
        query === "" ||
        standard.id
          .toLowerCase()
          .includes(query) ||
        standard.title
          .toLowerCase()
          .includes(query) ||
        standard.content
          .toLowerCase()
          .includes(query) ||
        standard.category
          .toLowerCase()
          .includes(query) ||
        (
          standard.sub_category ?? ""
        )
          .toLowerCase()
          .includes(query);

      return (
        matchesCategory &&
        matchesSearch
      );
    });

  if (filteredStandards.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <h2 className="text-lg font-semibold text-foreground">
          No standards found
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Try changing your search or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {filteredStandards.map(
        (standard) => (
          <StandardCard
            key={standard.id}
            standard={standard}
          />
        )
      )}
    </div>
  );
}