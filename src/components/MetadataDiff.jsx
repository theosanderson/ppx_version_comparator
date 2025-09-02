import React, { useMemo } from 'react'
import { computeMetadataDiff, formatValueAsString, isMultiLineString } from '../utils/diffUtils.js'
import { diffWords, diffLines, diffChars } from 'diff'

function InlineDiff({ oldText, newText }) {
  const parts = useMemo(() => diffWords(oldText || '', newText || ''), [oldText, newText])
  const render = (mode) => (
    <div className="mono text-sm leading-6">
      {parts.map((p, i) => {
        const t = p.added ? 'added' : p.removed ? 'removed' : 'equal'
        if ((mode === 'old' && p.added) || (mode === 'new' && p.removed)) return null
        const cls = t === 'added' ? 'bg-green-100 text-green-800' : t === 'removed' ? 'bg-red-100 text-red-800' : ''
        return (
          <span key={i} className={`px-0.5 rounded ${cls}`}>{p.value}</span>
        )
      })}
    </div>
  )
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div className="bg-white border border-slate-200 rounded p-2">{render('old')}</div>
      <div className="bg-white border border-slate-200 rounded p-2">{render('new')}</div>
    </div>
  )
}

function MultiLineDiff({ oldText, newText }) {
  const pairs = useMemo(() => {
    const parts = diffLines(oldText || '', newText || '')

    const trimSplit = (val) => {
      if (!val) return []
      const arr = String(val).split('\n')
      if (arr.length && arr[arr.length - 1] === '') arr.pop()
      return arr
    }

    const res = []
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]
      if (p.added) {
        const lines = trimSplit(p.value)
        for (const ln of lines) res.push({ old: '', nw: ln, kind: 'added' })
        continue
      }
      if (p.removed) {
        const next = parts[i + 1]
        const removedLines = trimSplit(p.value)
        if (next && next.added) {
          const addedLines = trimSplit(next.value)
          const max = Math.max(removedLines.length, addedLines.length)
          for (let j = 0; j < max; j++) {
            res.push({ old: removedLines[j] ?? '', nw: addedLines[j] ?? '', kind: 'changed' })
          }
          i++ // consume the added chunk
        } else {
          for (const ln of removedLines) res.push({ old: ln, nw: '', kind: 'removed' })
        }
        continue
      }
      // equal
      const lines = trimSplit(p.value)
      for (const ln of lines) res.push({ old: ln, nw: ln, kind: 'equal' })
    }
    return res
  }, [oldText, newText])

  const renderLineWithChars = (left, right, mode) => {
    // mode: 'old' or 'new'
    if (left === right) {
      return <span>{left ? left : ' '}</span>
    }
    const parts = diffChars(left || '', right || '')
    const filtered = parts.filter((p) => !(mode === 'old' && p.added) && !(mode === 'new' && p.removed))
    if (filtered.length === 0) return <span className="text-slate-300"> </span>
    return (
      <>
        {filtered.map((p, idx) => {
          const cls = p.added
            ? 'font-bold text-green-900'
            : p.removed
            ? 'font-bold text-red-900'
            : ''
          return (
            <span key={idx} className={`px-0.5 rounded ${cls}`}>{p.value}</span>
          )
        })}
      </>
    )
  }

  const Col = ({ mode }) => (
    <div className="bg-white border border-slate-200 rounded p-2 space-y-1">
      {pairs.map((pair, i) => {
        const rowClass = (() => {
          if (pair.kind === 'equal') return ''
          if (pair.kind === 'added') return mode === 'new' ? 'bg-green-50' : 'bg-slate-50 text-slate-400'
          if (pair.kind === 'removed') return mode === 'old' ? 'bg-red-50' : 'bg-slate-50 text-slate-400'
          if (pair.kind === 'changed') return mode === 'old' ? 'bg-red-50' : 'bg-green-50'
          return ''
        })()

        const text = mode === 'old' ? pair.old : pair.nw
        const showChar = pair.kind === 'changed' || (pair.old && pair.nw) // highlight when both sides exist
        const isOppositeBlank = !text
        return (
          <div key={i} className={`mono text-sm whitespace-pre-wrap px-2 py-0.5 rounded ${rowClass}`}>
            {showChar
              ? renderLineWithChars(pair.old, pair.nw, mode)
              : isOppositeBlank
              ? <span className="text-slate-300"> </span>
              : <span>{text}</span>}
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <Col mode="old" />
      <Col mode="new" />
    </div>
  )
}

export default function MetadataDiff({ metadata1 = {}, metadata2 = {}, version1, version2 }) {
  const fields = useMemo(() => computeMetadataDiff(metadata1, metadata2), [metadata1, metadata2])

  if (!fields.length) {
    return <div className="text-slate-600">No metadata available to compare.</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 text-sm text-slate-600">
        <div className="px-2 py-1 rounded bg-red-100 text-red-800">Old v{version1}</div>
        <div className="px-2 py-1 rounded bg-green-100 text-green-800">New v{version2}</div>
      </div>

      <div className="space-y-6">
        {fields.map(({ key, v1, v2, same }) => {
          const str1 = formatValueAsString(v1)
          const str2 = formatValueAsString(v2)
          const multiline = isMultiLineString(str1) || isMultiLineString(str2)
          return (
            <div key={key} className="">
              <div className="mb-1 text-sm font-semibold text-slate-800">{key}</div>
              {same ? (
                <div className="text-slate-600 text-sm bg-slate-50 border border-slate-200 rounded p-2">No change</div>
              ) : multiline ? (
                <MultiLineDiff oldText={str1} newText={str2} />
              ) : (
                <InlineDiff oldText={str1} newText={str2} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
