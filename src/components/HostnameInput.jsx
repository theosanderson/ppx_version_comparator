import React from 'react'

// Deprecated/Unused: kept for reference; functionality merged in SequenceInput
export default function HostnameInput({ hostname, onChange }) {
  return (
    <input
      className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
      placeholder="pathoplexus.org"
      value={hostname}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

