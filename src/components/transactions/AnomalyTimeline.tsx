"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Actor = "T1" | "T2" | "both";

interface Step {
  actor: Actor;
  t1Sql: string | null;
  t2Sql: string | null;
  t1View: string;
  isAnomaly: boolean;
  note: string;
}

interface Scenario {
  id: string;
  label: string;
  conclusion: string;
  steps: Step[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "dirty-read",
    label: "Dirty Read",
    conclusion:
      'T1이 읽은 500은 실제로 존재하지 않았던 값. "Dirty = 더러운(미커밋) 데이터"',
    steps: [
      {
        actor: "T1",
        t1Sql: "BEGIN",
        t2Sql: null,
        t1View: "balance = 1000",
        isAnomaly: false,
        note: "T1 트랜잭션 시작. 현재 잔액 1000.",
      },
      {
        actor: "T2",
        t1Sql: null,
        t2Sql: "BEGIN\nUPDATE accounts\n  SET balance = 500\n  WHERE id = 1\n-- 미커밋",
        t1View: "(아직 읽기 전)",
        isAnomaly: false,
        note: "T2가 balance를 500으로 수정했지만 아직 커밋하지 않음.",
      },
      {
        actor: "T1",
        t1Sql: "SELECT balance\n  FROM accounts\n  WHERE id = 1\n-- → 500 (미커밋 값!)",
        t2Sql: null,
        t1View: "500",
        isAnomaly: true,
        note: "T1이 T2의 미커밋 변경 값을 읽어버림.",
      },
      {
        actor: "T2",
        t1Sql: null,
        t2Sql: "ROLLBACK",
        t1View: "500 (실제론 1000이어야 함)",
        isAnomaly: true,
        note: "T2가 롤백. 실제 DB는 다시 1000이지만 T1은 이미 500을 읽었음.",
      },
    ],
  },
  {
    id: "non-repeatable",
    label: "Non-repeatable Read",
    conclusion:
      "같은 row를 두 번 읽었는데 값이 달라짐. Repeatable하지 않음.",
    steps: [
      {
        actor: "T1",
        t1Sql: "BEGIN\nSELECT balance\n  FROM accounts\n  WHERE id = 1\n-- → 1000",
        t2Sql: null,
        t1View: "1000",
        isAnomaly: false,
        note: "T1이 처음 balance를 조회. 1000 확인.",
      },
      {
        actor: "T2",
        t1Sql: null,
        t2Sql: "BEGIN\nUPDATE accounts\n  SET balance = 500\n  WHERE id = 1\nCOMMIT",
        t1View: "(T2 커밋 완료)",
        isAnomaly: false,
        note: "T2가 balance를 500으로 수정하고 커밋 완료.",
      },
      {
        actor: "T1",
        t1Sql: "SELECT balance\n  FROM accounts\n  WHERE id = 1\n-- → 500 (다른 값!)",
        t2Sql: null,
        t1View: "500",
        isAnomaly: true,
        note: "같은 쿼리를 다시 실행했는데 결과가 달라짐.",
      },
    ],
  },
  {
    id: "phantom",
    label: "Phantom Read",
    conclusion:
      "유령처럼 없던 row가 나타남. Non-repeatable Read와 달리 기존 row가 아니라 새 row의 추가/삭제.",
    steps: [
      {
        actor: "T1",
        t1Sql: "BEGIN\nSELECT COUNT(*)\n  FROM orders\n  WHERE amount > 100\n-- → 3",
        t2Sql: null,
        t1View: "3건",
        isAnomaly: false,
        note: "T1이 조건에 맞는 주문 수를 조회. 3건 확인.",
      },
      {
        actor: "T2",
        t1Sql: null,
        t2Sql: "BEGIN\nINSERT INTO orders(amount)\n  VALUES(150)\nCOMMIT",
        t1View: "(T2 커밋)",
        isAnomaly: false,
        note: "T2가 새 주문(amount=150)을 삽입하고 커밋.",
      },
      {
        actor: "T1",
        t1Sql: "SELECT COUNT(*)\n  FROM orders\n  WHERE amount > 100\n-- → 4 (row 수 증가!)",
        t2Sql: null,
        t1View: "4건",
        isAnomaly: true,
        note: "같은 범위 쿼리인데 결과 row 수가 달라짐.",
      },
    ],
  },
];

