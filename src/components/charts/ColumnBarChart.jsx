// ============================================================
// ColumnBarChart.jsx – Bar kolom "Pesawat per Interval Refresh"
// ============================================================
import { Component } from 'react';

class ChartErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__title">⚠ Chart tidak tersedia</div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * @param {string}   title
 * @param {object[]} history   – array snapshot dari useFlightHistory
 */
function ColumnBarChartInner({ history = [] }) {
  if (history.length === 0) {
    return (
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', textAlign: 'center', padding: '2rem 0' }}>
        Menunggu data refresh…
      </p>
    );
  }

  const maxCount = Math.max(...history.map((h) => h.total), 1);

  return (
    <div
      className="col-chart__inner"
      role="img"
      aria-label={`Bar chart: ${history.length} interval refresh terakhir`}
    >
      {history.map((snap, i) => {
        const isLatest  = i === history.length - 1;
        const heightPct = Math.max((snap.total / maxCount) * 100, 2);
        const time = new Date(snap.ts).toLocaleTimeString('id-ID', {
          hour: '2-digit', minute: '2-digit',
        });
        return (
          <div
            key={snap.ts}
            className={`col-bar${isLatest ? ' col-bar--latest' : ''}`}
            style={{ height: `${heightPct}%` }}
            title={`${time}: ${snap.total} pesawat`}
            aria-label={`${time}: ${snap.total} pesawat`}
          />
        );
      })}
    </div>
  );
}

export default function ColumnBarChart({ title, history }) {
  return (
    <ChartErrorBoundary>
      <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="card__header">
          <h3 className="card__title">{title}</h3>
        </div>
        <div className="card__body" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 180 }}>
          <ColumnBarChartInner history={history} />
        </div>
      </div>
    </ChartErrorBoundary>
  );
}
