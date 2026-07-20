import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WaitlistTable from './components/WaitlistTable';
import RouteParamsExplorer from './components/RouteParamsExplorer';
import NfrComplianceView from './components/NfrComplianceView';
import WaitlistFormModal from './components/WaitlistFormModal';
import WaitlistDetailModal from './components/WaitlistDetailModal';
import EmptyState from './components/EmptyState';
import LoadingIndicator from './components/LoadingIndicator';
import { Plus, Search, RotateCcw, Gamepad2, CheckCircle2 } from 'lucide-react';
import { logAnalytics } from './utils/telemetry';

export default function App() {
  const [activeTab, setActiveTab] = useState('waitlist');
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSlowNetworkSimulated, setIsSlowNetworkSimulated] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [selectedEntryForDetail, setSelectedEntryForDetail] = useState(null);
  
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch games list via GET /games (with optional search query parameter)
  const fetchGames = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      let url = '/games';
      if (searchQuery.trim()) {
        url += `?search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const headers = {
        'Content-Type': 'application/json',
        ...(isSlowNetworkSimulated ? { 'x-simulate-delay': 'true' } : {})
      };

      const res = await fetch(url, { headers });
      const responseText = await res.text();
      
      let json;
      try {
        json = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`API Endpoint '${url}' returned non-JSON response (HTTP ${res.status}). Ensure server routes are deployed.`);
      }

      if (json.success) {
        setGames(json.data || []);
      } else {
        setErrorMessage(json.message || 'Failed to fetch games data.');
        setGames([]);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error fetching data.');
      setGames([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [isSlowNetworkSimulated]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGames();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Create Entry (POST /games)
  const handleCreateEntry = async (payload) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(isSlowNetworkSimulated ? { 'x-simulate-delay': 'true' } : {})
      };

      const res = await fetch('/games', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (json.success) {
        logAnalytics(); // Log required analytics string on successful CRUD action
        showToast(json.message || 'Game waitlist entry created successfully.');
        setIsFormModalOpen(false);
        fetchGames();
      } else {
        showToast(json.message || (json.errors && json.errors[0]) || 'Creation failed');
      }
    } catch (err) {
      showToast(err.message || 'Network error creating entry');
    }
  };

  // Handle Update Entry (PUT /games/:id)
  const handleUpdateEntry = async (payload) => {
    if (!editingEntry) return;

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(isSlowNetworkSimulated ? { 'x-simulate-delay': 'true' } : {})
      };

      const res = await fetch(`/games/${editingEntry.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (json.success) {
        logAnalytics(); // Log required analytics string on successful CRUD action
        showToast(json.message || `Updated entry '${editingEntry.id}' successfully.`);
        setIsFormModalOpen(false);
        setEditingEntry(null);
        fetchGames();
      } else {
        showToast(json.message || (json.errors && json.errors[0]) || 'Update failed');
      }
    } catch (err) {
      showToast(err.message || 'Network error updating entry');
    }
  };

  // Handle Delete Entry (DELETE /games/:id)
  const handleDeleteEntry = async (id) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(isSlowNetworkSimulated ? { 'x-simulate-delay': 'true' } : {})
      };

      const res = await fetch(`/games/${id}`, {
        method: 'DELETE',
        headers
      });
      const json = await res.json();

      if (json.success) {
        logAnalytics(); // Log required analytics string on successful CRUD action
        showToast(json.message || `Deleted entry '${id}' successfully.`);
        fetchGames();
      } else {
        showToast(json.message || (json.errors && json.errors[0]) || 'Deletion failed');
      }
    } catch (err) {
      showToast(err.message || 'Network error deleting entry');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSlowNetworkSimulated={isSlowNetworkSimulated}
        setIsSlowNetworkSimulated={setIsSlowNetworkSimulated}
      />

      {toast && (
        <div 
          className="fixed bottom-6 right-6 z-50 p-4 bg-white text-zinc-950 border border-zinc-300 rounded-lg shadow-2xl font-mono text-xs flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {activeTab === 'waitlist' && (
          <div className="space-y-6">
            
            <div className="mono-card p-4 sm:p-6 space-y-4">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-white" aria-hidden="true" />
                    Game Waitlist Management Dashboard
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Express REST API with explicit route parameters (GET /games, GET /games/:id, POST /games, PUT /games/:id, DELETE /games/:id).
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingEntry(null);
                    setIsFormModalOpen(true);
                  }}
                  className="mono-btn-primary text-xs shrink-0"
                  aria-label="Create new game waitlist entry"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  Add Waitlist Entry
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-zinc-800">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" aria-hidden="true" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by game title, gamer tag, email, or ID..."
                    className="mono-input pl-9 text-xs"
                    aria-label="Search waitlist entries"
                  />
                </div>

                {searchQuery && (
                  <button
                    onClick={handleResetFilters}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded border border-zinc-700"
                    title="Reset search"
                    aria-label="Reset search filter"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>

            </div>

            {isLoading ? (
              <LoadingIndicator isSlowNetworkSimulated={isSlowNetworkSimulated} />
            ) : errorMessage ? (
              <div className="mono-card p-6 text-center text-red-300 bg-red-950/40 border-red-800 space-y-2">
                <p className="text-sm font-semibold">{errorMessage}</p>
                <button onClick={fetchGames} className="mono-btn-secondary text-xs">Retry Fetch</button>
              </div>
            ) : games.length === 0 ? (
              <EmptyState
                searchQuery={searchQuery}
                onResetFilters={handleResetFilters}
                onCreateNew={() => {
                  setEditingEntry(null);
                  setIsFormModalOpen(true);
                }}
              />
            ) : (
              <WaitlistTable
                entries={games}
                onViewDetail={(entry) => setSelectedEntryForDetail(entry)}
                onEdit={(entry) => {
                  setEditingEntry(entry);
                  setIsFormModalOpen(true);
                }}
                onDelete={handleDeleteEntry}
              />
            )}

          </div>
        )}

        {activeTab === 'explorer' && (
          <RouteParamsExplorer
            games={games}
            isSlowNetworkSimulated={isSlowNetworkSimulated}
          />
        )}

        {activeTab === 'compliance' && (
          <NfrComplianceView />
        )}

      </main>

      <WaitlistFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingEntry(null);
        }}
        onSubmit={editingEntry ? handleUpdateEntry : handleCreateEntry}
        editingEntry={editingEntry}
      />

      <WaitlistDetailModal
        entry={selectedEntryForDetail}
        onClose={() => setSelectedEntryForDetail(null)}
      />

      <footer className="border-t border-zinc-800 bg-zinc-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono gap-4">
          <div>Monochromatic Corporate Design • Express REST API /games</div>
          <div>Target 100% Lighthouse A11y • XSS Sanitized</div>
        </div>
      </footer>

    </div>
  );
}
