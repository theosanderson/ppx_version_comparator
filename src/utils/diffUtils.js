import { diffWords, diffChars, diffLines } from 'diff'

export function computeMetadataDiff(meta1 = {}, meta2 = {}) {
  const keys = Array.from(new Set([...(Object.keys(meta1 || {})), ...(Object.keys(meta2 || {}))])).sort()
  return keys.map((key) => {
    const v1 = meta1?.[key]
    const v2 = meta2?.[key]
    const same = JSON.stringify(v1) === JSON.stringify(v2)
    return { key, v1, v2, same }
  })
}

export function isMultiLineString(v) {
  return typeof v === 'string' && /\n/.test(v)
}

export function formatValueAsString(v) {
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') return v
  try {
    return JSON.stringify(v, null, 2)
  } catch {
    return String(v)
  }
}

export const diffs = { diffWords, diffChars, diffLines }

