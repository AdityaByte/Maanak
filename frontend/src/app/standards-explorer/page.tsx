import React from "react";
import { Compass } from "lucide-react";
import Footer from "../components/Footer";

export default function StandardsExplorerPage() {
  return (
    <div className="w-full space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-xs">
          <Compass className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Standards Explorer
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Explore standards organized by category and domain.
          </p>
        </div>
      </div>

      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground shadow-xs">
        <Compass className="h-8 w-8 text-muted-foreground/40 mb-3" />
        <p>Content for Standards Explorer will be rendered here.</p>
      </div>

      <Footer />
    </div>
  );
}