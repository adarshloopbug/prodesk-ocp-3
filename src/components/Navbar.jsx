import React from 'react';
import { Layers, Terminal, Shield, Wifi, WifiOff } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  isSlowNetworkSimulated, 
  setIsSlowNetworkSimulated 
}) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-zinc-900 border border-zinc-700 rounded-lg">
              <Layers className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-mono text-zinc-400 block tracking-wider uppercase">Enterprise Express REST API</span>
              <h1 className="text-sm font-semibold text-white tracking-tight">
                Game Waitlist CRUD API <span className="font-mono text-xs px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-300">with Route Parameters</span>
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2" aria-label="Main Navigation">
            <button
              onClick={() => setActiveTab('waitlist')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeTab === 'waitlist'
                  ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
              aria-current={activeTab === 'waitlist' ? 'page' : undefined}
            >
              Waitlist Dashboard
            </button>
            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'explorer'
                  ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
              aria-current={activeTab === 'explorer' ? 'page' : undefined}
            >
              <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
              Route Params Explorer
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'compliance'
                  ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
              aria-current={activeTab === 'compliance' ? 'page' : undefined}
            >
              <Shield className="w-3.5 h-3.5" aria-hidden="true" />
              NFR & DoD Specs
            </button>
          </nav>

          {/* Network Connection Simulator Toggle (Unhappy Path Requirement) */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSlowNetworkSimulated(!isSlowNetworkSimulated)}
              className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-all flex items-center gap-2 ${
                isSlowNetworkSimulated
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
              }`}
              aria-pressed={isSlowNetworkSimulated}
              aria-label="Toggle slow network simulation"
              title="Simulate slow 3G connectivity (1.5s delay on requests)"
            >
              {isSlowNetworkSimulated ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" aria-hidden="true" />
                  <span>Slow 3G Mode (Active)</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                  <span>Simulate Slow 3G</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
