"use client";

import { useState } from "react";

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export default function PassFailPredictor() {
  const [studyHours, setStudyHours] = useState(5);
  const [threshold, setThreshold] = useState(0.5);

  // Model: logit(p) = -4 + 0.8 * hours
  const b0 = -4;
  const b1 = 0.8;
  const logit = b0 + b1 * studyHours;
  const probability = sigmoid(logit);
  const prediction = probability >= threshold ? "Pass" : "Fail";

  // S-curve points
  const svgW = 600, svgH = 280;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const pW = svgW - pad.left - pad.right;
  const pH = svgH - pad.top - pad.bottom;

  const xMin = 0, xMax = 12;
  function tx(x: number) { return pad.left + ((x - xMin) / (xMax - xMin)) * pW; }
  function ty(y: number) { return pad.top + pH - y * pH; }

  const curvePoints: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = xMin + (i / 200) * (xMax - xMin);
    const p = sigmoid(b0 + b1 * x);
    curvePoints.push(`${tx(x)},${ty(p)}`);
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        This model predicts whether a student passes based on study hours.
        Adjust the hours and see the probability change along the S-curve.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Study hours: {studyHours}
          </label>
          <input type="range" min={0} max={12} step={0.5} value={studyHours}
            onChange={(e) => setStudyHours(Number(e.target.value))}
            className="w-full accent-brand-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Threshold: {(threshold * 100).toFixed(0)}%
          </label>
          <input type="range" min={0.1} max={0.9} step={0.05} value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full accent-brand-500" />
        </div>
      </div>

      {/* Result */}
      <div className={`rounded-xl border p-5 flex items-center gap-4 ${
        prediction === "Pass" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
      }`}>
        <div className={`text-4xl font-semibold ${
          prediction === "Pass" ? "text-green-600" : "text-red-500"
        }`}>
          {(probability * 100).toFixed(1)}%
        </div>
        <div>
          <div className={`text-sm font-semibold ${
            prediction === "Pass" ? "text-green-700" : "text-red-700"
          }`}>
            Prediction: {prediction}
          </div>
          <div className="text-xs text-brand-500">
            {studyHours} hours of studying, threshold at {(threshold * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* S-curve plot */}
      <div className="bg-white border border-brand-100 rounded-xl p-4 overflow-x-auto">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Grid */}
          <line x1={pad.left} y1={pad.top + pH} x2={pad.left + pW} y2={pad.top + pH} stroke="#b0c9c3" strokeWidth="1" />
          <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + pH} stroke="#b0c9c3" strokeWidth="1" />

          {/* Threshold line */}
          <line x1={pad.left} y1={ty(threshold)} x2={pad.left + pW} y2={ty(threshold)}
            stroke="#82a99f" strokeWidth="1" strokeDasharray="4 3" />
          <text x={pad.left + pW + 5} y={ty(threshold) + 4} fontSize="10" fill="#82a99f">
            {(threshold * 100).toFixed(0)}%
          </text>

          {/* S-curve */}
          <polyline points={curvePoints.join(" ")} fill="none" stroke="#436d62" strokeWidth="2.5" />

          {/* Current point */}
          <circle cx={tx(studyHours)} cy={ty(probability)} r="7" fill={prediction === "Pass" ? "#22c55e" : "#ef4444"} stroke="white" strokeWidth="2" />

          {/* Dashed lines to point */}
          <line x1={tx(studyHours)} y1={ty(probability)} x2={tx(studyHours)} y2={pad.top + pH}
            stroke="#82a99f" strokeWidth="1" strokeDasharray="3 2" />
          <line x1={pad.left} y1={ty(probability)} x2={tx(studyHours)} y2={ty(probability)}
            stroke="#82a99f" strokeWidth="1" strokeDasharray="3 2" />

          {/* X axis labels */}
          {[0, 2, 4, 6, 8, 10, 12].map((x) => (
            <text key={x} x={tx(x)} y={svgH - 10} textAnchor="middle" fontSize="11" fill="#5c8a7e">{x}</text>
          ))}
          {/* Y axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((y) => (
            <text key={y} x={pad.left - 8} y={ty(y) + 4} textAnchor="end" fontSize="11" fill="#5c8a7e">{(y * 100).toFixed(0)}%</text>
          ))}

          <text x={svgW / 2} y={svgH - 2} textAnchor="middle" fontSize="11" fill="#5c8a7e">Study Hours</text>
        </svg>
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
        <p className="text-sm text-brand-700">
          The S-curve is flat at the extremes (very low or very high hours barely change the probability)
          and steep in the middle (where each extra hour makes the biggest difference).
          Moving the threshold changes where the model draws the line between &quot;pass&quot; and &quot;fail.&quot;
        </p>
      </div>
    </div>
  );
}
