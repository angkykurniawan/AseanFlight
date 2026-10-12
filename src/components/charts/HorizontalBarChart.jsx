// ============================================================
// HorizontalBarChart.jsx – Bar horizontal dengan CSS murni
// ============================================================
import { Component } from 'react';

/* ---- Error Boundary ---- */
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
 * @param {{ label: string, count: number, color?: string }[]} data
 * @param {string}   [emptyMsg]
 */
function HorizontalBarChartInner({ data = [], emptyMsg = 'Tidak ada data.' }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="hbar-chart" aria-label="Bar chart horizontal">
      {data.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
          {emptyMsg}
        </p>
      )}
      {data.map((item) => {
        const pct = Math.round((item.count / maxCount) * 100);
        return (
          <div
            key={item.label}
            className="hbar-item"
            aria-label={`${item.label}: ${item.count}`}
          >
            <div className="hbar-item__top">
              <span className="hbar-item__label" title={item.label}>{item.label}</span>
              <span className="hbar-item__count">{item.count}</span>
            </div>
            <div className="hbar-track" role="presentation">
              <div
                className="hbar-fill"
                style={{
                  width: `${pct}%`,
                  background: item.color ?? 'var(--color-chart-1)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HorizontalBarChart(props) {
  return (
    <ChartErrorBoundary>
      <div className="card">
        <div className="card__header">
          <h3 className="card__title">{props.title}</h3>
        </div>
        <div className="card__body">
          <HorizontalBarChartInner {...props} />
        </div>
      </div>
    </ChartErrorBoundary>
  );
}
