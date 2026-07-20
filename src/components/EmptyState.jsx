import React from 'react';
import { SearchX, RotateCcw, Plus } from 'lucide-react';

export default function EmptyState({ searchQuery, onResetFilters, onCreateNew }) {
  return (
    <div 
      className="mono-card p-12 text-center flex flex-col items-center justify-center space-y-4 my-6"
      role="region"
      aria-label="Empty search results notification"
    >
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-full">
        <SearchX className="w-8 h-8 text-zinc-400" aria-hidden="true" />
      </div>

      <div className="space-y-1 max-w-md">
        <h3 className="text-base font-semibold text-white">No game waitlist data found</h3>
        <p className="text-xs text-zinc-400">
          No records match your active query
          {searchQuery && <span> matching "<code className="text-zinc-200">{searchQuery}</code>"</span>}.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        {searchQuery && (
          <button
            onClick={onResetFilters}
            className="mono-btn-secondary text-xs"
            aria-label="Reset search query"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reset Search Filter
          </button>
        )}

        <button
          onClick={onCreateNew}
          className="mono-btn-primary text-xs"
          aria-label="Create new waitlist entry"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          Add Waitlist Entry
        </button>
      </div>
    </div>
  );
}
