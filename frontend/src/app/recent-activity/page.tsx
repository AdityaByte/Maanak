import React from 'react';

export default function RecentActivityPage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Recent Activity</h1>
        <p className="mt-1 text-sm text-muted-foreground">View your search history, opened files, and recent queries.</p>
      </div>
      <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground shadow-sm">
        Content for Recent Activity will be rendered here.
      </div>
    </div>
  );
}