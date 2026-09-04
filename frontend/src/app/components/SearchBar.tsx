"use client";

import { useDispatch, useSelector } from "react-redux";

import type {
  AppDispatch,
  RootState,
} from "@/redux/store";

import {
  setSearchQuery,
} from "@/redux/standardsSlice";

export default function SearchBar() {
  const dispatch = useDispatch<AppDispatch>();

  const searchQuery = useSelector(
    (state: RootState) =>
      state.standards.searchQuery
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      setSearchQuery(e.target.value)
    );
  };

  return (
    <div className="mb-8">
      <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-2 shadow-sm">

        {/* Search Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
            />
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Search BIS standards..."
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            type="button"
            onClick={() =>
              dispatch(setSearchQuery(""))
            }
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}