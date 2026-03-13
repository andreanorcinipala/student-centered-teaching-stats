import Link from "next/link";
import TopicIcon from "./TopicIcon";
import type { Topic } from "../data/topics";

export default function TopicCard({
  topic,
  index,
}: {
  topic: Topic;
  index: number;
}) {
  const inner = (
    <div
      className="group bg-white rounded-2xl p-6 border border-brand-100 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
        <TopicIcon name={topic.icon} />
      </div>
      <h2 className="font-serif text-xl text-brand-800 mb-2">{topic.title}</h2>
      <p className="text-sm text-brand-600 leading-relaxed">
        {topic.description}
      </p>
      {topic.status === "coming-soon" && (
        <span className="inline-block mt-4 text-xs font-medium text-brand-400 uppercase tracking-wide">
          Coming Soon
        </span>
      )}
    </div>
  );

  if (topic.status === "live") {
    return <Link href={`/topics/${topic.id}`}>{inner}</Link>;
  }

  return <div className="cursor-default">{inner}</div>;
}
