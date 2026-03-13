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
  wage: number;
}

function generateWageData(n: number): DataRow[] {
  const rows: DataRow[] = [];
  for (let i = 0; i < n; i++) {
    const education = 8 + Math.random() * 12;
    const experience = Math.random() * 30;
    // Correlated with education slightly
    const wage = 15 + 4.2 * education + 1.5 * experience - 0.02 * experience * experience + gaussianRandom() * 12;
    rows.push({ education, experience, wage: Math.max(wage, 10) });
  }
  return rows;
}

function regress(y: number[], xs: number[][]) {
  // Simple 1 or 2 predictor OLS via normal equations
  const n = y.length;
  const p = xs.length; // number of predictors
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  if (p === 1) {
    const x = xs[0];
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const ssXY = x.reduce((s, xi, i) => s + (xi - meanX) * (y[i] - meanY), 0);
    const ssXX = x.reduce((s, xi) => s + (xi - meanX) ** 2, 0);
    const b1 = ssXX > 0 ? ssXY / ssXX : 0;
    const b0 = meanY - b1 * meanX;
    const ssRes = y.reduce((s, yi, i) => s + (yi - (b0 + b1 * x[i])) ** 2, 0);
    const ssTot = y.reduce((s, yi) => s + (yi - meanY) ** 2, 0);
    const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;
    return { coeffs: [b0, b1], rSquared: r2 };
  }

  // 2 predictors: manual normal equations
  const x1 = xs[0], x2 = xs[1];
  const m1 = x1.reduce((a, b) => a + b, 0) / n;
  const m2 = x2.reduce((a, b) => a + b, 0) / n;

  let s11 = 0, s12 = 0, s22 = 0, s1y = 0, s2y = 0;
  for (let i = 0; i < n; i++) {
    const d1 = x1[i] - m1, d2 = x2[i] - m2, dy = y[i] - meanY;
    s11 += d1 * d1; s12 += d1 * d2; s22 += d2 * d2;
    s1y += d1 * dy; s2y += d2 * dy;
  }
  const det = s11 * s22 - s12 * s12;
  if (Math.abs(det) < 1e-10) return { coeffs: [meanY, 0, 0], rSquared: 0 };

  const b1 = (s22 * s1y - s12 * s2y) / det;
  const b2 = (s11 * s2y - s12 * s1y) / det;
  const b0 = meanY - b1 * m1 - b2 * m2;

  const ssRes = y.reduce((s, yi, i) => s + (yi - (b0 + b1 * x1[i] + b2 * x2[i])) ** 2, 0);
  const ssTot = y.reduce((s, yi) => s + (yi - meanY) ** 2, 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;

  // VIF for each predictor
  const r12Num = x1.reduce((s, xi, i) => s + (xi - m1) * (x2[i] - m2), 0);
  const r12 = r12Num / Math.sqrt(s11 * s22);
  const vif = 1 / (1 - r12 * r12);

  return { coeffs: [b0, b1, b2], rSquared: r2, vif };
}

export default function MultipleRegression() {
  const [data] = useState<DataRow[]>(() => generateWageData(200));
  const [useEducation, setUseEducation] = useState(true);
  const [useExperience, setUseExperience] = useState(false);

  const result = useMemo(() => {
    const y = data.map((d) => d.wage);
    const predictors: number[][] = [];
    const labels: string[] = [];

    if (useEducation) { predictors.push(data.map((d) => d.education)); labels.push("Education"); }
    if (useExperience) { predictors.push(data.map((d) => d.experience)); labels.push("Experience"); }

    if (predictors.length === 0) return null;
    const reg = regress(y, predictors);
    return { ...reg, labels };
  }, [data, useEducation, useExperience]);

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Toggle predictors on and off to see how coefficient estimates and
        R-squared change. When both are included, check the VIF for multicollinearity.
      </p>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-brand-700 cursor-pointer">
          <input type="checkbox" checked={useEducation} onChange={(e) => setUseEducation(e.target.checked)}
            className="accent-brand-500" />
          Education
        </label>
        <label className="flex items-center gap-2 text-sm text-brand-700 cursor-pointer">
          <input type="checkbox" checked={useExperience} onChange={(e) => setUseExperience(e.target.checked)}
            className="accent-brand-500" />
          Experience
        </label>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="bg-brand-50 rounded-lg p-3">
              <div className="text-xs text-brand-400">Intercept</div>
              <div className="text-lg font-semibold text-brand-800">{result.coeffs[0].toFixed(2)}</div>
            </div>
            {result.labels.map((label, i) => (
              <div key={label} className="bg-brand-50 rounded-lg p-3">
                <div className="text-xs text-brand-400">{label} (b{i + 1})</div>
                <div className="text-lg font-semibold text-brand-800">{result.coeffs[i + 1].toFixed(2)}</div>
              </div>
            ))}
            <div className="bg-brand-50 rounded-lg p-3">
              <div className="text-xs text-brand-400">R-squared</div>
              <div className="text-lg font-semibold text-brand-800">{result.rSquared.toFixed(3)}</div>
            </div>
          </div>

          {result.vif !== undefined && (
            <div className={`rounded-xl border p-4 ${result.vif > 5 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
              <div className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-1">
                Variance Inflation Factor (VIF)
              </div>
              <div className={`text-2xl font-semibold ${result.vif > 5 ? "text-amber-600" : "text-green-600"}`}>
                {result.vif.toFixed(2)}
              </div>
              <p className="text-xs text-brand-500 mt-1">
                {result.vif > 10
                  ? "Severe multicollinearity. Coefficient estimates are unreliable."
                  : result.vif > 5
                  ? "Moderate multicollinearity. Interpret individual coefficients with caution."
                  : "Low multicollinearity. Coefficients are stable."}
              </p>
            </div>
          )}

          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
            <p className="text-sm text-brand-700 font-mono mb-2">
              Wage = {result.coeffs[0].toFixed(1)}
              {result.labels.map((l, i) => ` + ${result.coeffs[i + 1].toFixed(2)} * ${l}`).join("")}
            </p>
            <p className="text-sm text-brand-700">
              {result.labels.length === 1
                ? `With only ${result.labels[0]} in the model, R-squared is ${result.rSquared.toFixed(3)}. Try adding the other predictor to see if explanatory power improves.`
                : `With both predictors, R-squared is ${result.rSquared.toFixed(3)}. Notice how the Education coefficient may shift compared to the single-predictor model. This is omitted variable bias in action.`}
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
