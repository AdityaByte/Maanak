"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOldStandards } from "@/redux/standardsSlice";
import StandardCard from "../components/StandardCard";
import { Loader2, History, AlertCircle } from "lucide-react";

export default function OldStandardsPage() {
  const dispatch = useDispatch<any>();
  const { oldStandards, loadingOldStandards, errorOldStandards } = useSelector(
    (state: any) => state.standards
  );

  useEffect(() => {
    // createAsyncThunk condition checks Redux first and skips if cached
    dispatch(fetchOldStandards());
  }, [dispatch]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Old &amp; Archived Standards
          </h1>
          <p className="text-sm text-muted-foreground">
            Superseded or historical Bureau of Indian Standards specifications.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loadingOldStandards && oldStandards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm text-muted-foreground font-medium">
            Checking cache and loading archived records...
          </p>
        </div>
      )}

      {/* Error state */}
      {errorOldStandards && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm flex items-center gap-3 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{errorOldStandards}</p>
        </div>
      )}

      {/* Equal-Height Standards Grid */}
      {!loadingOldStandards && oldStandards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {oldStandards.map((item: any) => (
            <div key={item.id} className="relative flex flex-col h-full">
              {/* Archived Tag Badge */}
              <span className="absolute top-5 right-5 z-10 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/30">
                Archived
              </span>
              {/* Standard card expands to full height */}
              <div className="h-full flex flex-col">
                <StandardCard standard={item} className="h-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loadingOldStandards && oldStandards.length === 0 && !errorOldStandards && (
        <div className="bg-card border border-border rounded-2xl p-16 text-center text-muted-foreground text-sm">
          No archived standards found.
        </div>
      )}
    </div>
  );
}