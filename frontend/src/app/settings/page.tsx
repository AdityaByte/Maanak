import React from 'react';

export default function SettingsPage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage preferences and profile settings.</p>
      </div>
      <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground shadow-sm">
        Content for Settings will be rendered here.
      </div>
    </div>
  );
}