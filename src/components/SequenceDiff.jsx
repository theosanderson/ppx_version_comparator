import React, { useMemo } from 'react'
import { diffChars } from 'diff'
import { calculateHash } from '../utils/hashUtils.js'

function ColorSpan({ type, children }) {
  const cls =
    type === 'removed'
      ? 'bg-red-100 text-red-800'
      : type === 'added'
      ? 'bg-green-100 text-green-800'
      : 'text-slate-800'
  return <span className={`px-0.5 rounded ${cls}`}>{children}</span>
}

function renderWithPositions(parts, which) {
  // which: 'v1' or 'v2' for position counting
  let pos = 0
  const nodes = []
  parts.forEach((p, i) => {
    const text = p.value || ''
    const len = text.length
    const t = p.added ? 'added' : p.removed ? 'removed' : 'equal'
    // For the line to display, if showing v1, suppress added; if v2, suppress removed
    const shouldShow = which === 'v1' ? !p.added : !p.removed
    const showText = shouldShow ? text : ''
    if (!showText) return
    const start = pos + 1
    pos += showText.length
    const end = pos
    nodes.push(
      <span key={`${which}-${i}`} title={`pos ${start}-${end}`}> 
        <ColorSpan type={t}>{showText}</ColorSpan>
      </span>
    )
  })
  return nodes
}

export default function SequenceDiff({ sequence1 = '', sequence2 = '', version1, version2 }) {
  const parts = useMemo(() => diffChars(sequence1 || '', sequence2 || ''), [sequence1, sequence2])
  const identical = useMemo(() => (sequence1 || '') === (sequence2 || ''), [sequence1, sequence2])

  const [hash1Promise, hash2Promise] = useMemo(() => [calculateHash(sequence1), calculateHash(sequence2)], [sequence1, sequence2])
  const [hash1, setHash1] = React.useState('…')
  const [hash2, setHash2] = React.useState('…')
  React.useEffect(() => { hash1Promise.then(setHash1) }, [hash1Promise])
  React.useEffect(() => { hash2Promise.then(setHash2) }, [hash2Promise])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded">
          <div className="text-xs text-slate-600">v{version1} hash</div>
          <div className="mono text-sm">{hash1}</div>
        </div>
        <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded">
          <div className="text-xs text-slate-600">v{version2} hash</div>
          <div className="mono text-sm">{hash2}</div>
        </div>
      </div>

      {identical ? (
        <div className="p-3 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
          Sequences are identical.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-md p-3">
            <div className="mb-2 text-sm font-medium text-slate-700">Version {version1}</div>
            <div className="mono text-sm leading-6 overflow-auto scroll-thin max-h-[40vh]">
              {renderWithPositions(parts, 'v1')}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Red: deletions/mismatches in v{version1}; Gray gaps suppressed.
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-md p-3">
            <div className="mb-2 text-sm font-medium text-slate-700">Version {version2}</div>
            <div className="mono text-sm leading-6 overflow-auto scroll-thin max-h-[40vh]">
              {renderWithPositions(parts, 'v2')}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Green: additions in v{version2}; Gray gaps suppressed.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

