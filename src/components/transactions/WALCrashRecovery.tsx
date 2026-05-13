"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WalStep {
  id: number;
  title: string;
  description: string;
  activeLane: "buffer" | "redo" | "data" | "commit";
  showCrashButton: boolean;
}

const WAL_STEPS: WalStep[] = [
  {
    id: 1,
    title: "Buffer Pool 페이지 수정",
    description: "UPDATE 실행 → Buffer Pool의 page를 dirty 상태로 변경. Undo log에 이전 값(balance=1000) 기록.",
    activeLane: "buffer",
    showCrashButton: false,
  },
  {
    id: 2,
    title: "Redo Log 기록 + fsync",
    description: "Redo log ring buffer에 LSN=101 엔트리 추가. fsync로 디스크에 강제 기록. WAL 보장.",
    activeLane: "redo",
    showCrashButton: false,
  },
  {
    id: 3,
    title: "COMMIT 응답",
    description: "redo log fsync 완료 후 클라이언트에 OK 반환. 아직 data file에는 미기록 상태.",
    activeLane: "commit",
    showCrashButton: true,
  },
  {
    id: 4,
    title: "비동기 Flush (Checkpoint)",
    description: "Checkpoint 진행. dirty page가 data file에 기록됨. 이 시점 이전 LSN은 안전.",
    activeLane: "data",
    showCrashButton: false,
  },
];

interface CrashRecoveryState {
  phase: "idle" | "crashed" | "recovering" | "recovered";
}

