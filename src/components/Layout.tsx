import type { ReactNode } from 'react'

export type NavItem = { id: 'ads' | 'create' | 'insights'; label: string }

export type LayoutProps = {
  navItems: NavItem[]
  activePage: NavItem['id']
  onNavigate: (page: NavItem['id']) => void
  children: ReactNode
}

/**
 * Shell component that renders the sidebar navigation and main content area.
 */
export function Layout({ navItems, activePage, onNavigate, children }: LayoutProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">AI Ads</div>
        <nav className="nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <p className="muted small">Manage AI-generated ads from one place.</p>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  )
}
