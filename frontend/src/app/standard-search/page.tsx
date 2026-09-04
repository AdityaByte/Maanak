"use client";

import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import type {
  AppDispatch,
  RootState,
} from "@/redux/store";

import {
  fetchCategories,
  fetchStandards,
} from "@/redux/standardsSlice";

import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import StandardList from "../components/StandardList";

export default function StandardSearchPage() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    standards,
    categories,
  } = useSelector(
    (state: RootState) => state.standards
  );

  useEffect(() => {
    if (standards.length === 0) {
      dispatch(fetchStandards());
    }

    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [
    dispatch,
    standards.length,
    categories.length,
  ]);

  return (
    <div className="mx-auto max-w-7xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground">
          Standards Search
        </h1>

        <p className="mt-2 text-muted-foreground">
          Search and explore BIS standards.
        </p>
      </div>

      {/* Search */}
      <SearchBar />

      {/* Categories */}
      <CategoryTabs />

      {/* Standards */}
      <div className="mt-6">
        <StandardList />
      </div>

    </div>
  );
}