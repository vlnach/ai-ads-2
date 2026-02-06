import type { AdPerformance, Totals } from '../types'

export type AdsPageProps = {
  ads: AdPerformance[]
  totals: Totals
  onToggleStatus: (id: string) => void
}

/**
 * Ads listing view with high-level metrics and per-ad controls.
 */
export function AdsPage({ ads, totals, onToggleStatus }: AdsPageProps) {
  return (
    <div className="content">
      <header className="header compact">
        <div>
          <p className="eyebrow">Ads</p>
          <h1>All live and paused ads</h1>
          <p className="muted">Adjust delivery and scan performance quickly.</p>
        </div>
      </header>
      <div className="metrics-grid">
        <div className="metric-card">
          <p>Total reach</p>
          <h2>{totals.reach.toLocaleString()}</h2>
          <span>{totals.active} active ads</span>
        </div>
        <div className="metric-card">
          <p>CTR</p>
          <h2>{totals.ctr.toFixed(1)}%</h2>
          <span>{totals.clicks.toLocaleString()} clicks</span>
        </div>
        <div className="metric-card">
          <p>CPA (approx)</p>
          <h2>{totals.cpa.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
          <span>{totals.conversions.toLocaleString()} conversions</span>
        </div>
      </div>
      <div className="panel">
        <div className="list">
          {ads.map((ad) => (
            <article key={ad.id} className={`ad-row status-${ad.status}`}>
              <div className="ad-main">
                <div>
                  <p className="platform">{ad.platform}</p>
                  <h4>{ad.title}</h4>
                  <a className="muted" href={ad.url} target="_blank" rel="noreferrer">
                    {ad.url}
                  </a>
                </div>
                <div className="chips">
                  <span className={`chip sentiment-${ad.sentiment}`}>{ad.sentiment}</span>
                  <span className="chip">{ad.status === 'active' ? 'Active' : 'Paused'}</span>
                </div>
              </div>
              <div className="ad-metrics">
                <div>
                  <p>Reach</p>
                  <strong>{ad.reach.toLocaleString()}</strong>
                </div>
                <div>
                  <p>CTR</p>
                  <strong>{ad.ctr.toFixed(1)}%</strong>
                </div>
                <div>
                  <p>Conversions</p>
                  <strong>{ad.conversions.toLocaleString()}</strong>
                </div>
              </div>
              <div className="ad-actions">
                <button className="ghost" onClick={() => onToggleStatus(ad.id)}>
                  {ad.status === 'active' ? 'Take down' : 'Resume'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
