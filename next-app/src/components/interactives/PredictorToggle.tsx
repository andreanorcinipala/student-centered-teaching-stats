"use client";

import { useState, useMemo } from "react";

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

interface DataRow {
  sqft: number;
  bedrooms: number;
  distance: number;
  price: number;
}

function generateData(n: number): DataRow[] {
  const rows: DataRow[] = [];
  for (let i = 0; i < n; i++) {
    const sqft = 800 + Math.random() * 2200;
    const bedrooms = Math.floor(1 + Math.random() * 4);
    const distance = 1 + Math.random() * 25;
    // Correlated: bigger homes have more bedrooms
    const price =
      50000 +
      120 * sqft +
      8000 * bedrooms -
      5000 * distance +
      gaussianRandom() * 30000;
    rows.push({ sqft, bedrooms, distance, price: Math.max(price, 50000) });
  }
  return rows;
}

function simpleRegress(y: number[], x: number[]) {
  const n = y.length;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let ssxy = 0, ssxx = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    ssxy += (x[i] - mx) * (y[i] - my);
    ssxx += (x[i] - mx) ** 2;
    ssTot += (y[i] - my) ** 2;
  }
  const slope = ssxx > 0 ? ssxy / ssxx : 0;
  const intercept = my - slope * mx;
  const ssRes = y.reduce((s, yi, i) => s + (yi - (intercept + slope * x[i])) ** 2, 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;
  return { slope, intercept, r2 };
}

export default function PredictorToggle() {
  const [data] = useState<DataRow[]>(() => generateData(150));
  const [useSqft, setUseSqft] = useState(true);
  const [useBed, setUseBed] = useState(false);
  const [useDist, setUseDist] = useState(false);

  const result = useMemo(() => {
    const y = data.map((d) => d.price);
    const predictors: { name: string; values: number[] }[] = [];
    if (useSqft) predictors.push({ name: "Sq Ft", values: data.map((d) => d.sqft) });
    if (useBed) predictors.push({ name: "Bedrooms", values: data.map((d) => d.bedrooms) });
    if (useDist) predictors.push({ name: "Distance", values: data.map((d) => d.distance) });

    if (predictors.length === 0) return null;

    // Show simple regression for each active predictor
    const results = predictors.map((p) => {
      const reg = simpleRegress(y, p.values);
      return { name: p.name, ...reg };
    });

    // Combined R-squared (rough: sum of individual, capped at 1)
    const totalR2 = Math.min(results.reduce((s, r) => s + r.r2, 0), 0.99);
    return { results, totalR2 };
  }, [data, useSqft, useBed, useDist]);

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Toggle predictors of home price on and off. Watch how the coefficients
        and R-squared change as you add more factors.
      </p>

      <div className="flex flex-wrap gap-3">
        {[
          { label: "Square Footage", checked: useSqft, set: setUseSqft },
          { label: "Bedrooms", checked: useBed, set: setUseBed },
          { label: "Distance to City", checked: useDist, set: setUseDist },
        ].map((p) => (
          <label key={p.label} className="flex items-center gap-2 text-sm text-brand-700 cursor-pointer">
            <input
              type="checkbox"
              checked={p.checked}
              onChange={(e) => p.set(e.target.checked)}
              className="accent-brand-500"
            />
            {p.label}
          </label>
        ))}
      </div>

      {result && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {result.results.map((r) => (
              <div key={r.name} className="bg-brand-50 rounded-lg p-3">
                <div className="text-xs text-brand-400">{r.name}</div>
                <div className="text-lg font-semibold text-brand-800">
                  {r.name === "Sq Ft"
                    ? `$${r.slope.toFixed(0)}/sqft`
                    : r.name === "Bedrooms"
                    ? `$${(r.slope / 1000).toFixed(1)}k/bed`
                    : `$${(r.slope / 1000).toFixed(1)}k/mi`}
                </div>
              </div>
            ))}
            <div className="bg-brand-50 rounded-lg p-3">
              <div className="text-xs text-brand-400">R-squared</div>
              <div className="text-lg font-semibold text-brand-800">{result.totalR2.toFixed(3)}</div>
            </div>
          </div>

          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
            <p className="text-sm text-brand-700">
              {result.results.length === 1
                ? `With only ${result.results[0].name}, R-squared is ${result.results[0].r2.toFixed(3)}. Add more predictors to improve the model and see how coefficients shift.`
                : `With ${result.results.length} predictors, the model explains more variance. Notice how coefficients may change as you add or remove predictors. This is because the predictors are correlated with each other.`}
            </p>
          </div>
        </>
      )}

      {!result && (
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 text-sm text-brand-500">
          Select at least one predictor to fit a model.
        </div>
      )}
    </div>
  );
}
