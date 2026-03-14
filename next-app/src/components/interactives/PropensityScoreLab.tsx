"use client";

import { useState, useMemo } from "react";

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

interface Subject {
  age: number;
  bmi: number;
  treatment: number;
  outcome: number;
  propensity: number;
}

function logistic(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function generateData(n: number, confoundingStrength: number): Subject[] {
  const data: Subject[] = [];
  for (let i = 0; i < n; i++) {
    const age = 30 + gaussianRandom() * 15;
    const bmi = 25 + gaussianRandom() * 5;
    // Treatment assignment depends on confounders
    const treatLogit = -1 + confoundingStrength * 0.04 * (age - 50) + confoundingStrength * 0.08 * (bmi - 25);
    const treatProb = logistic(treatLogit);
    const treatment = Math.random() < treatProb ? 1 : 0;
    // Propensity score
    const propensity = treatProb;
    // Outcome depends on treatment + confounders
    const outcomeLogit = -2 + 0.6 * treatment + 0.03 * (age - 50) + 0.05 * (bmi - 25);
    const outcome = Math.random() < logistic(outcomeLogit) ? 1 : 0;
    data.push({ age, bmi, treatment, outcome, propensity });
  }
  return data;
}

function crudeOR(data: Subject[]) {
  let a = 0, b = 0, c = 0, d = 0;
  for (const s of data) {
    if (s.treatment === 1 && s.outcome === 1) a++;
    else if (s.treatment === 1 && s.outcome === 0) b++;
    else if (s.treatment === 0 && s.outcome === 1) c++;
    else d++;
  }
  if (b === 0 || c === 0 || a === 0 || d === 0) return 1;
  return (a * d) / (b * c);
}

function iptwOR(data: Subject[]) {
  // Simple IPTW estimate
  let wTreatEvent = 0, wTreatNoEvent = 0, wControlEvent = 0, wControlNoEvent = 0;
  for (const s of data) {
    const w = s.treatment === 1 ? 1 / s.propensity : 1 / (1 - s.propensity);
    const clampedW = Math.min(w, 20); // Truncate extreme weights
    if (s.treatment === 1 && s.outcome === 1) wTreatEvent += clampedW;
    else if (s.treatment === 1 && s.outcome === 0) wTreatNoEvent += clampedW;
    else if (s.treatment === 0 && s.outcome === 1) wControlEvent += clampedW;
    else wControlNoEvent += clampedW;
  }
  if (wTreatNoEvent === 0 || wControlEvent === 0) return 1;
  return (wTreatEvent * wControlNoEvent) / (wTreatNoEvent * wControlEvent);
}

function eValue(or: number) {
  if (or < 1) or = 1 / or;
  return or + Math.sqrt(or * (or - 1));
}

export default function PropensityScoreLab() {
  const [confounding, setConfounding] = useState(1.5);
  const [data, setData] = useState<Subject[]>(() => generateData(2000, 1.5));

  const regenerate = (c: number) => {
    setConfounding(c);
    setData(generateData(2000, c));
  };

  const crude = useMemo(() => crudeOR(data), [data]);
  const weighted = useMemo(() => iptwOR(data), [data]);
  const ev = useMemo(() => eValue(weighted), [weighted]);
  const trueOR = Math.exp(0.6); // ~1.82

  const svgW = 320, svgH = 130;
  const maxOR = Math.max(crude, weighted, trueOR) * 1.3;
  const scale = (v: number) => 50 + ((v - 0) / maxOR) * (svgW - 70);

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Compare crude, IPTW-adjusted, and true treatment effects. Adjust
        confounding strength to see how propensity score weighting recovers the
        true effect.
      </p>

      <div>
        <label className="block text-xs font-medium text-brand-500 mb-1">
          Confounding strength: {confounding.toFixed(1)}
        </label>
        <input
          type="range" min={0} max={3} step={0.1} value={confounding}
          onChange={(e) => regenerate(Number(e.target.value))}
          className="w-full accent-brand-500"
        />
        <div className="flex justify-between text-xs text-brand-400">
          <span>No confounding</span><span>Strong confounding</span>
        </div>
      </div>

      <div className="bg-white border border-brand-100 rounded-xl p-4">
        <div className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-2">
          Odds Ratio Estimates
        </div>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
          <line x1={scale(1)} y1={5} x2={scale(1)} y2={svgH - 20} stroke="#d7e4e1" strokeWidth="1" strokeDasharray="4 3" />
          <text x={scale(1)} y={svgH - 5} textAnchor="middle" fontSize="9" fill="#82a99f">OR=1</text>

          {/* True */}
          <line x1={scale(trueOR)} y1={5} x2={scale(trueOR)} y2={svgH - 20} stroke="#a3bfb8" strokeWidth="1.5" strokeDasharray="6 3" />
          <text x={scale(trueOR)} y={svgH - 5} textAnchor="middle" fontSize="8" fill="#82a99f">True</text>

          {/* Crude */}
          <circle cx={scale(crude)} cy={30} r={6} fill="#ef4444" />
          <text x={8} y={33} fontSize="10" fill="#ef4444" fontWeight="bold">Crude</text>
          <text x={scale(crude) + 10} y={33} fontSize="9" fill="#ef4444">{crude.toFixed(2)}</text>

          {/* IPTW */}
          <circle cx={scale(weighted)} cy={60} r={6} fill="#436d62" />
          <text x={8} y={63} fontSize="10" fill="#436d62" fontWeight="bold">IPTW</text>
          <text x={scale(weighted) + 10} y={63} fontSize="9" fill="#436d62">{weighted.toFixed(2)}</text>

          {/* True value label */}
          <circle cx={scale(trueOR)} cy={90} r={6} fill="#a3bfb8" />
          <text x={8} y={93} fontSize="10" fill="#82a99f" fontWeight="bold">True</text>
          <text x={scale(trueOR) + 10} y={93} fontSize="9" fill="#82a99f">{trueOR.toFixed(2)}</text>
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
          <div className="text-xs text-red-400 font-medium">Crude OR</div>
          <div className="text-lg font-semibold text-red-600">{crude.toFixed(2)}</div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
          <div className="text-xs text-green-600 font-medium">IPTW OR</div>
          <div className="text-lg font-semibold text-green-700">{weighted.toFixed(2)}</div>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
          <div className="text-xs text-amber-600 font-medium">E-value</div>
          <div className="text-lg font-semibold text-amber-700">{ev.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
        <p className="text-sm text-brand-700">
          The true OR is {trueOR.toFixed(2)}. The crude OR ({crude.toFixed(2)}) is{" "}
          {Math.abs(crude - trueOR) > 0.3 ? "substantially biased" : "close"} due to
          confounding by age and BMI. IPTW weighting recovers an estimate of{" "}
          {weighted.toFixed(2)}, which is{" "}
          {Math.abs(weighted - trueOR) < Math.abs(crude - trueOR) ? "closer to" : "further from"}{" "}
          the truth. The E-value of {ev.toFixed(2)} means an unmeasured confounder would
          need an association of at least {ev.toFixed(2)} with both treatment and outcome
          to fully explain the remaining effect.
        </p>
      </div>
    </div>
  );
}
