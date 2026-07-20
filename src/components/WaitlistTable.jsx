import React from 'react';
import { Eye, Edit3, Trash2, Sparkles } from 'lucide-react';

export default function WaitlistTable({ 
  entries, 
  onViewDetail, 
  onEdit, 
  onDelete
}) {

  return (
    <div className="mono-card overflow-hidden">
      
      <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-zinc-300">
          <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
          <span className="font-semibold text-white">Active Game Waitlist Records</span>
          <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded font-mono text-[11px] text-zinc-300">
            Count: {entries.length}
          </span>
        </div>

        <div className="flex items-center space-x-2 font-mono text-[11px] text-zinc-400">
          <span>Express REST Route:</span>
          <code className="text-emerald-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
            GET /games
          </code>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table 
          className="w-full text-left border-collapse text-xs"
          role="table"
          aria-label="Game Waitlist Data Table"
        >
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/80 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
              <th scope="col" className="py-3 px-4 font-semibold">GamerTag & Email</th>
              <th scope="col" className="py-3 px-4 font-semibold">Game Title (Route :id)</th>
              <th scope="col" className="py-3 px-4 font-semibold">Genre / Platform</th>
              <th scope="col" className="py-3 px-4 font-semibold">Priority</th>
              <th scope="col" className="py-3 px-4 font-semibold">Status</th>
              <th scope="col" className="py-3 px-4 font-semibold text-right">Route Param Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/30">
            {entries.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-zinc-800/40 transition-colors group"
              >
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {item.gamerTag}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-400">{item.email}</span>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-zinc-200 font-medium truncate max-w-[180px]">{item.title}</span>
                    <code className="text-[10px] font-mono text-zinc-500">:id = {item.id}</code>
                  </div>
                </td>

                <td className="py-3 px-4 font-mono text-zinc-300">
                  <div>{item.genre}</div>
                  <div className="text-[10px] text-zinc-500">{item.platform}</div>
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2 font-mono text-[11px]">
                    <div className="w-14 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-300"
                        style={{ width: `${item.priorityScore}%` }}
                      ></div>
                    </div>
                    <span className="text-zinc-300 font-semibold">{item.priorityScore}</span>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <span className={`mono-badge ${
                    item.status === 'APPROVED' ? 'mono-badge-approved' :
                    item.status === 'INVITED' ? 'mono-badge-invited' : 'mono-badge-pending'
                  }`}>
                    {item.status}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    
                    <button
                      onClick={() => onViewDetail(item)}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                      title={`GET /games/${item.id}`}
                      aria-label={`Inspect detail for game waitlist entry ${item.gamerTag}`}
                    >
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    </button>

                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                      title={`PUT /games/${item.id}`}
                      aria-label={`Edit game waitlist entry ${item.gamerTag}`}
                    >
                      <Edit3 className="w-4 h-4" aria-hidden="true" />
                    </button>

                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                      title={`DELETE /games/${item.id}`}
                      aria-label={`Delete game waitlist entry ${item.gamerTag}`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500">
        <span>Monochromatic Corporate UI Standard</span>
        <span>Keyboard Navigable & ARIA Compliant</span>
      </div>

    </div>
  );
}
