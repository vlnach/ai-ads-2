import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import './App.css'
import { Layout, type NavItem } from './components/Layout'
import { AdsPage } from './components/AdsPage'
import { CreateLinkPage } from './components/CreateLinkPage'
import { InsightsPage } from './components/InsightsPage'
import { computeTotals, selectCoolAds, selectHotAds } from './lib/ads'
import { createAdFromLink, fetchAds, updateAdStatus } from './lib/api'
import type { AdPerformance, NewLinkPayload } from './types'

const navItems: NavItem[] = [
  { id: 'ads', label: 'Ads' },
  { id: 'create', label: 'Create link' },
  { id: 'insights', label: 'Insights' },
]

const defaultLink: NewLinkPayload = {
  title: '',
  platform: 'Instagram',
  url: '',
}

/**
 * Top-level application container orchestrating navigation and shared ad state.
 */
function App() {
  const queryClient = useQueryClient()
  const [newLink, setNewLink] = useState<NewLinkPayload>(defaultLink)
  const [note, setNote] = useState('')
  const [activePage, setActivePage] = useState<NavItem['id']>('ads')

  const {
    data: ads = [],
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ['ads'], queryFn: fetchAds })

  const totals = useMemo(() => computeTotals(ads), [ads])
  const hotAds = useMemo(() => selectHotAds(ads), [ads])
  const coolAds = useMemo(() => selectCoolAds(ads), [ads])

  const createAd = useMutation({
    mutationFn: createAdFromLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] })
      setNote('New link added. We will auto-generate AI ads and begin tracking reach within minutes.')
      setNewLink(defaultLink)
      setActivePage('ads')
    },
    onError: (mutationError) => {
      const message = mutationError instanceof Error ? mutationError.message : 'Unable to add link.'
      setNote(message)
    },
  })

  const toggleStatus = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: AdPerformance['status'] }) =>
      updateAdStatus(id, nextStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] })
      setNote('Ad status updated. Paused ads stop delivery and budget burn instantly.')
    },
    onError: (mutationError) => {
      const message = mutationError instanceof Error ? mutationError.message : 'Unable to update status.'
      setNote(message)
    },
  })

  const handleAddLink = () => {
    if (!newLink.title.trim() || !newLink.url.trim()) return
    createAd.mutate(newLink)
  }

  const handleToggleStatus = (id: string) => {
    const target = ads.find((ad) => ad.id === id)
    if (!target) return
    const nextStatus = target.status === 'active' ? 'paused' : 'active'
    toggleStatus.mutate({ id, nextStatus })
  }

  const errorMessage = error instanceof Error ? error.message : 'Unable to load ads.'

  const renderAdsPage = () => {
    if (isLoading) return <div className="content">Loading ads...</div>
    if (isError) return <div className="content">Failed to load ads: {errorMessage}</div>
    return <AdsPage ads={ads} totals={totals} onToggleStatus={handleToggleStatus} />
  }

  const renderInsightsPage = () => {
    if (isLoading) return <div className="content">Loading insights...</div>
    if (isError) return <div className="content">Failed to load insights: {errorMessage}</div>
    return <InsightsPage hotAds={hotAds} coolAds={coolAds} onToggleStatus={handleToggleStatus} />
  }

  return (
    <Layout navItems={navItems} activePage={activePage} onNavigate={setActivePage}>
      {activePage === 'ads' && renderAdsPage()}
      {activePage === 'create' && (
        <CreateLinkPage
          newLink={newLink}
          note={note}
          onChange={(update) => setNewLink((prev) => ({ ...prev, ...update }))}
          onSubmit={handleAddLink}
          onBackToAds={() => setActivePage('ads')}
        />
      )}
      {activePage === 'insights' && renderInsightsPage()}
    </Layout>
  )
}

export default App
