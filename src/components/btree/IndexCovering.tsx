"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type Mode = "normal" | "covering";

export default function IndexCovering() {
  const [mode, setMode] = useState<Mode>("normal");

  const steps = {
    normal: [
      { label: "① Index B-Tree 탐색", sublabel: "email = 'kim@...' → PK = 583 발견", mem: true },
      { label: "② Table Lookup (Random I/O)", sublabel: "PK 583으로 실제 테이블 페이지 접근", mem: false, highlight: true },
      { label: "③ Row 반환", sublabel: "SELECT * — 모든 컬럼 가져옴", mem: false },
    ],
    covering: [
      { label: "① Index B-Tree 탐색", sublabel: "email = 'kim@...' — 인덱스에 모든 컬럼 있음", mem: true },
      { label: "② 끝", sublabel: "Table Lookup 없음. Using index", mem: true, highlight: true },
    ],
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="p-6 pb-4 border-b border-white/10">
        <h3 className="text-white font-semibold text-sm font-mono mb-1">
          Covering Index — Table Lookup 제거
        </h3>
        <p className="text-zinc-500 text-xs">
          SELECT/WHERE/ORDER BY에 필요한 모든 컬럼이 인덱스에 있으면 테이블 접근을 건너뜁니다.
        </p>
      </div>

      {/* toggle */}
      <div className="flex border-b border-white/10">
        {(["normal", "covering"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-5 py-2.5 text-xs font-mono transition-colors ${
              mode === m
                ? "text-white border-b-2 border-sky-500 bg-white/[0.04]"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {m === "normal" ? "일반 인덱스" : "커버링 인덱스"}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* query */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-zinc-600 font-mono mb-2">쿼리</p>
            <div className="rounded-lg border border-white/10 bg-black/30 p-3 font-mono text-xs text-zinc-300">
              {mode === "normal" ? (
                <pre>{`SELECT *
FROM users
WHERE email = 'kim@example.com'`}</pre>
              ) : (
                <pre>{`SELECT email, status
FROM users
WHERE status = 'ACTIVE'
-- INDEX (status, email)`}</pre>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs text-zinc-600 font-mono mb-2">EXPLAIN Extra</p>
            <div
              className={`rounded-lg border p-3 font-mono text-xs ${
                mode === "covering"
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                  : "border-white/10 bg-black/30 text-zinc-400"
              }`}
            >
              {mode === "normal" ? "Using where" : "Using index  ← 핵심"}
            </div>
          </div>
        </div>

        {/* flow */}
        <p className="text-xs text-zinc-600 font-mono mb-3">실행 경로</p>
        <div className="space-y-2">
          {steps[mode].map((step, i) => (
            <motion.div
              key={`${mode}-${i}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-start gap-3 rounded-lg border p-3 ${
                step.highlight
                  ? mode === "covering"
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-rose-500/20 bg-rose-500/5"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                  step.mem ? "bg-violet-500/20 text-violet-400" : "bg-white/10 text-zinc-500"
                }`}
              >
                {i + 1}
              </div>
              <div>
                <p
                  className={`text-xs font-semibold ${
                    step.highlight
                      ? mode === "covering"
                        ? "text-emerald-400"
                        : "text-rose-400"
                      : "text-white"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-zinc-500 text-xs mt-0.5">{step.sublabel}</p>
              </div>
              {step.mem && (
                <span className="ml-auto text-xs font-mono text-violet-400/70 border border-violet-500/20 rounded px-1.5 py-0.5 shrink-0">
                  memory
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* summary */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-3">
          {[
            { label: "Table Access", normal: "발생 (Random I/O)", covering: "없음" },
            { label: "읽기 성능", normal: "보통", covering: "매우 빠름" },
            { label: "EXPLAIN", normal: "Using where", covering: "Using index" },
          ].map((row) => (
            <div key={row.label} className="text-center">
              <p className="text-zinc-600 text-xs mb-1.5">{row.label}</p>
              <p
                className={`text-xs font-mono ${
                  mode === "covering" ? "text-emerald-400" : "text-zinc-400"
                }`}
              >
                {mode === "covering" ? row.covering : row.normal}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
