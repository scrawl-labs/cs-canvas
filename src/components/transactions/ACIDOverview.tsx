"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AcidColor = "violet" | "sky" | "amber" | "emerald";

interface AcidProperty {
  letter: string;
  name: string;
  color: AcidColor;
  tagline: string;
  failureScenario: string;
  mechanism: string;
  mechanismDetail: string;
}

const ACID_PROPERTIES: AcidProperty[] = [
  {
    letter: "A",
    name: "Atomicity",
    color: "violet",
    tagline: "전부 아니면 전무",
    failureScenario:
      "송금 중 A 계좌에서 10만원이 차감됐는데 크래시. B 계좌엔 미입금. 돈이 사라짐.",
    mechanism: "Undo Log",
    mechanismDetail:
      "트랜잭션이 롤백되면 undo log에 저장된 이전 값으로 복구합니다.",
  },
  {
    letter: "C",
    name: "Consistency",
    color: "sky",
    tagline: "제약은 항상 성립",
    failureScenario:
      "잔액이 음수가 되거나, FK 참조가 없는 row가 삽입됨. DB가 모순 상태로 진입.",
    mechanism: "Constraint 검증",
    mechanismDetail:
      "트랜잭션 커밋 전 CHECK, FK, UNIQUE 등 제약을 검증합니다. 위반 시 롤백.",
  },
  {
    letter: "I",
    name: "Isolation",
    color: "amber",
    tagline: "동시 트랜잭션은 서로 간섭 안 함",
    failureScenario:
      "T1이 읽는 도중 T2가 수정하면 T1이 일관성 없는 중간 상태를 봄.",
    mechanism: "MVCC + Lock",
    mechanismDetail:
      "Read View로 스냅샷을 만들어 일관된 읽기를 보장. 쓰기 충돌은 Lock으로 직렬화.",
  },
  {
    letter: "D",
    name: "Durability",
    color: "emerald",
    tagline: "커밋된 데이터는 살아남음",
    failureScenario:
      "COMMIT 직후 서버가 재시작. 메모리에만 있던 변경이 모두 사라짐.",
    mechanism: "Redo Log (WAL)",
    mechanismDetail:
      "커밋 전 redo log를 먼저 fsync. 크래시 후 재시작 시 redo log를 재생해 복구.",
  },
];

const COLOR_MAP: Record<
  AcidColor,
  { border: string; bg: string; letter: string; badge: string; badgeBg: string }
> = {
  violet: {
    border: "border-violet-500/60",
    bg: "bg-violet-500/5",
    letter: "text-violet-400",
    badge: "text-violet-300",
    badgeBg: "bg-violet-500/15",
  },
  sky: {
    border: "border-sky-500/60",
    bg: "bg-sky-500/5",
    letter: "text-sky-400",
    badge: "text-sky-300",
    badgeBg: "bg-sky-500/15",
  },
  amber: {
    border: "border-amber-500/60",
    bg: "bg-amber-500/5",
    letter: "text-amber-400",
    badge: "text-amber-300",
    badgeBg: "bg-amber-500/15",
  },
  emerald: {
    border: "border-emerald-500/60",
    bg: "bg-emerald-500/5",
    letter: "text-emerald-400",
    badge: "text-emerald-300",
    badgeBg: "bg-emerald-500/15",
  },
};

export default function ACIDOverview() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {ACID_PROPERTIES.map((prop, idx) => {
        const isActive = activeIdx === idx;
        const c = COLOR_MAP[prop.color];

        return (
          <div
            key={prop.letter}
            onClick={() => setActiveIdx(isActive ? null : idx)}
            className={[
              "rounded-xl border cursor-pointer transition-all duration-200 overflow-hidden",
              isActive
                ? `${c.border} ${c.bg}`
                : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]",
            ].join(" ")}
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                <span
                  className={`font-mono text-4xl font-bold leading-none ${c.letter}`}
                >
                  {prop.letter}
                </span>
                <div className="flex flex-col gap-1 pt-0.5">
                  <span className="font-mono text-sm font-semibold text-zinc-200">
                    {prop.name}
                  </span>
                  <span className="text-xs text-zinc-500">{prop.tagline}</span>
                </div>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 flex flex-col gap-3">
                    <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-2.5">
                      <p className="font-mono text-xs text-rose-400 mb-1">
                        이게 없으면
                      </p>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {prop.failureScenario}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span
                        className={`inline-flex self-start font-mono text-xs px-2 py-0.5 rounded-md ${c.badgeBg} ${c.badge}`}
                      >
                        {prop.mechanism}
                      </span>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {prop.mechanismDetail}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
