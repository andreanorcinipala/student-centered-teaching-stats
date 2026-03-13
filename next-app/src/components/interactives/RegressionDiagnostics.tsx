"use client";

import { useState, useMemo } from "react";

interface Point { x: number; y: number; }

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function generateData(n: number, trueSlope: number, trueIntercept: number, noise: number): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < n; i++) {
    const x = 1 + Math.random() * 9;
    const y = trueIntercept + trueSlope * x + gaussianRandom() * noise;
    pts.push({ x, y });
  }
  return pts;
}

function computeRegression(points: Point[]) {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: 0, rSquared: 0, residuals: [] as number[] };
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
  const meanX = sumX / n;
  const meanY = sumY / n;
  const denom = sumX2 - n * meanX * meanX;
  if (Math.abs(denom) < 1e-10) return { slope: 0, intercept: meanY, rSquared: 0, residuals: points.map(() => 0) };
  const slope = (sumXY - n * meanX * meanY) / denom;
  const intercept = meanY - slope * meanX;
  const residuals = points.map((p) => p.y - (intercept + slope * p.x));
  const ssRes = residuals.reduce((s, r) => s + r * r, 0);
  const ssTot = points.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
  const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;
  return { slope, intercept, rSquared, residuals };
}

export default function RegressionDiagnostics() {
  const [sampleSize, setSampleSize] = useState(40);
  const [trueSlope, setTrueSlope] = useState(5);
  const [noise, setNoise] = useState(10);
  const [points, setPoints] = useState<Point[]>(() => generateData(40, 5, 10, 10));

  function regenerate() {
    setPoints(generateData(sampleSize, trueSlope, 10, noise));
  }

  const reg = useMemo(() => computeRegression(points), [points]);
  const predicted = points.map((p) => reg.intercept + reg.slope * p.x);

  const xMin = 0, xMax = 11;
  const allY = points.map((p) => p.y);
  const yMin = Math.min(...allY, 0) - 5;
  const yMax = Math.max(...allY, 100) + 5;

  const svgW = 280, svgH = 200;
  const pad = { top: 10, right: 10, bottom: 25, left: 35 };
  const pW = svgW - pad.left - pad.right;
  const pH = svgH - pad.top - pad.bottom;

  function tx(x: number) { return pad.left + ((x - xMin) / (xMax - xMin)) * pW; }
  function ty(y: number) { return pad.top + pH - ((y - yMin) / (yMax - yMin)) * pH; }

  // Residual plot bounds
  const resMax = Math.max(...reg.residuals.map(Math.abs), 1) * 1.2;
  function tryR(r: number) { return pad.top + pH - ((r - (-resMax)) / (2 * resMax)) * pH; }

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Generate data with a known slope and noise level. Compare the estimated
        regression to the truth and check the residual plot for patterns.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Sample size: {sampleSize}
          </label>
          <input type="range" min={10} max={200} step={5} value={sampleSize}
            onChange={(e) => setSampleSize(Number(e.target.value))}
            className="w-full accent-brand-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            True slope: {trueSlope}
          </label>
          <input type="range" min={-10} max={15} step={0.5} value={trueSlope}
            onChange={(e) => setTrueSlope(Number(e.target.value))}
            className="w-full accent-brand-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Noise (SD): {noise}
          </label>
          <input type="range" min={1} max={40} step={1} value={noise}
            onChange={(e) => setNoise(Number(e.target.value))}
            className="w-full accent-brand-500" />
        </div>
      </div>

      <button onClick={regenerate}
        className="px-5 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors">
        Generate new data
      </button>

      {/* Charts side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Scatter + line */}
        <div className="bg-white border border-brand-100 rounded-xl p-3">
          <div className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-1">Scatter + Regression</div>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
            <line x1={pad.left} y1={pad.top + pH} x2={pad.left + pW} y2={pad.top + pH} stroke="#b0c9c3" strokeWidth="1" />
            <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + pH} stroke="#b0c9c3" strokeWidth="1" />
            <line x1={tx(xMin)} y1={ty(reg.intercept + reg.slope * xMin)} x2={tx(xMax)} y2={ty(reg.intercept + reg.slope * xMax)}
              stroke="#436d62" strokeWidth="2" />
            {points.map((p, i) => (
              <circle key={i} cx={tx(p.x)} cy={ty(p.y)} r="3" fill="#5c8a7e" opacity="0.7" />
            ))}
            <text x={svgW / 2} y={svgH - 3} textAnchor="middle" fontSize="10" fill="#82a99f">X</text>
            <text x={8} y={svgH / 2} textAnchor="middle" fontSize="10" fill="#82a99f" transform={`rotate(-90,8,${svgH / 2})`}>Y</text>
          </svg>
        </div>

        {/* Residual plot */}
        <div className="bg-white border border-brand-100 rounded-xl p-3">
          <div className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-1">Residuals vs. Predicted</div>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
            <line x1={pad.left} y1={tryR(0)} x2={pad.left + pW} y2={tryR(0)} stroke="#ef4444" strokeWidth="1" strokeDasharray="4 2" />
            <line x1={pad.left} y1={pad.top + pH} x2={pad.left + pW} y2={pad.top + pH} stroke="#b0c9c3" strokeWidth="1" />
            <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + pH} stroke="#b0c9c3" strokeWidth="1" />
            {points.map((p, i) => (
              <circle key={i} cx={tx(predicted[i] !== undefined ? p.x : 0)} cy={tryR(reg.residuals[i])} r="3" fill="#5c8a7e" opacity="0.7" />
            ))}
            <text x={svgW / 2} y={svgH - 3} textAnchor="middle" fontSize="10" fill="#82a99f">Predicted</text>
            <text x={8} y={svgH / 2} textAnchor="middle" fontSize="10" fill="#82a99f" transform={`rotate(-90,8,${svgH / 2})`}>Residual</text>
          </svg>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div className="bg-brand-50 rounded-lg p-3">
          <div className="text-xs text-brand-400">Estimated slope</div>
          <div className="text-lg font-semibold text-brand-800">{reg.slope.toFixed(2)}</div>
          <div className="text-xs text-brand-400">True: {trueSlope}</div>
        </div>
        <div className="bg-brand-50 rounded-lg p-3">
          <div className="text-xs text-brand-400">Intercept</div>
          <div className="text-lg font-semibold text-brand-800">{reg.intercept.toFixed(2)}</div>
          <div className="text-xs text-brand-400">True: 10</div>
        </div>
        <div className="bg-brand-50 rounded-lg p-3">
          <div className="text-xs text-brand-400">R-squared</div>
          <div className="text-lg font-semibold text-brand-800">{reg.rSquared.toFixed(3)}</div>
        </div>
        <div className="bg-brand-50 rounded-lg p-3">
          <div className="text-xs text-brand-400">n</div>
          <div className="text-lg font-semibold text-brand-800">{points.length}</div>
        </div>
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
        <p className="text-sm text-brand-700">
          {Math.abs(reg.slope - trueSlope) < 1
            ? "The estimated slope is close to the true value. "
            : "The estimated slope differs from the true value due to noise. Try increasing the sample size. "}
          {reg.rSquared > 0.7
            ? "The R-squared is high, indicating a strong linear fit. "
            : reg.rSquared > 0.3
            ? "The R-squared is moderate. The relationship exists but noise obscures it. "
            : "The R-squared is low. With this much noise, the linear pattern is hard to detect. "}
          The residual plot should show random scatter around zero. Patterns suggest model misspecification.
        </p>
      </div>
    </div>
  );
}
