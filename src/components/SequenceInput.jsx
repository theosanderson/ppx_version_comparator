import React, { useState } from 'react'

export default function SequenceInput({ hostname, sequenceId, onHostnameChange, onSequenceIdChange, onFetch }) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div className="w-full bg-white/70 backdrop-blur border border-slate-200 rounded-lg p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1">
          <div className="text-sm font-medium text-slate-700">Sequence ID</div>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="PP_00003PJ"
            value={sequenceId}
            onChange={(e) => onSequenceIdChange(e.target.value)}
          />
        </label>

        <button
          onClick={() => setShowAdvanced((s) => !s)}
          className="text-sm text-slate-600 hover:text-slate-900 underline self-start"
        >
          {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
        </button>

        <button
          onClick={onFetch}
          className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 font-medium"
        >
          Fetch Versions
        </button>
      </div>

      {showAdvanced && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label>
            <div className="text-sm font-medium text-slate-700">Server Hostname</div>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="pathoplexus.org"
              value={hostname}
              onChange={(e) => onHostnameChange(e.target.value)}
            />
          </label>

          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-md p-3">
            Requests use a CORS proxy. The target server must allow cross-origin requests or responses may be blocked.
          </div>
        </div>
      )}
    </div>
  )
}

