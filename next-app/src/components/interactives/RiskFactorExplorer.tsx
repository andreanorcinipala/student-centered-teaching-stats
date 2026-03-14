"use client";

import { useState, useMemo } from "react";

interface RiskFactor {
  name: string;
  adjustedOR: number;
  enabled: boolean;
}

const defaultFactors: RiskFactor[] = [
  { name: "High Blood Pressure", adjustedOR: 1.8, enabled: false },
  { name: "Smoking", adjustedOR: 2.1, enabled: false },
  { name: "High Cholesterol", adjustedOR: 1.5, enabled: false },
  { name: "Diabetes", adjustedOR: 1.9, enabled: false },
  { name: "Family History", adjustedOR: 1.6, enabled: false },
  { name: "Obesity (BMI > 30)", adjustedOR: 1.4, enabled: false },
];

const BASE_PROBABILITY = 0.05;

function oddsFromProb(p: number) {
  return p / (1 - p);
}

function probFromOdds(o: number) {
  return o / (1 + o);
}

export default function RiskFactorExplorer() {
  const [factors, setFactors] = useState<RiskFactor[]>(defaultFactors);

  const toggle = (idx: number) => {
    setFactors((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const predicted = useMemo(() => {
    let odds = oddsFromProb(BASE_PROBABILITY);
    for (const f of factors) {
      if (f.enabled) odds *= f.adjustedOR;
    }
    return probFromOdds(odds);
  }, [factors]);

  const activeCount = factors.filter((f) => f.enabled).length;

  const barW = 280;
  const barH = 32;
  const fillW = Math.min(predicted, 1) * barW;

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Toggle risk factors on and off. Watch how the predicted probability of
        heart disease changes. Each factor contributes independently through its
        adjusted odds ratio.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {factors.map((f, i) => (
          <button
            key={f.name}
            onClick={() => toggle(i)}
            className={`flex items-center justify-between rounded-xl border p-3 text-sm transition-colors ${
              f.enabled
                ? "bg-brand-500 text-white border-brand-600"
                : "bg-white text-brand-700 border-brand-200 hover:border-brand-300"
            }`}
          >
            <span className="font-medium">{f.name}</span>
            <span className={`text-xs ${f.enabled ? "text-brand-200" : "text-brand-400"}`}>
              OR = {f.adjustedOR}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-brand-100 rounded-xl p-5">
        <div className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-3">
          Predicted Probability of Heart Disease
        </div>

        <svg viewBox={`0 0 ${barW} ${barH + 20}`} className="w-full max-w-sm h-auto">
          <rect x={0} y={0} width={barW} height={barH} rx={6} fill="#e8f0ed" />
          <rect
            x={0}
            y={0}
            width={fillW}
            height={barH}
            rx={6}
            fill={predicted > 0.3 ? "#ef4444" : predicted > 0.15 ? "#f59e0b" : "#436d62"}
          />
          <text x={barW / 2} y={barH / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="bold" fill={fillW > barW / 2 ? "white" : "#436d62"}>
            {(predicted * 100).toFixed(1)}%
          </text>
          <text x={0} y={barH + 14} fontSize="9" fill="#82a99f">0%</text>
          <text x={barW} y={barH + 14} textAnchor="end" fontSize="9" fill="#82a99f">100%</text>
        </svg>
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
        <p className="text-sm text-brand-700">
          {activeCount === 0
            ? `Baseline risk with no factors: ${(BASE_PROBABILITY * 100).toFixed(1)}%. Toggle factors to see how each one independently increases the predicted probability.`
            : activeCount === 1
            ? `One risk factor active. The odds ratio multiplies the baseline odds, changing the probability from ${(BASE_PROBABILITY * 100).toFixed(1)}% to ${(predicted * 100).toFixed(1)}%.`
            : `${activeCount} risk factors active. Each factor multiplies the odds independently. Combined probability: ${(predicted * 100).toFixed(1)}%. Notice how multiple moderate risk factors can add up to substantial risk.`}
        </p>
      </div>
    </div>
  );
}
