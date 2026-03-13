"use client";

import { useState, useMemo, useCallback } from "react";

type Distribution = "uniform" | "skewed" | "bimodal";

function sampleFromPopulation(dist: Distribution): number {
  switch (dist) {
    case "uniform":
      return Math.random() * 10;
    case "skewed": {
      // Exponential-ish (right skewed)
      return -Math.log(1 - Math.random()) * 3;
    }
    case "bimodal": {
      // Mix of two normals
      const pick = Math.random() < 0.5;
      const mu = pick ? 3 : 7;
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      return mu + z * 0.8;
    }
  }
}

function computeMean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export default function CLTVisualizer() {
  const [dist, setDist] = useState<Distribution>("skewed");
  const [sampleSize, setSampleSize] = useState(30);
  const [means, setMeans] = useState<number[]>([]);

  const drawSamples = useCallback(
    (count: number) => {
      const newMeans: number[] = [];
      for (let i = 0; i < count; i++) {
        const sample: number[] = [];
        for (let j = 0; j < sampleSize; j++) {
          sample.push(sampleFromPopulation(dist));
        }
        newMeans.push(computeMean(sample));
      }
      setMeans((prev) => [...prev, ...newMeans]);
    },
    [dist, sampleSize]
  );

  function reset() {
    setMeans([]);
  }

  // Histogram of means
  const histogram = useMemo(() => {
    if (means.length === 0) return { bins: [], min: 0, max: 10, maxCount: 1 };

    const min = Math.min(...means);
    const max = Math.max(...means);
    const range = max - min || 1;
    const numBins = 30;
    const binWidth = range / numBins;

    const bins = Array(numBins).fill(0);
    for (const m of means) {
      const idx = Math.min(Math.floor((m - min) / binWidth), numBins - 1);
      bins[idx]++;
    }

    return { bins, min, max, maxCount: Math.max(...bins, 1), binWidth };
  }, [means]);

  const grandMean = means.length > 0 ? computeMean(means) : 0;
  const grandSd =
    means.length > 1
      ? Math.sqrt(
          means.reduce((s, m) => s + (m - grandMean) ** 2, 0) /
            (means.length - 1)
        )
      : 0;

  // SVG for population shape
  const popSvgWidth = 200;
  const popSvgHeight = 60;

  function popCurvePoints(): string {
    const pts: string[] = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * popSvgWidth;
      let y: number;
      const t = i / steps;
      switch (dist) {
        case "uniform":
          y = 0.8;
          break;
        case "skewed":
          y = Math.exp(-t * 3) * 2;
          break;
        case "bimodal":
          y =
            Math.exp(-((t - 0.3) ** 2) / 0.01) +
            Math.exp(-((t - 0.7) ** 2) / 0.01);
          break;
      }
      pts.push(`${x},${popSvgHeight - y * (popSvgHeight * 0.4) - 5}`);
    }
    return pts.join(" ");
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        The Central Limit Theorem says that no matter the shape of the
        population, the distribution of sample means approaches a normal curve
        as sample size increases. Choose a non-normal population and see it
        happen.
      </p>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-2">
            Population shape
          </label>
          <div className="flex gap-2">
            {(["uniform", "skewed", "bimodal"] as Distribution[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDist(d);
                  setMeans([]);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  dist === d
                    ? "bg-brand-500 text-white"
                    : "bg-brand-100 text-brand-700 hover:bg-brand-200"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-500 mb-1">
            Sample size (n): {sampleSize}
          </label>
          <input
            type="range"
            min={2}
            max={200}
            step={1}
            value={sampleSize}
            onChange={(e) => {
              setSampleSize(Number(e.target.value));
              setMeans([]);
            }}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-xs text-brand-400">
            <span>2</span>
            <span>200</span>
          </div>
        </div>
      </div>

      {/* Population shape preview */}
      <div className="bg-white border border-brand-100 rounded-xl p-4">
        <div className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-2">
          Population distribution ({dist})
        </div>
        <svg
          viewBox={`0 0 ${popSvgWidth} ${popSvgHeight}`}
          className="w-full h-16"
          preserveAspectRatio="xMidYMid meet"
        >
          <polyline
            points={popCurvePoints()}
            fill="none"
            stroke="#5c8a7e"
            strokeWidth="2"
          />
          <line
            x1="0"
            y1={popSvgHeight - 4}
            x2={popSvgWidth}
            y2={popSvgHeight - 4}
            stroke="#b0c9c3"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => drawSamples(1)}
          className="px-5 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          Draw 1 sample
        </button>
        <button
          onClick={() => drawSamples(50)}
          className="px-5 py-2 bg-brand-100 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-200 transition-colors"
        >
          Draw 50
        </button>
        <button
          onClick={() => drawSamples(500)}
          className="px-5 py-2 bg-brand-100 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-200 transition-colors"
        >
          Draw 500
        </button>
        <button
          onClick={reset}
          className="px-5 py-2 bg-white border border-brand-200 text-brand-600 rounded-lg text-sm font-medium hover:bg-brand-50 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Stats */}
      {means.length > 0 && (
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="bg-brand-50 rounded-lg p-3">
            <div className="text-xs text-brand-400">Samples drawn</div>
            <div className="text-lg font-semibold text-brand-800">
              {means.length}
            </div>
          </div>
          <div className="bg-brand-50 rounded-lg p-3">
            <div className="text-xs text-brand-400">Mean of means</div>
            <div className="text-lg font-semibold text-brand-800">
              {grandMean.toFixed(3)}
            </div>
          </div>
          <div className="bg-brand-50 rounded-lg p-3">
            <div className="text-xs text-brand-400">SD of means</div>
            <div className="text-lg font-semibold text-brand-800">
              {grandSd.toFixed(3)}
            </div>
          </div>
        </div>
      )}

      {/* Histogram */}
      {means.length > 0 && (
        <div className="bg-white border border-brand-100 rounded-xl p-4">
          <div className="text-xs font-medium text-brand-400 uppercase tracking-wide mb-2">
            Distribution of sample means (n = {sampleSize})
          </div>
          <div className="flex items-end gap-px h-40">
            {histogram.bins.map((count, i) => (
              <div
                key={i}
                className="flex-1 bg-brand-400 rounded-t-sm transition-all duration-200 hover:bg-brand-500"
                style={{
                  height: `${(count / histogram.maxCount) * 100}%`,
                  minHeight: count > 0 ? "2px" : "0",
                }}
                title={`${count} sample means`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-brand-400 mt-1">
            <span>{histogram.min.toFixed(2)}</span>
            <span>{((histogram.min + histogram.max) / 2).toFixed(2)}</span>
            <span>{histogram.max.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Interpretation */}
      {means.length > 0 && (
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
          <p className="text-sm text-brand-700">
            {means.length < 30
              ? "Draw more samples to see the shape emerge. The histogram of means will gradually form a bell curve."
              : means.length < 200
              ? `With ${means.length} samples of size ${sampleSize}, the distribution of means is starting to look normal, even though the population is ${dist}. This is the CLT in action.`
              : `With ${means.length} samples, the sampling distribution is clearly bell-shaped. The population is ${dist}, but the means follow a normal distribution centered at ${grandMean.toFixed(2)} with SD ${grandSd.toFixed(3)}. Try changing the sample size to see how it affects the spread.`}
          </p>
        </div>
      )}
    </div>
  );
}
