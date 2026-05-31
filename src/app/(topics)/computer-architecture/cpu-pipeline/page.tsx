"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";
import CodeBlock from "@/components/CodeBlock";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "computer-architecture", current: "cpu pipeline" },
  hero: {
    title: "CPU Pipeline",
    desc: "한 명령어를 끝내고 다음 명령어 시작? 너무 느림.\n공장 라인처럼 여러 명령어를 단계별로 겹쳐 실행 — 한 사이클당 1개 처리량(IPC=1)이 목표.",
    tags: ["5단계", "IPC", "Hazard", "Stall", "Forwarding", "Superscalar"],
  },
  sections: [
    {
      number: "01",
      title: "5단계 클래식 파이프라인",
      desc: "IF (Instruction Fetch) → ID (Decode) → EX (Execute) → MEM (Memory) → WB (Writeback). 각 단계가 한 사이클. 5개 명령어가 동시에 다른 단계에서 진행됨.",
    },
    {
      number: "02",
      title: "왜 파이프라인 — Throughput vs Latency",
      desc: "한 명령어 자체의 시간(latency)은 같지만, 매 사이클마다 1개씩 완료(throughput). 이상적 속도 향상은 단계 수와 같지만, hazard로 실제로는 더 작음.",
    },
    {
      number: "03",
      title: "3가지 Hazard",
      desc: "1) Data Hazard: 이전 명령의 결과를 다음 명령이 필요. 2) Control Hazard: 분기 명령. 3) Structural Hazard: 자원 충돌 (예: 메모리 포트 부족). 각각 다른 해결책.",
    },
    {
      number: "04",
      title: "Data Hazard 해결 — Forwarding, Stall",
      desc: "Forwarding (Bypass): EX 단계 결과를 다음 명령의 EX에 직접 전달. 대부분 해결. 하지만 Load 직후 사용은 1 사이클 stall 불가피 (Load-Use Hazard).",
    },
    {
      number: "05",
      title: "Control Hazard — 분기 처리",
      desc: "분기 결과는 EX/MEM에서 확정 → 그동안 가져온 명령어들은 버려야 함. 해결: Branch Prediction (예측), Branch Delay Slot (옛 MIPS), Speculation.",
    },
    {
      number: "06",
      title: "Superscalar & Out-of-Order — 현대 CPU",
      desc: "Superscalar: 한 사이클에 여러 명령어 동시 실행 (IPC>1). Out-of-Order: 의존성 없는 명령어를 먼저 실행. 현대 x86, ARM 코어의 기본.",
    },
  ],
  stages: {
    title: "5단계 파이프라인",
    rows: [
      { name: "IF (Fetch)", desc: "PC가 가리키는 메모리에서 명령어 읽어옴", time: "1 cycle" },
      { name: "ID (Decode)", desc: "명령어 해석, 레지스터 파일에서 피연산자 읽기", time: "1 cycle" },
      { name: "EX (Execute)", desc: "ALU 연산 또는 주소 계산", time: "1 cycle" },
      { name: "MEM (Memory)", desc: "Load는 메모리에서 읽기, Store는 쓰기 (다른 명령은 통과)", time: "1 cycle" },
      { name: "WB (Writeback)", desc: "결과를 레지스터 파일에 기록", time: "1 cycle" },
    ],
  },
  comparison: {
    title: "비파이프라인 vs 파이프라인",
    diagram: `Non-Pipelined (5 cycles per instruction):
  Inst1: IF ID EX MEM WB
  Inst2:                IF ID EX MEM WB
  Inst3:                              IF ID EX MEM WB
  → 5 instructions in 25 cycles

Pipelined:
  Inst1: IF ID EX MEM WB
  Inst2:    IF ID EX  MEM WB
  Inst3:       IF ID  EX  MEM WB
  Inst4:          IF  ID  EX  MEM WB
  Inst5:              IF  ID  EX  MEM WB
  → 5 instructions in 9 cycles (CPI ≈ 1)`,
    note: "이상적으로 명령어 수만큼 + 4 사이클 = 거의 N. 단계 깊이를 늘리면 throughput↑ 하지만 분기 페널티↑.",
  },
  hazards: {
    title: "3가지 Hazard 정리",
    items: [
      {
        name: "Data Hazard",
        example: "ADD R1, R2, R3   # R1 = R2 + R3\nSUB R4, R1, R5   # R4 = R1 - R5 (R1이 아직 WB 전!)",
        solution: "Forwarding으로 EX 단계 결과를 다음 EX에 직접 전달",
      },
      {
        name: "Control Hazard",
        example: "BEQ R1, R2, label  # 분기 결정은 EX/MEM에서\n(다음 명령어는 이미 IF/ID에 진입한 상태)",
        solution: "Branch Prediction으로 미리 예측, 틀리면 flush",
      },
      {
        name: "Structural Hazard",
        example: "메모리 포트가 1개인데, IF는 명령어 읽고 MEM은 데이터 읽음 → 충돌",
        solution: "분리: I-Cache와 D-Cache 따로 (Harvard Architecture)",
      },
    ],
  },
  forwarding: {
    title: "Forwarding (Bypass) — Data Hazard 해결",
    desc: "EX 단계가 끝난 결과를 WB까지 기다리지 않고, 즉시 다음 명령의 EX 입력으로 전달.",
    diagram: `Without Forwarding (with stall):
  ADD R1, R2, R3:  IF ID EX MEM WB
  SUB R4, R1, R5:     IF ID -- -- EX MEM WB   (2 cycle stall)

With Forwarding:
  ADD R1, R2, R3:  IF ID EX MEM WB
  SUB R4, R1, R5:     IF ID EX MEM WB
                          ↑
                          EX 결과를 직접 전달 (forward)`,
    loadUse: "예외: Load → 즉시 사용은 1 cycle stall 불가피 (값이 MEM 단계에야 나옴).",
  },
  branchPrediction: {
    title: "Branch Prediction — Control Hazard 완화",
    items: [
      { name: "Static Prediction", desc: "Backward branch는 take, forward는 not-take 등 컴파일 시 결정. 단순." },
      { name: "1-bit Predictor", desc: "직전 분기 결과 기억. 'taken' 또는 'not'. 잘 안 맞음." },
      { name: "2-bit Saturating Counter", desc: "강한 taken/약한 taken/약한 NT/강한 NT. 한 번 틀려도 즉시 반전 X." },
      { name: "Two-Level Predictor", desc: "최근 분기 히스토리에 따라 다른 카운터 사용. 정확도 95%+." },
      { name: "TAGE / Perceptron", desc: "현대 CPU의 최첨단. 99% 정확도 가능. 틀린 분기당 ~20 cycle 페널티." },
    ],
  },
  modern: {
    title: "현대 CPU — 단순 파이프라인 너머",
    items: [
      { name: "Deep Pipeline", desc: "단계 수 늘리기 (Intel Pentium 4: 31단계). 클럭 ↑ 하지만 분기 페널티 ↑." },
      { name: "Superscalar", desc: "한 사이클에 여러 명령어 발행 (IPC>1). 보통 4-wide ~ 8-wide." },
      { name: "Out-of-Order Execution", desc: "Reservation Station으로 준비된 명령부터 실행. Reorder Buffer로 순서 복원." },
      { name: "Register Renaming", desc: "Architectural 레지스터 → 물리적 레지스터 매핑. 거짓 의존성 제거." },
      { name: "SIMD (Vector)", desc: "한 명령으로 여러 데이터 처리 (SSE, AVX, ARM NEON). 데이터 병렬성." },
      { name: "Speculative Execution", desc: "분기 예측대로 미리 실행. 틀리면 결과 폐기. Spectre/Meltdown 취약점의 원인." },
    ],
  },
  metrics: {
    title: "성능 지표",
    items: [
      { name: "CPI (Cycles Per Instruction)", desc: "명령어당 평균 사이클. 이상적 1, hazard 때문에 보통 1.2~2." },
      { name: "IPC (Instructions Per Cycle)", desc: "1/CPI. Superscalar에선 >1 가능." },
      { name: "Clock Frequency", desc: "초당 사이클 수 (GHz). 깊은 파이프라인으로 ↑ 가능, 그러나 발열 한계." },
      { name: "Total Execution Time", desc: "Instructions × CPI / Frequency. 셋 모두 최적화 필요." },
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "파이프라인", text: "5단계 (IF/ID/EX/MEM/WB)로 명령어를 겹쳐 실행. 매 사이클 1개 완료가 목표." },
      { label: "이득", text: "Throughput 증가. Latency는 그대로. 단계 수만큼 이상적 속도 향상." },
      { label: "Data Hazard", text: "이전 결과 의존. Forwarding으로 대부분 해결, Load-Use는 1 stall." },
      { label: "Control Hazard", text: "분기. Branch Prediction으로 예측 실행, 틀리면 flush." },
      { label: "Structural Hazard", text: "자원 충돌. Harvard (I-Cache + D-Cache 분리)로 흔한 케이스 해결." },
      { label: "Superscalar", text: "한 사이클에 여러 명령 발행. IPC>1. 현대 모든 CPU." },
      { label: "Out-of-Order", text: "준비된 명령부터 실행. Reorder Buffer로 in-order retirement." },
      { label: "Speculative", text: "분기 예측대로 미리 실행. 성능 ↑ 하지만 Spectre/Meltdown 보안 이슈의 뿌리." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "computer-architecture", current: "cpu pipeline" },
  hero: {
    title: "CPU Pipeline",
    desc: "Finish an instruction before starting the next? Too slow.\nLike an assembly line — overlap stages of many instructions. Target: 1 instruction completed per cycle (IPC=1).",
    tags: ["5-stage", "IPC", "Hazard", "Stall", "Forwarding", "Superscalar"],
  },
  sections: [
    {
      number: "01",
      title: "Classic 5-Stage Pipeline",
      desc: "IF (Instruction Fetch) → ID (Decode) → EX (Execute) → MEM (Memory) → WB (Writeback). One cycle per stage. Five instructions in flight at five stages.",
    },
    {
      number: "02",
      title: "Why Pipeline — Throughput vs Latency",
      desc: "Per-instruction latency stays the same, but one finishes every cycle (throughput). Ideal speedup equals stage count, but hazards make it smaller in practice.",
    },
    {
      number: "03",
      title: "Three Hazard Types",
      desc: "1) Data Hazard: next instruction needs the previous result. 2) Control Hazard: branches. 3) Structural Hazard: resource conflict (e.g., one memory port). Different fixes for each.",
    },
    {
      number: "04",
      title: "Data Hazard — Forwarding, Stall",
      desc: "Forwarding (bypass): pass the EX result directly to the next EX. Solves most. Load-Use is the exception — one cycle stall is unavoidable.",
    },
    {
      number: "05",
      title: "Control Hazard — Handling Branches",
      desc: "Branch direction is resolved in EX/MEM — meanwhile fetched instructions must be flushed. Mitigations: Branch Prediction, Branch Delay Slot (old MIPS), Speculation.",
    },
    {
      number: "06",
      title: "Superscalar & Out-of-Order — Modern CPUs",
      desc: "Superscalar: issue multiple instructions per cycle (IPC>1). Out-of-Order: execute independent instructions first. The default for modern x86 and ARM cores.",
    },
  ],
  stages: {
    title: "Five Stages",
    rows: [
      { name: "IF (Fetch)", desc: "Read the instruction from memory at PC", time: "1 cycle" },
      { name: "ID (Decode)", desc: "Decode the opcode, read operands from the register file", time: "1 cycle" },
      { name: "EX (Execute)", desc: "ALU operation or address calculation", time: "1 cycle" },
      { name: "MEM (Memory)", desc: "Load reads, store writes (other ops pass through)", time: "1 cycle" },
      { name: "WB (Writeback)", desc: "Write result back to the register file", time: "1 cycle" },
    ],
  },
  comparison: {
    title: "Non-pipelined vs Pipelined",
    diagram: `Non-Pipelined (5 cycles per instruction):
  Inst1: IF ID EX MEM WB
  Inst2:                IF ID EX MEM WB
  Inst3:                              IF ID EX MEM WB
  → 5 instructions in 25 cycles

Pipelined:
  Inst1: IF ID EX MEM WB
  Inst2:    IF ID EX  MEM WB
  Inst3:       IF ID  EX  MEM WB
  Inst4:          IF  ID  EX  MEM WB
  Inst5:              IF  ID  EX  MEM WB
  → 5 instructions in 9 cycles (CPI ≈ 1)`,
    note: "Ideally N instructions take N + 4 cycles ≈ N. Deeper pipelines raise throughput but worsen branch penalties.",
  },
  hazards: {
    title: "Three Hazards",
    items: [
      {
        name: "Data Hazard",
        example: "ADD R1, R2, R3   # R1 = R2 + R3\nSUB R4, R1, R5   # R4 = R1 - R5 (R1 not yet written back!)",
        solution: "Forwarding: pass EX result directly to the next EX",
      },
      {
        name: "Control Hazard",
        example: "BEQ R1, R2, label  # branch outcome resolves at EX/MEM\n(instructions after it are already in IF/ID)",
        solution: "Branch Prediction: speculate; flush on misprediction",
      },
      {
        name: "Structural Hazard",
        example: "Single memory port: IF reads instructions while MEM reads data → conflict",
        solution: "Split: separate I-Cache and D-Cache (Harvard architecture)",
      },
    ],
  },
  forwarding: {
    title: "Forwarding (Bypass) — fixing Data Hazards",
    desc: "Instead of waiting until WB, hand the EX result straight to the next instruction's EX input.",
    diagram: `Without Forwarding (with stall):
  ADD R1, R2, R3:  IF ID EX MEM WB
  SUB R4, R1, R5:     IF ID -- -- EX MEM WB   (2 cycle stall)

With Forwarding:
  ADD R1, R2, R3:  IF ID EX MEM WB
  SUB R4, R1, R5:     IF ID EX MEM WB
                          ↑
                          EX result forwarded directly`,
    loadUse: "Exception: Load → immediate use needs 1 cycle stall (value not ready until end of MEM).",
  },
  branchPrediction: {
    title: "Branch Prediction — softening Control Hazards",
    items: [
      { name: "Static Prediction", desc: "Backward branches taken, forward not — decided at compile time. Simple." },
      { name: "1-bit Predictor", desc: "Remember last outcome: taken or not. Poor accuracy." },
      { name: "2-bit Saturating Counter", desc: "Strong/weak taken, weak/strong not-taken. Doesn't flip on a single miss." },
      { name: "Two-Level Predictor", desc: "Use recent branch history to pick a counter. 95%+ accuracy." },
      { name: "TAGE / Perceptron", desc: "State-of-the-art in modern CPUs. 99% accuracy. Each miss costs ~20 cycles." },
    ],
  },
  modern: {
    title: "Modern CPUs — Beyond Simple Pipelines",
    items: [
      { name: "Deep Pipeline", desc: "More stages (Pentium 4: 31). Higher clock; bigger branch penalty." },
      { name: "Superscalar", desc: "Issue multiple instructions per cycle (IPC>1). Usually 4-wide to 8-wide." },
      { name: "Out-of-Order Execution", desc: "Reservation Station fires ready instructions; Reorder Buffer restores order on retire." },
      { name: "Register Renaming", desc: "Map architectural to physical registers. Eliminates false dependencies." },
      { name: "SIMD (Vector)", desc: "One instruction, many data lanes (SSE, AVX, ARM NEON). Data parallelism." },
      { name: "Speculative Execution", desc: "Run ahead of branches. Discard wrong paths. Root cause of Spectre/Meltdown." },
    ],
  },
  metrics: {
    title: "Performance Metrics",
    items: [
      { name: "CPI (Cycles Per Instruction)", desc: "Average cycles per instruction. Ideal 1, typically 1.2~2 with hazards." },
      { name: "IPC (Instructions Per Cycle)", desc: "1/CPI. Superscalar can exceed 1." },
      { name: "Clock Frequency", desc: "Cycles per second (GHz). Deeper pipelines allow higher, but thermal limits apply." },
      { name: "Total Execution Time", desc: "Instructions × CPI / Frequency. All three must be optimized together." },
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Pipeline", text: "Five stages (IF/ID/EX/MEM/WB) overlapping. Goal: complete one per cycle." },
      { label: "Gain", text: "Throughput up; latency unchanged. Ideal speedup = number of stages." },
      { label: "Data Hazard", text: "Dependency on prior result. Forwarding handles most; Load-Use needs 1 stall." },
      { label: "Control Hazard", text: "Branches. Branch Prediction speculates; flush on miss." },
      { label: "Structural Hazard", text: "Resource conflict. Harvard (split I/D cache) addresses the common case." },
      { label: "Superscalar", text: "Multiple issues per cycle. IPC>1. Universal in modern CPUs." },
      { label: "Out-of-Order", text: "Execute when ready. Reorder buffer keeps retirement in program order." },
      { label: "Speculative", text: "Run ahead of branches for speed. Root of Spectre/Meltdown security flaws." },
    ],
  },
};

