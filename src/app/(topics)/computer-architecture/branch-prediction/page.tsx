"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "computer-architecture", current: "branch prediction" },
  hero: {
    title: "Branch Prediction",
    desc: "if/else가 만나면 파이프라인은 멈춰야 하나? 미리 예측해서 계속 가자.\nCPU의 'AI' — 분기 결과를 99%+ 정확도로 맞추는 정교한 머신.",
    tags: ["Speculation", "BTB", "2-bit Counter", "TAGE", "Misprediction Penalty", "Spectre"],
  },
  sections: [
    {
      number: "01",
      title: "왜 예측인가 — 분기의 비용",
      desc: "현대 CPU는 깊은 파이프라인 (15-20단계). 분기 결과는 EX/MEM에서 확정 → 그동안 fetch한 명령어는 모두 폐기. 예측이 틀리면 15+ cycle 페널티.",
    },
    {
      number: "02",
      title: "기본 — Static Prediction",
      desc: "컴파일 시 결정. 1) Backward branch는 take (루프), Forward는 not-take. 2) 분기 명령 자체에 hint bit. 단순하지만 정확도 70-80%. 분기 빈도 높은 코드에선 부족.",
    },
    {
      number: "03",
      title: "1-bit & 2-bit Saturating Counter",
      desc: "1-bit: 직전 결과만 기억. 루프의 첫·마지막 반복에서 항상 틀림. 2-bit: 강한/약한 taken, 강한/약한 not-taken 4상태. 한 번 틀려도 즉시 반전 X → 더 안정적.",
    },
    {
      number: "04",
      title: "History-based — Two-Level Predictor",
      desc: "최근 N개의 분기 히스토리에 따라 다른 카운터 사용. 패턴(taken, not, taken, taken, ...)을 학습. 정확도 95-97%. PHT(Pattern History Table)와 BHR(Branch History Register).",
    },
    {
      number: "05",
      title: "현대 — TAGE, Perceptron, Neural",
      desc: "TAGE: 여러 길이의 히스토리를 동시에 사용. Perceptron: 신경망의 단일 뉴런으로 가중치 학습. 정확도 99%+. AMD Zen, Intel Skylake+ 사용.",
    },
    {
      number: "06",
      title: "BTB와 Indirect Branch",
      desc: "BTB (Branch Target Buffer): 분기 목적지 주소도 캐시. Indirect branch (switch, 함수 포인터, virtual call) 처리. Misprediction이 더 비쌈.",
    },
    {
      number: "07",
      title: "Speculative Execution과 보안",
      desc: "예측 기반으로 미리 실행 → 틀리면 결과 폐기. 그러나 캐시 상태 등은 일부 남음 → Spectre/Meltdown. 사이드 채널 공격의 원인.",
    },
  ],
  cost: {
    title: "Misprediction Cost",
    desc: "분기 예측이 틀리면 모든 in-flight 명령어 폐기. 깊은 파이프라인일수록 비쌈.",
    rows: [
      { cpu: "단순 5단계 RISC", cost: "5 cycles" },
      { cpu: "Intel Pentium 4 (NetBurst, 31단계)", cost: "30+ cycles" },
      { cpu: "Modern x86 (Skylake)", cost: "~15-20 cycles" },
      { cpu: "ARM Cortex-A78", cost: "~13 cycles" },
      { cpu: "Apple M-series", cost: "~10-15 cycles" },
    ],
    insight: "GHz CPU에서 15 cycle = 약 5ns. 분기당 1% misprediction이면 IPC가 크게 떨어짐.",
  },
  twoBit: {
    title: "2-bit Saturating Counter — 상태 전이",
    diagram: `         taken         taken
   ┌──────────→ ┌──────────→
   │            │
[Strong NT] [Weak NT] [Weak T] [Strong T]
   │   ←──────── │   ←──────────
   │   not-taken    not-taken
   │
   초기 상태:  Weak NT 또는 Weak T

상태:
  00 = Strong Not Taken
  01 = Weak Not Taken
  10 = Weak Taken
  11 = Strong Taken

10/11 → 분기 예측: TAKEN
00/01 → 분기 예측: NOT TAKEN`,
    note: "한 번 틀려도 강한 상태에서 약한 상태로만 이동. 두 번 연속 틀려야 예측이 반전됨.",
  },
  predictors: {
    title: "예측기 진화",
    headers: ["예측기", "원리", "정확도", "사용처"],
    rows: [
      ["Static", "Backward = take, Forward = not", "70-80%", "초기 CPU"],
      ["1-bit", "직전 결과 기억", "80-85%", "초기 동적 예측"],
      ["2-bit Counter", "Saturating 4-state", "85-90%", "MIPS, 초기 x86"],
      ["Two-Level (PHT+BHR)", "히스토리별 카운터", "95-97%", "Pentium Pro"],
      ["gshare", "히스토리 XOR PC로 인덱싱", "96-97%", "Alpha 21264"],
      ["TAGE", "여러 길이 히스토리 결합", "98-99%", "AMD Zen, Intel Skylake+"],
      ["Perceptron", "신경망 가중치 학습", "98-99%", "AMD Bulldozer/Zen"],
      ["Hybrid (TAGE + 신경망)", "여러 예측기 통합", "99%+", "최신 CPU"],
    ],
  },
  loopExample: {
    title: "예시 — 루프 분기 (10번 반복)",
    code: `for (int i = 0; i < 10; i++) {
    // ...
    if (i < 10) goto loop;  // 분기: 처음 10번 taken, 11번째 not
}`,
    accuracy: [
      { predictor: "Static (backward = take)", correct: "10/11", note: "마지막 반복만 틀림" },
      { predictor: "1-bit", correct: "9/11", note: "첫·마지막 반복 틀림" },
      { predictor: "2-bit Counter", correct: "10/11", note: "마지막만 — 강한 상태가 1회 misprediction에 안 흔들림" },
      { predictor: "Two-Level (history len 3)", correct: "11/11", note: "패턴을 학습 — 완벽" },
    ],
  },
  spectre: {
    title: "Spectre / Meltdown — 예측의 보안 사이드 효과",
    desc: "Speculative Execution이 만든 빈틈. 예측이 틀려서 결과는 폐기됐지만, 캐시 상태는 변함 → 사이드 채널로 비밀 데이터 누출.",
    flow: [
      "1. 공격자가 분기 예측기를 'taken'으로 훈련",
      "2. 실제로는 not-taken인 분기 → CPU가 잘못 예측해서 미리 실행",
      "3. 실행 중에 비밀 메모리를 읽고 → 캐시에 흔적 남김",
      "4. CPU가 misprediction 감지 → 결과 폐기, 하지만 캐시는 그대로",
      "5. 공격자가 캐시 hit/miss 시간차로 비밀 값 복원",
    ],
    mitigation: "마이크로코드 패치, LFENCE/MFENCE로 speculation 차단, 커널 페이지 분리(KPTI), Retpoline 등. 모두 성능 비용 동반.",
  },
  software: {
    title: "코드에서 분기 줄이기",
    items: [
      { name: "분기 없는 코드 (Branchless)", desc: "if 대신 조건부 대입. `x = cond ? a : b;` 또는 비트 연산. 패턴이 무작위일 때 효과적." },
      { name: "정렬된 데이터", desc: "유명한 stackoverflow 질문: 정렬된 배열을 처리하면 빠른 이유 → 분기 예측이 잘 맞기 때문." },
      { name: "Likely/Unlikely 힌트", desc: "GCC/Clang의 __builtin_expect, C++20 [[likely]]/[[unlikely]]. 컴파일러가 코드 배치 최적화." },
      { name: "Loop unrolling", desc: "루프 본문을 여러 번 펼쳐 분기 횟수 감소. 컴파일러 자동 또는 수동." },
      { name: "Profile-Guided Optimization (PGO)", desc: "실행 프로파일로 어느 분기가 자주 taken인지 측정 → 컴파일러에 알려줌." },
      { name: "Lookup Table", desc: "분기 대신 테이블 인덱싱. 작은 범위 switch에 효과적." },
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "왜 예측", text: "깊은 파이프라인 + 분기 결과 늦게 확정. 예측 없으면 매 분기마다 15+ cycle stall." },
      { label: "Static", text: "단순한 휴리스틱 (backward = take). 정확도 70-80%. 현대엔 fallback." },
      { label: "2-bit Counter", text: "Strong/Weak Taken/NT의 4상태. 한 번 틀려도 즉시 반전 X." },
      { label: "Two-Level", text: "히스토리에 따라 다른 카운터. 패턴 학습. 95%+." },
      { label: "TAGE / Perceptron", text: "여러 길이 히스토리, 신경망 가중치. 99%+ 정확도. 현대 CPU 표준." },
      { label: "BTB", text: "분기 목적지 캐시. Indirect branch 처리. Miss 시 더 비쌈." },
      { label: "Misprediction 비용", text: "10-20 cycle. 모든 in-flight 명령어 폐기. 깊은 파이프라인일수록 비쌈." },
      { label: "Spectre", text: "Speculative execution의 부산물. 캐시 상태로 비밀 누출. 사이드 채널 공격." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "computer-architecture", current: "branch prediction" },
  hero: {
    title: "Branch Prediction",
    desc: "Should the pipeline stall at every if/else? Predict the outcome and keep going.\nThe CPU's 'AI' — 99%+ accuracy on branch direction.",
    tags: ["Speculation", "BTB", "2-bit Counter", "TAGE", "Misprediction Penalty", "Spectre"],
  },
  sections: [
    {
      number: "01",
      title: "Why Predict — The Cost of Branches",
      desc: "Modern CPUs have deep pipelines (15-20 stages). The branch outcome is known at EX/MEM — meanwhile, all fetched instructions in flight get discarded. A misprediction costs 15+ cycles.",
    },
    {
      number: "02",
      title: "Basic — Static Prediction",
      desc: "Decided at compile time. 1) Backward branches taken (loops), forward not-taken. 2) Hint bits in the branch itself. Simple, 70-80% accurate. Insufficient on branch-heavy code.",
    },
    {
      number: "03",
      title: "1-bit & 2-bit Saturating Counter",
      desc: "1-bit: remember only the last outcome. Always wrong on the first and last iteration of a loop. 2-bit: four states (strong/weak taken, strong/weak not-taken). A single misprediction doesn't flip the direction → more stable.",
    },
    {
      number: "04",
      title: "History-based — Two-Level Predictor",
      desc: "Use the last N branch outcomes as an index into different counters. Learns patterns (taken, not, taken, taken, ...). 95-97% accuracy. PHT (Pattern History Table) + BHR (Branch History Register).",
    },
    {
      number: "05",
      title: "Modern — TAGE, Perceptron, Neural",
      desc: "TAGE: combine multiple history lengths. Perceptron: a single neuron's weighted sum. 99%+ accuracy. Used in AMD Zen and Intel Skylake+.",
    },
    {
      number: "06",
      title: "BTB and Indirect Branches",
      desc: "BTB (Branch Target Buffer): cache the branch target address. Indirect branches (switch, function pointers, virtual calls) need this. Misprediction here is even more expensive.",
    },
    {
      number: "07",
      title: "Speculative Execution and Security",
      desc: "Speculating ahead executes more, discards on mispredict. But cache state lingers → Spectre/Meltdown. Root of modern side-channel attacks.",
    },
  ],
  cost: {
    title: "Misprediction Cost",
    desc: "All in-flight instructions discarded. Deeper pipelines pay more.",
    rows: [
      { cpu: "Simple 5-stage RISC", cost: "5 cycles" },
      { cpu: "Intel Pentium 4 (NetBurst, 31 stages)", cost: "30+ cycles" },
      { cpu: "Modern x86 (Skylake)", cost: "~15-20 cycles" },
      { cpu: "ARM Cortex-A78", cost: "~13 cycles" },
      { cpu: "Apple M-series", cost: "~10-15 cycles" },
    ],
    insight: "On a GHz CPU, 15 cycles ≈ 5 ns. A 1% misprediction rate per branch causes a big IPC drop.",
  },
  twoBit: {
    title: "2-bit Saturating Counter — State Transitions",
    diagram: `         taken         taken
   ┌──────────→ ┌──────────→
   │            │
[Strong NT] [Weak NT] [Weak T] [Strong T]
   │   ←──────── │   ←──────────
   │   not-taken    not-taken
   │
   Initial:  Weak NT or Weak T

States:
  00 = Strong Not Taken
  01 = Weak Not Taken
  10 = Weak Taken
  11 = Strong Taken

10/11 → predict: TAKEN
00/01 → predict: NOT TAKEN`,
    note: "A single misprediction only moves strong → weak in that direction. Two in a row are needed to flip the prediction.",
  },
  predictors: {
    title: "Predictor Evolution",
    headers: ["Predictor", "Principle", "Accuracy", "Used in"],
    rows: [
      ["Static", "Backward = taken, Forward = not", "70-80%", "Early CPUs"],
      ["1-bit", "Remember last outcome", "80-85%", "Early dynamic prediction"],
      ["2-bit Counter", "Saturating 4-state", "85-90%", "MIPS, early x86"],
      ["Two-Level (PHT+BHR)", "History-indexed counters", "95-97%", "Pentium Pro"],
      ["gshare", "History XOR PC for indexing", "96-97%", "Alpha 21264"],
      ["TAGE", "Multiple history lengths combined", "98-99%", "AMD Zen, Intel Skylake+"],
      ["Perceptron", "Neural-style weight learning", "98-99%", "AMD Bulldozer/Zen"],
      ["Hybrid (TAGE + neural)", "Multiple predictors voted", "99%+", "Latest CPUs"],
    ],
  },
  loopExample: {
    title: "Example — Loop Branch (10 iterations)",
    code: `for (int i = 0; i < 10; i++) {
    // ...
    if (i < 10) goto loop;  // taken 10 times, not-taken on the 11th
}`,
    accuracy: [
      { predictor: "Static (backward = taken)", correct: "10/11", note: "Wrong only on the last iteration" },
      { predictor: "1-bit", correct: "9/11", note: "Wrong on first and last" },
      { predictor: "2-bit Counter", correct: "10/11", note: "Only the last — strong state survives a single miss" },
      { predictor: "Two-Level (history len 3)", correct: "11/11", note: "Pattern learned — perfect" },
    ],
  },
  spectre: {
    title: "Spectre / Meltdown — Prediction's Side Effects",
    desc: "Speculative Execution leaves residue. Even after the result is discarded, cache state changes — a side channel leaks secrets.",
    flow: [
      "1. Attacker trains the predictor to assume 'taken'",
      "2. The actual branch is not-taken — CPU mispredicts and executes ahead",
      "3. During speculation, the CPU reads secret memory → cache lines change",
      "4. CPU detects the mispredict → discards results, but cache state remains",
      "5. Attacker measures cache hit/miss timing to recover the secret",
    ],
    mitigation: "Microcode patches, LFENCE/MFENCE to block speculation, KPTI (kernel page isolation), Retpoline. All cost performance.",
  },
  software: {
    title: "Reducing Branches in Code",
    items: [
      { name: "Branchless code", desc: "Conditional assignment instead of if. `x = cond ? a : b;` or bit tricks. Helps on random patterns." },
      { name: "Sorted data", desc: "Classic Stack Overflow question: why is processing a sorted array faster? Branch prediction nails it." },
      { name: "Likely/unlikely hints", desc: "GCC/Clang __builtin_expect, C++20 [[likely]]/[[unlikely]]. Helps compiler layout code." },
      { name: "Loop unrolling", desc: "Unfold the loop body to cut branch frequency. Auto or manual." },
      { name: "Profile-Guided Optimization (PGO)", desc: "Profile real runs to find hot branches → tell the compiler." },
      { name: "Lookup tables", desc: "Replace branches with table indexing. Effective for small-range switches." },
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Why predict", text: "Deep pipeline + late branch resolution. Without prediction, every branch stalls 15+ cycles." },
      { label: "Static", text: "Simple heuristic (backward = taken). 70-80%. Fallback only in modern designs." },
      { label: "2-bit Counter", text: "Four states. A single miss doesn't flip prediction direction." },
      { label: "Two-Level", text: "Counters indexed by recent history. Learns patterns. 95%+." },
      { label: "TAGE / Perceptron", text: "Multiple history lengths or neural weights. 99%+. Modern CPU standard." },
      { label: "BTB", text: "Branch target cache for indirect branches. Misses here cost more." },
      { label: "Misprediction cost", text: "10-20 cycles. All in-flight work discarded. Worse with deeper pipelines." },
      { label: "Spectre", text: "Speculation's side effect. Cache state leaks secrets. Root of side-channel attacks." },
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

export default function BranchPredictionPage() {
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
            <h3 className="text-xs font-mono text-zinc-400 mb-2">{t.cost.title}</h3>
            <p className="text-[11px] text-zinc-500 mb-3">{t.cost.desc}</p>
            <table className="w-full text-[11px] font-mono mb-3">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-slate-400">CPU</th>
                  <th className="text-left py-2 text-red-400 w-32">Misprediction</th>
                </tr>
              </thead>
              <tbody>
                {t.cost.rows.map((r) => (
                  <tr key={r.cpu} className="border-b border-zinc-800/50">
                    <td className="py-1.5 text-zinc-400">{r.cpu}</td>
                    <td className="py-1.5 text-red-300/80 font-semibold">{r.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-zinc-500 italic">{t.cost.insight}</p>
          </div>
        </Section>

        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.twoBit.title}</h3>
            <pre className="text-[11px] font-mono text-slate-300/80 whitespace-pre leading-relaxed bg-zinc-900/30 p-3 rounded">{t.twoBit.diagram}</pre>
            <p className="text-[10px] text-zinc-500 italic mt-3">{t.twoBit.note}</p>
          </div>
        </Section>

        <Section number={t.sections[4].number} title={t.sections[4].title} description={t.sections[4].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.predictors.title}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] font-mono">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {t.predictors.headers.map((h, i) => (
                      <th key={i} className={`text-left py-2 pr-3 ${i === 0 ? "text-slate-400 w-40" : i === 2 ? "text-cyan-400 w-24" : "text-zinc-500"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.predictors.rows.map((row, i) => (
                    <tr key={i} className="border-b border-zinc-800/50">
                      <td className="py-2 pr-3 text-slate-300/80 font-semibold">{row[0]}</td>
                      <td className="py-2 pr-3 text-zinc-400 text-[10px]">{row[1]}</td>
                      <td className="py-2 pr-3 text-cyan-300/80">{row[2]}</td>
                      <td className="py-2 pr-3 text-zinc-500 text-[10px]">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        <Section number="04" title={t.loopExample.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <pre className="text-[11px] font-mono text-zinc-400 bg-zinc-900/30 p-3 rounded mb-3">{t.loopExample.code}</pre>
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-slate-400 w-56">Predictor</th>
                  <th className="text-left py-2 text-cyan-400 w-20">Correct</th>
                  <th className="text-left py-2 text-zinc-500">Note</th>
                </tr>
              </thead>
              <tbody>
                {t.loopExample.accuracy.map((a) => (
                  <tr key={a.predictor} className="border-b border-zinc-800/50">
                    <td className="py-1.5 text-slate-300/80">{a.predictor}</td>
                    <td className="py-1.5 text-cyan-300/80 font-semibold">{a.correct}</td>
                    <td className="py-1.5 text-zinc-500 text-[10px]">{a.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section number={t.sections[6].number} title={t.sections[6].title} description={t.sections[6].desc}>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-2">{t.spectre.title}</h3>
            <p className="text-[11px] text-zinc-500 mb-3">{t.spectre.desc}</p>
            <div className="space-y-1 mb-3">
              {t.spectre.flow.map((f, i) => (
                <div key={i} className="text-[11px] font-mono text-zinc-400">{f}</div>
              ))}
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <div className="text-[10px] font-mono text-emerald-400 font-semibold mb-1">{lang === "ko" ? "완화책" : "Mitigations"}</div>
              <p className="text-[11px] text-zinc-400">{t.spectre.mitigation}</p>
            </div>
          </div>
        </Section>

        <Section number="06" title={t.software.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.software.items.map((s) => (
                <div key={s.name} className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                  <div className="text-xs font-mono text-slate-300 font-semibold mb-1">{s.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{s.desc}</p>
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
