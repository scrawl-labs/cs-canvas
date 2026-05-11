"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  subtopics: string[];
  count: number;
}

interface TopicCardProps {
  topic: Topic;
  index: number;
}

export default function TopicCard({ topic, index }: TopicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      <Link href={`/${topic.id}`} className="block h-full">
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="group relative h-full rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.06] transition-colors cursor-pointer overflow-hidden"
        >
          {/* gradient glow on hover */}
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${topic.color} rounded-xl`}
          />

          <div className="relative flex flex-col gap-4 h-full">
            {/* icon + count */}
            <div className="flex items-start justify-between">
              <span className="text-3xl" role="img" aria-label={topic.title}>
                {topic.icon}
              </span>
              <span className="text-xs font-mono text-zinc-500 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                {topic.count} topics
              </span>
            </div>

            {/* title + description */}
            <div className="flex-1">
              <h2 className="text-base font-semibold text-white mb-1.5">
                {topic.title}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {topic.description}
              </p>
            </div>

            {/* subtopic pills */}
            <div className="flex flex-wrap gap-1.5">
              {topic.subtopics.map((sub) => (
                <span
                  key={sub}
                  className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${topic.color} bg-opacity-10 text-white/70 border border-white/10`}
                >
                  {sub}
                </span>
              ))}
            </div>

            {/* arrow */}
            <div className="flex items-center gap-1 text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors mt-1">
              <span>Explore</span>
              <motion.span
                animate={{ x: 0 }}
                whileHover={{ x: 2 }}
                className="inline-block"
              >
                →
              </motion.span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
