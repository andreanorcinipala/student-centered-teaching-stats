"use client";

import { useState } from "react";

export default function CoinFlip() {
  const [flips, setFlips] = useState<string[]>([]);
  const [headsCount, setHeadsCount] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const totalFlips = flips.length;
  const headsRate = totalFlips > 0 ? (headsCount / totalFlips) * 100 : 0;

  function flipCoin() {
    setIsFlipping(true);
    setTimeout(() => {
      const isHeads = Math.random() < 0.5;
      const result = isHeads ? "H" : "T";
      setFlips((prev) => [...prev, result]);
      if (isHeads) setHeadsCount((prev) => prev + 1);
      setIsFlipping(false);
    }, 300);
  }

  function flipTen() {
    let newFlips: string[] = [];
    let newHeads = 0;
    for (let i = 0; i < 10; i++) {
      const isHeads = Math.random() < 0.5;
      newFlips.push(isHeads ? "H" : "T");
      if (isHeads) newHeads++;
    }
    setFlips((prev) => [...prev, ...newFlips]);
    setHeadsCount((prev) => prev + newHeads);
  }

  function reset() {
    setFlips([]);
    setHeadsCount(0);
  }

  function getVerdict() {
    if (totalFlips < 10) return "Flip at least 10 times to start seeing a pattern.";
    if (totalFlips < 30)
      return `With only ${totalFlips} flips, it is hard to tell. Keep flipping for a clearer picture.`;
    if (headsRate > 65 || headsRate < 35)
      return `Heads rate: ${headsRate.toFixed(1)}%. That looks suspicious. You might reject the null hypothesis that this coin is fair.`;
    if (headsRate > 55 || headsRate < 45)
      return `Heads rate: ${headsRate.toFixed(1)}%. A little off from 50%, but not enough to rule out chance. The null hypothesis holds.`;
    return `Heads rate: ${headsRate.toFixed(1)}%. Very close to 50%. No reason to doubt this is a fair coin. The null hypothesis stands.`;
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        This coin is fair (50/50). Flip it and watch. Sometimes you will see streaks
        that look non-random, but the null hypothesis says: it is just chance.
      </p>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={flipCoin}
          disabled={isFlipping}
          className="px-5 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
        >
          {isFlipping ? "Flipping..." : "Flip Once"}
        </button>
        <button
          onClick={flipTen}
          className="px-5 py-2 bg-brand-100 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-200 transition-colors"
        >
          Flip 10x
        </button>
        <button
          onClick={reset}
          className="px-5 py-2 bg-white border border-brand-200 text-brand-600 rounded-lg text-sm font-medium hover:bg-brand-50 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Results */}
      {totalFlips > 0 && (
        <div className="space-y-4">
          {/* Stats bar */}
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-brand-400">Total flips:</span>{" "}
              <span className="font-medium text-brand-800">{totalFlips}</span>
            </div>
            <div>
              <span className="text-brand-400">Heads:</span>{" "}
              <span className="font-medium text-brand-800">{headsCount}</span>
            </div>
            <div>
              <span className="text-brand-400">Tails:</span>{" "}
              <span className="font-medium text-brand-800">
                {totalFlips - headsCount}
              </span>
            </div>
            <div>
              <span className="text-brand-400">Heads rate:</span>{" "}
              <span className="font-medium text-brand-800">
                {headsRate.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Visual bar */}
          <div className="w-full h-8 rounded-full overflow-hidden bg-brand-100 flex">
            <div
              className="h-full bg-brand-500 transition-all duration-300 flex items-center justify-center text-xs text-white font-medium"
              style={{ width: `${headsRate}%` }}
            >
              {headsRate > 15 ? "H" : ""}
            </div>
            <div
              className="h-full bg-brand-200 transition-all duration-300 flex items-center justify-center text-xs text-brand-700 font-medium"
              style={{ width: `${100 - headsRate}%` }}
            >
              {headsRate < 85 ? "T" : ""}
            </div>
          </div>

          {/* Flip history */}
          <div className="flex flex-wrap gap-1">
            {flips.slice(-50).map((f, i) => (
              <span
                key={i}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                  f === "H"
                    ? "bg-brand-500 text-white"
                    : "bg-brand-100 text-brand-600"
                }`}
              >
                {f}
              </span>
            ))}
            {flips.length > 50 && (
              <span className="text-xs text-brand-400 self-center ml-1">
                ...showing last 50
              </span>
            )}
          </div>

          {/* Verdict */}
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
            <p className="text-sm text-brand-700 font-medium">{getVerdict()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
