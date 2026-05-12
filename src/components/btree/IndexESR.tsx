"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ESRColumn {
  name: string;
  type: "equality" | "sort" | "range";
  condition: string;
}

interface ESRScenario {
  title: string;
  query: string;
  columns: ESRColumn[];
  index: string[];
  verdict: "good" | "bad";
  explanation: string;
}

const SCENARIOS: ESRScenario[] = [
  {
    title: "ESR 올바른 순서",
    query: `SELECT *
FROM orders
WHERE user_id = 100        -- E
  AND status = 'DONE'      -- E
ORDER BY created_at DESC   -- S
LIMIT 20`,
    columns: [
      { name: "user_id", type: "equality", condition: "= 100" },
      { name: "status", type: "equality", condition: "= 'DONE'" },
      { name: "created_at", type: "sort", condition: "ORDER BY DESC" },
    ],
    index: ["user_id", "status", "created_at"],
    verdict: "good",
    explanation:
      "Equality 먼저 좁히고 → Sort로 정렬 순서 확보 → filesort 없이 LIMIT까지 처리. 인덱스 한 번으로 끝.",
  },
  {
    title: "Range가 Sort 앞에 올 때",
    query: `SELECT *
FROM orders
WHERE user_id = 100           -- E
  AND created_at >= '2025-01' -- R (Range가 앞)
ORDER BY status               -- S (이미 Range 이후라 정렬 못 씀)
LIMIT 20`,
    columns: [
      { name: "user_id", type: "equality", condition: "= 100" },
      { name: "created_at", type: "range", condition: ">= '2025-01'" },
      { name: "status", type: "sort", condition: "ORDER BY" },
    ],
    index: ["user_id", "created_at", "status"],
    verdict: "bad",
    explanation:
      "Range 조건(created_at) 이후 컬럼은 인덱스 정렬이 보장되지 않습니다. status ORDER BY에서 filesort 발생.",
  },
  {
    title: "Q2-5 실전: 최근 주문 조회",
    query: `-- "최근 1주일 특정 유저의 완료 주문"
SELECT *
FROM orders
WHERE user_id = ?            -- E
  AND status = 'DONE'        -- E
  AND created_at >= NOW()-7d -- R`,
    columns: [
      { name: "user_id", type: "equality", condition: "= ?" },
      { name: "status", type: "equality", condition: "= 'DONE'" },
      { name: "created_at", type: "range", condition: ">= NOW()-7d" },
    ],
    index: ["user_id", "status", "created_at"],
    verdict: "good",
    explanation:
      "Equality 두 개로 데이터를 최대로 좁힌 후 Range. created_at을 앞에 두면 날짜 범위가 모든 유저를 포함해 선택도가 나빠집니다.",
  },
];

const TYPE_CONFIG = {
  equality: { label: "E — Equality", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/30" },
  sort: { label: "S — Sort", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/30" },
  range: { label: "R — Range", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
};

export default function IndexESR() {
  const [idx, setIdx] = useState(0);
  const s = SCENARIOS[idx];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="p-6 pb-4 border-b border-white/10">
        <h3 className="text-white font-semibold text-sm font-mono mb-1">
          복합 인덱스 설계 — ESR 규칙
        </h3>
        <div className="flex gap-4 text-xs font-mono mt-2">
          {(["equality", "sort", "range"] as const).map((t) => (
            <span key={t} className={TYPE_CONFIG[t].color}>
              {TYPE_CONFIG[t].label}
            </span>
          ))}
        </div>
      </div>

      {/* scenario tabs */}
      <div className="flex border-b border-white/10">
        {SCENARIOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`px-4 py-2.5 text-xs font-mono transition-colors ${
              idx === i
                ? "text-white border-b-2 border-violet-500 bg-white/[0.04]"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {i === 0 ? "올바른 순서" : i === 1 ? "잘못된 순서" : "실전 예시"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="p-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* query */}
            <div>
              <p className="text-xs text-zinc-600 font-mono mb-2">쿼리</p>
              <div className="rounded-lg border border-white/10 bg-black/30 p-4 font-mono text-xs text-zinc-300 leading-relaxed">
                <pre>{s.query}</pre>
              </div>
            </div>

            {/* ESR columns */}
            <div className="overflow-hidden">
              <p className="text-xs text-zinc-600 font-mono mb-2">컬럼 역할 분류</p>
              <div className="space-y-2">
                {s.columns.map((col, i) => (
                  <motion.div
                    key={col.name}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${TYPE_CONFIG[col.type].bg}`}
                  >
                    <span className={`text-xs font-mono font-bold w-4 ${TYPE_CONFIG[col.type].color}`}>
                      {col.type[0].toUpperCase()}
                    </span>
                    <span className="text-white text-xs font-mono font-semibold flex-1">
                      {col.name}
                    </span>
                    <span className="text-zinc-500 text-xs font-mono truncate max-w-[160px]">{col.condition}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* index result */}
          <div className="mt-5 pt-5 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                <p className="text-xs text-zinc-600 font-mono mb-2">인덱스 설계</p>
                <div
                  className={`rounded-lg border p-3 font-mono text-xs ${
                    s.verdict === "good"
                      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                      : "border-rose-500/20 bg-rose-500/5 text-rose-300"
                  }`}
                >
                  INDEX ({s.index.join(", ")})
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-zinc-600 font-mono mb-2">결과</p>
                <p className="text-zinc-400 text-xs leading-relaxed">{s.explanation}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
