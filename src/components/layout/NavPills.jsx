// ============================================================
// NavPills.jsx – Navigasi tab berbentuk pill
// ============================================================
import { NAV_TABS } from '../../config.js';

/**
 * @param {string}   activeTab
 * @param {function} onTabChange
 */
export default function NavPills({ activeTab, onTabChange }) {
  function handleKeyDown(e, tabId) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTabChange(tabId);
    }
    // Navigasi panah kiri/kanan
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const idx  = NAV_TABS.findIndex((t) => t.id === activeTab);
      const next = e.key === 'ArrowRight'
        ? (idx + 1) % NAV_TABS.length
        : (idx - 1 + NAV_TABS.length) % NAV_TABS.length;
      onTabChange(NAV_TABS[next].id);
    }
  }

  return (
    <nav
      className="nav-pills"
      role="tablist"
      aria-label="Navigasi halaman"
    >
      {NAV_TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            className={`nav-pills__tab${isActive ? ' nav-pills__tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
