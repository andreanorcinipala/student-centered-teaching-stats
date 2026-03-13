"use client";

import { useState, useMemo } from "react";

function normalPDF(x: number, mu: number, sigma: number): number {
  const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
  return coeff * Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
}

function normalCDFApprox(x: number): number {
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x) / Math.SQRT2;
  const t = 1.0 / (1.0 + p * ax);
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return 0.5 * (1.0 + sign * y);
}

function zForAlpha(alpha: number): number {
  // Approximate inverse normal for common alpha values
  if (alpha <= 0.001) return 3.09;
  if (alpha <= 0.005) return 2.576;
  if (alpha <= 0.01) return 2.326;
  if (alpha <= 0.025) return 1.96;
  if (alpha <= 0.05) return 1.645;
  if (alpha <= 0.1) return 1.282;
  return 1.0;
}

export default function PowerAnalysis() {
  const [sampleSize, setSampleSize] = useState(100);
  const [effectSize, setEffectSize] = useState(0.5);
  const [alpha, setAlpha] = useState(0.05);

  const se = 1 / Math.sqrt(sampleSize);
  const zCrit = zForAlpha(alpha);
  const criticalValue = zCrit * se;
  const power = useMemo(() => {
    // Power = P(Z > zCrit - effectSize/se)
    const ncp = effectSize / se;
    return 1 - normalCDFApprox(zCrit - ncp);
  }, [sampleSize, effectSize, alpha, se, zCrit]);

  const beta = 1 - power;

  // Generate curve points for SVG
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = { top: 20, bottom: 40, left: 10, right: 10 };
  const plotW = svgWidth - padding.left - padding.right;
  const plotH = svgHeight - padding.top - padding.bottom;

  const xMin = -4 * se;
  const xMax = effectSize + 4 * se;
  const xRange = xMax - xMin;

  function toSvgX(x: number) {
    return padding.left + ((x - xMin) / xRange) * plotW;
  }

  const maxPdf = normalPDF(0, 0, se);
  const maxPdfAlt = normalPDF(effectSize, effectSize, se);
  const yMax = Math.max(maxPdf, maxPdfAlt) * 1.15;

  function toSvgY(y: number) {
    return padding.top + plotH - (y / yMax) * plotH;
  }

  const steps = 200;
  const dx = xRange / steps;

  // H0 curve
  const h0Points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    const y = normalPDF(x, 0, se);
    h0Points.push(`${toSvgX(x)},${toSvgY(y)}`);
  }

  // H1 curve
  const h1Points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    const y = normalPDF(x, effectSize, se);
    h1Points.push(`${toSvgX(x)},${toSvgY(y)}`);
  }

  // Rejection region fill (H1 curve, right of critical value)
  const rejectFill: string[] = [];
  rejectFill.push(`${toSvgX(criticalValue)},${toSvgY(0)}`);
  for (let i = 0; i <= steps; i++) {
    const x = criticalValue + (i / steps) * (xMax - criticalValue);
    const y = normalPDF(x, effectSize, se);
    rejectFill.push(`${toSvgX(x)},${toSvgY(y)}`);
  }
  rejectFill.push(`${toSvgX(xMax)},${toSvgY(0)}`);

  // Alpha region fill (H0 curve, right of critical value)
  const alphaFill: string[] = [];
  alphaFill.push(`${toSvgX(criticalValue)},${toSvgY(0)}`);
  for (let i = 0; i <= steps; i++) {
    const x = criticalValue + (i / steps) * (xMax - criticalValue);
    const y = normalPDF(x, 0, se);
    alphaFill.push(`${toSvgX(x)},${toSvgY(y)}`);
  }
  alphaFill.push(`${toSvgX(xMax)},${toSvgY(0)}`);

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Visualize how sample size, effect size, and significance level interact
        to determine statistical power. The green area is power (correctly
        rejecting H0). The red area is alpha (Type I error).
      </p>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Sample size (n): {sampleSize}
          </label>
          <input
            type="range"
            min={10}
            max={500}
            step={5}
            value={sampleSize}
            onChange={(e) => setSampleSize(Number(e.target.value))}
            className="w-full accent-brand-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Effect size (d): {effectSize.toFixed(2)}
          </label>
          <input
            type="range"
            min={0.05}
            max={1.5}
            step={0.05}
            value={effectSize}
            onChange={(e) => setEffectSize(Number(e.target.value))}
            className="w-full accent-brand-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Alpha: {alpha}
          </label>
          <input
            type="range"
            min={0.001}
            max={0.1}
            step={0.001}
            value={alpha}
            onChange={(e) => setAlpha(Number(e.target.value))}
            className="w-full accent-brand-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div className="bg-brand-50 rounded-lg p-3">
          <div className="text-xs text-brand-400">Power (1-beta)</div>
          <div
            className={`text-lg font-semibold ${
              power >= 0.8 ? "text-green-600" : "text-amber-600"
            }`}
          >
            {(power * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-brand-50 rounded-lg p-3">
          <div className="text-xs text-brand-400">Beta (Type II)</div>
          <div className="text-lg font-semibold text-brand-700">
            {(beta * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-brand-50 rounded-lg p-3">
          <div className="text-xs text-brand-400">Alpha (Type I)</div>
          <div className="text-lg font-semibold text-red-500">
            {(alpha * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-brand-50 rounded-lg p-3">
          <div className="text-xs text-brand-400">Critical value</div>
          <div className="text-lg font-semibold text-brand-700">
            {criticalValue.toFixed(3)}
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-white border border-brand-100 rounded-xl p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Alpha fill */}
          <polygon
            points={alphaFill.join(" ")}
            fill="rgba(239,68,68,0.2)"
            stroke="none"
          />
          {/* Power fill */}
          <polygon
            points={rejectFill.join(" ")}
            fill="rgba(34,197,94,0.25)"
            stroke="none"
          />
          {/* H0 curve */}
          <polyline
            points={h0Points.join(" ")}
            fill="none"
            stroke="#436d62"
            strokeWidth="2"
          />
          {/* H1 curve */}
          <polyline
            points={h1Points.join(" ")}
            fill="none"
            stroke="#5c8a7e"
            strokeWidth="2"
            strokeDasharray="6 3"
          />
          {/* Critical value line */}
          <line
            x1={toSvgX(criticalValue)}
            y1={padding.top}
            x2={toSvgX(criticalValue)}
            y2={padding.top + plotH}
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          {/* Axis */}
          <line
            x1={padding.left}
            y1={toSvgY(0)}
            x2={svgWidth - padding.right}
            y2={toSvgY(0)}
            stroke="#b0c9c3"
            strokeWidth="1"
          />
          {/* Labels */}
          <text
            x={toSvgX(0)}
            y={svgHeight - 8}
            textAnchor="middle"
            fontSize="11"
            fill="#436d62"
          >
            H0 (0)
          </text>
          <text
            x={toSvgX(effectSize)}
            y={svgHeight - 8}
            textAnchor="middle"
            fontSize="11"
            fill="#5c8a7e"
          >
            H1 ({effectSize.toFixed(2)})
          </text>
          <text
            x={toSvgX(criticalValue)}
            y={padding.top - 5}
            textAnchor="middle"
            fontSize="10"
            fill="#ef4444"
          >
            critical value
          </text>
        </svg>
        <div className="flex gap-6 mt-2 text-xs text-brand-500 justify-center">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-brand-500 inline-block"></span> H0
            distribution
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-brand-400 inline-block border-dashed border-b"></span>{" "}
            H1 distribution
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-green-200 inline-block rounded-sm"></span>{" "}
            Power
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-red-200 inline-block rounded-sm"></span>{" "}
            Alpha
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
        <p className="text-sm text-brand-700">
          {power >= 0.8
            ? `With n=${sampleSize}, effect size=${effectSize.toFixed(2)}, and alpha=${alpha}, power is ${(power * 100).toFixed(1)}%. This study is adequately powered (above the conventional 80% threshold).`
            : `With n=${sampleSize}, effect size=${effectSize.toFixed(2)}, and alpha=${alpha}, power is only ${(power * 100).toFixed(1)}%. This study is underpowered. Consider increasing sample size or targeting a larger effect.`}
        </p>
      </div>
    </div>
  );
}
