import type { AdPerformance } from '../types'

export type InsightsPageProps = {
  hotAds: AdPerformance[]
  coolAds: AdPerformance[]
  onToggleStatus: (id: string) => void
}

/**
 * Focused view for acting on winning and underperforming ads.
 */
export function InsightsPage({ hotAds, coolAds, onToggleStatus }: InsightsPageProps) {
  return (
    <div className="content">
      <header className="header compact">
        <div>
          <p className="eyebrow">Insights</p>
          <h1>Winners and underperformers</h1>
          <p className="muted">Act on signals quickly: pause weak ads.</p>
        </div>
      </header>
      <div className="split">
        <div className="panel stack">
          <div>
            <p className="eyebrow">Winners</p>
            {hotAds.length === 0 && <p className="muted">No hot ads yet. Keep testing.</p>}
            {hotAds.map((ad) => (
              <div key={ad.id} className="callout positive">
                <div>
                  <strong>{ad.title}</strong>
                  <p className="muted">{ad.platform} · CTR {ad.ctr}% · {ad.conversions} conversions</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="eyebrow">Needs attention</p>
            {coolAds.length === 0 && <p className="muted">No underperformers flagged.</p>}
            {coolAds.map((ad) => (
              <div key={ad.id} className="callout caution">
                <div>
                  <strong>{ad.title}</strong>
                  <p className="muted">{ad.platform} · CTR {ad.ctr}% · {ad.reach.toLocaleString()} reach</p>
                </div>
                <button className="ghost" onClick={() => onToggleStatus(ad.id)}>
                  Take down
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="muted">
            <p><strong>Next steps</strong></p>
            <p>- Pause or rewrite ads with CTR below 3%.</p>
            <p>- Add 2 new links to keep freshness high.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
