// Removes FASTA headers and computes SHA-256 hash (first 8 hex chars)
export async function calculateHash(text) {
  try {
    if (!text) return '—'
    const cleaned = text
      .split(/\r?\n/) // drop header lines
      .filter((l) => !l.trim().startsWith('>'))
      .join('')
      .replace(/\s+/g, '')
      .toUpperCase()

    const enc = new TextEncoder()
    const data = enc.encode(cleaned)
    const digest = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(digest))
    const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return hex.slice(0, 8)
  } catch (e) {
    console.warn('Hash calculation failed', e)
    return 'error'
  }
}

