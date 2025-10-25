import React from 'react'
import SequenceInput from './components/SequenceInput.jsx'
import VersionSelector from './components/VersionSelector.jsx'
import SequenceDiff from './components/SequenceDiff.jsx'
import MetadataDiff from './components/MetadataDiff.jsx'
import { DEFAULT_HOSTNAME, DEFAULT_SEQUENCE_ID, fetchAllVersions } from './utils/dataFetcher.js'

export default function App() {
  const params = React.useMemo(() => new URLSearchParams(window.location.search), [])
  const initialHostname = params.get('server') || DEFAULT_HOSTNAME
  const initialSequenceId = params.get('accession') || DEFAULT_SEQUENCE_ID
  const [hostname, setHostname] = React.useState(initialHostname)
  const [sequenceId, setSequenceId] = React.useState(initialSequenceId)
  const [versions, setVersions] = React.useState([])
  const [version1, setVersion1] = React.useState(null)
  const [version2, setVersion2] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('sequence') // 'sequence' | 'metadata'

  const onFetch = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await fetchAllVersions(10, hostname, sequenceId)
      setVersions(data)
      if (data.length >= 2) {
        setVersion1(data[0].version)
        setVersion2(data[data.length - 1].version)
      } else if (data.length === 1) {
        setVersion1(data[0].version)
        setVersion2(data[0].version)
      } else {
        setVersion1(null)
        setVersion2(null)
      }
    } catch (e) {
      setError('Failed to fetch versions. Check hostname/CORS and try again.')
    } finally {
      setLoading(false)
    }
  }

  const v1Obj = versions.find((v) => v.version === version1)
  const v2Obj = versions.find((v) => v.version === version2)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Sequence Version Comparator</h1>
        <p className="text-slate-600">Compare Pathoplexus sequence versions and associated metadata.</p>
      </header>

      <div className="mb-6">
        <SequenceInput
          hostname={hostname}
          sequenceId={sequenceId}
          onHostnameChange={setHostname}
          onSequenceIdChange={setSequenceId}
          onFetch={onFetch}
        />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-700">
          <div className="animate-spin h-4 w-4 border-2 border-slate-300 border-t-sky-600 rounded-full" />
          Fetching versions…
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-md bg-red-50 text-red-800 border border-red-200">{error}</div>
      )}

      {!loading && versions.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <VersionSelector
              versions={versions}
              selectedVersion={version1}
              onVersionSelect={setVersion1}
              label="Version A"
            />
            <VersionSelector
              versions={versions}
              selectedVersion={version2}
              onVersionSelect={setVersion2}
              label="Version B"
            />
          </div>

          <div className="border-b border-slate-200 mt-4" />

          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'sequence' ? 'bg-sky-600 text-white' : 'bg-white border border-slate-300 text-slate-700'}`}
              onClick={() => setActiveTab('sequence')}
            >
              Sequence
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'metadata' ? 'bg-sky-600 text-white' : 'bg-white border border-slate-300 text-slate-700'}`}
              onClick={() => setActiveTab('metadata')}
            >
              Metadata
            </button>
          </div>

          {version1 == null || version2 == null ? (
            <div className="text-slate-600">Select two versions to compare.</div>
          ) : activeTab === 'sequence' ? (
            <SequenceDiff
              sequence1={v1Obj?.sequence}
              sequence2={v2Obj?.sequence}
              version1={version1}
              version2={version2}
            />
          ) : (
            <MetadataDiff
              metadata1={v1Obj?.metadata}
              metadata2={v2Obj?.metadata}
              version1={version1}
              version2={version2}
            />
          )}
        </div>
      )}

      {!loading && versions.length === 0 && !error && (
        <div className="mt-8 text-slate-600 text-sm">
          Enter a sequence ID and click Fetch Versions to load versions 1–10 from the server.
        </div>
      )}
    </div>
  )
}

