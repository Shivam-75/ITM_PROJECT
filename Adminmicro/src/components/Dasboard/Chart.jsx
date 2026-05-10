// admin/AdminComponents/Chart.jsx
import React, { memo } from "react";

/**
 * Simple, dependency-free responsive bar/line chart.
 * Props:
 *  - data: [{label, value}]
 *  - width (optional)
 *  - height (optional)
 *  - type: "bar" | "line"
 *
 * This is minimal and great for dashboards where you
 * want small, fast visuals without adding chart libs.
 */

const Chart = ({ data = [], height = 120, type = "bar" }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  const padding = 10;
  const chartWidth = 600; // viewBox width (scales)
  const stepX = chartWidth / Math.max(data.length, 1);

  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${height}`}
      className="w-full h-32"
      preserveAspectRatio="xMinYMin meet"
    >
      {/* background grid lines */}
      {[0.25, 0.5, 0.75, 1].map((p, i) => (
        <line
          key={i}
          x1="0"
          x2={chartWidth}
          y1={height - p * (height - padding)}
          y2={height - p * (height - padding)}
          stroke="#f3f4f6"
          strokeWidth="1"
        />
      ))}

      {type === "bar" &&
        data.map((d, i) => {
          const barWidth = Math.max(stepX * 0.6, 6);
          const x = i * stepX + (stepX - barWidth) / 2;
          const h = (d.value / max) * (height - padding);
          const y = height - h;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={h}
                rx="4"
                fill="#3b82f6"
                opacity="0.85"
              />
              <text
                x={x + barWidth / 2}
                y={height - 4}
                textAnchor="middle"
                fontSize="9"
                fill="#374151"
              >
                {d.label}
              </text>
            </g>
          );
        })}

      {type === "line" && (
        <>
          <polyline
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            points={data
              .map((d, i) => {
                const x = i * stepX + stepX / 2;
                const y = height - (d.value / max) * (height - padding);
                return `${x},${y}`;
              })
              .join(" ")}
          />
          {data.map((d, i) => {
            const x = i * stepX + stepX / 2;
            const y = height - (d.value / max) * (height - padding);
            return <circle key={i} cx={x} cy={y} r="3" fill="#ef4444" />;
          })}
        </>
      )}
    </svg>
  );
};

export default memo(Chart);
