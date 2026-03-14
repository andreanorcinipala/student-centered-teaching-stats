"use client";

import { useState, useMemo } from "react";

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

interface DataRow {
  exercise: number;
  age: number;
  bp: number;
}

function generateData(n: number, confoundStrength: number): DataRow[] {
  const rows: DataRow[] = [];
  for (let i = 0; i < n; i++) {
    const age = 25 + Math.random() * 50;
    // Older people exercise less (confounding)
    const exercise = Math.max(0, 8 - confoundStrength * 0.06 * age + gaussianRandom() * 3);
    // BP depends on age and exercise
    const bp = 110 + 0.5 * age - 1.8 * exercise + gaussianRandom() * 10;
    rows.push({ exercise, age, bp });
  }
  return rows;
}

function regress1(y: number[], x: number[]) {
  const n = y.length;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let ssxy = 0, ssxx = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    ssxy += (x[i] - mx) * (y[i] - my);
    ssxx += (x[i] - mx) ** 2;
    ssTot += (y[i] - my) ** 2;
  }
  const b1 = ssxx > 0 ? ssxy / ssxx : 0;
  const b0 = my - b1 * mx;
  const ssRes = y.reduce((s, yi, i) => s + (yi - (b0 + b1 * x[i])) ** 2, 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;
  return { b0, b1, r2 };
}

function regress2(y: number[], x1: number[], x2: number[]) {
  const n = y.length;
  const my = y.reduce((a, b) => a + b, 0) / n;
  const m1 = x1.reduce((a, b) => a + b, 0) / n;
  const m2 = x2.reduce((a, b) => a + b, 0) / n;

  let s11 = 0, s12 = 0, s22 = 0, s1y = 0, s2y = 0;
  for (let i = 0; i < n; i++) {
    const d1 = x1[i] - m1, d2 = x2[i] - m2, dy = y[i] - my;
    s11 += d1 * d1; s12 += d1 * d2; s22 += d2 * d2;
    s1y += d1 * dy; s2y += d2 * dy;
  }
  const det = s11 * s22 - s12 * s12;
  if (Math.abs(det) < 1e-10) return { b0: my, b1: 0, b2: 0, r2: 0 };

  const b1 = (s22 * s1y - s12 * s2y) / det;
  const b2 = (s11 * s2y - s12 * s1y) / det;
  const b0 = my - b1 * m1 - b2 * m2;

  const ssTot = y.reduce((s, yi) => s + (yi - my) ** 2, 0);
  const ssRes = y.reduce((s, yi, i) => s + (yi - (b0 + b1 * x1[i] + b2 * x2[i])) ** 2, 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;

  return { b0, b1, b2, r2 };
}

export default function ConfoundingSim() {
  const [confounding, setConfounding] = useState(1);
  const [data, setData] = useState<DataRow[]>(() => generateData(400, 1));

  const regenerate = (c: number) => {
    setConfounding(c);
    setData(generateData(400, c));
  };

  const naive = useMemo(() => {
    const y = data.map((d) => d.bp);
    const x = data.map((d) => d.exercise);
    return regress1(y, x);
  }, [data]);

  const adjusted = useMemo(() => {
    const y = data.map((d) => d.bp);
    const x1 = data.map((d) => d.exercise);
    const x2 = data.map((d) => d.age);
    return regress2(y, x1, x2);
  }, [data]);

  const biasPercent = naive.b1 !== 0
    ? Math.abs(((naive.b1 - adjusted.b1) / adjusted.b1) * 100)
    : 0;

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Adjust confounding strength to see how omitting age biases the effect
        of exercise on blood pressure. Compare the naive (unadjusted) and
        adjusted coefficients.
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Naive model */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <div className="text-xs font-medium text-red-400 uppercase tracking-wide mb-2">
            Without Age (Naive)
          </div>
          <div className="font-mono text-sm text-red-700 mb-2">
            BP = {naive.b0.toFixed(1)} + ({naive.b1.toFixed(2)}) * Exercise
          </div>
          <div className="text-xs text-red-500">
            Exercise coeff: {naive.b1.toFixed(2)} | R-squared: {naive.r2.toFixed(3)}
          </div>
        </div>

        {/* Adjusted model */}
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-2">
            With Age (Adjusted)
          </div>
          <div className="font-mono text-sm text-green-800 mb-2">
            BP = {adjusted.b0.toFixed(1)} + ({adjusted.b1.toFixed(2)}) * Exercise + ({adjusted.b2.toFixed(2)}) * Age
          </div>
          <div className="text-xs text-green-600">
            Exercise coeff: {adjusted.b1.toFixed(2)} | R-squared: {adjusted.r2.toFixed(3)}
          </div>
        </div>
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
        <p className="text-sm text-brand-700">
          The true exercise effect is about -1.8 mmHg per hour. The naive model
          estimates {naive.b1.toFixed(2)}, which is{" "}
          {Math.abs(naive.b1) < Math.abs(adjusted.b1) ? "attenuated (closer to zero)" : "inflated"}{" "}
          because age confounds the relationship. After controlling for age, the
          coefficient is {adjusted.b1.toFixed(2)}, a {biasPercent.toFixed(0)}% change.
          R-squared also improves from {naive.r2.toFixed(3)} to {adjusted.r2.toFixed(3)}.
        </p>
      </div>
    </div>
  );
}
