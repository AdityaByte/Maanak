"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchCategories, setSelectedCategory } from "@/redux/standardsSlice";
import { FolderTree, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function AllCategoriesPage() {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { categories, loadingCategories, errorCategories } = useSelector(
    (state: any) => state.standards
  );

  useEffect(() => {
    // Automatically skipped by createAsyncThunk condition if already present in Redux
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (categoryName: string) => {
    dispatch(setSelectedCategory(categoryName));
    router.push(`/standard-search?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <FolderTree className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            All BIS Categories
          </h1>
          <p className="text-sm text-muted-foreground">
            Browse and filter official standards grouped by industrial and technical sectors.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loadingCategories && categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm text-muted-foreground font-medium">
            Fetching standard divisions...
          </p>
        </div>
      )}

      {/* Error state */}
      {errorCategories && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm flex items-center gap-3 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{errorCategories}</p>
        </div>
      )}

      {/* Categories Grid */}
      {!loadingCategories && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category: string) => (
            <div
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="group cursor-pointer bg-card border border-border hover:border-primary/50 rounded-2xl p-5 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                  <FolderTree className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                  {category}
                </h3>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground group-hover:text-primary pt-3 border-t border-border/50">
                <span>View Standards</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}