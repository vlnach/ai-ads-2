import type { AdPerformance, NewLinkPayload } from '../types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
const ADS_ENDPOINT = `${API_URL}/ads`

const parseJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }
  return response.json() as Promise<T>
}

/**
 * Fetch all ads from the mock API.
 */
export const fetchAds = async (): Promise<AdPerformance[]> => {
  const response = await fetch(ADS_ENDPOINT)
  return parseJson<AdPerformance[]>(response)
}

/**
 * Create a new ad based on a source link. Seeding mirrors the previous client-only logic.
 */
export const createAdFromLink = async (payload: NewLinkPayload): Promise<AdPerformance> => {
  const seededReach = Math.floor(2400 + Math.random() * 4200)
  const seededClicks = Math.floor(seededReach * (0.03 + Math.random() * 0.04))
  const seededConversions = Math.max(4, Math.floor(seededClicks * (0.08 + Math.random() * 0.07)))
  const seededCtr = seededReach === 0 ? 0 : Number(((seededClicks / seededReach) * 100).toFixed(1))

  const ad: AdPerformance = {
    id: `ad-${crypto.randomUUID()}`,
    title: payload.title.trim(),
    platform: payload.platform,
    url: payload.url.trim(),
    reach: seededReach,
    clicks: seededClicks,
    ctr: seededCtr,
    conversions: seededConversions,
    status: 'active',
    sentiment: seededCtr > 5 ? 'hot' : seededCtr > 3 ? 'steady' : 'cool',
    createdAt: new Date().toISOString().slice(0, 10),
  }

  const response = await fetch(ADS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ad),
  })

  return parseJson<AdPerformance>(response)
}

/**
 * Toggle an ad's active/paused status.
 */
export const updateAdStatus = async (
  id: string,
  nextStatus: AdPerformance['status'],
): Promise<AdPerformance> => {
  const response = await fetch(`${ADS_ENDPOINT}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: nextStatus }),
  })

  return parseJson<AdPerformance>(response)
}
