/**
 * Enumerates delivery states for ads.
 */
export type AdStatus = 'active' | 'paused'

/**
 * Supported social platforms for content sources.
 */
export type Platform = 'Instagram' | 'TikTok' | 'LinkedIn' | 'Facebook' | 'X'

/**
 * Qualitative sentiment buckets derived from recent performance.
 */
export type Sentiment = 'hot' | 'steady' | 'cool'

/**
 * Core performance record for an AI-generated ad linked to a piece of content.
 */
export type AdPerformance = {
  id: string
  title: string
  platform: Platform
  url: string
  reach: number
  clicks: number
  ctr: number
  conversions: number
  status: AdStatus
  sentiment: Sentiment
  createdAt: string
}

/**
 * Payload used when creating a new tracked link to seed AI ads.
 */
export type NewLinkPayload = {
  title: string
  platform: Platform
  url: string
}

/**
 * Aggregated metrics for a set of ads, used in overview cards.
 */
export type Totals = {
  reach: number
  clicks: number
  conversions: number
  active: number
  ctr: number
  cpa: number
}
