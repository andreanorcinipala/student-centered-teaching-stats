"use client";

import { useState, useMemo } from "react";

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

interface Subject {
  treatment: number;
  confounder: number;
  outcome: number;
}

function generateData(n: number, confounding: number): Subject[] {
  const data: Subject[] = [];
  for (let i = 0; i < n; i++) {
    const confounder = Math.random() < 0.5 ? 1 : 0;
    // Confounder increases probability of getting treatment
    const treatProb = confounder === 1 ? 0.3 + confounding * 0.3 : 0.3;
    const treatment = Math.random() < treatProb ? 1 : 0;
    // True treatment effect + confounder effect
    const logit = -2 + 0.5 * treatment + confounding * 1.2 * confounder + gaussianRandom() * 0.3;
    const prob = 1 / (1 + Math.exp(-logit));
    const outcome = Math.random() < prob ? 1 : 0;
    data.push({ treatment, confounder, outcome });
  }
  return data;
}

function computeOR(data: Subject[], adjust: boolean) {
  if (!adjust) {
    // Crude OR
    let a = 0, b = 0, c = 0, d = 0;
    for (const s of data) {
      if (s.treatment === 1 && s.outcome === 1) a++;
      else if (s.treatment === 1 && s.outcome === 0) b++;
      else if (s.treatment === 0 && s.outcome === 1) c++;
      else d++;
    }
    if (b === 0 || c === 0) return { or: 1, ci_lower: 1, ci_upper: 1 };
    const or = (a * d) / (b * c);
    const se = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d);
    return {
      or,
      ci_lower: Math.exp(Math.log(or) - 1.96 * se),
      ci_upper: Math.exp(Math.log(or) + 1.96 * se),
    };
  }

  // Mantel-Haenszel adjusted OR
  let sumR = 0, sumS = 0;
  for (const level of [0, 1]) {
    const stratum = data.filter((s) => s.confounder === level);
    const n = stratum.length;
    if (n === 0) continue;
    let a = 0, b = 0, c = 0, d = 0;
    for (const s of stratum) {
      if (s.treatment === 1 && s.outcome === 1) a++;
      else if (s.treatment === 1 && s.outcome === 0) b++;
      else if (s.treatment === 0 && s.outcome === 1) c++;
      else d++;
    }
    sumR += (a * d) / n;
    sumS += (b * c) / n;
  }
  if (sumS === 0) return { or: 1, ci_lower: 1, ci_upper: 1 };
  const mhOR = sumR / sumS;
  const se = 0.3; // approximate
  return {
    or: mhOR,
    ci_lower: Math.exp(Math.log(mhOR) - 1.96 * se),
    ci_upper: Math.exp(Math.log(mhOR) + 1.96 * se),
  };
}

export default function CrudeVsAdjusted() {
  const [confounding, setConfounding] = useState(1);
  const [data, setData] = useState<Subject[]>(() => generateData(1000, 1));

  const regenerate = (c: number) => {
    setConfounding(c);
    setData(generateData(1000, c));
  };

  const crude = useMemo(() => computeOR(data, false), [data]);
  const adjusted = useMemo(() => computeOR(data, true), [data]);

  const change = crude.or > 0
    ? Math.abs(((adjusted.or - crude.or) / crude.or) * 100)
    : 0;

  const svgW = 300, svgH = 120;
  const maxOR = Math.max(crude.or, adjusted.or, crude.ci_upper, adjusted.ci_upper) * 1.2;
  const scale = (v: number) => 40 + ((v - 0) / maxOR) * (svgW - 60);

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Adjust confounding strength and compare crude vs. adjusted odds ratios.
        When the confounder is strong, the crude OR overestimates the true effect.
      </p>

      <div>
        <label className="block text-xs font-medium text-brand-500 mb-1">
          Confounding strength: {confounding.toFixed(1)}
        </label>
        <input
          type="range" min={0} max={2} step={0.1} value={confounding}
          onChange={(e) => regenerate(Number(e.target.value))}
          className="w-full accent-brand-500"
        />
        <div className="flex justify-between text-xs text-brand-400">
          <span>No confounding</span><span>Strong confounding</span>
        </div>
      </div>

      <div className="bg-white border border-brand-100 rounded-xl p-4">
        <div className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-2">
          Odds Ratio Comparison
        </div>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
          {/* Reference line at OR=1 */}
          <line x1={scale(1)} y1={10} x2={scale(1)} y2={svgH - 20} stroke="#d7e4e1" strokeWidth="1" strokeDasharray="4 3" />
          <text x={scale(1)} y={svgH - 8} textAnchor="middle" fontSize="9" fill="#82a99f">OR=1</text>

          {/* Crude */}
          <line x1={scale(crude.ci_lower)} y1={35} x2={scale(crude.ci_upper)} y2={35} stroke="#ef4444" strokeWidth="2" />
          <circle cx={scale(crude.or)} cy={35} r={5} fill="#ef4444" />
          <text x={4} y={38} fontSize="10" fill="#ef4444" fontWeight="bold">Crude</text>

          {/* Adjusted */}
          <line x1={scale(adjusted.ci_lower)} y1={65} x2={scale(adjusted.ci_upper)} y2={65} stroke="#436d62" strokeWidth="2" />
          <circle cx={scale(adjusted.or)} cy={65} r={5} fill="#436d62" />
          <text x={4} y={68} fontSize="10" fill="#436d62" fontWeight="bold">Adjusted</text>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-red-50 border border-red-100 rounded-xl p-3">
          <div className="text-xs text-red-400 font-medium">Crude OR</div>
          <div className="text-lg font-semibold text-red-600">{crude.or.toFixed(2)}</div>
          <div className="text-xs text-red-400">
            95% CI: [{crude.ci_lower.toFixed(2)}, {crude.ci_upper.toFixed(2)}]
          </div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-3">
          <div className="text-xs text-green-600 font-medium">Adjusted OR</div>
          <div className="text-lg font-semibold text-green-700">{adjusted.or.toFixed(2)}</div>
          <div className="text-xs text-green-600">
            95% CI: [{adjusted.ci_lower.toFixed(2)}, {adjusted.ci_upper.toFixed(2)}]
          </div>
        </div>
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
        <p className="text-sm text-brand-700">
          The OR changed by {change.toFixed(0)}% after adjustment.{" "}
          {change > 10
            ? "This exceeds the 10% change rule, confirming the variable is a confounder. The crude OR overestimated the treatment effect because the confounder was associated with both treatment and outcome."
            : "This is below the 10% threshold, suggesting minimal confounding at this level. Try increasing the confounding strength to see the difference grow."}
        </p>
      </div>
    </div>
  );
}
