import React, { useState } from 'react';
import { Terminal, Play, CheckCircle, AlertCircle, Cpu, Code2, ArrowRight } from 'lucide-react';
import { logAnalytics } from '../utils/telemetry';

export default function RouteParamsExplorer({ games, isSlowNetworkSimulated }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState('GET_GAME_BY_ID');
  const [paramId, setParamId] = useState('game-101');
  const [requestBody, setRequestBody] = useState('{\n  "title": "Cyberpunk Odyssey 2077",\n  "gamerTag": "ApexPredator_99",\n  "email": "apex.predator@esports.org",\n  "status": "APPROVED",\n  "priorityScore": 95\n}');
  
  const [responseState, setResponseState] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const endpoints = [
    {
      id: 'GET_ALL_GAMES',
      method: 'GET',
      path: '/games',
      description: 'Fetch all game waitlist entries',
      paramsNeeded: []
    },
    {
      id: 'GET_GAME_BY_ID',
      method: 'GET',
      path: '/games/:id',
      description: 'Retrieve single game waitlist entry by route parameter :id',
      paramsNeeded: ['id']
    },
    {
      id: 'POST_GAME',
      method: 'POST',
      path: '/games',
      description: 'Create new game waitlist entry',
      paramsNeeded: ['body']
    },
    {
      id: 'PUT_GAME',
      method: 'PUT',
      path: '/games/:id',
      description: 'Update game waitlist entry details by route parameter :id',
      paramsNeeded: ['id', 'body']
    },
    {
      id: 'DELETE_GAME',
      method: 'DELETE',
      path: '/games/:id',
      description: 'Delete game waitlist entry by route parameter :id',
      paramsNeeded: ['id']
    }
  ];

  const currentEndpoint = endpoints.find(e => e.id === selectedEndpoint);
  const resolvedPath = currentEndpoint.path.replace(':id', paramId || ':id');

  const executeRequest = async () => {
    setIsExecuting(true);
    setResponseState(null);

    const startTime = performance.now();
    try {
      const options = {
        method: currentEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          ...(isSlowNetworkSimulated ? { 'x-simulate-delay': 'true' } : {})
        }
      };

      if (['POST', 'PUT'].includes(currentEndpoint.method) && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(resolvedPath, options);
      const endTime = performance.now();
      const json = await res.json();

      if (json.success) {
        logAnalytics();
      }

      setResponseState({
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        duration: Math.round(endTime - startTime),
        data: json
      });
    } catch (err) {
      setResponseState({
        status: 500,
        statusText: 'Fetch Failure',
        ok: false,
        duration: 0,
        data: { success: false, message: err.message, errors: [err.message] }
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <section aria-labelledby="explorer-heading" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 id="explorer-heading" className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-zinc-400" aria-hidden="true" />
            Route Parameters API Explorer
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Test Express REST API endpoints with explicit dynamic URL route parameters in real-time.
          </p>
        </div>
        
        <div className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-mono flex items-center gap-2 text-zinc-300">
          <Cpu className="w-4 h-4 text-zinc-400" aria-hidden="true" />
          <span>Pattern: <strong className="text-white">{currentEndpoint.path}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="mono-card p-4 space-y-3">
            <label className="text-xs font-semibold uppercase text-zinc-400 tracking-wider block">
              1. Select REST API Endpoint
            </label>
            <div className="space-y-2">
              {endpoints.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => setSelectedEndpoint(ep.id)}
                  className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all flex flex-col gap-1.5 ${
                    selectedEndpoint === ep.id
                      ? 'bg-zinc-800 border-white text-white shadow-sm'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                  aria-pressed={selectedEndpoint === ep.id}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ep.method === 'GET' ? 'bg-zinc-700 text-white' :
                      ep.method === 'POST' ? 'bg-white text-zinc-950 font-bold' :
                      ep.method === 'PUT' ? 'bg-zinc-600 text-white' : 'bg-red-950 text-red-200 border border-red-800'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="text-[11px] text-zinc-300 truncate max-w-[200px]">{ep.path}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-sans">{ep.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mono-card p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <label className="text-xs font-semibold uppercase text-zinc-400 tracking-wider block">
                2. Configure Route Parameters
              </label>
              <Code2 className="w-4 h-4 text-zinc-500" aria-hidden="true" />
            </div>

            {currentEndpoint.paramsNeeded.includes('id') && (
              <div className="space-y-1.5">
                <label htmlFor="param-id" className="text-xs font-mono text-zinc-300 flex items-center justify-between">
                  <span>Route Param: <code className="text-white bg-zinc-800 px-1 py-0.5 rounded">:id</code></span>
                  <span className="text-[10px] text-zinc-500">Resource ID</span>
                </label>
                <select
                  id="param-id"
                  value={paramId}
                  onChange={(e) => setParamId(e.target.value)}
                  className="mono-input text-xs font-mono"
                  aria-label="Route parameter id"
                >
                  {games.map(g => (
                    <option key={g.id} value={g.id}>{g.id} ({g.title})</option>
                  ))}
                  <option value="invalid-game-999">invalid-game-999 (Test 404 Error)</option>
                </select>
              </div>
            )}

            {currentEndpoint.paramsNeeded.includes('body') && (
              <div className="space-y-1.5">
                <label htmlFor="param-body" className="text-xs font-mono text-zinc-300">
                  JSON Request Body:
                </label>
                <textarea
                  id="param-body"
                  rows={5}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="mono-input text-xs font-mono"
                  aria-label="JSON Request payload"
                />
              </div>
            )}

            <button
              onClick={executeRequest}
              disabled={isExecuting}
              className="mono-btn-primary w-full justify-center py-2.5 text-xs font-bold uppercase tracking-wider"
              aria-label={`Execute HTTP request for ${resolvedPath}`}
            >
              {isExecuting ? (
                <span className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                  Executing Request...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  Execute {currentEndpoint.method} Request
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="mono-card p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-800 pb-2">
              <span className="uppercase font-semibold text-zinc-300">HTTP Request Payload</span>
              <span>Express Route Resolution</span>
            </div>
            
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md font-mono text-xs space-y-2">
              <div className="flex items-center gap-2 text-white">
                <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded font-bold">{currentEndpoint.method}</span>
                <span className="text-emerald-400 font-semibold">{resolvedPath}</span>
              </div>

              <div className="pt-2 border-t border-zinc-900 text-[11px] text-zinc-400 flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-zinc-500" aria-hidden="true" />
                <span>Express req.params: </span>
                <code className="text-zinc-200 bg-zinc-900 px-2 py-0.5 rounded">
                  {JSON.stringify(currentEndpoint.paramsNeeded.includes('id') ? { id: paramId } : {})}
                </code>
              </div>
            </div>
          </div>

          <div className="mono-card p-4 space-y-4 min-h-[360px] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
                  HTTP Response Inspector
                </span>
                
                {responseState && (
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-zinc-400">Latency: {responseState.duration}ms</span>
                    <span className={`px-2 py-0.5 rounded font-bold flex items-center gap-1 ${
                      responseState.ok 
                        ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' 
                        : 'bg-red-950 border border-red-800 text-red-300'
                    }`}>
                      {responseState.ok ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      HTTP {responseState.status} {responseState.statusText}
                    </span>
                  </div>
                )}
              </div>

              {responseState ? (
                <div className="space-y-2">
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md font-mono text-xs max-h-[380px] overflow-y-auto">
                    <pre className="text-zinc-300 whitespace-pre-wrap">
                      {JSON.stringify(responseState.data, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="h-[280px] border border-dashed border-zinc-800 rounded-md flex flex-col items-center justify-center p-6 text-center text-zinc-500 space-y-2">
                  <Terminal className="w-8 h-8 text-zinc-600" aria-hidden="true" />
                  <p className="text-xs font-mono text-zinc-400">No HTTP response yet</p>
                  <p className="text-[11px] text-zinc-500 max-w-sm">
                    Select an endpoint, configure the route parameters, and click "Execute Request" to inspect the JSON output.
                  </p>
                </div>
              )}
            </div>

            <div className="text-[11px] text-zinc-500 pt-3 border-t border-zinc-800 flex items-center justify-between font-mono">
              <span>Standardized JSON Payload Format</span>
              <span>Express REST Route Architecture</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
