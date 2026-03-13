"use client";

import { useState, useMemo } from "react";

interface Point {
  x: number;
  y: number;
}

function computeRegression(points: Point[]) {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: 0, rSquared: 0 };

  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);

  const meanX = sumX / n;
  const meanY = sumY / n;

  const denom = sumX2 - n * meanX * meanX;
  if (Math.abs(denom) < 1e-10) return { slope: 0, intercept: meanY, rSquared: 0 };

  const slope = (sumXY - n * meanX * meanY) / denom;
  const intercept = meanY - slope * meanX;

  const ssRes = points.reduce((s, p) => s + (p.y - (intercept + slope * p.x)) ** 2, 0);
  const ssTot = points.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
  const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;

  return { slope, intercept, rSquared };
}

export default function LineBestFit() {
  const [points, setPoints] = useState<Point[]>([]);

  const svgWidth = 600;
  const svgHeight = 400;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const plotW = svgWidth - pad.left - pad.right;
  const plotH = svgHeight - pad.top - pad.bottom;

  const xRange = [0, 10] as const;
  const yRange = [0, 100] as const;

  function toSvgX(x: number) {
    return pad.left + ((x - xRange[0]) / (xRange[1] - xRange[0])) * plotW;
  }
  function toSvgY(y: number) {
    return pad.top + plotH - ((y - yRange[0]) / (yRange[1] - yRange[0])) * plotH;
  }
  function fromSvgX(sx: number) {
    return xRange[0] + ((sx - pad.left) / plotW) * (xRange[1] - xRange[0]);
  }
  function fromSvgY(sy: number) {
    return yRange[0] + ((pad.top + plotH - sy) / plotH) * (yRange[1] - yRange[0]);
  }

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * svgWidth;
    const sy = ((e.clientY - rect.top) / rect.height) * svgHeight;
    const x = fromSvgX(sx);
    const y = fromSvgY(sy);
    if (x >= xRange[0] && x <= xRange[1] && y >= yRange[0] && y <= yRange[1]) {
      setPoints((prev) => [...prev, { x, y }]);
    }
  }

  const reg = useMemo(() => computeRegression(points), [points]);

  function addSampleData() {
    const sample: Point[] = [
      { x: 1, y: 20 }, { x: 2, y: 35 }, { x: 2.5, y: 30 },
      { x: 3, y: 45 }, { x: 4, y: 50 }, { x: 4.5, y: 55 },
      { x: 5, y: 60 }, { x: 6, y: 65 }, { x: 6.5, y: 58 },
      { x: 7, y: 75 }, { x: 8, y: 80 }, { x: 9, y: 85 },
      { x: 9.5, y: 90 },
    ];
    setPoints(sample);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-600">
        Click anywhere on the plot to add data points. The regression line
        updates automatically.
      </p>

      <div className="flex gap-3">
        <button
          onClick={addSampleData}
          className="px-5 py-2 bg-brand-100 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-200 transition-colors"
        >
          Load sample data
        </button>
        <button
          onClick={() => setPoints([])}
          className="px-5 py-2 bg-white border border-brand-200 text-brand-600 rounded-lg text-sm font-medium hover:bg-brand-50 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Plot */}
      <div className="bg-white border border-brand-100 rounded-xl p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto cursor-crosshair"
          preserveAspectRatio="xMidYMid meet"
          onClick={handleClick}
        >
          {/* Grid lines */}
          {[0, 2, 4, 6, 8, 10].map((x) => (
            <line key={`gx${x}`} x1={toSvgX(x)} y1={pad.top} x2={toSvgX(x)} y2={pad.top + plotH} stroke="#d7e4e1" strokeWidth="1" />
          ))}
          {[0, 20, 40, 60, 80, 100].map((y) => (
            <line key={`gy${y}`} x1={pad.left} y1={toSvgY(y)} x2={pad.left + plotW} y2={toSvgY(y)} stroke="#d7e4e1" strokeWidth="1" />
          ))}

          {/* Axes */}
          <line x1={pad.left} y1={pad.top + plotH} x2={pad.left + plotW} y2={pad.top + plotH} stroke="#82a99f" strokeWidth="1.5" />
          <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + plotH} stroke="#82a99f" strokeWidth="1.5" />

          {/* Axis labels */}
          {[0, 2, 4, 6, 8, 10].map((x) => (
            <text key={`lx${x}`} x={toSvgX(x)} y={svgHeight - 10} textAnchor="middle" fontSize="11" fill="#5c8a7e">{x}</text>
          ))}
          {[0, 20, 40, 60, 80, 100].map((y) => (
            <text key={`ly${y}`} x={pad.left - 8} y={toSvgY(y) + 4} textAnchor="end" fontSize="11" fill="#5c8a7e">{y}</text>
          ))}

          {/* Regression line */}
          {points.length >= 2 && (
            <line
              x1={toSvgX(xRange[0])}
              y1={toSvgY(reg.intercept + reg.slope * xRange[0])}
              x2={toSvgX(xRange[1])}
              y2={toSvgY(reg.intercept + reg.slope * xRange[1])}
              stroke="#436d62"
              strokeWidth="2.5"
            />
          )}

          {/* Residual lines */}
          {points.length >= 2 &&
            points.map((p, i) => {
              const predicted = reg.intercept + reg.slope * p.x;
              return (
                <line
                  key={`r${i}`}
                  x1={toSvgX(p.x)}
                  y1={toSvgY(p.y)}
                  x2={toSvgX(p.x)}
                  y2={toSvgY(predicted)}
                  stroke="#ef4444"
                  strokeWidth="1"
                  strokeDasharray="3 2"
                  opacity="0.4"
                />
              );
            })}

          {/* Data points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={toSvgX(p.x)}
              cy={toSvgY(p.y)}
              r="5"
              fill="#436d62"
              stroke="white"
              strokeWidth="1.5"
            />
          ))}

          {points.length === 0 && (
            <text x={svgWidth / 2} y={svgHeight / 2} textAnchor="middle" fontSize="14" fill="#82a99f">
              Click to add data points
            </text>
          )}
        </svg>
      </div>

      {/* Stats */}
      {points.length >= 2 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="bg-brand-50 rounded-lg p-3">
            <div className="text-xs text-brand-400">Points</div>
            <div className="text-lg font-semibold text-brand-800">{points.length}</div>
          </div>
          <div className="bg-brand-50 rounded-lg p-3">
            <div className="text-xs text-brand-400">Slope (b1)</div>
            <div className="text-lg font-semibold text-brand-800">{reg.slope.toFixed(2)}</div>
          </div>
          <div className="bg-brand-50 rounded-lg p-3">
            <div className="text-xs text-brand-400">Intercept (b0)</div>
            <div className="text-lg font-semibold text-brand-800">{reg.intercept.toFixed(2)}</div>
          </div>
          <div className="bg-brand-50 rounded-lg p-3">
            <div className="text-xs text-brand-400">R-squared</div>
            <div className="text-lg font-semibold text-brand-800">{reg.rSquared.toFixed(3)}</div>
          </div>
        </div>
      )}

      {points.length >= 2 && (
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
          <p className="text-sm text-brand-700">
            Equation: Y = {reg.intercept.toFixed(1)} + {reg.slope.toFixed(2)} * X.
            {reg.slope > 0
              ? ` For each 1-unit increase in X, Y increases by ${reg.slope.toFixed(2)}.`
              : reg.slope < 0
              ? ` For each 1-unit increase in X, Y decreases by ${Math.abs(reg.slope).toFixed(2)}.`
              : " The slope is zero, indicating no linear relationship."}
            {" "}The red dashed lines are residuals (the errors the model makes).
          </p>
        </div>
      )}
    </div>
  );
}
