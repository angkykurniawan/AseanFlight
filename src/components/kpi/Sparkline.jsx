// ============================================================
// Sparkline.jsx – Mini line chart SVG murni
// ============================================================

/**
 * @param {number[]}  data    – array nilai numerik
 * @param {number}    width
 * @param {number}    height
 * @param {string}    color
 * @param {string}    label   – aria-label
 */
export default function Sparkline({
  data = [],
  width = 80,
  height = 28,
  color = '#1a2b4a',
  label = 'Sparkline',
}) {
  if (data.length < 2) {
    return (
      <svg
        className="sparkline"
        width={width}
        height={height}
        aria-label={label}
        role="img"
      >
        <line x1="0" y1={height / 2} x2={width} y2={height / 2}
          stroke={color} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.3" />
      </svg>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + (1 - (v - min) / range) * h;
    return `${x},${y}`;
  });

  const polyline = points.join(' ');

  // Area fill
  const firstX = pad;
  const lastX  = pad + w;
  const bottom = pad + h;
  const areaPoints = `${firstX},${bottom} ${polyline} ${lastX},${bottom}`;

  return (
    <svg
      className="sparkline"
      width={width}
      height={height}
      aria-label={label}
      role="img"
      viewBox={`0 0 ${width} ${height}`}
    >
      <polygon
        points={areaPoints}
        fill={color}
        opacity="0.1"
      />
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Titik terakhir */}
      <circle
        cx={points[points.length - 1].split(',')[0]}
        cy={points[points.length - 1].split(',')[1]}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}
