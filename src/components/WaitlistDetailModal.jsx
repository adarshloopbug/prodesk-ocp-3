import React, { useEffect } from 'react';
import { X, Terminal, UserCheck } from 'lucide-react';

export default function WaitlistDetailModal({ entry, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!entry) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-detail-title"
    >
      <div className="mono-card w-full max-w-2xl overflow-hidden shadow-2xl space-y-0 border-zinc-700 animate-in fade-in zoom-in duration-150">
        
        <div className="p-4 sm:p-6 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg">
              <UserCheck className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-400">Route Param:</span>
                <code className="text-xs font-mono text-emerald-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                  GET /games/{entry.id}
                </code>
              </div>
              <h2 id="modal-detail-title" className="text-lg font-bold text-white mt-1">
                {entry.title} - {entry.gamerTag}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
            aria-label="Close detail modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md space-y-1">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">Record ID</span>
              <p className="text-sm font-mono font-bold text-white">{entry.id}</p>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md space-y-1">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">Game Title</span>
              <p className="text-sm font-semibold text-white truncate">{entry.title}</p>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md space-y-1">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">GamerTag</span>
              <p className="text-sm font-semibold text-white">{entry.gamerTag}</p>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md space-y-1">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">Email Address</span>
              <p className="text-sm font-mono text-zinc-300 truncate">{entry.email}</p>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md space-y-1">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">Genre & Platform</span>
              <p className="text-sm font-medium text-white">{entry.genre} ({entry.platform})</p>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md space-y-1">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">Status & Priority</span>
              <div className="flex items-center gap-2">
                <span className={`mono-badge ${
                  entry.status === 'APPROVED' ? 'mono-badge-approved' :
                  entry.status === 'INVITED' ? 'mono-badge-invited' : 'mono-badge-pending'
                }`}>
                  {entry.status}
                </span>
                <span className="text-xs font-mono text-zinc-300">Priority: {entry.priorityScore}/100</span>
              </div>
            </div>

          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md space-y-1">
            <span className="text-[11px] font-mono text-zinc-400 uppercase">Notes / Comments</span>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {entry.notes || <span className="text-zinc-500 italic">No notes provided.</span>}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                Raw Express Server JSON Payload (`req.params.id` = "{entry.id}")
              </span>
            </div>
            <pre className="p-3 bg-zinc-950 border border-zinc-800 rounded-md font-mono text-[11px] text-zinc-300 overflow-x-auto">
              {JSON.stringify(entry, null, 2)}
            </pre>
          </div>

        </div>

        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="mono-btn-secondary text-xs"
            aria-label="Close detail modal"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
