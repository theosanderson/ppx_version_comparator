export const DEFAULT_HOSTNAME = 'pathoplexus.org'
export const DEFAULT_SEQUENCE_ID = 'PP_00003PJ'
export const CORS_PROXY = 'https://corsproxy.io/?'

function cleanSequenceFA(text) {
  if (!text) return ''
  return text
    .split(/\r?\n/)
    .filter((l) => !l.trim().startsWith('>'))
    .join('')
    .replace(/\s+/g, '')
    .toUpperCase()
}

export function getBaseUrl(hostname) {
  const h = (hostname || DEFAULT_HOSTNAME).replace(/\/$/, '')
  return `${CORS_PROXY}https://${h}/seq/`
}

export async function fetchSequenceVersion(version, hostname, sequenceId) {
  const base = getBaseUrl(hostname)
  const sid = sequenceId || DEFAULT_SEQUENCE_ID
  const ver = String(version)
  const detailsUrl = `${base}${sid}.${ver}/details.json`
  const fastaUrl = `${base}${sid}.${ver}.fa`
  try {
    const [detailsRes, fastaRes] = await Promise.all([
      fetch(detailsUrl),
      fetch(fastaUrl),
    ])

    if (!detailsRes.ok || !fastaRes.ok) {
      throw new Error(`Failed to fetch v${ver}`)
    }
    const metadata = await detailsRes.json()
    const fastaText = await fastaRes.text()
    const sequence = cleanSequenceFA(fastaText)
    return { version: Number(ver), metadata, sequence }
  } catch (e) {
    console.warn(`Version ${ver} fetch failed`, e)
    return null
  }
}

export async function fetchAllVersions(maxVersion = 10, hostname, sequenceId) {
  const tasks = []
  for (let v = 1; v <= maxVersion; v++) tasks.push(fetchSequenceVersion(v, hostname, sequenceId))
  const results = await Promise.all(tasks)
  return results.filter(Boolean).sort((a, b) => a.version - b.version)
}

