"use client";

import { useState, useMemo } from "react";

export default function TestResultCalc() {
  const [prevalence, setPrevalence] = useState(2);
  const [sensitivity, setSensitivity] = useState(95);
  const [specificity, setSpecificity] = useState(90);

  const result = useMemo(() => {
    const pop = 10000;
    const prev = prevalence / 100;
    const sens = sensitivity / 100;
    const spec = specificity / 100;

    const diseased = Math.round(pop * prev);
    const healthy = pop - diseased;
    const tp = Math.round(diseased * sens);
    const fn = diseased - tp;
    const tn = Math.round(healthy * spec);
    const fp = healthy - tn;
    const totalPos = tp + fp;
    const ppv = totalPos > 0 ? tp / totalPos : 0;
    const totalNeg = tn + fn;
    const npv = totalNeg > 0 ? tn / totalNeg : 0;

    return { diseased, healthy, tp, fn, tn, fp, totalPos, totalNeg, ppv, npv };
  }, [prevalence, sensitivity, specificity]);

  const barMax = Math.max(result.tp, result.fp, 1);

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Set the disease prevalence and test accuracy. See how many positive
        results are true cases versus false alarms out of 10,000 people.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Prevalence: {prevalence}%
          </label>
          <input type="range" min={0.1} max={30} step={0.1} value={prevalence}
            onChange={(e) => setPrevalence(Number(e.target.value))}
            className="w-full accent-brand-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Sensitivity: {sensitivity}%
          </label>
          <input type="range" min={50} max={100} step={1} value={sensitivity}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="w-full accent-brand-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Specificity: {specificity}%
          </label>
          <input type="range" min={50} max={100} step={1} value={specificity}
            onChange={(e) => setSpecificity(Number(e.target.value))}
            className="w-full accent-brand-500" />
        </div>
      </div>

      <div className="bg-white border border-brand-100 rounded-xl p-5">
        <div className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-3">
          Out of 10,000 people tested
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xs text-brand-500 mb-1">Actually have it</div>
            <div className="text-2xl font-semibold text-brand-800">{result.diseased}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-brand-500 mb-1">Do not have it</div>
            <div className="text-2xl font-semibold text-brand-800">{result.healthy}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-green-600 font-medium">True Positives: {result.tp}</span>
              <span className="text-brand-400">correctly caught</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${(result.tp / barMax) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-red-500 font-medium">False Positives: {result.fp}</span>
              <span className="text-brand-400">false alarms</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-400 rounded-full transition-all" style={{ width: `${(result.fp / barMax) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`rounded-xl border p-4 text-center ${result.ppv > 0.5 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <div className="text-xs text-brand-500 mb-1">If you test POSITIVE</div>
          <div className={`text-2xl font-bold ${result.ppv > 0.5 ? "text-green-600" : "text-amber-600"}`}>
            {(result.ppv * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-brand-400">chance you actually have it</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-xs text-brand-500 mb-1">If you test NEGATIVE</div>
          <div className="text-2xl font-bold text-green-600">
            {(result.npv * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-brand-400">chance you are clear</div>
        </div>
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
        <p className="text-sm text-brand-700">
          {result.ppv < 0.2
            ? `Only ${(result.ppv * 100).toFixed(0)}% of positive results are true cases. The low prevalence means most positives are false alarms, even with a good test.`
            : result.ppv < 0.5
            ? `About ${(result.ppv * 100).toFixed(0)}% of positive results are true cases. Try increasing the prevalence to see how the predictive value improves.`
            : `${(result.ppv * 100).toFixed(0)}% of positive results are true cases. With this prevalence, the test is quite informative.`}
        </p>
      </div>
    </div>
  );
}
