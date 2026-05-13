"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

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

const KO = {
  header: "복합 인덱스 설계 — ESR 규칙",
  typeLabels: {
    equality: "E — Equality",
    sort: "S — Sort",
    range: "R — Range",
  },
  tabLabels: ["올바른 순서", "잘못된 순서", "실전 예시"],
  queryLabel: "쿼리",
  columnsLabel: "컬럼 역할 분류",
  indexLabel: "인덱스 설계",
  resultLabel: "결과",
  scenarios: [
    {
      title: "ESR 올바른 순서",
      query: `SELECT *
FROM orders
WHERE user_id = 100        -- E
  AND status = 'DONE'      -- E
ORDER BY created_at DESC   -- S
LIMIT 20`,
      columns: [
        { name: "user_id", type: "equality" as const, condition: "= 100" },
        { name: "status", type: "equality" as const, condition: "= 'DONE'" },
        { name: "created_at", type: "sort" as const, condition: "ORDER BY DESC" },
      ],
      index: ["user_id", "status", "created_at"],
      verdict: "good" as const,
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
        { name: "user_id", type: "equality" as const, condition: "= 100" },
        { name: "created_at", type: "range" as const, condition: ">= '2025-01'" },
        { name: "status", type: "sort" as const, condition: "ORDER BY" },
      ],
      index: ["user_id", "created_at", "status"],
      verdict: "bad" as const,
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
        { name: "user_id", type: "equality" as const, condition: "= ?" },
        { name: "status", type: "equality" as const, condition: "= 'DONE'" },
        { name: "created_at", type: "range" as const, condition: ">= NOW()-7d" },
      ],
      index: ["user_id", "status", "created_at"],
      verdict: "good" as const,
      explanation:
        "Equality 두 개로 데이터를 최대로 좁힌 후 Range. created_at을 앞에 두면 날짜 범위가 모든 유저를 포함해 선택도가 나빠집니다.",
    },
  ] as ESRScenario[],
};

const EN = {
  header: "Composite Index Design — ESR Rule",
  typeLabels: {
    equality: "E — Equality",
    sort: "S — Sort",
    range: "R — Range",
  },
  tabLabels: ["Correct Order", "Wrong Order", "Real Example"],
  queryLabel: "Query",
  columnsLabel: "Column Role Classification",
  indexLabel: "Index Design",
  resultLabel: "Result",
  scenarios: [
    {
      title: "Correct ESR Order",
      query: `SELECT *
FROM orders
WHERE user_id = 100        -- E
  AND status = 'DONE'      -- E
ORDER BY created_at DESC   -- S
LIMIT 20`,
      columns: [
        { name: "user_id", type: "equality" as const, condition: "= 100" },
        { name: "status", type: "equality" as const, condition: "= 'DONE'" },
        { name: "created_at", type: "sort" as const, condition: "ORDER BY DESC" },
      ],
      index: ["user_id", "status", "created_at"],
      verdict: "good" as const,
      explanation:
        "Narrow with Equality first → secure sort order with Sort → handle LIMIT without filesort. One index traversal is enough.",
    },
    {
      title: "Range Before Sort",
      query: `SELECT *
FROM orders
WHERE user_id = 100           -- E
  AND created_at >= '2025-01' -- R (Range first)
ORDER BY status               -- S (after Range, sort can't use index)
LIMIT 20`,
      columns: [
        { name: "user_id", type: "equality" as const, condition: "= 100" },
        { name: "created_at", type: "range" as const, condition: ">= '2025-01'" },
        { name: "status", type: "sort" as const, condition: "ORDER BY" },
      ],
      index: ["user_id", "created_at", "status"],
      verdict: "bad" as const,
      explanation:
        "Columns after a Range condition (created_at) are not guaranteed to be index-sorted. Filesort occurs for the status ORDER BY.",
    },
    {
      title: "Q2-5 Practice: Recent Orders",
      query: `-- "Completed orders for a specific user in the past week"
SELECT *
FROM orders
WHERE user_id = ?            -- E
  AND status = 'DONE'        -- E
  AND created_at >= NOW()-7d -- R`,
      columns: [
        { name: "user_id", type: "equality" as const, condition: "= ?" },
        { name: "status", type: "equality" as const, condition: "= 'DONE'" },
        { name: "created_at", type: "range" as const, condition: ">= NOW()-7d" },
      ],
      index: ["user_id", "status", "created_at"],
      verdict: "good" as const,
      explanation:
        "Narrow the data as much as possible with two Equality conditions, then apply Range. Putting created_at first would include all users in the date range, reducing selectivity.",
    },
  ] as ESRScenario[],
};

const TYPE_CONFIG = {
  equality: { color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/30" },
  sort:     { color: "text-sky-400",    bg: "bg-sky-500/10 border-sky-500/30" },
  range:    { color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/30" },
};

export default function IndexESR() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  const [idx, setIdx] = useState(0);
  const s = t.scenarios[idx];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="p-6 pb-4 border-b border-white/10">
        <h3 className="text-white font-semibold text-sm font-mono mb-1">
          {t.header}
        </h3>
        <div className="flex gap-4 text-xs font-mono mt-2">
          {(["equality", "sort", "range"] as const).map((type) => (
            <span key={type} className={TYPE_CONFIG[type].color}>
              {t.typeLabels[type]}
            </span>
          ))}
        </div>
      </div>

      {/* scenario tabs */}
      <div className="flex border-b border-white/10">
        {t.scenarios.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`px-4 py-2.5 text-xs font-mono transition-colors ${
              idx === i
                ? "text-white border-b-2 border-violet-500 bg-white/[0.04]"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t.tabLabels[i]}
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
              <p className="text-xs text-zinc-600 font-mono mb-2">{t.queryLabel}</p>
              <div className="rounded-lg border border-white/10 bg-black/30 p-4 font-mono text-xs text-zinc-300 leading-relaxed">
                <pre>{s.query}</pre>
              </div>
            </div>

            {/* ESR columns */}
            <div className="overflow-hidden">
              <p className="text-xs text-zinc-600 font-mono mb-2">{t.columnsLabel}</p>
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
                <p className="text-xs text-zinc-600 font-mono mb-2">{t.indexLabel}</p>
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
                <p className="text-xs text-zinc-600 font-mono mb-2">{t.resultLabel}</p>
                <p className="text-zinc-400 text-xs leading-relaxed">{s.explanation}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
