"use client";

import { useState } from "react";

const levels = ["beginner", "intermediate", "advanced"] as const;
export type Difficulty = (typeof levels)[number];

export default function DifficultyToggle() {
  const [active, setActive] = useState<Difficulty>("beginner");

  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-sm text-brand-600 font-medium mr-2">
        Difficulty:
      </span>
      {levels.map((level) => (
        <button
          key={level}
          onClick={() => setActive(level)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
            active === level
              ? "bg-brand-500 text-white"
              : "bg-brand-100 text-brand-700 hover:bg-brand-200"
          }`}
        >
          {level}
        </button>
      ))}
    </div>
  );
}
