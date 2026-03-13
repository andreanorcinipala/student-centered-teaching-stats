"use client";

import { useState } from "react";

export default function BayesCalculator() {
  const [baseRate, setBaseRate] = useState(1);
  const [sensitivity, setSensitivity] = useState(95);
  const [falsePositiveRate, setFalsePositiveRate] = useState(5);

  const prevalence = baseRate / 100;
  const sens = sensitivity / 100;
  const fpr = falsePositiveRate / 100;

  const pPositive = sens * prevalence + fpr * (1 - prevalence);
  const posteriorPositive = pPositive > 0 ? (sens * prevalence) / pPositive : 0;

  const pNegative = (1 - sens) * prevalence + (1 - fpr) * (1 - prevalence);
  const posteriorNegative =
    pNegative > 0 ? ((1 - sens) * prevalence) / pNegative : 0;

  // For the visual: icon grid of 100 people
  const pop = 1000;
  const sick = Math.round(prevalence * pop);
  const healthy = pop - sick;
  const truePos = Math.round(sens * sick);
  const falsePos = Math.round(fpr * healthy);
  const totalPos = truePos + falsePos;

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Set the base rate of a condition, the test sensitivity (true positive
        rate), and the false positive rate. See how Bayes' Theorem computes
        the actual probability after a positive test.
      </p>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Base rate: {baseRate}%
          </label>
          <input
            type="range"
            min={0.1}
            max={50}
            step={0.1}
            value={baseRate}
            onChange={(e) => setBaseRate(Number(e.target.value))}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-xs text-brand-400">
            <span>0.1% (rare)</span>
            <span>50%</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Sensitivity: {sensitivity}%
          </label>
          <input
            type="range"
            min={50}
            max={100}
            step={0.5}
            value={sensitivity}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-xs text-brand-400">
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            False positive rate: {falsePositiveRate}%
          </label>
          <input
            type="range"
            min={0.1}
            max={30}
            step={0.1}
            value={falsePositiveRate}
            onChange={(e) => setFalsePositiveRate(Number(e.target.value))}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-xs text-brand-400">
            <span>0.1%</span>
            <span>30%</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className={`rounded-xl border p-5 ${
            posteriorPositive > 0.5
              ? "bg-red-50 border-red-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <div className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-1">
            If you test POSITIVE
          </div>
          <div
            className={`text-3xl font-semibold ${
              posteriorPositive > 0.5 ? "text-red-600" : "text-amber-600"
            }`}
          >
            {(posteriorPositive * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-brand-600 mt-1">
            chance you actually have it
          </div>
        </div>
        <div className="rounded-xl border p-5 bg-green-50 border-green-200">
          <div className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-1">
            If you test NEGATIVE
          </div>
          <div className="text-3xl font-semibold text-green-600">
            {((1 - posteriorNegative) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-brand-600 mt-1">
            chance you are truly clear
          </div>
        </div>
      </div>

      {/* Natural frequency breakdown */}
      <div className="bg-white border border-brand-100 rounded-xl p-5">
        <h4 className="text-sm font-medium text-brand-700 mb-3">
          Out of {pop.toLocaleString()} people tested:
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="bg-brand-50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-brand-800">{sick}</div>
            <div className="text-xs text-brand-500">actually have it</div>
          </div>
          <div className="bg-brand-50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-green-600">
              {truePos}
            </div>
            <div className="text-xs text-brand-500">true positives</div>
          </div>
          <div className="bg-brand-50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-amber-600">
              {falsePos}
            </div>
            <div className="text-xs text-brand-500">false positives</div>
          </div>
          <div className="bg-brand-50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-brand-800">
              {totalPos}
            </div>
            <div className="text-xs text-brand-500">total positive tests</div>
          </div>
        </div>
        <p className="text-xs text-brand-500 mt-3">
          Of the {totalPos} positive results, only {truePos} are true cases.
          That is why the posterior probability is{" "}
          {(posteriorPositive * 100).toFixed(1)}%, not {sensitivity}%.
        </p>
      </div>

      {/* Formula */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
        <p className="text-sm text-brand-700 font-medium mb-2">
          Bayes' Theorem:
        </p>
        <p className="text-sm text-brand-600 font-mono">
          P(Disease|+) = P(+|Disease) * P(Disease) / P(+)
        </p>
        <p className="text-sm text-brand-600 font-mono mt-1">
          = {sens.toFixed(2)} * {prevalence.toFixed(4)} /{" "}
          {pPositive.toFixed(4)} = {posteriorPositive.toFixed(4)}
        </p>
      </div>
    </div>
  );
}
