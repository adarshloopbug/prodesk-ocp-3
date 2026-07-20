import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingIndicator({ isSlowNetworkSimulated, message = "Fetching Game Waitlist data via Express REST API..." }) {
  return (
    <div 
      className="mono-card p-12 text-center flex flex-col items-center justify-center space-y-4 my-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading data"
    >
      <div className="relative">
        <Loader2 className="w-8 h-8 text-white animate-spin" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <p className="text-xs font-mono text-zinc-300 font-medium">{message}</p>
        {isSlowNetworkSimulated && (
          <span className="inline-block text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
            Slow 3G Connection Simulation Active (1.5s delay)
          </span>
        )}
      </div>

      {/* Skeleton loader items */}
      <div className="w-full max-w-2xl space-y-2 pt-4 opacity-50">
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-full"></div>
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-5/6 mx-auto"></div>
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-4/6 mx-auto"></div>
      </div>
    </div>
  );
}
