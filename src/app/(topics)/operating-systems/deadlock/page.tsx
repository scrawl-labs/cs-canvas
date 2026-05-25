"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "operating-systems", current: "deadlock" },
  hero: {
    title: "Deadlock",
    desc: "두 프로세스가 서로의 자원을 기다리며 영원히 멈춤.\n4가지 조건이 모두 성립할 때 발생 — 하나만 깨면 데드락은 일어나지 않습니다.",
    tags: ["4조건", "RAG", "Banker's", "예방·회피·탐지·회복", "라이브락"],
  },
  sections: [
    {
      number: "01",
      title: "데드락이란",
      desc: "두 개 이상의 프로세스가 서로가 가진 자원을 기다리며 무한히 대기하는 상태. CPU·메모리·파일·DB row·뮤텍스 등 어떤 자원에서든 발생 가능.",
    },
    {
      number: "02",
      title: "4가지 필요 조건 (Coffman Conditions)",
      desc: "1) 상호 배제(Mutual Exclusion), 2) 점유와 대기(Hold and Wait), 3) 비선점(No Preemption), 4) 원형 대기(Circular Wait). 모두 성립해야 데드락. 하나만 깨도 예방.",
    },
    {
      number: "03",
      title: "Resource Allocation Graph (RAG)",
      desc: "프로세스 → 자원: 요청. 자원 → 프로세스: 할당. RAG에 사이클이 있으면 데드락 가능 (자원 인스턴스가 1개씩이면 사이클 = 데드락 보장).",
    },
    {
      number: "04",
      title: "대응 전략 — 예방·회피·탐지·무시",
      desc: "예방(Prevention): 4조건 중 하나를 깸. 회피(Avoidance): Banker's algorithm으로 안전 상태 유지. 탐지(Detection): 주기적 확인 후 회복. 무시(Ostrich): Unix/Linux의 기본 — 드물어서 무시.",
    },
    {
      number: "05",
      title: "Banker's Algorithm — 회피 전략",
      desc: "각 프로세스가 최대 필요량을 미리 선언. 자원 요청 시, OS가 가상 할당해보고 모든 프로세스가 완료 가능한 안전 상태(safe state)인지 검사. 안전하지 않으면 거부.",
    },
    {
      number: "06",
      title: "회복 — Kill or Rollback",
      desc: "데드락 탐지 후: 1) 프로세스 종료 (전부 또는 한 개씩), 2) 자원 선점 (다른 프로세스에 넘김), 3) 체크포인트로 롤백. 가장 비용 적은 victim을 선택.",
    },
  ],
  coffman: {
    title: "Coffman Conditions — 4가지 모두 성립해야",
    items: [
      {
        name: "1. Mutual Exclusion",
        ko: "상호 배제",
        desc: "자원은 한 번에 한 프로세스만 사용. 공유 불가능한 자원이 있어야 함.",
        break: "공유 가능한 자원으로 만들기 (대부분의 경우 어려움)",
      },
      {
        name: "2. Hold and Wait",
        ko: "점유와 대기",
        desc: "자원을 가진 채로 다른 자원을 요청하며 대기.",
        break: "시작 시 모든 자원을 한 번에 요청 (효율 떨어짐)",
      },
      {
        name: "3. No Preemption",
        ko: "비선점",
        desc: "프로세스가 자발적으로 놓을 때까지 빼앗을 수 없음.",
        break: "OS가 자원을 강제로 회수 (일부 자원만 가능)",
      },
      {
        name: "4. Circular Wait",
        ko: "원형 대기",
        desc: "P1 → P2 → P3 → ... → P1처럼 자원 대기가 사이클을 형성.",
        break: "자원에 전역 순서 부여, 항상 오름차순으로 요청 (실용적)",
      },
    ],
  },
  rag: {
    title: "RAG 예시 — 데드락 사이클",
    diagram: `   P1 ──request──→ R2
   ↑                │
   │                ↓ assigned
   R1 ←─assigned── P2
   ↑                │
   │                ↓ request
   P2 ──────────────┘`,
    explanation: "P1은 R2를 요청, R2는 P2에 할당, P2는 R1을 요청, R1은 P1에 할당. 사이클 → 데드락.",
  },
  classic: {
    title: "고전 예시 — Dining Philosophers",
    desc: "5명의 철학자가 원형 테이블에 앉아 양옆 포크를 들어야 식사. 모두 동시에 왼쪽 포크를 잡으면 오른쪽 포크 영원히 기다림 → 데드락.",
    fixes: [
      "포크에 순번 부여, 낮은 번호부터 잡기 (원형 대기 깨기)",
      "한 번에 한 명만 시도 가능 (Mutex로 권한 부여)",
      "양쪽 포크 동시에 잡기 (Hold and Wait 깨기)",
      "비대칭: 짝수번 철학자는 왼쪽부터, 홀수번은 오른쪽부터",
    ],
  },
  strategies: {
    title: "데드락 대응 전략",
    headers: ["전략", "방법", "비용", "사용처"],
    rows: [
      ["Prevention", "4조건 중 하나 깨기", "효율 저하", "임베디드, 실시간"],
      ["Avoidance", "Banker's algorithm", "Safe state 검사 비용", "이론적, 거의 안 씀"],
      ["Detection + Recovery", "주기적 RAG 검사 + Kill", "탐지·회복 오버헤드", "DB 시스템"],
      ["Ignore (Ostrich)", "안 함", "거의 0", "Unix/Linux (드물어서)"],
    ],
  },
  bankers: {
    title: "Banker's Algorithm — 핵심 아이디어",
    state: [
      { proc: "P0", max: "(7,5,3)", alloc: "(0,1,0)", need: "(7,4,3)" },
      { proc: "P1", max: "(3,2,2)", alloc: "(2,0,0)", need: "(1,2,2)" },
      { proc: "P2", max: "(9,0,2)", alloc: "(3,0,2)", need: "(6,0,0)" },
      { proc: "P3", max: "(2,2,2)", alloc: "(2,1,1)", need: "(0,1,1)" },
      { proc: "P4", max: "(4,3,3)", alloc: "(0,0,2)", need: "(4,3,1)" },
    ],
    available: "Available = (3,3,2)",
    note: "각 프로세스의 Need = Max - Alloc. Available로 어떤 Need를 충족시킬 수 있는지 확인하여 안전한 실행 순서가 있으면 safe state.",
  },
  livelock: {
    title: "Livelock과 Starvation — 데드락의 사촌",
    items: [
      { name: "Deadlock", desc: "두 프로세스가 서로를 영원히 기다림. 아무것도 안 함." },
      { name: "Livelock", desc: "프로세스들이 끊임없이 상태를 바꾸지만 진척이 없음. 양보의 양보. (좁은 복도에서 마주친 두 사람)" },
      { name: "Starvation", desc: "프로세스가 자원을 영원히 얻지 못함. 다른 프로세스가 계속 우선됨. (낮은 우선순위가 영원히 뒤로)" },
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "데드락", text: "둘 이상의 프로세스가 서로의 자원을 기다리며 영원히 멈춤. 4조건 모두 성립할 때만." },
      { label: "Mutual Exclusion", text: "자원을 한 번에 한 명만. 깨기 어려움 — 자원의 본질." },
      { label: "Hold and Wait", text: "자원을 가진 채 다른 자원 대기. 시작 시 일괄 요청으로 깰 수 있음." },
      { label: "No Preemption", text: "자원을 빼앗을 수 없음. CPU는 선점 가능하지만 락은 어려움." },
      { label: "Circular Wait", text: "자원 대기가 사이클. 자원 번호 순으로 잡으면 깸 — 실무에서 가장 흔한 방법." },
      { label: "RAG", text: "Resource Allocation Graph. 사이클 → 데드락 가능성. 자원 인스턴스 1개씩이면 사이클 = 데드락." },
      { label: "Banker's Algorithm", text: "Safe state 유지. 이론적으로 우아, 실무에선 거의 사용 안 함 (최대 필요량 선언이 비현실적)." },
      { label: "Livelock vs Starvation", text: "Livelock: 움직이는데 진척 없음. Starvation: 자원 못 받음. 둘 다 데드락은 아니지만 비슷한 문제." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "operating-systems", current: "deadlock" },
  hero: {
    title: "Deadlock",
    desc: "Two processes wait forever for each other's resources.\nFour conditions must all hold — break any one and deadlock cannot happen.",
    tags: ["4 conditions", "RAG", "Banker's", "Prevent/Avoid/Detect", "Livelock"],
  },
  sections: [
    {
      number: "01",
      title: "What is Deadlock",
      desc: "Two or more processes wait indefinitely for resources held by each other. Can happen with any resource — CPU, memory, files, DB rows, mutexes.",
    },
    {
      number: "02",
      title: "Four Necessary Conditions (Coffman)",
      desc: "1) Mutual Exclusion, 2) Hold and Wait, 3) No Preemption, 4) Circular Wait. All four must hold simultaneously. Break any one to prevent.",
    },
    {
      number: "03",
      title: "Resource Allocation Graph (RAG)",
      desc: "Process → resource: request edge. Resource → process: assignment edge. A cycle in RAG means possible deadlock (with single instances, a cycle = deadlock).",
    },
    {
      number: "04",
      title: "Strategies — Prevent, Avoid, Detect, Ignore",
      desc: "Prevention: break one of the 4 conditions. Avoidance: keep system in safe state (Banker's). Detection: scan periodically, recover. Ignore (Ostrich): Unix/Linux default — rare in practice.",
    },
    {
      number: "05",
      title: "Banker's Algorithm — Avoidance",
      desc: "Each process declares its maximum needs up front. On request, OS simulates allocation and checks for a safe state where all processes can complete. Reject if unsafe.",
    },
    {
      number: "06",
      title: "Recovery — Kill or Rollback",
      desc: "After detection: 1) kill processes (all or one at a time), 2) preempt resources, 3) roll back to a checkpoint. Pick the lowest-cost victim.",
    },
  ],
  coffman: {
    title: "Coffman Conditions — all four must hold",
    items: [
      {
        name: "1. Mutual Exclusion",
        ko: "Mutual Exclusion",
        desc: "Resource used by at most one process at a time. There must exist non-sharable resources.",
        break: "Make resources shareable (rarely feasible)",
      },
      {
        name: "2. Hold and Wait",
        ko: "Hold and Wait",
        desc: "Holding some resources while waiting for others.",
        break: "Request all resources up front (hurts utilization)",
      },
      {
        name: "3. No Preemption",
        ko: "No Preemption",
        desc: "Resources can't be taken; processes must release voluntarily.",
        break: "Let OS forcibly reclaim resources (works for some, not all)",
      },
      {
        name: "4. Circular Wait",
        ko: "Circular Wait",
        desc: "P1 → P2 → P3 → ... → P1 cycle of waits.",
        break: "Global resource ordering, always request in ascending order (practical)",
      },
    ],
  },
  rag: {
    title: "RAG Example — Deadlock Cycle",
    diagram: `   P1 ──request──→ R2
   ↑                │
   │                ↓ assigned
   R1 ←─assigned── P2
   ↑                │
   │                ↓ request
   P2 ──────────────┘`,
    explanation: "P1 wants R2 (held by P2), P2 wants R1 (held by P1). Cycle → deadlock.",
  },
  classic: {
    title: "Classic Example — Dining Philosophers",
    desc: "5 philosophers seated in a circle need both adjacent forks to eat. If everyone grabs the left fork simultaneously, all wait for the right → deadlock.",
    fixes: [
      "Number the forks; pick up lower-numbered first (breaks circular wait)",
      "Allow only one philosopher to try at a time (mutex)",
      "Pick up both forks together (breaks hold-and-wait)",
      "Asymmetry: even philosophers start with left, odd with right",
    ],
  },
  strategies: {
    title: "Deadlock Strategies",
    headers: ["Strategy", "Method", "Cost", "Used in"],
    rows: [
      ["Prevention", "Break one of the 4 conditions", "Lower utilization", "Embedded, real-time"],
      ["Avoidance", "Banker's algorithm", "Safe-state check overhead", "Mostly theoretical"],
      ["Detection + Recovery", "Periodic RAG scan + kill", "Detection/recovery cost", "Database systems"],
      ["Ignore (Ostrich)", "Do nothing", "~0", "Unix/Linux (rare in practice)"],
    ],
  },
  bankers: {
    title: "Banker's Algorithm — Core Idea",
    state: [
      { proc: "P0", max: "(7,5,3)", alloc: "(0,1,0)", need: "(7,4,3)" },
      { proc: "P1", max: "(3,2,2)", alloc: "(2,0,0)", need: "(1,2,2)" },
      { proc: "P2", max: "(9,0,2)", alloc: "(3,0,2)", need: "(6,0,0)" },
      { proc: "P3", max: "(2,2,2)", alloc: "(2,1,1)", need: "(0,1,1)" },
      { proc: "P4", max: "(4,3,3)", alloc: "(0,0,2)", need: "(4,3,1)" },
    ],
    available: "Available = (3,3,2)",
    note: "Need = Max - Alloc. Check if available resources can satisfy some Need; mark that process done and release its alloc, then repeat. If all finish, state is safe.",
  },
  livelock: {
    title: "Livelock and Starvation — Deadlock's Cousins",
    items: [
      { name: "Deadlock", desc: "Two processes wait for each other forever. Nothing happens." },
      { name: "Livelock", desc: "Processes keep changing state but make no progress. Mutual yielding. (Two people in a narrow corridor each stepping aside.)" },
      { name: "Starvation", desc: "A process never gets a resource. Other processes always get prioritized. (Low priority forever bumped back.)" },
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Deadlock", text: "Two+ processes wait forever for each other's resources. Needs all 4 conditions." },
      { label: "Mutual Exclusion", text: "One holder at a time. Hard to break — it's the nature of the resource." },
      { label: "Hold and Wait", text: "Hold some, wait for more. Break by requesting everything up front." },
      { label: "No Preemption", text: "Can't take resources back. CPU can be preempted; locks rarely can." },
      { label: "Circular Wait", text: "Cycle of waits. Break by global resource ordering — the most practical fix." },
      { label: "RAG", text: "Resource Allocation Graph. Cycle → potential deadlock. Single instances: cycle = deadlock." },
      { label: "Banker's Algorithm", text: "Maintain safe state. Elegant in theory, rarely used in practice (max-need declaration unrealistic)." },
      { label: "Livelock vs Starvation", text: "Livelock: moving but no progress. Starvation: never gets the resource. Both are related but distinct." },
    ],
  },
};

