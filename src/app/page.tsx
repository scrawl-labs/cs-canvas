"use client";

import TopicCard from "@/components/TopicCard";
import HeroGraph from "@/components/HeroGraph";

const topics = [
  {
    id: "algorithms",
    title: "Algorithms",
    description:
      "Sorting, graph traversal, dynamic programming — watch them run.",
    icon: "⚡",
    color: "from-violet-500 to-purple-600",
    subtopics: ["Sorting", "Graph Traversal", "Dynamic Programming"],
    count: 8,
  },
  {
    id: "data-structures",
    title: "Data Structures",
    description: "Trees, heaps, linked lists — interact with every operation.",
    icon: "🌲",
    color: "from-emerald-500 to-teal-600",
    subtopics: ["Trees", "Heaps", "Linked Lists"],
    count: 6,
  },
  {
    id: "operating-systems",
    title: "Operating Systems",
    description:
      "Process scheduling, memory management, deadlocks visualized.",
    icon: "⚙️",
    color: "from-orange-500 to-amber-600",
    subtopics: ["Scheduling", "Memory", "Deadlock"],
    count: 5,
  },
  {
    id: "networks",
    title: "Networks",
    description: "TCP handshakes, OSI layers, routing — see packets travel.",
    icon: "🌐",
    color: "from-blue-500 to-cyan-600",
    subtopics: ["TCP/IP", "OSI Layers", "Routing"],
    count: 4,
  },
  {
    id: "databases",
    title: "Databases",
    description:
      "B-Trees, transactions, joins — understand what happens inside.",
    icon: "🗄️",
    color: "from-rose-500 to-pink-600",
    subtopics: ["B-Tree", "Transactions", "Joins"],
    count: 5,
  },
  {
    id: "computer-architecture",
    title: "Computer Architecture",
    description:
      "CPU pipelines, cache hierarchies in 3D — powered by Three.js.",
    icon: "🔧",
    color: "from-slate-500 to-gray-600",
    subtopics: ["CPU Pipeline", "Cache", "Memory"],
    count: 3,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-grid-pattern">
      {/* radial gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(120,80,255,0.12),transparent)]" />

      {/* Hero — Three.js 인터랙티브 3D 노드 그래프 */}
      <HeroGraph />

      {/* Topic grid */}
      <section id="topics" className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, index) => (
            <TopicCard key={topic.id} topic={topic} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
