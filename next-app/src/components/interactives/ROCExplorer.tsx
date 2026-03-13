"use client";

import { useState, useMemo } from "react";

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

interface Sample { score: number; label: number; }

function generateSamples(n: number, separation: number): Sample[] {
  const samples: Sample[] = [];
  for (let i = 0; i < n; i++) {
    const label = Math.random() < 0.3 ? 1 : 0;
    const score = label === 1
      ? 0.5 + separation * 0.3 + gaussianRandom() * 0.2
      : 0.3 + gaussianRandom() * 0.2;
    samples.push({ score: Math.max(0, Math.min(1, score)), label });
  }
  return samples;
}

function computeROC(samples: Sample[]) {
  const sorted = [...samples].sort((a, b) => b.score - a.score);
  const totalPos = samples.filter((s) => s.label === 1).length;
  const totalNeg = samples.length - totalPos;
  if (totalPos === 0 || totalNeg === 0) return { points: [{ fpr: 0, tpr: 0 }], auc: 0.5 };

  const points: { fpr: number; tpr: number; threshold: number }[] = [{ fpr: 0, tpr: 0, threshold: 1.01 }];
  let tp = 0, fp = 0;

  for (const s of sorted) {
    if (s.label === 1) tp++;
    else fp++;
    points.push({ fpr: fp / totalNeg, tpr: tp / totalPos, threshold: s.score });
  }

  // AUC via trapezoidal rule
  let auc = 0;
  for (let i = 1; i < points.length; i++) {
    auc += (points[i].fpr - points[i - 1].fpr) * (points[i].tpr + points[i - 1].tpr) / 2;
  }

  return { points, auc };
}

export default function ROCExplorer() {
  const [separation, setSeparation] = useState(1);
  const [threshold, setThreshold] = useState(0.5);
  const [samples] = useState<Sample[]>(() => generateSamples(500, 1));

  const adjustedSamples = useMemo(() => {
    return generateSamples(500, separation);
  }, [separation]);

  const roc = useMemo(() => computeROC(adjustedSamples), [adjustedSamples]);

  // Confusion matrix at threshold
  const cm = useMemo(() => {
    let tp = 0, fp = 0, tn = 0, fn = 0;
    for (const s of adjustedSamples) {
      const pred = s.score >= threshold ? 1 : 0;
      if (pred === 1 && s.label === 1) tp++;
      else if (pred === 1 && s.label === 0) fp++;
      else if (pred === 0 && s.label === 0) tn++;
      else fn++;
    }
    const sensitivity = tp + fn > 0 ? tp / (tp + fn) : 0;
    const specificity = tn + fp > 0 ? tn / (tn + fp) : 0;
    return { tp, fp, tn, fn, sensitivity, specificity };
  }, [adjustedSamples, threshold]);

  const svgW = 300, svgH = 300;
  const pad = { top: 15, right: 15, bottom: 30, left: 35 };
  const pW = svgW - pad.left - pad.right;
  const pH = svgH - pad.top - pad.bottom;

  function tx(x: number) { return pad.left + x * pW; }
  function ty(y: number) { return pad.top + pH - y * pH; }

  const rocPath = roc.points.map((p, i) =>
    `${i === 0 ? "M" : "L"}${tx(p.fpr)},${ty(p.tpr)}`
  ).join(" ");

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Adjust the class separation to change model quality. Move the
        classification threshold to see the tradeoff between sensitivity and
        specificity.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Class separation: {separation.toFixed(1)}
          </label>
          <input type="range" min={0} max={3} step={0.1} value={separation}
            onChange={(e) => setSeparation(Number(e.target.value))}
            className="w-full accent-brand-500" />
          <div className="flex justify-between text-xs text-brand-400">
            <span>Overlapping</span><span>Well separated</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Threshold: {threshold.toFixed(2)}
          </label>
          <input type="range" min={0.01} max={0.99} step={0.01} value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full accent-brand-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ROC Curve */}
        <div className="bg-white border border-brand-100 rounded-xl p-3">
          <div className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-1">
            ROC Curve (AUC = {roc.auc.toFixed(3)})
          </div>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
            <line x1={pad.left} y1={pad.top + pH} x2={pad.left + pW} y2={pad.top + pH} stroke="#b0c9c3" strokeWidth="1" />
            <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + pH} stroke="#b0c9c3" strokeWidth="1" />
            {/* Diagonal */}
            <line x1={tx(0)} y1={ty(0)} x2={tx(1)} y2={ty(1)} stroke="#d7e4e1" strokeWidth="1" strokeDasharray="4 3" />
            {/* ROC curve */}
            <path d={rocPath} fill="none" stroke="#436d62" strokeWidth="2.5" />
            {/* Current operating point */}
            <circle cx={tx(1 - cm.specificity)} cy={ty(cm.sensitivity)} r="6" fill="#ef4444" stroke="white" strokeWidth="2" />

            {[0, 0.5, 1].map((v) => (
              <text key={`x${v}`} x={tx(v)} y={svgH - 8} textAnchor="middle" fontSize="10" fill="#5c8a7e">{v}</text>
            ))}
            {[0, 0.5, 1].map((v) => (
              <text key={`y${v}`} x={pad.left - 8} y={ty(v) + 4} textAnchor="end" fontSize="10" fill="#5c8a7e">{v}</text>
            ))}
            <text x={svgW / 2} y={svgH - 1} textAnchor="middle" fontSize="10" fill="#82a99f">1 - Specificity (FPR)</text>
            <text x={6} y={svgH / 2} textAnchor="middle" fontSize="10" fill="#82a99f" transform={`rotate(-90,6,${svgH / 2})`}>Sensitivity (TPR)</text>
          </svg>
        </div>

        {/* Confusion Matrix */}
        <div className="bg-white border border-brand-100 rounded-xl p-3">
          <div className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-2">
            Confusion Matrix
          </div>
          <div className="grid grid-cols-3 gap-1 text-center text-xs">
            <div></div>
            <div className="font-medium text-brand-600 py-1">Pred +</div>
            <div className="font-medium text-brand-600 py-1">Pred -</div>

            <div className="font-medium text-brand-600 py-2">Actual +</div>
            <div className="bg-green-100 text-green-700 font-semibold py-2 rounded">{cm.tp} (TP)</div>
            <div className="bg-red-100 text-red-600 font-semibold py-2 rounded">{cm.fn} (FN)</div>

            <div className="font-medium text-brand-600 py-2">Actual -</div>
            <div className="bg-red-100 text-red-600 font-semibold py-2 rounded">{cm.fp} (FP)</div>
            <div className="bg-green-100 text-green-700 font-semibold py-2 rounded">{cm.tn} (TN)</div>
          </div>

          <div className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-500">Sensitivity (TPR):</span>
              <span className="font-medium text-brand-800">{(cm.sensitivity * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-500">Specificity (TNR):</span>
              <span className="font-medium text-brand-800">{(cm.specificity * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
        <p className="text-sm text-brand-700">
          {roc.auc > 0.85
            ? `AUC of ${roc.auc.toFixed(3)} indicates excellent discrimination. `
            : roc.auc > 0.7
            ? `AUC of ${roc.auc.toFixed(3)} indicates acceptable discrimination. `
            : `AUC of ${roc.auc.toFixed(3)} indicates poor discrimination. Increase class separation to improve. `}
          At threshold {threshold.toFixed(2)}, sensitivity is {(cm.sensitivity * 100).toFixed(0)}% and specificity is {(cm.specificity * 100).toFixed(0)}%.
          Lowering the threshold catches more true positives but increases false positives.
        </p>
      </div>
    </div>
  );
}
