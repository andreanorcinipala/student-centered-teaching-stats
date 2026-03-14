"use client";

import { useState, useMemo } from "react";

export default function BayesFormula() {
  const [prevalence, setPrevalence] = useState(8);
  const [sensitivity, setSensitivity] = useState(92);
  const [specificity, setSpecificity] = useState(98);

  const calc = useMemo(() => {
    const prev = prevalence / 100;
    const sens = sensitivity / 100;
    const spec = specificity / 100;
    const fpr = 1 - spec;

    const pBgivenA = sens;
    const pA = prev;
    const pBgivenNotA = fpr;
    const pNotA = 1 - prev;

    const pB = pBgivenA * pA + pBgivenNotA * pNotA;
    const ppv = pB > 0 ? (pBgivenA * pA) / pB : 0;

    // Negative
    const pNegGivenA = 1 - sens;
    const pNegGivenNotA = spec;
    const pNeg = pNegGivenA * pA + pNegGivenNotA * pNotA;
    const forRate = pNeg > 0 ? (pNegGivenA * pA) / pNeg : 0;
    const npv = 1 - forRate;

    return {
      pA: pA,
      pBgivenA: pBgivenA,
      pBgivenNotA: pBgivenNotA,
      pB: pB,
      ppv: ppv,
      npv: npv,
      numerator: pBgivenA * pA,
    };
  }, [prevalence, sensitivity, specificity]);

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Adjust prevalence, sensitivity, and specificity. Watch the formula
        compute the posterior probability step by step.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            P(Disease) = {prevalence}%
          </label>
          <input type="range" min={0.5} max={50} step={0.5} value={prevalence}
            onChange={(e) => setPrevalence(Number(e.target.value))}
            className="w-full accent-brand-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Sensitivity = {sensitivity}%
          </label>
          <input type="range" min={50} max={100} step={1} value={sensitivity}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="w-full accent-brand-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Specificity = {specificity}%
          </label>
          <input type="range" min={50} max={100} step={1} value={specificity}
            onChange={(e) => setSpecificity(Number(e.target.value))}
            className="w-full accent-brand-500" />
        </div>
      </div>

      {/* Formula breakdown */}
      <div className="bg-white border border-brand-100 rounded-xl p-5">
        <div className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-3">
          Bayes&apos; Theorem Step by Step
        </div>

        <div className="font-mono text-sm text-brand-700 space-y-2">
          <p>P(Disease | Positive) = P(Pos | Disease) * P(Disease) / P(Pos)</p>
          <div className="border-l-2 border-brand-200 pl-4 space-y-1 text-xs">
            <p>P(Pos | Disease) = {calc.pBgivenA.toFixed(3)} (sensitivity)</p>
            <p>P(Disease) = {calc.pA.toFixed(4)} (prevalence)</p>
            <p>P(Pos | No Disease) = {calc.pBgivenNotA.toFixed(3)} (false positive rate)</p>
            <p>P(Pos) = {calc.pBgivenA.toFixed(3)} * {calc.pA.toFixed(4)} + {calc.pBgivenNotA.toFixed(3)} * {(1 - calc.pA).toFixed(4)}</p>
            <p className="font-semibold">P(Pos) = {calc.pB.toFixed(5)}</p>
          </div>
          <p className="font-semibold text-brand-800">
            = {calc.numerator.toFixed(5)} / {calc.pB.toFixed(5)} = {calc.ppv.toFixed(4)} ({(calc.ppv * 100).toFixed(1)}%)
          </p>
        </div>
      </div>

      {/* Natural frequencies */}
      <div className="bg-white border border-brand-100 rounded-xl p-5">
        <div className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-3">
          Natural Frequency Tree (per 10,000)
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-brand-50 rounded-lg p-3 text-center">
            <div className="text-xs text-brand-400">Diseased</div>
            <div className="text-lg font-semibold text-brand-800">{Math.round(10000 * calc.pA)}</div>
          </div>
          <div className="bg-brand-50 rounded-lg p-3 text-center">
            <div className="text-xs text-brand-400">Healthy</div>
            <div className="text-lg font-semibold text-brand-800">{Math.round(10000 * (1 - calc.pA))}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-xs text-green-600">True Pos</div>
            <div className="text-lg font-semibold text-green-700">{Math.round(10000 * calc.pA * calc.pBgivenA)}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-xs text-red-500">False Pos</div>
            <div className="text-lg font-semibold text-red-600">{Math.round(10000 * (1 - calc.pA) * calc.pBgivenNotA)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`rounded-xl border p-4 text-center ${calc.ppv > 0.5 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <div className="text-xs text-brand-500">PPV</div>
          <div className={`text-2xl font-bold ${calc.ppv > 0.5 ? "text-green-600" : "text-amber-600"}`}>
            {(calc.ppv * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-xs text-brand-500">NPV</div>
          <div className="text-2xl font-bold text-green-600">
            {(calc.npv * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
        <p className="text-sm text-brand-700">
          At {prevalence}% prevalence, a positive test gives a {(calc.ppv * 100).toFixed(1)}% chance of
          actually having the disease (PPV). Notice how much this changes when you move the
          prevalence slider. The same test accuracy produces very different results in different populations.
        </p>
      </div>
    </div>
  );
}
