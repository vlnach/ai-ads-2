import type { AdPerformance, Totals } from '../types'

/**
 * Aggregate simple performance metrics across a list of ads.
 */
export const computeTotals = (ads: AdPerformance[]): Totals => {
  const aggregate = ads.reduce(
    (acc, ad) => {
      acc.reach += ad.reach
      acc.clicks += ad.clicks
      acc.conversions += ad.conversions
      if (ad.status === 'active') acc.active += 1
      return acc
    },
    { reach: 0, clicks: 0, conversions: 0, active: 0 },
  )

  const ctr = aggregate.reach === 0 ? 0 : (aggregate.clicks / aggregate.reach) * 100
  const cpa = aggregate.conversions === 0 ? 0 : aggregate.reach / aggregate.conversions

  return { ...aggregate, ctr, cpa }
}

/**
 * Pull out high-performing "hot" ads.
 */
export const selectHotAds = (ads: AdPerformance[]) =>
  ads.filter((ad) => ad.sentiment === 'hot' && ad.status === 'active')

/**
 * Pull out lower-performing ads that may need intervention.
 */
export const selectCoolAds = (ads: AdPerformance[]) =>
  ads.filter((ad) => ad.sentiment === 'cool' && ad.status === 'active')
