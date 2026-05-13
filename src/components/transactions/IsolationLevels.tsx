"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Level = "RU" | "RC" | "RR" | "SER";
type Anomaly = "dirty" | "nonRepeatable" | "phantom";

interface LevelDef {
  id: Level;
  name: string;
  short: string;
  prevents: Record<Anomaly, boolean>;
  cost: number;
  defaultIn?: string;
}

const LEVELS: LevelDef[] = [
  {
    id: "RU",
    name: "READ UNCOMMITTED",
    short: "RU",
    prevents: { dirty: false, nonRepeatable: false, phantom: false },
    cost: 1,
  },
  {
    id: "RC",
    name: "READ COMMITTED",
    short: "RC",
    prevents: { dirty: true, nonRepeatable: false, phantom: false },
    cost: 2,
    defaultIn: "PostgreSQL",
  },
  {
    id: "RR",
    name: "REPEATABLE READ",
    short: "RR",
    prevents: { dirty: true, nonRepeatable: true, phantom: true },
    cost: 3,
    defaultIn: "MySQL InnoDB (Gap Lock으로 Phantom 방지)",
  },
  {
    id: "SER",
    name: "SERIALIZABLE",
    short: "SER",
    prevents: { dirty: true, nonRepeatable: true, phantom: true },
    cost: 4,
  },
];

const ANOMALIES: { id: Anomaly; label: string; desc: string }[] = [
  { id: "dirty", label: "Dirty Read", desc: "미커밋 데이터 읽기" },
  {
    id: "nonRepeatable",
    label: "Non-repeatable Read",
    desc: "같은 row 재읽기 시 값 변경",
  },
  { id: "phantom", label: "Phantom Read", desc: "같은 쿼리에 row 수 변화" },
];

const LEVEL_DESC: Record<Level, string> = {
  RU: "락 없이 최신 값 읽음. 미커밋 데이터도 보임.",
  RC: "커밋된 데이터만 읽음. SELECT마다 새 Read View 생성.",
  RR: "트랜잭션 시작 시 Read View 1회 생성. MySQL은 갭락으로 Phantom까지 방지.",
  SER: "모든 읽기에 공유락. 완전한 직렬화. 처리량이 가장 낮음.",
};

export default function IsolationLevels() {
  const [selected, setSelected] = useState<Level>("RC");

  const level = LEVELS.find((l) => l.id === selected)!;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelected(l.id)}
            className={[
              "flex flex-col items-center px-4 py-2.5 rounded-xl border transition-all duration-150",
              selected === l.id
                ? "bg-rose-500/15 border-rose-500/50 text-rose-300"
                : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]",
            ].join(" ")}
          >
            <span className="font-mono text-sm font-semibold">{l.short}</span>
            {l.defaultIn && (
              <span
                className={[
                  "font-mono text-[10px] mt-0.5 px-1.5 py-0.5 rounded",
                  selected === l.id
                    ? "bg-rose-500/20 text-rose-400"
                    : "bg-white/[0.05] text-zinc-500",
                ].join(" ")}
              >
                default
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-2">
          <p className="font-mono text-xs text-zinc-500 mb-1">이상현상 방지 여부</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-2"
            >
              {ANOMALIES.map((a) => {
                const prevented = level.prevents[a.id];
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-xs text-zinc-200">
                        {a.label}
                      </span>
                      <span className="text-[11px] text-zinc-500">{a.desc}</span>
                    </div>
                    <div
                      className={[
                        "flex items-center gap-1.5 px-2 py-1 rounded-md font-mono text-xs font-semibold",
                        prevented
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-rose-500/15 text-rose-400",
                      ].join(" ")}
                    >
                      <span>{prevented ? "방지" : "발생 가능"}</span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-4"
          >
            <div>
              <p className="font-mono text-xs text-zinc-500 mb-1">구현 방식</p>
              <p className="font-mono text-sm font-semibold text-rose-300 mb-2">
                {level.name}
              </p>
              {level.defaultIn && (
                <p className="font-mono text-[11px] text-zinc-500 mb-3">
                  기본값: {level.defaultIn}
                </p>
              )}
              <p className="text-xs text-zinc-300 leading-relaxed">
                {LEVEL_DESC[selected]}
              </p>
            </div>

            <div>
              <p className="font-mono text-xs text-zinc-500 mb-2">처리량 (상대적)</p>
              <div className="flex flex-col gap-1.5">
                {LEVELS.map((l) => {
                  const isSelected = l.id === selected;
                  const throughput = 5 - l.cost;
                  return (
                    <div key={l.id} className="flex items-center gap-2">
                      <span
                        className={[
                          "font-mono text-[11px] w-8 text-right",
                          isSelected ? "text-rose-400" : "text-zinc-500",
                        ].join(" ")}
                      >
                        {l.short}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(throughput / 4) * 100}%`,
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className={[
                            "h-full rounded-full",
                            isSelected ? "bg-rose-500" : "bg-white/20",
                          ].join(" ")}
                        />
                      </div>
                      <span
                        className={[
                          "font-mono text-[11px] w-12",
                          isSelected ? "text-rose-400" : "text-zinc-600",
                        ].join(" ")}
                      >
                        {throughput === 4
                          ? "최고"
                          : throughput === 3
                            ? "높음"
                            : throughput === 2
                              ? "보통"
                              : "낮음"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
