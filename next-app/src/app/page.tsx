import { topics } from "../data/topics";
import TopicCard from "../components/TopicCard";
import DifficultyToggle from "../components/DifficultyToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-50 text-brand-900">
      {/* Header */}
      <header className="bg-white border-b border-brand-100">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-brand-800 mb-3">
            Student-Centered Teaching Stats
          </h1>
          <p className="text-brand-500 text-lg max-w-2xl mx-auto">
            Statistics explained at your level. Pick a topic, choose your
            difficulty, and build your understanding at your own pace.
          </p>
        </div>
      </header>

      {/* Difficulty Toggle */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-2">
        <DifficultyToggle />
      </div>

      {/* Topic Grid */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, i) => (
            <TopicCard key={topic.id} topic={topic} index={i} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-100 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-brand-400">
          Built for students, by Andrea Norcini Pala
        </div>
      </footer>
    </div>
  );
}