export default function AnomalyTimeline() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  const scenario = SCENARIOS[scenarioIdx];
  const currentStep = scenario.steps[stepIdx];
  const visibleSteps = scenario.steps.slice(0, stepIdx + 1);

  function handleScenarioChange(idx: number) {
    setScenarioIdx(idx);
    setStepIdx(0);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => handleScenarioChange(i)}
            className={[
              "font-mono text-xs px-3 py-1.5 rounded-lg border transition-all duration-150",
              scenarioIdx === i
                ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
                : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]",
            ].join(" ")}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-4 min-w-0">
          <div className="flex gap-0 mb-4">
            <div className="flex-1 text-center">
              <span className="font-mono text-xs text-violet-400">T1</span>
            </div>
            <div className="w-6" />
            <div className="flex-1 text-center">
              <span className="font-mono text-xs text-amber-400">T2</span>
            </div>
          </div>

          <div className="relative flex flex-col gap-0">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

            {visibleSteps.map((step, i) => {
              const isCurrent = i === stepIdx;
              const isPast = i < stepIdx;

              return (
                <motion.div
                  key={`${scenarioIdx}-${i}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: isPast ? 0.35 : 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-0 items-start py-2"
                >
                  <div className="flex-1 flex justify-end pr-4">
                    {(step.actor === "T1" || step.actor === "both") &&
                    step.t1Sql ? (
                      <div
                        className={[
                          "rounded-lg border px-3 py-2 max-w-[180px]",
                          isCurrent
                            ? "border-violet-500/50 bg-violet-500/10"
                            : "border-white/10 bg-white/[0.02]",
                        ].join(" ")}
                      >
                        <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                          {step.t1Sql}
                        </pre>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end w-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      </div>
                    )}
                  </div>

                  <div className="w-6 flex items-center justify-center pt-2">
                    <div
                      className={[
                        "w-2 h-2 rounded-full border",
                        isCurrent
                          ? step.isAnomaly
                            ? "bg-rose-500 border-rose-400"
                            : "bg-white/60 border-white/40"
                          : "bg-white/10 border-white/10",
                      ].join(" ")}
                    />
                  </div>

                  <div className="flex-1 pl-4">
                    {(step.actor === "T2" || step.actor === "both") &&
                    step.t2Sql ? (
                      <div
                        className={[
                          "rounded-lg border px-3 py-2 max-w-[180px]",
                          isCurrent
                            ? "border-amber-500/50 bg-amber-500/10"
                            : "border-white/10 bg-white/[0.02]",
                        ].join(" ")}
                      >
                        <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                          {step.t2Sql}
                        </pre>
                      </div>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10 mt-2" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="w-52 flex-shrink-0 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${scenarioIdx}-${stepIdx}`}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3"
            >
              <div>
                <p className="font-mono text-xs text-zinc-500 mb-2">
                  T1이 보는 값
                </p>
                <div
                  className={[
                    "rounded-lg border px-3 py-2",
                    currentStep.isAnomaly
                      ? "border-rose-500/40 bg-rose-500/10"
                      : "border-white/10 bg-white/[0.04]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "font-mono text-sm font-semibold",
                      currentStep.isAnomaly ? "text-rose-300" : "text-zinc-200",
                    ].join(" ")}
                  >
                    {currentStep.t1View}
                  </span>
                </div>
              </div>

              {currentStep.isAnomaly && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex self-start items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/20 border border-rose-500/30"
                >
                  <span className="font-mono text-xs font-bold text-rose-400">
                    ANOMALY
                  </span>
                </motion.div>
              )}

              <p className="text-xs text-zinc-400 leading-relaxed">
                {currentStep.note}
              </p>
            </motion.div>
          </AnimatePresence>

          {stepIdx === scenario.steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <p className="font-mono text-xs text-zinc-500 mb-1.5">결론</p>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {scenario.conclusion}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {scenario.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStepIdx(i)}
              className={[
                "w-2 h-2 rounded-full transition-all duration-150",
                i === stepIdx
                  ? "bg-rose-500"
                  : i < stepIdx
                    ? "bg-white/30"
                    : "bg-white/10",
              ].join(" ")}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-600">
            {stepIdx + 1} / {scenario.steps.length}
          </span>
          <button
            onClick={() => setStepIdx((s) => Math.max(0, s - 1))}
            disabled={stepIdx === 0}
            className="font-mono text-xs px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            prev
          </button>
          <button
            onClick={() =>
              setStepIdx((s) => Math.min(scenario.steps.length - 1, s + 1))
            }
            disabled={stepIdx === scenario.steps.length - 1}
            className="font-mono text-xs px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            next
          </button>
        </div>
      </div>
    </div>
  );
}
