# Sequence Version Comparator

A React-based web application for comparing different versions of Pathoplexus genomic sequences and their associated metadata.

## Tech Stack

- Framework: React 19.1.1 (Vite 7)
- Language: JavaScript (ES6+)
- Styling: Tailwind CSS 4.1.12
- Diff Library: diff 8.0.2
- Build Tool: Vite
- Package Manager: npm

## Getting Started

1. Install dependencies

   `npm install`

2. Run the dev server

   `npm run dev`

3. Build for production

   `npm run build`

4. Preview the production build

   `npm run preview`

Note: Network calls use a public CORS proxy. If the Pathoplexus server denies cross-origin requests, responses may be blocked by the browser.

## API Endpoints

- Base: `https://{hostname}/seq/`
- Metadata: `https://{hostname}/seq/{sequenceId}.{version}/details.json`
- Sequence: `https://{hostname}/seq/{sequenceId}.{version}.fa`
- All requests are proxied via: `https://corsproxy.io/?` (prefixed to the full URL)

Examples (with proxy):

- Metadata: `https://corsproxy.io/?https://pathoplexus.org/seq/PP_00003PJ.1/details.json`
- Sequence: `https://corsproxy.io/?https://pathoplexus.org/seq/PP_00003PJ.1.fa`

## App Features

- Fetch up to 10 versions in parallel for a given sequence ID
- Select two versions and compare:
  - Sequence: SHA-256 (first 8 chars) and visual nucleotide diffs
  - Metadata: field-by-field diffs with word/line-aware highlighting
- Responsive UI, tab navigation, loading and error states
- Advanced settings to change server hostname (with CORS warning)
- Server hostname and accession can be pre-populated via `?server=` and `?accession=` query parameters

## Project Structure

- `src/App.jsx`: Main app state, fetching, and tabbed views
- `src/components/SequenceInput.jsx`: Sequence ID + advanced hostname input and fetch button
- `src/components/VersionSelector.jsx`: Version dropdowns
- `src/components/SequenceDiff.jsx`: Sequence hash + visual diff
- `src/components/MetadataDiff.jsx`: Metadata diff views
- `src/utils/dataFetcher.js`: URLs + fetch helpers
- `src/utils/diffUtils.js`: Diff helpers for metadata
- `src/utils/hashUtils.js`: Sequence hashing (SHA-256, first 8 chars)

## Notes

- The sequence viewer suppresses gaps for clarity and shows positions on hover tooltips.
- Metadata diff auto-selects word-level diffs for single-line values and line-level diffs for multi-line text, with pretty-printed JSON for objects.
- ESLint is referenced in scripts but may require local setup to run successfully.


