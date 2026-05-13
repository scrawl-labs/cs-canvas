"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "range" | "deadlock";
type LockType = "row" | "gap" | "next-key";

const KEYS = [null, 5, 8, 10, 15, 20, 25, null] as const;
const KEY_LABELS = ["(-∞)", "5", "8", "10", "15", "20", "25", "(+∞)"];

interface LockConfig {
  label: string;
  query: string;
  description: string;
  overlay: { type: "record"; index: number } | { type: "gap"; from: number; to: number } | { type: "next-key"; from: number; to: number };
  color: "rose" | "amber" | "violet";
}

const LOCK_CONFIGS: Record<LockType, LockConfig> = {
  row: {
    label: "Row Lock",
    query: "SELECT * FROM t WHERE id = 15 FOR UPDATE;",
    description: "id=15 레코드 하나만 잠금. 삽입 차단 없음.",
    overlay: { type: "record", index: 4 },
    color: "rose",
  },
  gap: {
    label: "Gap Lock",
    query: "SELECT * FROM t WHERE id > 15 AND id < 20 FOR UPDATE;",
    description: "15~20 사이 공간 잠금. 새 row 삽입 차단. 기존 레코드는 무관.",
    overlay: { type: "gap", from: 4, to: 5 },
    color: "amber",
  },
  "next-key": {
    label: "Next-Key Lock",
    query: "SELECT * FROM t WHERE id <= 15 AND id > 10 FOR UPDATE;",
    description: "10 < id ≤ 15 구간 전체 잠금. InnoDB RR 기본 동작.",
    overlay: { type: "next-key", from: 3, to: 4 },
    color: "violet",
  },
};

const DEADLOCK_STEPS = [
  {
    id: 1,
    t1: { action: "LOCK row id=10", status: "acquired" as const },
    t2: { action: null, status: "idle" as const },
    rowA: "t1",
    rowB: null,
    banner: null,
  },
  {
    id: 2,
    t1: { action: "LOCK row id=10", status: "acquired" as const },
    t2: { action: "LOCK row id=20", status: "acquired" as const },
    rowA: "t1",
    rowB: "t2",
    banner: null,
  },
  {
    id: 3,
    t1: { action: "LOCK row id=20", status: "waiting" as const },
    t2: { action: "LOCK row id=20", status: "acquired" as const },
    rowA: "t1",
    rowB: "t2",
    banner: null,
  },
  {
    id: 4,
    t1: { action: "LOCK row id=20", status: "waiting" as const },
    t2: { action: "LOCK row id=10", status: "waiting" as const },
    rowA: "t1",
    rowB: "t2",
    banner: "deadlock",
  },
  {
    id: 5,
    t1: { action: "진행 중", status: "acquired" as const },
    t2: { action: "ROLLBACK", status: "rolled-back" as const },
    rowA: "t1",
    rowB: null,
    banner: "resolved",
  },
];

