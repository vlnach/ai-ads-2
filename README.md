# Marketing Dashboard (React + Vite + TanStack Query)

Customer-facing dashboard to manage AI-generated ads created from your social content links. Add new links, monitor reach and conversions, pause underperforming ads, and request more variants from winners.

## Features
- Add social or landing page URLs and auto-seed AI ad performance data
- Live ad list with reach, CTR, conversions, and status badges
- Actions: take down (pause) or resume ads
- Winner/underperformer panels to focus optimization
- Data fetching via TanStack Query with mock API (json-server)

## Getting started
1) Install dependencies
```bash
npm install
```
2) Run the API and dev server together
```bash
npm start
```
This launches the mock API (http://localhost:4000) and dev server (http://localhost:5173) in parallel.

Alternatively, run them separately:
```bash
npm run api      # Start json-server on port 4000
npm run dev      # Start Vite dev server on port 5173
```
3) Build for production
```bash
npm run build
```
4) Lint
```bash
npm run lint
```

## Architecture
- **Frontend**: React 19 + TypeScript (Vite) with TanStack Query for data synchronization
- **API**: json-server mock backend (db.json) serving ads endpoints
- **State**: Query-driven (read) and mutation-driven (write) patterns via TanStack Query
- **Styling**: Minimal dark theme with sidebar layout

## Data
- Mock ads are seeded in [db.json](db.json) and persisted by json-server during the session
- Creating new ads generates seeded metrics and POSTs to the API
- Status updates PATCH individual ad records

