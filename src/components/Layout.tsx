import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

export function Layout() {
  const { t, lang, setLang } = useTranslation()
  const location = useLocation()

  const navItems = [
    { path: '/checklista', label: t.nav.checklista, icon: 'e-icons e-check-box' },
    { path: '/journal', label: t.nav.journal, icon: 'e-icons e-edit' },
    { path: '/avvikelser', label: t.nav.avvikelser, icon: 'e-icons e-warning' },
    { path: '/installningar', label: t.nav.installningar, icon: 'e-icons e-settings' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        backgroundColor: '#fff',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#1a1a1a' }}>
            {t.appName}
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#666' }}>
            {t.appSubtitle}
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  textDecoration: 'none',
                  color: isActive ? '#0078d4' : '#333',
                  backgroundColor: isActive ? '#f0f7ff' : 'transparent',
                  borderLeft: isActive ? '3px solid #0078d4' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <span className={item.icon} style={{ fontSize: '18px' }} />
                <span style={{ fontSize: '14px', fontWeight: isActive ? 500 : 400 }}>
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </nav>

        {/* Language Switcher */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e0e0e0' }}>
          <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '8px' }}>
            {t.installningar.sprak}
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setLang('sv-SE')}
              className={`e-btn ${lang === 'sv-SE' ? 'e-primary' : ''}`}
              style={{ flex: 1, fontSize: '13px' }}
            >
              Svenska
            </button>
            <button
              onClick={() => setLang('de-DE')}
              className={`e-btn ${lang === 'de-DE' ? 'e-primary' : ''}`}
              style={{ flex: 1, fontSize: '13px' }}
            >
              Deutsch
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
