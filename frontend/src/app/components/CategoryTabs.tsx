"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import type {
  AppDispatch,
  RootState,
} from "@/redux/store";

import {
  setSelectedCategory,
} from "@/redux/standardsSlice";

export default function CategoryTabs() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    categories,
    selectedCategory,
  } = useSelector(
    (state: RootState) => state.standards
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const allCategories = [
    "All",
    ...categories,
  ];

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const amount = 350;

    scrollRef.current.scrollBy({
      left:
        direction === "left"
          ? -amount
          : amount,
      behavior: "smooth",
    });
  };

  // Automatically bring selected category into view
  useEffect(() => {
    const activeButton =
      scrollRef.current?.querySelector(
        '[data-active="true"]'
      );

    if (activeButton instanceof HTMLElement) {
      activeButton.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedCategory]);

  return (
    <div className="relative mb-2">
      
      {/* Left Arrow */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll categories left"
        className="absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition hover:bg-muted hover:text-foreground"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15 19-7-7 7-7"
          />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll categories right"
        className="absolute right-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition hover:bg-muted hover:text-foreground"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9 5 7 7-7 7"
          />
        </svg>
      </button>

      {/* Left Fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-[5] h-full w-12 bg-gradient-to-r from-background to-transparent" />

      {/* Right Fade */}
      <div className="pointer-events-none absolute right-0 top-0 z-[5] h-full w-12 bg-gradient-to-l from-background to-transparent" />

      {/* Categories */}
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-8 overflow-x-auto scroll-smooth px-12"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {allCategories.map((category) => {
          const isActive =
            selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              data-active={isActive}
              onClick={() =>
                dispatch(
                  setSelectedCategory(category)
                )
              }
              className={`relative shrink-0 whitespace-nowrap pb-4 pt-2 text-sm font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}

              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}