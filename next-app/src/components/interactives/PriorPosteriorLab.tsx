"use client";

import { useState, useMemo, useCallback } from "react";

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function normalPDF(x: number, mean: number, sd: number) {
  const z = (x - mean) / sd;
  return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
}

type PriorType = "informative" | "weakly-informative" | "flat";

const priorConfigs: Record<PriorType, { mean: number; sd: number; label: string }> = {
  informative: { mean: 0.3, sd: 0.1, label: "Informative (mean=0.3, SD=0.1)" },
  "weakly-informative": { mean: 0, sd: 0.5, label: "Weakly Informative (mean=0, SD=0.5)" },
  flat: { mean: 0, sd: 5, label: "Flat/Non-informative (mean=0, SD=5)" },
};

export default function PriorPosteriorLab() {
  const [priorType, setPriorType] = useState<PriorType>("informative");
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  const prior = priorConfigs[priorType];

  const addData = useCallback(() => {
    // True effect is 0.4
    const newPoint = 0.4 + gaussianRandom() * 0.3;
    setDataPoints((prev) => [...prev, newPoint]);
  }, []);

  const addBatch = useCallback(() => {
    const batch = Array.from({ length: 10 }, () => 0.4 + gaussianRandom() * 0.3);
    setDataPoints((prev) => [...prev, ...batch]);
  }, []);

  const reset = useCallback(() => {
    setDataPoints([]);
  }, []);

  const posterior = useMemo(() => {
    if (dataPoints.length === 0) {
      return { mean: prior.mean, sd: prior.sd };
    }

    const n = dataPoints.length;
    const dataMean = dataPoints.reduce((a, b) => a + b, 0) / n;
    const dataVariance = 0.09; // known sigma^2 = 0.3^2
    const priorVariance = prior.sd * prior.sd;

    // Normal-Normal conjugate update
    const postVariance = 1 / (1 / priorVariance + n / dataVariance);
    const postMean = postVariance * (prior.mean / priorVariance + n * dataMean / dataVariance);
    const postSD = Math.sqrt(postVariance);

    return { mean: postMean, sd: postSD };
  }, [dataPoints, prior]);

  // SVG plot
  const svgW = 400, svgH = 200;
  const pad = { top: 15, right: 20, bottom: 30, left: 20 };
  const pW = svgW - pad.left - pad.right;
  const pH = svgH - pad.top - pad.bottom;

  const xMin = -1, xMax = 1.5;
  const tx = (x: number) => pad.left + ((x - xMin) / (xMax - xMin)) * pW;
  const ty = (y: number, maxY: number) => pad.top + pH - (y / maxY) * pH;

  const { priorCurve, posteriorCurve, maxY } = useMemo(() => {
    const steps = 200;
    let maxY = 0;
    const priorPts: { x: number; y: number }[] = [];
    const postPts: { x: number; y: number }[] = [];

    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const py = normalPDF(x, prior.mean, prior.sd);
      const poY = normalPDF(x, posterior.mean, posterior.sd);
      priorPts.push({ x, y: py });
      postPts.push({ x, y: poY });
      maxY = Math.max(maxY, py, poY);
    }

    return { priorCurve: priorPts, posteriorCurve: postPts, maxY: maxY * 1.1 };
  }, [prior, posterior]);

  const pathFromPts = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${tx(p.x).toFixed(1)},${ty(p.y, maxY).toFixed(1)}`).join(" ");

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Choose a prior, then add data points one at a time or in batches.
        Watch the posterior distribution update and converge toward the true
        effect (0.4) as evidence accumulates.
      </p>

      <div className="flex flex-wrap gap-2">
        {(Object.entries(priorConfigs) as [PriorType, typeof priorConfigs[PriorType]][]).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => { setPriorType(key); setDataPoints([]); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              priorType === key
                ? "bg-brand-500 text-white"
                : "bg-brand-100 text-brand-700 hover:bg-brand-200"
            }`}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-brand-100 rounded-xl p-4">
        <div className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-2">
          Prior (dashed) vs Posterior (solid) | n = {dataPoints.length}
        </div>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
          {/* Axes */}
          <line x1={pad.left} y1={pad.top + pH} x2={pad.left + pW} y2={pad.top + pH} stroke="#b0c9c3" strokeWidth="1" />

          {/* True value line */}
          <line x1={tx(0.4)} y1={pad.top} x2={tx(0.4)} y2={pad.top + pH} stroke="#82a99f" strokeWidth="1" strokeDasharray="4 3" />
          <text x={tx(0.4)} y={pad.top - 3} textAnchor="middle" fontSize="9" fill="#82a99f">True = 0.4</text>

          {/* Prior curve */}
          <path d={pathFromPts(priorCurve)} fill="none" stroke="#a3bfb8" strokeWidth="2" strokeDasharray="6 3" />

          {/* Posterior curve */}
          <path d={pathFromPts(posteriorCurve)} fill="none" stroke="#436d62" strokeWidth="2.5" />

          {/* X-axis labels */}
          {[-0.5, 0, 0.5, 1.0].map((v) => (
            <text key={v} x={tx(v)} y={svgH - 8} textAnchor="middle" fontSize="9" fill="#82a99f">{v}</text>
          ))}

          {/* Posterior mean marker */}
          <circle cx={tx(posterior.mean)} cy={ty(normalPDF(posterior.mean, posterior.mean, posterior.sd), maxY)} r={4} fill="#436d62" />
        </svg>

        <div className="flex gap-4 text-xs text-brand-500 mt-1">
          <span><span className="inline-block w-4 border-t-2 border-dashed border-brand-300 mr-1 align-middle" /> Prior</span>
          <span><span className="inline-block w-4 border-t-2 border-brand-600 mr-1 align-middle" /> Posterior</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={addData} className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors">
          + 1 Data Point
        </button>
        <button onClick={addBatch} className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors">
          + 10 Data Points
        </button>
        <button onClick={reset} className="px-4 py-2 bg-brand-100 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-200 transition-colors">
          Reset
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="bg-brand-50 rounded-lg p-3 text-center">
          <div className="text-xs text-brand-400">Prior Mean</div>
          <div className="text-lg font-semibold text-brand-800">{prior.mean.toFixed(2)}</div>
        </div>
        <div className="bg-brand-50 rounded-lg p-3 text-center">
          <div className="text-xs text-brand-400">Posterior Mean</div>
          <div className="text-lg font-semibold text-brand-800">{posterior.mean.toFixed(3)}</div>
        </div>
        <div className="bg-brand-50 rounded-lg p-3 text-center">
          <div className="text-xs text-brand-400">95% Credible Interval</div>
          <div className="text-lg font-semibold text-brand-800">
            [{(posterior.mean - 1.96 * posterior.sd).toFixed(2)}, {(posterior.mean + 1.96 * posterior.sd).toFixed(2)}]
          </div>
        </div>
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
        <p className="text-sm text-brand-700">
          {dataPoints.length === 0
            ? "No data yet. The curve shows your prior belief. Add data points to see Bayesian updating in action."
            : dataPoints.length < 5
            ? `With ${dataPoints.length} observation${dataPoints.length > 1 ? "s" : ""}, the posterior is still heavily influenced by the prior. Add more data to see the posterior shift toward the true value.`
            : dataPoints.length < 30
            ? `With ${dataPoints.length} observations, the posterior is moving toward the true value (0.4). The credible interval is narrowing as evidence accumulates.`
            : `With ${dataPoints.length} observations, the posterior has converged near the true value regardless of the prior. This demonstrates how data eventually overwhelms the prior with enough evidence.`}
        </p>
      </div>
    </div>
  );
}
