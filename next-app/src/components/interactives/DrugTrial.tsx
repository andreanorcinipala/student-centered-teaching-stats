"use client";

import { useState } from "react";

function generateTrial(n: number, trueEffect: number) {
  const control: number[] = [];
  const treatment: number[] = [];

  for (let i = 0; i < n; i++) {
    // Blood pressure reductions ~ Normal(5, 8) for control
    control.push(5 + gaussianRandom() * 8);
    // Treatment group gets the true effect added
    treatment.push(5 + trueEffect + gaussianRandom() * 8);
  }

  const controlMean = mean(control);
  const treatmentMean = mean(treatment);
  const controlSd = sd(control);
  const treatmentSd = sd(treatment);

  // Two-sample t-test (Welch's)
  const se = Math.sqrt(
    (controlSd * controlSd) / n + (treatmentSd * treatmentSd) / n
  );
  const t = (treatmentMean - controlMean) / se;

  // Approximate p-value using normal distribution for large n
  const p = 1 - normalCDF(Math.abs(t));

  return {
    controlMean: controlMean.toFixed(1),
    treatmentMean: treatmentMean.toFixed(1),
    difference: (treatmentMean - controlMean).toFixed(1),
    tStat: t.toFixed(2),
    pValue: p,
    pDisplay: p < 0.001 ? "< 0.001" : p.toFixed(3),
    significant: p < 0.05,
    n,
  };
}

function gaussianRandom(): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function mean(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function sd(arr: number[]) {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, x) => s + (x - m) ** 2, 0) / (arr.length - 1));
}

function normalCDF(x: number): number {
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.SQRT2;
  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

interface TrialResult {
  controlMean: string;
  treatmentMean: string;
  difference: string;
  tStat: string;
  pValue: number;
  pDisplay: string;
  significant: boolean;
  n: number;
}

export default function DrugTrial() {
  const [sampleSize, setSampleSize] = useState(100);
  const [trueEffect, setTrueEffect] = useState(3);
  const [result, setResult] = useState<TrialResult | null>(null);
  const [history, setHistory] = useState<TrialResult[]>([]);

  function runTrial() {
    const r = generateTrial(sampleSize, trueEffect);
    setResult(r);
    setHistory((prev) => [r, ...prev].slice(0, 10));
  }

  function resetAll() {
    setResult(null);
    setHistory([]);
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Simulate a clinical trial comparing a drug group to a placebo group.
        Adjust the sample size and true effect to see how they change the results.
      </p>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Sample size per group: {sampleSize}
          </label>
          <input
            type="range"
            min={20}
            max={500}
            step={10}
            value={sampleSize}
            onChange={(e) => setSampleSize(Number(e.target.value))}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-xs text-brand-400">
            <span>20</span>
            <span>500</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            True drug effect (mmHg): {trueEffect}
          </label>
          <input
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={trueEffect}
            onChange={(e) => setTrueEffect(Number(e.target.value))}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-xs text-brand-400">
            <span>0 (no effect)</span>
            <span>10</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={runTrial}
          className="px-5 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          Run Trial
        </button>
        <button
          onClick={resetAll}
          className="px-5 py-2 bg-white border border-brand-200 text-brand-600 rounded-lg text-sm font-medium hover:bg-brand-50 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Result */}
      {result && (
        <div
          className={`rounded-xl border p-5 space-y-3 ${
            result.significant
              ? "bg-green-50 border-green-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold ${
                result.significant ? "text-green-700" : "text-amber-700"
              }`}
            >
              {result.significant
                ? "Reject H0: Statistically significant"
                : "Fail to reject H0: Not significant"}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="text-xs text-brand-400">Control mean</div>
              <div className="font-medium text-brand-800">
                {result.controlMean} mmHg
              </div>
            </div>
            <div>
              <div className="text-xs text-brand-400">Treatment mean</div>
              <div className="font-medium text-brand-800">
                {result.treatmentMean} mmHg
              </div>
            </div>
            <div>
              <div className="text-xs text-brand-400">Difference</div>
              <div className="font-medium text-brand-800">
                {result.difference} mmHg
              </div>
            </div>
            <div>
              <div className="text-xs text-brand-400">p-value</div>
              <div
                className={`font-medium ${
                  result.significant ? "text-green-700" : "text-amber-700"
                }`}
              >
                {result.pDisplay}
              </div>
            </div>
          </div>
          <p className="text-xs text-brand-500">
            t-statistic: {result.tStat} | n per group: {result.n} | alpha: 0.05
          </p>
        </div>
      )}

      {/* History */}
      {history.length > 1 && (
        <div>
          <h4 className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-2">
            Trial History
          </h4>
          <div className="space-y-1">
            {history.map((h, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 text-xs px-3 py-1.5 rounded-lg ${
                  h.significant
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                <span className="font-medium w-16">
                  n={h.n}
                </span>
                <span>diff: {h.difference} mmHg</span>
                <span>p = {h.pDisplay}</span>
                <span className="font-medium">
                  {h.significant ? "Reject H0" : "Fail to reject"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
