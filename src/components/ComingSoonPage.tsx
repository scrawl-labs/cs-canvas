"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface SubtopicItem {
  name: string;
  description: string;
}

interface ComingSoonPageProps {
  title: string;
  icon: string;
  color: string;
  description: string;
  subtopics: SubtopicItem[];
}

export default function ComingSoonPage({
  title,
  icon,
  color,
  description,
  subtopics,
}: ComingSoonPageProps) {
  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(120,80,255,0.08),transparent)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        {/* breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-10"
        >
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
          >
            ← cs-canvas
          </Link>
        </motion.div>

        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{icon}</span>
            <h1 className="text-3xl font-bold text-white font-mono">{title}</h1>
          </div>
          <p className="text-zinc-400 text-base max-w-lg leading-relaxed">
            {description}
          </p>

          {/* coming soon badge */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Coming Soon — visualizations in progress
          </div>
        </motion.div>

        {/* subtopics grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {subtopics.map((subtopic, index) => (
            <motion.div
              key={subtopic.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.1 + index * 0.06,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-5 overflow-hidden"
            >
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br ${color}`}
              />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">
                    {subtopic.name}
                  </h3>
                  <span className="text-xs text-zinc-600 border border-white/5 rounded px-1.5 py-0.5 bg-white/[0.02]">
                    soon
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {subtopic.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
