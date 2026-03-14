"use client";

import { useState } from "react";
import Link from "next/link";
import TopicIcon from "../../../components/TopicIcon";
import { multivariableLogisticRegressionContent } from "../../../data/multivariable-logistic-regression";
import RiskFactorExplorer from "../../../components/interactives/RiskFactorExplorer";
import CrudeVsAdjusted from "../../../components/interactives/CrudeVsAdjusted";
import PropensityScoreLab from "../../../components/interactives/PropensityScoreLab";
import CustomExample from "../../../components/CustomExample";

type Difficulty = "beginner" | "intermediate" | "advanced";
const levels: Difficulty[] = ["beginner", "intermediate", "advanced"];

function InteractiveSection({ difficulty }: { difficulty: Difficulty }) {
  switch (difficulty) {
    case "beginner": return <RiskFactorExplorer />;
    case "intermediate": return <CrudeVsAdjusted />;
    case "advanced": return <PropensityScoreLab />;
  }
}

export default function MultivariableLogisticRegressionPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const content = multivariableLogisticRegressionContent[difficulty];

  return (
    <div className="min-h-screen bg-brand-50 text-brand-900">
      <header className="bg-white border-b border-brand-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/" className="text-sm text-brand-400 hover:text-brand-600 transition-colors">&larr; Back to Topics</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <div className="text-center space-y-4">
          <div className="w-28 h-28 rounded-2xl bg-white border border-brand-100 shadow-sm flex items-center justify-center mx-auto">
            <div className="scale-[2]"><TopicIcon name="multivariable-logistic" /></div>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-brand-800">Multivariable Logistic Regression</h1>
          <p className="text-brand-500 text-lg max-w-xl mx-auto">Predicting yes/no outcomes with multiple predictors. Adjusted odds ratios and causal inference.</p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-brand-600 font-medium mr-2">Level:</span>
          {levels.map((level) => (
            <button key={level} onClick={() => setDifficulty(level)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${difficulty === level ? "bg-brand-500 text-white" : "bg-brand-100 text-brand-700 hover:bg-brand-200"}`}>
              {level}
            </button>
          ))}
        </div>

        <section className="bg-white rounded-2xl border border-brand-100 shadow-sm p-6 md:p-8 space-y-4">
          <h2 className="font-serif text-2xl text-brand-800">Explanation</h2>
          {content.explanation.split("\n\n").map((para, i) => (<p key={i} className="text-brand-700 leading-relaxed">{para}</p>))}
        </section>

        <section className="bg-white rounded-2xl border border-brand-100 shadow-sm p-6 md:p-8 space-y-4">
          <h2 className="font-serif text-2xl text-brand-800">Example</h2>
          {content.example.split("\n\n").map((para, i) => (<p key={i} className="text-brand-700 leading-relaxed whitespace-pre-line">{para}</p>))}
        </section>

        <div className="bg-brand-500 text-white rounded-2xl p-6 md:p-8">
          <h3 className="font-serif text-xl mb-2">Key Takeaway</h3>
          <p className="text-brand-100 leading-relaxed">{content.keyTakeaway}</p>
        </div>

        <section className="bg-white rounded-2xl border border-brand-100 shadow-sm p-6 md:p-8">
          <h2 className="font-serif text-2xl text-brand-800 mb-4">Key Terms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.keyTerms.map((kt) => (
              <div key={kt.term} className="bg-brand-50 rounded-xl p-4 border border-brand-100">
                <h4 className="font-medium text-brand-800 text-sm mb-1">{kt.term}</h4>
                <p className="text-xs text-brand-600 leading-relaxed">{kt.definition}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-brand-100 shadow-sm p-6 md:p-8">
          <div className="mb-5">
            <h2 className="font-serif text-2xl text-brand-800">{content.interactive.title}</h2>
            <p className="text-sm text-brand-500 mt-1">{content.interactive.description}</p>
          </div>
          <InteractiveSection difficulty={difficulty} />
        </section>

        <section className="bg-white rounded-2xl border border-brand-100 shadow-sm p-6 md:p-8">
          <h2 className="font-serif text-2xl text-brand-800 mb-4">Make It Personal</h2>
          <CustomExample topic="Multivariable Logistic Regression" difficulty={difficulty} />
        </section>
      </main>

      <footer className="border-t border-brand-100 bg-white mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center text-sm text-brand-400">Built for students, by Andrea Norcini Pala</div>
      </footer>
    </div>
  );
}
