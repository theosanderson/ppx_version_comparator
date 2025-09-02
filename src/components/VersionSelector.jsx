import React from 'react'

export default function VersionSelector({ versions, selectedVersion, onVersionSelect, label }) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
        value={selectedVersion ?? ''}
        onChange={(e) => onVersionSelect(Number(e.target.value))}
      >
        <option value="" disabled>
          Select version
        </option>
        {(versions || []).map((v) => (
          <option key={v.version} value={v.version}>
            v{v.version}
          </option>
        ))}
      </select>
    </label>
  )
}

