"use client";

import { useState, useMemo } from "react";

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

interface DataRow {
  education: number;
  experience: number;
  ability: number;
  urban: number;
  wage: number;
}

function generateData(n: number): DataRow[] {
  const rows: DataRow[] = [];
  for (let i = 0; i < n; i++) {
    const ability = gaussianRandom();
    const education = 10 + 2 * ability + gaussianRandom() * 2;
    const experience = Math.max(0, 5 + gaussianRandom() * 8);
    const urban = Math.random() < 0.6 ? 1 : 0;
    const logWage =
      2.5 +
      0.062 * education +
      0.02 * experience -
      0.0003 * experience * experience +
      0.15 * ability +
      0.12 * urban +
      gaussianRandom() * 0.25;
    rows.push({ education, experience, ability, urban, wage: Math.exp(logWage) });
  }
  return rows;
}

function regress(y: number[], xs: number[][]): { coeffs: number[]; r2: number; adjR2: number; aic: number; bic: number; vifs: number[] } {
  const n = y.length;
  const p = xs.length;
  const my = y.reduce((a, b) => a + b, 0) / n;

  if (p === 0) {
    const ssTot = y.reduce((s, yi) => s + (yi - my) ** 2, 0);
    return { coeffs: [my], r2: 0, adjR2: 0, aic: n * Math.log(ssTot / n) + 2 * 1, bic: n * Math.log(ssTot / n) + Math.log(n), vifs: [] };
  }

  // Simple OLS via normal equations (up to 4 predictors)
  // For simplicity, solve using iterative approach for any number of predictors
  const means = xs.map(x => x.reduce((a, b) => a + b, 0) / n);

  // Center the data
  const cx = xs.map((x, j) => x.map(v => v - means[j]));
  const cy = y.map(v => v - my);

  // X'X matrix
  const XtX: number[][] = Array.from({ length: p }, () => Array(p).fill(0));
  const XtY: number[] = Array(p).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < p; j++) {
      XtY[j] += cx[j][i] * cy[i];
      for (let k = 0; k < p; k++) {
        XtX[j][k] += cx[j][i] * cx[k][i];
      }
    }
  }

  // Solve via Gaussian elimination
  const aug = XtX.map((row, i) => [...row, XtY[i]]);
  for (let col = 0; col < p; col++) {
    let maxRow = col;
    for (let row = col + 1; row < p; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
    if (Math.abs(aug[col][col]) < 1e-12) continue;
    for (let row = 0; row < p; row++) {
      if (row === col) continue;
      const factor = aug[row][col] / aug[col][col];
      for (let j = col; j <= p; j++) aug[row][j] -= factor * aug[col][j];
    }
  }
  const betas = aug.map((row, i) => Math.abs(row[i]) > 1e-12 ? row[p] / row[i] : 0);
  const b0 = my - betas.reduce((s, b, j) => s + b * means[j], 0);

  const ssRes = y.reduce((s, yi, i) => {
    const pred = b0 + betas.reduce((sum, b, j) => sum + b * xs[j][i], 0);
    return s + (yi - pred) ** 2;
  }, 0);
  const ssTot = y.reduce((s, yi) => s + (yi - my) ** 2, 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;
  const adjR2 = 1 - ((1 - r2) * (n - 1)) / (n - p - 1);
  const aic = n * Math.log(ssRes / n) + 2 * (p + 1);
  const bic = n * Math.log(ssRes / n) + Math.log(n) * (p + 1);

  // VIF for each predictor
  const vifs = xs.map((_, j) => {
    if (p === 1) return 1;
    const others = xs.filter((_, k) => k !== j);
    const yj = xs[j];
    const regJ = regress(yj, others);
    return regJ.r2 < 1 ? 1 / (1 - regJ.r2) : 999;
  });

  return { coeffs: [b0, ...betas], r2, adjR2, aic, bic, vifs };
}

const PREDICTORS = [
  { key: "education" as const, label: "Education" },
  { key: "experience" as const, label: "Experience" },
  { key: "ability" as const, label: "Ability (AFQT)" },
  { key: "urban" as const, label: "Urban" },
];

export default function ModelSelectionLab() {
  const [data] = useState<DataRow[]>(() => generateData(500));
  const [active, setActive] = useState<Record<string, boolean>>({
    education: true,
    experience: false,
    ability: false,
    urban: false,
  });

  const logWages = useMemo(() => data.map((d) => Math.log(d.wage)), [data]);

  const result = useMemo(() => {
    const activeKeys = PREDICTORS.filter((p) => active[p.key]);
    if (activeKeys.length === 0) return null;
    const xs = activeKeys.map((p) => data.map((d) => d[p.key]));
    const reg = regress(logWages, xs);
    return { ...reg, labels: activeKeys.map((p) => p.label) };
  }, [data, logWages, active]);

  const toggle = (key: string) => {
    setActive((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Build a model predicting log(wages). Add and remove predictors to see
        AIC, BIC, adjusted R-squared, and VIF update in real time.
      </p>

      <div className="flex flex-wrap gap-3">
        {PREDICTORS.map((p) => (
          <button
            key={p.key}
            onClick={() => toggle(p.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              active[p.key]
                ? "bg-brand-500 text-white"
                : "bg-brand-100 text-brand-700 hover:bg-brand-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {result && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {result.labels.map((label, i) => (
              <div key={label} className="bg-brand-50 rounded-lg p-3">
                <div className="text-xs text-brand-400">{label}</div>
                <div className="text-lg font-semibold text-brand-800">
                  {result.coeffs[i + 1].toFixed(4)}
                </div>
                {result.vifs[i] !== undefined && (
                  <div className={`text-xs mt-1 ${result.vifs[i] > 5 ? "text-amber-600" : "text-brand-400"}`}>
                    VIF: {result.vifs[i].toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-brand-50 rounded-lg p-3 text-center">
              <div className="text-xs text-brand-400">Adj. R-squared</div>
              <div className="text-lg font-semibold text-brand-800">{result.adjR2.toFixed(4)}</div>
            </div>
            <div className="bg-brand-50 rounded-lg p-3 text-center">
              <div className="text-xs text-brand-400">AIC</div>
              <div className="text-lg font-semibold text-brand-800">{result.aic.toFixed(1)}</div>
            </div>
            <div className="bg-brand-50 rounded-lg p-3 text-center">
              <div className="text-xs text-brand-400">BIC</div>
              <div className="text-lg font-semibold text-brand-800">{result.bic.toFixed(1)}</div>
            </div>
          </div>

          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
            <p className="text-sm font-mono text-brand-700 mb-2">
              log(Wage) = {result.coeffs[0].toFixed(3)}
              {result.labels.map((l, i) => ` + ${result.coeffs[i + 1].toFixed(4)} * ${l}`).join("")}
            </p>
            <p className="text-sm text-brand-700">
              {active.ability
                ? "With ability (AFQT) in the model, the education coefficient drops, revealing ability bias. More able individuals get more education AND earn more, inflating the naive education effect."
                : "Try adding Ability (AFQT) to see how the education coefficient changes. This demonstrates omitted variable bias."}
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
