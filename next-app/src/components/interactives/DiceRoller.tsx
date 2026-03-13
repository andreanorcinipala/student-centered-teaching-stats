"use client";

import { useState } from "react";

const dieFaces: Record<number, number[][]> = {
  1: [[1, 1]],
  2: [[0, 2], [2, 0]],
  3: [[0, 2], [1, 1], [2, 0]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

function DieFace({ value }: { value: number }) {
  const dots = dieFaces[value] || [];
  return (
    <div className="w-16 h-16 bg-white border-2 border-brand-200 rounded-lg grid grid-cols-3 grid-rows-3 p-1.5 gap-0.5">
      {Array.from({ length: 9 }).map((_, idx) => {
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        const hasDot = dots.some(([r, c]) => r === row && c === col);
        return (
          <div key={idx} className="flex items-center justify-center">
            {hasDot && (
              <div className="w-2.5 h-2.5 rounded-full bg-brand-700" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function DiceRoller() {
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const total = counts.reduce((a, b) => a + b, 0);
  const maxCount = Math.max(...counts, 1);

  function rollOnce() {
    setIsRolling(true);
    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setLastRoll(result);
      setCounts((prev) => {
        const next = [...prev];
        next[result - 1]++;
        return next;
      });
      setIsRolling(false);
    }, 200);
  }

  function rollMany(n: number) {
    const newCounts = [...counts];
    let last = lastRoll;
    for (let i = 0; i < n; i++) {
      const result = Math.floor(Math.random() * 6) + 1;
      newCounts[result - 1]++;
      last = result;
    }
    setCounts(newCounts);
    setLastRoll(last);
  }

  function reset() {
    setCounts([0, 0, 0, 0, 0, 0]);
    setLastRoll(null);
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-600">
        Each face has a 1 in 6 chance (16.7%). Roll the die and watch how the
        frequencies converge toward equal as you roll more. Early on, some
        numbers may seem &quot;hot&quot; or &quot;cold&quot;, but that is just
        randomness at work.
      </p>

      {/* Die display */}
      {lastRoll && (
        <div className="flex items-center gap-3">
          <DieFace value={lastRoll} />
          <span className="text-sm text-brand-500">
            You rolled a <span className="font-semibold text-brand-800">{lastRoll}</span>
          </span>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={rollOnce}
          disabled={isRolling}
          className="px-5 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
        >
          {isRolling ? "Rolling..." : "Roll Once"}
        </button>
        <button
          onClick={() => rollMany(10)}
          className="px-5 py-2 bg-brand-100 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-200 transition-colors"
        >
          Roll 10x
        </button>
        <button
          onClick={() => rollMany(100)}
          className="px-5 py-2 bg-brand-100 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-200 transition-colors"
        >
          Roll 100x
        </button>
        <button
          onClick={reset}
          className="px-5 py-2 bg-white border border-brand-200 text-brand-600 rounded-lg text-sm font-medium hover:bg-brand-50 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Frequency chart */}
      {total > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-brand-400">
            Total rolls: <span className="font-medium text-brand-800">{total}</span>
          </div>

          <div className="space-y-2">
            {counts.map((count, i) => {
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 text-sm font-medium text-brand-700 text-right">
                    {i + 1}
                  </span>
                  <div className="flex-1 h-7 bg-brand-50 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-brand-400 rounded-full transition-all duration-300"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                    {/* Expected line at 16.7% */}
                    <div
                      className="absolute top-0 h-full border-r-2 border-dashed border-brand-300"
                      style={{ left: `${(total / 6 / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-20 text-xs text-brand-600 text-right">
                    {count} ({pct.toFixed(1)}%)
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-brand-400">
            <span className="w-4 border-t-2 border-dashed border-brand-300 inline-block" />
            Expected (16.7%)
          </div>

          {/* Interpretation */}
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
            <p className="text-sm text-brand-700">
              {total < 20
                ? "With so few rolls, the frequencies look uneven. This is normal. Keep rolling to see probability in action."
                : total < 100
                ? `After ${total} rolls, you can start to see the pattern forming. Some faces are still over- or under-represented, but they are getting closer to 16.7% each.`
                : `After ${total} rolls, the frequencies are converging toward 16.7% each. This is the Law of Large Numbers: the more you repeat a random experiment, the closer the observed frequencies get to the true probabilities.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
