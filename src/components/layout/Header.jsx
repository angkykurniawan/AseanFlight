// ============================================================
// Header.jsx – Header utama aplikasi SkyWatch ASEAN
// ============================================================
import StatusBadge from './StatusBadge.jsx';
import NavPills    from './NavPills.jsx';
import { useFlightContext } from '../../context/FlightContext.jsx';
import { useAuth }          from '../../context/AuthContext.jsx';

function formatDateTime(date) {
  if (!date) return '—';
  return date.toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export default function Header() {
  const { dataStatus, lastUpdated, countdown, activeTab, setActiveTab } = useFlightContext();
  const { user, logout } = useAuth();

  return (
    <header className="header" role="banner">
      <div className="header__top">
        {/* Logo + Judul */}
        <div className="header__brand">
          <div className="header__logo" aria-hidden="true">✈</div>
          <div>
            <div className="header__title">SkyWatch ASEAN</div>
            <div className="header__subtitle">IBM Global AI Builders Challenge · Aviation Track</div>
          </div>
        </div>

        {/* Meta kanan */}
        <div className="header__meta">
          <span className="header__updated" aria-live="polite">
            Data sampai{' '}
            <time dateTime={lastUpdated?.toISOString()}>
              {formatDateTime(lastUpdated)}
            </time>
          </span>
          {countdown > 0 && (
            <span className="header__countdown" aria-live="polite">
              (refresh dalam {countdown}d)
            </span>
          )}
          <StatusBadge status={dataStatus} />

          {/* User chip + Logout */}
          {user && (
            <div className="header__user-chip">
              <span className="header__user-avatar" aria-hidden="true">👤</span>
              <span className="header__user-name">{user.username}</span>
              <button
                className="header__logout-btn"
                onClick={logout}
                aria-label="Keluar dari dashboard"
                title="Keluar"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Nav Pills */}
      <NavPills activeTab={activeTab} onTabChange={setActiveTab} />
    </header>
  );
}