interface SectionProps {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}

function Section({ number, title, description, children }: SectionProps) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-xs font-mono text-orange-500/60">{number}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function DeadlockPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(251,146,60,0.06),transparent)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.home}</Link>
          <span>/</span>
          <Link href="/operating-systems" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.parent}</Link>
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

        {/* 01 + 02 - coffman */}
        <Section number={t.sections[1].number} title={t.sections[1].title} description={t.sections[1].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.coffman.title}</h3>
            <div className="space-y-2">
              {t.coffman.items.map((c) => (
                <div key={c.name} className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                  <div className="text-xs font-mono text-orange-300 font-semibold mb-1">{c.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">{c.desc}</p>
                  <div className="text-[10px] text-emerald-400/80">
                    <span className="font-semibold">{lang === "ko" ? "깨는 방법: " : "How to break: "}</span>
                    <span>{c.break}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 03 - RAG */}
        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.rag.title}</h3>
            <pre className="text-[11px] font-mono text-orange-300 mb-3">{t.rag.diagram}</pre>
            <p className="text-[11px] text-zinc-500">{t.rag.explanation}</p>
          </div>
        </Section>

        {/* classic */}
        <Section number="03" title={t.classic.title} description={t.classic.desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="text-[11px] font-mono text-zinc-400 mb-3">{lang === "ko" ? "해결 방법" : "Fixes"}</div>
            <ul className="space-y-1.5">
              {t.classic.fixes.map((f, i) => (
                <li key={i} className="text-[11px] text-zinc-400 leading-relaxed flex gap-2">
                  <span className="text-orange-400">→</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* 04 - strategies */}
        <Section number={t.sections[3].number} title={t.sections[3].title} description={t.sections[3].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.strategies.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-orange-400 w-44" : "text-zinc-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.strategies.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-orange-300/80 font-semibold">{row[0]}</td>
                    <td className="py-2 text-zinc-400">{row[1]}</td>
                    <td className="py-2 text-zinc-500 text-[10px]">{row[2]}</td>
                    <td className="py-2 text-zinc-500 text-[10px]">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 05 - banker's */}
        <Section number={t.sections[4].number} title={t.sections[4].title} description={t.sections[4].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.bankers.title}</h3>
            <table className="w-full text-[11px] font-mono mb-3">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-orange-400 w-20">Process</th>
                  <th className="text-left py-2 text-zinc-500 w-28">Max</th>
                  <th className="text-left py-2 text-emerald-400 w-28">Allocation</th>
                  <th className="text-left py-2 text-amber-400">Need</th>
                </tr>
              </thead>
              <tbody>
                {t.bankers.state.map((s) => (
                  <tr key={s.proc} className="border-b border-zinc-800/50">
                    <td className="py-2 text-orange-300/80">{s.proc}</td>
                    <td className="py-2 text-zinc-400">{s.max}</td>
                    <td className="py-2 text-emerald-300/80">{s.alloc}</td>
                    <td className="py-2 text-amber-300/80">{s.need}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-[11px] font-mono text-cyan-300/80 mb-3">{t.bankers.available}</div>
            <p className="text-[11px] text-zinc-500 italic leading-relaxed">{t.bankers.note}</p>
          </div>
        </Section>

        {/* livelock */}
        <Section number="06" title={t.livelock.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {t.livelock.items.map((i) => (
                <div key={i.name} className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                  <div className="text-xs font-mono text-orange-300 font-semibold mb-1">{i.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{i.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold text-sm font-mono mb-5">{t.summary.title}</h3>
          <div className="space-y-3">
            {t.summary.items.map((item) => (
              <div key={item.label} className="flex gap-3 items-start">
                <span className="text-xs font-mono text-orange-500/50 shrink-0 mt-0.5 min-w-[140px]">{item.label}</span>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
