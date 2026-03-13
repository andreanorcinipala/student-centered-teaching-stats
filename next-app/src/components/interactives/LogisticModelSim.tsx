"use client";

import { useState, useMemo } from "react";

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export default function LogisticModelSim() {
  const [intercept, setIntercept] = useState(-3);
  const [slope, setSlope] = useState(0.5);
  const [xValue, setXValue] = useState(6);

  const logit = intercept + slope * xValue;
  const prob = sigmoid(logit);
  const odds = prob / (1 - prob);
  const oddsRatio = Math.exp(slope);

  const svgW = 600, svgH = 250;
  const pad = { top: 15, right: 20, bottom: 35, left: 50 };
  const pW = svgW - pad.left - pad.right;
  const pH = svgH - pad.top - pad.bottom;
  const xMin = -2, xMax = 15;

  function tx(x: number) { return pad.left + ((x - xMin) / (xMax - xMin)) * pW; }
  function ty(y: number) { return pad.top + pH - y * pH; }

  const curvePoints = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (i / 200) * (xMax - xMin);
      pts.push(`${tx(x)},${ty(sigmoid(intercept + slope * x))}`);
    }
    return pts.join(" ");
  }, [intercept, slope]);

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Adjust the intercept and slope to see how the logistic curve shifts.
        Then set a predictor value to read off the predicted probability and odds ratio.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Intercept (b0): {intercept.toFixed(1)}
          </label>
          <input type="range" min={-8} max={4} step={0.1} value={intercept}
            onChange={(e) => setIntercept(Number(e.target.value))}
            className="w-full accent-brand-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Slope (b1): {slope.toFixed(2)}
          </label>
          <input type="range" min={-2} max={3} step={0.05} value={slope}
            onChange={(e) => setSlope(Number(e.target.value))}
            className="w-full accent-brand-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Predictor value (X): {xValue.toFixed(1)}
          </label>
          <input type="range" min={xMin} max={xMax} step={0.5} value={xValue}
            onChange={(e) => setXValue(Number(e.target.value))}
            className="w-full accent-brand-500" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div className="bg-brand-50 rounded-lg p-3">
          <div className="text-xs text-brand-400">Logit</div>
          <div className="text-lg font-semibold text-brand-800">{logit.toFixed(2)}</div>
        </div>
        <div className="bg-brand-50 rounded-lg p-3">
          <div className="text-xs text-brand-400">Probability</div>
          <div className="text-lg font-semibold text-brand-800">{(prob * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-brand-50 rounded-lg p-3">
          <div className="text-xs text-brand-400">Odds</div>
          <div className="text-lg font-semibold text-brand-800">{odds.toFixed(2)}</div>
        </div>
        <div className="bg-brand-50 rounded-lg p-3">
          <div className="text-xs text-brand-400">Odds Ratio (per unit X)</div>
          <div className="text-lg font-semibold text-brand-800">{oddsRatio.toFixed(2)}</div>
        </div>
      </div>

      {/* Curve */}
      <div className="bg-white border border-brand-100 rounded-xl p-4 overflow-x-auto">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          <line x1={pad.left} y1={pad.top + pH} x2={pad.left + pW} y2={pad.top + pH} stroke="#b0c9c3" strokeWidth="1" />
          <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + pH} stroke="#b0c9c3" strokeWidth="1" />
          <line x1={pad.left} y1={ty(0.5)} x2={pad.left + pW} y2={ty(0.5)} stroke="#d7e4e1" strokeWidth="1" strokeDasharray="4 3" />

          <polyline points={curvePoints} fill="none" stroke="#436d62" strokeWidth="2.5" />

          <circle cx={tx(xValue)} cy={ty(prob)} r="7" fill="#436d62" stroke="white" strokeWidth="2" />
          <line x1={tx(xValue)} y1={ty(prob)} x2={tx(xValue)} y2={pad.top + pH} stroke="#82a99f" strokeWidth="1" strokeDasharray="3 2" />
          <line x1={pad.left} y1={ty(prob)} x2={tx(xValue)} y2={ty(prob)} stroke="#82a99f" strokeWidth="1" strokeDasharray="3 2" />

          {[0, 5, 10, 15].filter(x => x >= xMin && x <= xMax).map((x) => (
            <text key={x} x={tx(x)} y={svgH - 8} textAnchor="middle" fontSize="11" fill="#5c8a7e">{x}</text>
          ))}
          {[0, 0.25, 0.5, 0.75, 1].map((y) => (
            <text key={y} x={pad.left - 8} y={ty(y) + 4} textAnchor="end" fontSize="11" fill="#5c8a7e">{(y * 100)}%</text>
          ))}
        </svg>
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
        <p className="text-sm text-brand-700 font-mono mb-2">
          logit(p) = {intercept.toFixed(1)} + {slope.toFixed(2)} * X
        </p>
        <p className="text-sm text-brand-700">
          The odds ratio of {oddsRatio.toFixed(2)} means that for each 1-unit increase in X,
          the odds of the outcome are multiplied by {oddsRatio.toFixed(2)}.
          {oddsRatio > 1
            ? ` That is a ${((oddsRatio - 1) * 100).toFixed(0)}% increase in odds per unit.`
            : oddsRatio < 1
            ? ` That is a ${((1 - oddsRatio) * 100).toFixed(0)}% decrease in odds per unit.`
            : " No change in odds."}
        </p>
      </div>
    </div>
  );
}