function KeyBox({ label, highlight, color }: { label: string; highlight: boolean; color?: "rose" | "amber" | "violet" }) {
  const colorMap = {
    rose: "bg-rose-500/30 border-rose-400 text-rose-300",
    amber: "bg-amber-500/20 border-amber-400 text-amber-300",
    violet: "bg-violet-500/30 border-violet-400 text-violet-300",
  };

  return (
    <div className={`relative flex flex-col items-center gap-1`}>
      <motion.div
        animate={highlight && color ? { scale: 1.05 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`w-12 h-10 flex items-center justify-center border rounded font-mono text-sm transition-colors duration-300 ${
          highlight && color
            ? colorMap[color]
            : "border-white/20 bg-white/[0.03] text-zinc-300"
        }`}
      >
        {label}
      </motion.div>
    </div>
  );
}

function LockRangeTab() {
  const [selected, setSelected] = useState<LockType>("row");
  const config = LOCK_CONFIGS[selected];

  const isHighlighted = (index: number) => {
    const o = config.overlay;
    if (o.type === "record") return index === o.index;
    if (o.type === "gap") return index === o.from || index === o.to;
    if (o.type === "next-key") return index === o.from || index === o.to;
    return false;
  };

  const getGapOverlay = () => {
    const o = config.overlay;
    if (o.type === "gap" || o.type === "next-key") {
      return { from: o.from, to: o.to };
    }
    return null;
  };

  const gap = getGapOverlay();

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {(["row", "gap", "next-key"] as LockType[]).map((t) => (
          <button
            key={t}
            onClick={() => setSelected(t)}
            className={`px-3 py-1.5 rounded font-mono text-xs border transition-colors ${
              selected === t
                ? t === "row"
                  ? "bg-rose-500/20 border-rose-400 text-rose-300"
                  : t === "gap"
                  ? "bg-amber-500/20 border-amber-400 text-amber-300"
                  : "bg-violet-500/20 border-violet-400 text-violet-300"
                : "border-white/10 text-zinc-400 hover:border-white/20"
            }`}
          >
            {LOCK_CONFIGS[t].label}
          </button>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-lg p-4">
        <p className="text-xs text-zinc-500 mb-1">쿼리 예시</p>
        <pre className="font-mono text-xs text-emerald-400">{config.query}</pre>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between px-2 relative">
          {gap && (
            <motion.div
              key={selected}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className={`absolute top-0 bottom-0 rounded pointer-events-none ${
                config.color === "amber"
                  ? "bg-amber-500/15 border border-amber-500/30"
                  : "bg-violet-500/15 border border-violet-500/30"
              }`}
              style={{
                left: `${(gap.from / (KEY_LABELS.length - 1)) * 100}%`,
                right: `${((KEY_LABELS.length - 1 - gap.to) / (KEY_LABELS.length - 1)) * 100}%`,
              }}
            />
          )}

          {KEY_LABELS.map((label, i) => (
            <KeyBox
              key={label}
              label={label}
              highlight={isHighlighted(i)}
              color={config.color}
            />
          ))}
        </div>

        {gap && config.color === "amber" && (
          <div className="mt-3 flex justify-center">
            <span className="text-xs text-amber-400 border border-amber-500/30 bg-amber-500/10 px-3 py-1 rounded font-mono">
              새 row 삽입 차단
            </span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="text-sm text-zinc-400"
        >
          {config.description}
        </motion.div>
      </AnimatePresence>

      <div className="border border-rose-500/30 bg-rose-500/[0.06] rounded-lg p-4">
        <p className="text-xs font-mono text-rose-400 mb-1">주의</p>
        <p className="text-xs text-zinc-400">
          인덱스 없는 컬럼의 WHERE 조건으로 UPDATE/SELECT FOR UPDATE 시 → 전체 레코드 + 갭에 락 적용 → 사실상 테이블 락.
          반드시 인덱스 컬럼을 사용할 것.
        </p>
      </div>
    </div>
  );
}

function DeadlockTab() {
  const [step, setStep] = useState(0);
  const current = DEADLOCK_STEPS[step];

  const statusStyle = (status: string) => {
    if (status === "acquired") return "border-violet-400 bg-violet-500/20 text-violet-300";
    if (status === "waiting") return "border-amber-400 bg-amber-500/10 text-amber-300 border-dashed";
    if (status === "rolled-back") return "border-zinc-600 bg-zinc-800/40 text-zinc-500 opacity-50";
    return "border-white/10 bg-white/[0.02] text-zinc-500";
  };

  return (
    <div className="space-y-6">
      <div className="text-xs text-zinc-500 font-mono">
        시나리오: T1이 row A(id=10) 락 후 row B(id=20) 대기, T2는 반대 순서 시도
      </div>

      <div className="relative grid grid-cols-3 gap-4 items-start">
        <div className="space-y-3">
          <div className="text-center text-xs font-mono text-violet-400 border border-violet-500/30 rounded px-2 py-1">
            Transaction T1
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`t1-${step}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`border rounded p-3 font-mono text-xs text-center ${statusStyle(current.t1.status)}`}
            >
              {current.t1.action ?? "—"}
              {current.t1.status === "waiting" && (
                <span className="block text-amber-400 mt-1">waiting...</span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-3 pt-8">
          <motion.div
            animate={current.rowA === "t1" ? { borderColor: "rgb(167 139 250)" } : { borderColor: "rgba(255,255,255,0.1)" }}
            className="border-2 rounded-lg px-3 py-2 font-mono text-xs text-zinc-300 text-center transition-colors bg-white/[0.03]"
          >
            row A<br />id=10
          </motion.div>
          <motion.div
            animate={current.rowB === "t2" ? { borderColor: "rgb(251 191 36)" } : current.rowB === "t1" ? { borderColor: "rgb(167 139 250)" } : { borderColor: "rgba(255,255,255,0.1)" }}
            className="border-2 rounded-lg px-3 py-2 font-mono text-xs text-zinc-300 text-center transition-colors bg-white/[0.03]"
          >
            row B<br />id=20
          </motion.div>
        </div>

        <div className="space-y-3">
          <div className="text-center text-xs font-mono text-amber-400 border border-amber-500/30 rounded px-2 py-1">
            Transaction T2
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`t2-${step}`}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`border rounded p-3 font-mono text-xs text-center ${statusStyle(current.t2.status)}`}
            >
              {current.t2.action ?? "—"}
              {current.t2.status === "waiting" && (
                <span className="block text-amber-400 mt-1">waiting...</span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {current.banner === "deadlock" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="border border-rose-500 bg-rose-500/10 rounded-lg p-3 text-center font-mono text-sm text-rose-400"
          >
            Deadlock Detected — InnoDB가 victim 선정 중
          </motion.div>
        )}
        {current.banner === "resolved" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="border border-emerald-500/50 bg-emerald-500/10 rounded-lg p-3 text-center font-mono text-sm text-emerald-400"
          >
            T2 ROLLBACK 완료 (undo 더 적은 트랜잭션) — T1 계속 진행
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-4 py-1.5 rounded border border-white/10 text-xs text-zinc-400 disabled:opacity-30 hover:border-white/20 transition-colors font-mono"
        >
          prev
        </button>

        <div className="flex gap-2">
          {DEADLOCK_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? "bg-rose-500" : "bg-white/20"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setStep((s) => Math.min(DEADLOCK_STEPS.length - 1, s + 1))}
          disabled={step === DEADLOCK_STEPS.length - 1}
          className="px-4 py-1.5 rounded border border-white/10 text-xs text-zinc-400 disabled:opacity-30 hover:border-white/20 transition-colors font-mono"
        >
          next
        </button>
      </div>

      <div className="text-xs text-zinc-500 font-mono text-center">
        Step {step + 1} / {DEADLOCK_STEPS.length}
      </div>
    </div>
  );
}

export default function LockTypes() {
  const [tab, setTab] = useState<Tab>("range");

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-6">
      <div>
        <h2 className="font-mono text-lg text-zinc-100">Lock Types</h2>
        <p className="text-sm text-zinc-500 mt-1">Row / Gap / Next-Key Lock 범위와 Deadlock 시나리오</p>
      </div>

      <div className="flex gap-1 border-b border-white/10 pb-0">
        {(["range", "deadlock"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-mono border-b-2 transition-colors ${
              tab === t
                ? "border-rose-500 text-zinc-100"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t === "range" ? "락 범위" : "Deadlock"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "range" ? <LockRangeTab /> : <DeadlockTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
