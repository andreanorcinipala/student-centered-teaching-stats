"use client";

import { useState } from "react";

const suggestions = [
  "football",
  "cooking",
  "video games",
  "music",
  "basketball",
  "gardening",
];

export default function CustomExample({
  topic,
  difficulty,
}: {
  topic: string;
  difficulty: string;
}) {
  const [scenario, setScenario] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!scenario.trim()) return;
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/custom-example", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, scenario: scenario.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setResult(data.example);
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-brand-700 leading-relaxed">
          Want to see this concept in a context you care about? Tell me a
          scenario and I will explain{" "}
          <span className="font-medium">{topic}</span> using it.
        </p>
        <p className="text-xs text-brand-400 mt-1">
          For example: &quot;Explain {topic} using a football scenario&quot;
        </p>
      </div>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setScenario(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              scenario === s
                ? "bg-brand-500 text-white"
                : "bg-brand-100 text-brand-600 hover:bg-brand-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder="Type your own scenario..."
          maxLength={300}
          className="flex-1 px-4 py-2 rounded-lg border border-brand-200 text-sm text-brand-800 placeholder-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
        />
        <button
          onClick={generate}
          disabled={loading || !scenario.trim()}
          className="px-5 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? "Generating..." : "Show me"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-brand-400 uppercase tracking-wide">
              Custom example: {scenario}
            </span>
          </div>
          {result.split("\n\n").map((para, i) => (
            <p key={i} className="text-sm text-brand-700 leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