export default function WALCrashRecovery() {
  const [step, setStep] = useState(0);
  const [crash, setCrash] = useState<CrashRecoveryState>({ phase: "idle" });
  const current = WAL_STEPS[step];

  const handleCrash = () => {
    setCrash({ phase: "crashed" });
    setTimeout(() => setCrash({ phase: "recovering" }), 800);
    setTimeout(() => setCrash({ phase: "recovered" }), 2000);
  };

  const handleReset = () => {
    setCrash({ phase: "idle" });
    setStep(0);
  };

  const isActive = (lane: WalStep["activeLane"]) => current.activeLane === lane;

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-6">
      <div>
        <h2 className="font-mono text-lg text-zinc-100">WAL & Crash Recovery</h2>
        <p className="text-sm text-zinc-500 mt-1">Undo / Redo log 구조와 크래시 복구 흐름</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="border border-violet-500/30 bg-violet-500/[0.06] rounded-lg p-4 space-y-1">
          <p className="font-mono text-xs text-violet-400">Undo Log</p>
          <p className="text-xs text-zinc-300">변경 전 값 저장</p>
          <p className="text-xs text-zinc-500">용도: 롤백, MVCC</p>
          <p className="text-xs text-zinc-500">위치: 테이블스페이스 내</p>
        </div>
        <div className="border border-emerald-500/30 bg-emerald-500/[0.06] rounded-lg p-4 space-y-1">
          <p className="font-mono text-xs text-emerald-400">Redo Log (WAL)</p>
          <p className="text-xs text-zinc-300">변경 후 값 저장</p>
          <p className="text-xs text-zinc-500">용도: Crash Recovery</p>
          <p className="text-xs text-zinc-500">위치: ib_logfile (디스크)</p>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-lg p-3 font-mono text-xs text-zinc-400">
        <span className="text-zinc-500">시나리오:</span>{" "}
        <span className="text-emerald-400">UPDATE accounts SET balance=800 WHERE id=1</span>
        <span className="text-zinc-600 ml-2">(이전: 1000)</span>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {crash.phase === "crashed" && (
            <motion.div
              key="crashed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="border border-rose-500 bg-rose-500/10 rounded-lg p-3 text-center font-mono text-sm text-rose-400"
            >
              CRASH! — 서버 비정상 종료
            </motion.div>
          )}
          {crash.phase === "recovering" && (
            <motion.div
              key="recovering"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border border-amber-500/50 bg-amber-500/10 rounded-lg p-3 text-center font-mono text-sm text-amber-400"
            >
              서버 재시작 — Redo log checkpoint 이후 LSN=101 재생 중...
            </motion.div>
          )}
          {crash.phase === "recovered" && (
            <motion.div
              key="recovered"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="border border-emerald-500/50 bg-emerald-500/10 rounded-lg p-3 text-center font-mono text-sm text-emerald-400"
            >
              balance=800 복구 완료 — WAL이 데이터 유실을 방지함
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-3 gap-3">
          <LaneCard
            label="Buffer Pool"
            color="violet"
            active={isActive("buffer") && crash.phase === "idle"}
            crashed={crash.phase === "crashed" || crash.phase === "recovering"}
          >
            <motion.div
              animate={
                isActive("buffer") && crash.phase === "idle"
                  ? { borderColor: "rgb(167 139 250)", backgroundColor: "rgba(139,92,246,0.15)" }
                  : crash.phase !== "idle"
                  ? { opacity: 0.1 }
                  : { borderColor: "rgba(255,255,255,0.1)", backgroundColor: "transparent" }
              }
              transition={{ duration: 0.4 }}
              className="border rounded px-2 py-2 font-mono text-xs text-center"
            >
              <p className="text-zinc-400">dirty page</p>
              <p className="text-violet-300 text-[10px] mt-1">balance=800</p>
              {isActive("buffer") && crash.phase === "idle" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-violet-400 text-[10px] mt-1"
                >
                  수정됨
                </motion.p>
              )}
            </motion.div>
            <div className="border border-white/10 rounded px-2 py-1.5 font-mono text-[10px] text-zinc-500 mt-2">
              undo log<br />before: 1000
            </div>
          </LaneCard>

          <LaneCard
            label="Redo Log"
            color="emerald"
            active={isActive("redo") || isActive("commit")}
          >
            <motion.div
              animate={
                (isActive("redo") || isActive("commit"))
                  ? { borderColor: "rgb(52 211 153)", backgroundColor: "rgba(52,211,153,0.1)" }
                  : { borderColor: "rgba(255,255,255,0.1)", backgroundColor: "transparent" }
              }
              transition={{ duration: 0.4 }}
              className="border rounded px-2 py-2 font-mono text-xs space-y-1"
            >
              {step >= 1 ? (
                <>
                  <div className="text-emerald-400 text-[10px]">LSN=101</div>
                  <div className="text-zinc-500 text-[10px]">UPDATE id=1</div>
                  <div className="text-zinc-500 text-[10px]">after: 800</div>
                  {(isActive("redo") || isActive("commit")) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-emerald-300 text-[10px] border-t border-white/10 pt-1 mt-1"
                    >
                      fsync 완료
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-zinc-600 text-[10px]">비어있음</div>
              )}
            </motion.div>
            <div className="border border-white/10 rounded px-2 py-1 font-mono text-[10px] text-zinc-600 mt-2 text-center">
              ring buffer
            </div>
          </LaneCard>

          <LaneCard
            label="Data File"
            color="zinc"
            active={isActive("data") || crash.phase === "recovered"}
          >
            <motion.div
              animate={
                isActive("data") || crash.phase === "recovered"
                  ? { borderColor: "rgb(52 211 153)", backgroundColor: "rgba(52,211,153,0.08)" }
                  : { borderColor: "rgba(255,255,255,0.1)", backgroundColor: "transparent" }
              }
              transition={{ duration: 0.5 }}
              className="border rounded px-2 py-2 font-mono text-xs text-center"
            >
              <p className="text-zinc-400">page</p>
              <p className={`text-[10px] mt-1 ${isActive("data") || crash.phase === "recovered" ? "text-emerald-300" : "text-zinc-600"}`}>
                balance={isActive("data") || crash.phase === "recovered" ? "800" : "1000(old)"}
              </p>
            </motion.div>
            <div className="border border-white/10 rounded px-2 py-1 font-mono text-[10px] text-zinc-600 mt-2 text-center">
              ib_data (디스크)
            </div>
          </LaneCard>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="bg-white/[0.02] border border-white/10 rounded-lg p-4 space-y-1"
        >
          <p className="font-mono text-xs text-zinc-300">Step {step + 1}: {current.title}</p>
          <p className="text-xs text-zinc-500">{current.description}</p>
        </motion.div>
      </AnimatePresence>

      {crash.phase !== "idle" ? (
        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="px-4 py-1.5 rounded border border-white/10 text-xs text-zinc-400 hover:border-white/20 transition-colors font-mono"
          >
            처음으로
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-4 py-1.5 rounded border border-white/10 text-xs text-zinc-400 disabled:opacity-30 hover:border-white/20 transition-colors font-mono"
          >
            prev
          </button>

          <div className="flex items-center gap-3">
            {current.showCrashButton && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleCrash}
                className="px-4 py-1.5 rounded border border-rose-500/60 bg-rose-500/10 text-xs text-rose-400 hover:bg-rose-500/20 transition-colors font-mono"
              >
                CRASH!
              </motion.button>
            )}

            <div className="flex gap-2">
              {WAL_STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === step ? "bg-emerald-500" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep((s) => Math.min(WAL_STEPS.length - 1, s + 1))}
            disabled={step === WAL_STEPS.length - 1}
            className="px-4 py-1.5 rounded border border-white/10 text-xs text-zinc-400 disabled:opacity-30 hover:border-white/20 transition-colors font-mono"
          >
            next
          </button>
        </div>
      )}
    </div>
  );
}

interface LaneCardProps {
  label: string;
  color: "violet" | "emerald" | "zinc";
  active: boolean;
  crashed?: boolean;
  children: React.ReactNode;
}

function LaneCard({ label, color, active, crashed, children }: LaneCardProps) {
  const bgMap = {
    violet: "border-violet-500/20 bg-violet-500/[0.04]",
    emerald: "border-emerald-500/20 bg-emerald-500/[0.04]",
    zinc: "border-white/10 bg-white/[0.02]",
  };
  const labelMap = {
    violet: "text-violet-400",
    emerald: "text-emerald-400",
    zinc: "text-zinc-400",
  };

  return (
    <motion.div
      animate={crashed && color === "violet" ? { opacity: 0.2 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`border rounded-lg p-3 space-y-2 ${bgMap[color]} ${active ? "ring-1 ring-white/10" : ""}`}
    >
      <p className={`font-mono text-[10px] ${labelMap[color]}`}>{label}</p>
      {children}
    </motion.div>
  );
}
