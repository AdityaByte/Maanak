import React from 'react';

export default function OldStandardsPage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Old Standards</h1>
        <p className="mt-1 text-sm text-muted-foreground">Browse historical, superseded, and archived BIS standards.</p>
      </div>
      <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground shadow-sm">
        Content for Old Standards will be rendered here.
      </div>
    </div>
  );
}