"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "undo-chain" | "rr-vs-rc";

interface UndoStep {
  id: number;
  title: string;
  target: "current" | "v2" | "v1";
  verdict: "invisible" | "visible";
  reason: string;
  result: string | null;
}

const UNDO_STEPS: UndoStep[] = [
  {
    id: 1,
    title: "현재 row 검사",
    target: "current",
    verdict: "invisible",
    reason: "trx_id=103, m_ids=[101,103]에 포함 → 아직 활성 트랜잭션. 안 보임.",
    result: null,
  },
  {
    id: 2,
    title: "undo v2 검사",
    target: "v2",
    verdict: "visible",
    reason: "trx_id=100, 100 < up_limit_id(101) → 커밋 완료. 보임.",
    result: "balance = 800",
  },
];

function ArrowRight() {
  return (
    <div className="flex items-center self-center">
      <div className="w-6 h-px bg-white/20" />
      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-white/20" />
    </div>
  );
}

interface VersionBoxProps {
  label: string;
  trxId: string | number;
  balance: number;
  rollPtr?: string;
  variant: "current" | "v2" | "v1";
  highlight: "active" | "found" | "dim" | "none";
}

function VersionBox({
  label,
  trxId,
  balance,
  rollPtr,
  variant,
  highlight,
}: VersionBoxProps) {
  const borderColor =
    highlight === "active"
      ? "border-rose-500/60"
      : highlight === "found"
        ? "border-emerald-500/60"
        : "border-white/10";

  const bgColor =
    highlight === "active"
      ? "bg-rose-500/10"
      : highlight === "found"
        ? "bg-emerald-500/10"
        : variant === "v1"
          ? "bg-zinc-900/60"
          : variant === "v2"
            ? "bg-amber-500/5"
            : "bg-rose-500/5";

  const labelColor =
    variant === "current"
      ? "text-rose-400"
      : variant === "v2"
        ? "text-amber-400"
        : "text-zinc-500";

  return (
    <div className="flex flex-col gap-1.5 items-center">
      <span className={`font-mono text-[10px] ${labelColor}`}>{label}</span>
      <div
        className={[
          "rounded-lg border px-3 py-2.5 min-w-[120px] transition-all duration-300",
          borderColor,
          bgColor,
        ].join(" ")}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] text-zinc-500">TRX_ID</span>
            <span className="font-mono text-xs text-zinc-200">{trxId}</span>
          </div>
          {rollPtr && (
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] text-zinc-500">ROLL_PTR</span>
              <span className="font-mono text-[10px] text-zinc-400">{rollPtr}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] text-zinc-500">balance</span>
            <span
              className={[
                "font-mono text-xs font-semibold",
                highlight === "found" ? "text-emerald-300" : "text-zinc-200",
              ].join(" ")}
            >
              {balance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function UndoChainTab() {
  const [step, setStep] = useState(0);

  const currentStep = UNDO_STEPS[step] ?? null;

  function getHighlight(target: VersionBoxProps["variant"]): VersionBoxProps["highlight"] {
    if (!currentStep) return "none";
    if (currentStep.target === target) {
      return currentStep.verdict === "visible" ? "found" : "active";
    }
    const stepIndex = UNDO_STEPS.findIndex((s) => s.target === target);
    const currentIndex = UNDO_STEPS.findIndex((s) => s.target === currentStep.target);
    return stepIndex < currentIndex ? "dim" : "none";
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="font-mono text-xs text-zinc-500 mb-4">
          Read View: m_ids=[101,103], up_limit_id=101, low_limit_id=105 / TRX=101 조회
        </p>

        <div className="flex items-start gap-1 overflow-x-auto pb-2">
          <VersionBox
            label="현재 (디스크)"
            trxId={103}
            balance={600}
            rollPtr="→undo"
            variant="current"
            highlight={step >= 0 ? getHighlight("current") : "none"}
          />
          <ArrowRight />
          <VersionBox
            label="undo v2"
            trxId={100}
            balance={800}
            rollPtr="→undo"
            variant="v2"
            highlight={step >= 1 ? getHighlight("v2") : "none"}
          />
          <ArrowRight />
          <VersionBox
            label="undo v1"
            trxId={0}
            balance={1000}
            variant="v1"
            highlight="none"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentStep && (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-500">
                Step {currentStep.id}
              </span>
              <span className="font-mono text-xs font-semibold text-zinc-200">
                {currentStep.title}
              </span>
              <span
                className={[
                  "ml-auto font-mono text-xs px-2 py-0.5 rounded-md",
                  currentStep.verdict === "visible"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-rose-500/15 text-rose-400",
                ].join(" ")}
              >
                {currentStep.verdict === "visible" ? "visible" : "invisible"}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {currentStep.reason}
            </p>
            {currentStep.result && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
                <span className="font-mono text-xs text-zinc-500">반환값 </span>
                <span className="font-mono text-sm font-semibold text-emerald-300">
                  {currentStep.result}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {UNDO_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={[
                "w-2 h-2 rounded-full transition-all duration-150",
                i === step ? "bg-rose-500" : i < step ? "bg-white/30" : "bg-white/10",
              ].join(" ")}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-600">
            {step + 1} / {UNDO_STEPS.length}
          </span>
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="font-mono text-xs px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            prev
          </button>
          <button
            onClick={() => setStep((s) => Math.min(UNDO_STEPS.length - 1, s + 1))}
            disabled={step === UNDO_STEPS.length - 1}
            className="font-mono text-xs px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            next
          </button>
        </div>
      </div>
    </div>
  );
}

interface TimelineEvent {
  label: string;
  highlight?: boolean;
  sub?: string;
}

interface IsolationColumn {
  title: string;
  accentColor: string;
  events: TimelineEvent[];
}

const RR_VS_RC_COLUMNS: IsolationColumn[] = [
  {
    title: "REPEATABLE READ",
    accentColor: "text-violet-400",
    events: [
      { label: "BEGIN" },
      { label: "Read View 생성", highlight: true, sub: "트랜잭션 시작 시 1회" },
      { label: "SELECT → 1000" },
      { label: "(T2: balance=800 커밋)", sub: "외부 변경" },
      {
        label: "SELECT → 1000",
        highlight: true,
        sub: "동일 Read View 재사용 → 이전 값 유지",
      },
    ],
  },
  {
    title: "READ COMMITTED",
    accentColor: "text-amber-400",
    events: [
      { label: "BEGIN" },
      { label: "SELECT → 1000" },
      { label: "Read View 생성", sub: "매 SELECT마다 새로 생성" },
      { label: "(T2: balance=800 커밋)", sub: "외부 변경" },
      {
        label: "SELECT → 800",
        highlight: true,
        sub: "새 Read View 생성 → 커밋된 값 보임",
      },
    ],
  },
];

function RRvsRCTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {RR_VS_RC_COLUMNS.map((col) => (
          <div
            key={col.title}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3"
          >
            <p className={`font-mono text-xs font-semibold ${col.accentColor}`}>
              {col.title}
            </p>
            <div className="relative flex flex-col gap-0">
              <div className="absolute left-[7px] top-0 bottom-0 w-px bg-white/10" />
              {col.events.map((ev, i) => (
                <div key={i} className="flex items-start gap-3 py-2">
                  <div
                    className={[
                      "mt-1 w-3.5 h-3.5 rounded-full border flex-shrink-0 z-10",
                      ev.highlight
                        ? "bg-rose-500/40 border-rose-500/60"
                        : "bg-white/[0.06] border-white/20",
                    ].join(" ")}
                  />
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={[
                        "font-mono text-xs",
                        ev.highlight ? "text-rose-300 font-semibold" : "text-zinc-300",
                      ].join(" ")}
                    >
                      {ev.label}
                    </span>
                    {ev.sub && (
                      <span className="text-[11px] text-zinc-500 leading-relaxed">
                        {ev.sub}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
        <p className="font-mono text-xs text-rose-400 mb-1">핵심 차이</p>
        <p className="text-xs text-zinc-300 leading-relaxed">
          RR은 BEGIN 시점의 스냅샷을 트랜잭션 내내 유지. RC는 SELECT마다 최신 커밋
          상태를 새로 스냅샷. RR이 Non-repeatable Read를 방지하는 이유가 여기 있음.
        </p>
      </div>
    </div>
  );
}

const TABS: { id: Tab; label: string }[] = [
  { id: "undo-chain", label: "Undo Chain" },
  { id: "rr-vs-rc", label: "RR vs RC" },
];

export default function MVCCInternals() {
  const [tab, setTab] = useState<Tab>("undo-chain");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              "font-mono text-xs px-3 py-1.5 rounded-lg border transition-all duration-150",
              tab === t.id
                ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
                : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {tab === "undo-chain" ? <UndoChainTab /> : <RRvsRCTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
