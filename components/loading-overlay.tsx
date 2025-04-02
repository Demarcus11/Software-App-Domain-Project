// components/loading-overlay.tsx
"use client";

import { Loader2 } from "lucide-react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="text-lg">Loading dashboard...</p>
      </div>
    </div>
  );
}