interface SectionProps { number: string; title: string; description: string; children: ReactNode; }
function Section({ number, title, description, children }: SectionProps) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-xs font-mono text-slate-400/60">{number}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function CpuPipelinePage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;
  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(148,163,184,0.06),transparent)]" />
      <div className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.home}</Link>
          <span>/</span>
          <Link href="/computer-architecture" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.parent}</Link>
          <span>/</span>
          <span className="text-zinc-400">{t.breadcrumb.current}</span>
        </div>
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-white font-mono mb-4">{t.hero.title}</h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-2xl mb-6 whitespace-pre-line">{t.hero.desc}</p>
          <div className="flex items-center gap-0 text-xs font-mono flex-wrap">
            {t.hero.tags.map((label, i, arr) => (
              <span key={label} className="flex items-center">
                <span className="text-zinc-500 px-2 py-1 rounded border border-white/[0.06] bg-white/[0.02]">{label}</span>
                {i < arr.length - 1 && <span className="text-zinc-700 mx-1.5">→</span>}
              </span>
            ))}
          </div>
        </div>

        <Section number={t.sections[0].number} title={t.sections[0].title} description={t.sections[0].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.stages.title}</h3>
            <div className="space-y-2">
              {t.stages.rows.map((s) => (
                <div key={s.name} className="grid grid-cols-[160px_1fr_80px] items-center gap-3 text-[11px] font-mono">
                  <span className="text-slate-300/80 font-semibold">{s.name}</span>
                  <span className="text-zinc-400">{s.desc}</span>
                  <span className="text-cyan-400/80 text-right">{s.time}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section number={t.sections[1].number} title={t.sections[1].title} description={t.sections[1].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.comparison.title}</h3>
            <pre className="text-[11px] font-mono text-slate-300/80 whitespace-pre leading-relaxed bg-zinc-900/30 p-3 rounded">{t.comparison.diagram}</pre>
            <p className="text-[10px] text-zinc-500 italic mt-3">{t.comparison.note}</p>
          </div>
        </Section>

        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="space-y-3">
              {t.hazards.items.map((h) => (
                <div key={h.name} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                  <div className="text-xs font-mono text-amber-300 font-semibold mb-2">{h.name}</div>
                  <div className="mb-2"><CodeBlock language="java" code={h.example} showHeader={false} /></div>
                  <div className="text-[10px] text-emerald-400/80">
                    <span className="font-semibold">{lang === "ko" ? "해결: " : "Fix: "}</span>
                    <span>{h.solution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section number={t.sections[3].number} title={t.sections[3].title} description={t.sections[3].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-2">{t.forwarding.title}</h3>
            <p className="text-[11px] text-zinc-500 mb-3">{t.forwarding.desc}</p>
            <pre className="text-[11px] font-mono text-emerald-300/80 whitespace-pre leading-relaxed bg-zinc-900/30 p-3 rounded">{t.forwarding.diagram}</pre>
            <p className="text-[10px] text-amber-400/80 italic mt-3">⚠ {t.forwarding.loadUse}</p>
          </div>
        </Section>

        <Section number={t.sections[4].number} title={t.sections[4].title} description={t.sections[4].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.branchPrediction.title}</h3>
            <div className="space-y-2">
              {t.branchPrediction.items.map((b) => (
                <div key={b.name} className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                  <div className="text-xs font-mono text-slate-300 font-semibold mb-1">{b.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section number={t.sections[5].number} title={t.sections[5].title} description={t.sections[5].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.modern.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.modern.items.map((m) => (
                <div key={m.name} className="rounded-lg border border-slate-500/20 bg-slate-500/5 p-3">
                  <div className="text-xs font-mono text-slate-300 font-semibold mb-1">{m.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section number="07" title={t.metrics.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="space-y-2">
              {t.metrics.items.map((m) => (
                <div key={m.name} className="grid grid-cols-[200px_1fr] gap-3 text-[11px] font-mono">
                  <span className="text-slate-300/80 font-semibold">{m.name}</span>
                  <span className="text-zinc-400">{m.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold text-sm font-mono mb-5">{t.summary.title}</h3>
          <div className="space-y-3">
            {t.summary.items.map((item) => (
              <div key={item.label} className="flex gap-3 items-start">
                <span className="text-xs font-mono text-slate-400/60 shrink-0 mt-0.5 min-w-[140px]">{item.label}</span>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
