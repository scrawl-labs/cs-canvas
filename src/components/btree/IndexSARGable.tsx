"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface SARGCase {
  query: string;
  result: "hit" | "miss";
  reason: string;
  fix?: string;
  tag: string;
}

const CASES: SARGCase[] = [
  {
    tag: "함수 적용",
    query: "WHERE DATE(created_at) = '2025-02-01'",
    result: "miss",
    reason:
      "컬럼에 함수를 씌우면 B-Tree가 시작점을 계산할 수 없습니다. 모든 row에 DATE()를 적용해야 해서 Full Scan.",
    fix: "WHERE created_at >= '2025-02-01' AND created_at < '2025-02-02'",
  },
  {
    tag: "앞 와일드카드",
    query: "WHERE email LIKE '%kim'",
    result: "miss",
    reason:
      "앞에 %가 붙으면 B-Tree에서 어디서 시작해야 하는지 알 수 없습니다. 인덱스의 정렬 순서가 무의미해집니다.",
    fix: "WHERE email LIKE 'kim%'  -- 뒤 와일드카드는 range scan 가능",
  },
  {
    tag: "타입 불일치",
    query: "WHERE user_id = '100'   -- user_id: INT",
    result: "miss",
    reason:
      "INT 컬럼에 문자열 '100'을 비교하면 묵시적 형변환이 발생합니다. 모든 row마다 변환이 일어나 인덱스 무력화.",
    fix: "WHERE user_id = 100  -- 타입 맞추기",
  },
  {
    tag: "올바른 LIKE",
    query: "WHERE email LIKE 'kim%'",
    result: "hit",
    reason:
      "시작 문자열이 확정되면 B-Tree에서 'kim' 이상 'kin' 미만 범위로 range scan이 가능합니다.",
  },
  {
    tag: "등치 조건",
    query: "WHERE email = 'kim@example.com'",
    result: "hit",
    reason:
      "정확한 키 탐색. B-Tree를 O(log N)으로 탐색해 해당 리프 노드를 바로 찾습니다. EXPLAIN에서 type: ref.",
  },
  {
    tag: "범위 조건",
    query: "WHERE created_at >= '2025-01-01'",
    result: "hit",
    reason:
      "시작점이 명확하므로 B-Tree에서 range scan이 가능합니다. EXPLAIN에서 type: range.",
  },
];

export default function IndexSARGable() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = CASES[activeIdx];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="p-6 pb-4 border-b border-white/10">
        <h3 className="text-white font-semibold text-sm font-mono mb-1">
          인덱스가 타는/안 타는 이유 (SARGable)
        </h3>
        <p className="text-zinc-500 text-xs">
          B-Tree는 &quot;시작점&quot;을 알아야 탐색할 수 있습니다. 시작점을 망가뜨리는 패턴들.
        </p>
      </div>

      <div className="flex">
        {/* case list */}
        <div className="w-40 border-r border-white/10 shrink-0">
          {CASES.map((c, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`w-full text-left px-4 py-3 text-xs font-mono transition-colors flex items-center gap-2 ${
                activeIdx === i
                  ? "bg-white/[0.06] text-white"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                  c.result === "hit" ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
              {c.tag}
            </button>
          ))}
        </div>

        {/* detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="flex-1 p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
                  active.result === "hit"
                    ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                    : "text-rose-400 border-rose-500/30 bg-rose-500/10"
                }`}
              >
                {active.result === "hit" ? "인덱스 사용" : "인덱스 미사용"}
              </span>
              <span className="text-xs text-zinc-600 font-mono">{active.tag}</span>
            </div>

            {/* query */}
            <div
              className={`rounded-lg border p-3 mb-4 font-mono text-xs ${
                active.result === "hit"
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-rose-500/20 bg-rose-500/5"
              }`}
            >
              <pre className={active.result === "hit" ? "text-emerald-300" : "text-rose-300"}>
                {active.query}
              </pre>
            </div>

            {/* reason */}
            <p className="text-zinc-400 text-xs leading-relaxed mb-4">{active.reason}</p>

            {/* fix */}
            {active.fix && (
              <div>
                <p className="text-xs text-zinc-600 font-mono mb-1.5">올바른 작성법</p>
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 font-mono text-xs">
                  <pre className="text-emerald-300">{active.fix}</pre>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
