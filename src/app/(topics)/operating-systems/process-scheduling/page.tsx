"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "operating-systems", current: "process scheduling" },
  hero: {
    title: "Process Scheduling",
    desc: "CPU는 하나, 프로세스는 많다 — 누구를 먼저 실행시킬까?\n스케줄러는 '공정성', '응답성', '처리량' 사이의 트레이드오프를 결정합니다.",
    tags: ["FCFS", "SJF", "Round Robin", "Priority", "MLFQ", "선점/비선점"],
  },
  sections: [
    {
      number: "01",
      title: "프로세스 상태와 큐",
      desc: "New → Ready → Running → Waiting → Terminated. 스케줄러의 일은 Ready 큐에서 어떤 프로세스를 Running으로 옮길지 결정하는 것.",
    },
    {
      number: "02",
      title: "선점 vs 비선점 (Preemptive vs Non-preemptive)",
      desc: "비선점: 프로세스가 자발적으로 CPU를 놓을 때만 교체 (FCFS, SJF). 선점: OS가 강제로 빼앗아 다른 프로세스 실행 (RR, MLFQ). 실시간성·공정성의 핵심.",
    },
    {
      number: "03",
      title: "FCFS — 먼저 온 순서대로",
      desc: "First-Come, First-Served. 가장 단순. 그러나 긴 작업이 앞에 있으면 짧은 작업도 무한정 대기 (Convoy Effect). 비선점.",
    },
    {
      number: "04",
      title: "SJF — 가장 짧은 작업 우선",
      desc: "Shortest Job First. 평균 대기 시간 최적. 단점: 실행 시간을 미리 알아야 함, 긴 작업이 starvation. SRTF는 선점형 버전 (Shortest Remaining Time First).",
    },
    {
      number: "05",
      title: "Round Robin — 시간 할당량",
      desc: "각 프로세스에 일정한 time quantum 부여, 다 쓰면 큐 뒤로. 공정성·응답성 좋음. Quantum이 너무 짧으면 context switch 오버헤드, 너무 길면 FCFS와 비슷해짐.",
    },
    {
      number: "06",
      title: "Priority & MLFQ — 우선순위 기반",
      desc: "각 프로세스에 우선순위. 단점: 낮은 우선순위 starvation → Aging으로 해결. MLFQ(Multilevel Feedback Queue): 여러 큐를 두고 동적으로 이동, 현대 OS의 기반.",
    },
  ],
  metrics: {
    title: "스케줄링 평가 지표",
    rows: [
      { name: "CPU 활용률 (Utilization)", desc: "CPU가 idle이 아닌 시간 비율. 높을수록 좋음.", goal: "최대화" },
      { name: "처리량 (Throughput)", desc: "단위 시간당 완료된 프로세스 수.", goal: "최대화" },
      { name: "반환 시간 (Turnaround)", desc: "도착 ~ 완료까지의 시간.", goal: "최소화" },
      { name: "대기 시간 (Waiting)", desc: "Ready 큐에서 기다린 총 시간.", goal: "최소화" },
      { name: "응답 시간 (Response)", desc: "도착 ~ 첫 응답까지의 시간 (인터랙티브에 중요).", goal: "최소화" },
    ],
  },
  fcfsExample: {
    title: "FCFS 예시 — Gantt 차트",
    setup: "P1(burst=24), P2(burst=3), P3(burst=3) 순서로 도착",
    gantt: "|  P1 (0→24)              | P2 (24→27) | P3 (27→30) |",
    waits: [
      "P1 대기: 0",
      "P2 대기: 24",
      "P3 대기: 27",
      "평균: (0+24+27)/3 = 17",
    ],
    note: "P1이 짧았으면 평균 대기 시간이 훨씬 줄었을 것. → Convoy Effect",
  },
  sjfExample: {
    title: "SJF 같은 입력",
    gantt: "| P2 (0→3) | P3 (3→6) | P1 (6→30)              |",
    waits: [
      "P2 대기: 0",
      "P3 대기: 3",
      "P1 대기: 6",
      "평균: (0+3+6)/3 = 3",
    ],
    note: "평균 대기 시간 최적 (증명 가능). 그러나 burst time을 미리 알아야 함.",
  },
  rrExample: {
    title: "Round Robin (quantum=4)",
    gantt: "|P1|P2|P3|P1|P1|P1|P1|P1|\n   4 3 3 4 4 4 4 4",
    note: "Context switch 오버헤드 발생. quantum 선택이 핵심.",
  },
  comparison: {
    title: "스케줄링 알고리즘 비교",
    headers: ["알고리즘", "선점", "기준", "대기 시간", "Starvation"],
    rows: [
      ["FCFS", "✗", "도착 순서", "긴 작업 뒤면 길어짐", "✗"],
      ["SJF", "✗", "Burst time", "평균 최적", "✓ 가능"],
      ["SRTF", "✓", "남은 Burst time", "최적 (선점형)", "✓ 가능"],
      ["Priority", "둘 다 가능", "우선순위", "우선순위에 의존", "✓ 가능 (Aging 필요)"],
      ["Round Robin", "✓", "Time quantum", "quantum에 의존", "✗"],
      ["MLFQ", "✓", "동적 우선순위", "혼합", "Aging으로 방지"],
    ],
  },
  mlfq: {
    title: "MLFQ — 현대 OS의 기본 아이디어",
    rules: [
      { n: "1", rule: "여러 우선순위 큐를 둠 (Q0 가장 높음, Qn 가장 낮음)" },
      { n: "2", rule: "새 프로세스는 Q0에 들어옴" },
      { n: "3", rule: "Q0에선 짧은 quantum, 더 낮은 큐일수록 quantum 길어짐" },
      { n: "4", rule: "프로세스가 quantum을 다 쓰면 한 단계 아래 큐로 이동 (CPU bound 추정)" },
      { n: "5", rule: "I/O 대기로 양보하면 같은 큐 유지 (Interactive 추정)" },
      { n: "6", rule: "일정 시간마다 모든 프로세스를 Q0로 끌어올림 (Aging — starvation 방지)" },
    ],
    note: "Linux CFS는 다른 접근(가상 실행 시간 기반)이지만, Windows·macOS는 MLFQ 계열.",
  },
  contextSwitch: {
    title: "Context Switch 비용",
    desc: "프로세스를 교체할 때 OS는 현재 프로세스의 레지스터·PC·메모리 맵을 저장하고, 새 프로세스의 것을 로드. 보통 수 마이크로초 ~ 수십 마이크로초.",
    items: [
      "레지스터 저장/복구",
      "PC (Program Counter) 저장/복구",
      "스택 포인터 변경",
      "메모리 관리 구조(페이지 테이블) 전환",
      "TLB flush (또는 ASID 활용)",
      "캐시 미스 증가 (working set 교체)",
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "프로세스 상태", text: "New → Ready → Running → Waiting → Terminated. 스케줄러는 Ready → Running을 결정." },
      { label: "선점 vs 비선점", text: "비선점: 자발적 양보 (FCFS, SJF). 선점: OS가 강제 (RR, MLFQ). 현대 OS는 선점형." },
      { label: "FCFS", text: "단순, 공정. 그러나 Convoy Effect — 긴 작업 뒤가 모두 대기." },
      { label: "SJF/SRTF", text: "평균 대기 시간 최적. 그러나 burst 예측 필요, starvation 위험." },
      { label: "Round Robin", text: "quantum 단위 회전. 공정·응답성 좋음. quantum 선택이 핵심." },
      { label: "Priority", text: "우선순위 기반. 낮은 우선순위 starvation → Aging으로 점진적 승급." },
      { label: "MLFQ", text: "여러 큐 + 동적 이동. CPU/IO 자동 분류. Windows·macOS 기반." },
      { label: "Context switch", text: "수 마이크로초 비용. 너무 잦으면 처리량 하락. quantum이 너무 짧을 때 주의." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "operating-systems", current: "process scheduling" },
  hero: {
    title: "Process Scheduling",
    desc: "One CPU, many processes — who runs first?\nThe scheduler trades off fairness, responsiveness, and throughput.",
    tags: ["FCFS", "SJF", "Round Robin", "Priority", "MLFQ", "Preemptive"],
  },
  sections: [
    {
      number: "01",
      title: "Process States and Queues",
      desc: "New → Ready → Running → Waiting → Terminated. The scheduler's job is to pick the next process from the Ready queue to run.",
    },
    {
      number: "02",
      title: "Preemptive vs Non-preemptive",
      desc: "Non-preemptive: only switches when a process voluntarily yields (FCFS, SJF). Preemptive: OS forcibly takes the CPU (RR, MLFQ). Core to real-time and fairness.",
    },
    {
      number: "03",
      title: "FCFS — First-Come First-Served",
      desc: "Simplest. But a long job in front blocks short jobs (Convoy Effect). Non-preemptive.",
    },
    {
      number: "04",
      title: "SJF — Shortest Job First",
      desc: "Optimal average waiting time. But you need to know burst time in advance, and long jobs can starve. SRTF is the preemptive variant.",
    },
    {
      number: "05",
      title: "Round Robin — Time Slice",
      desc: "Each process gets a fixed quantum; when it runs out, back to the queue. Fair and responsive. Too short → context-switch overhead; too long → behaves like FCFS.",
    },
    {
      number: "06",
      title: "Priority & MLFQ — Priority-based",
      desc: "Each process has a priority. Low priorities starve → use Aging. MLFQ (Multilevel Feedback Queue): multiple queues with dynamic movement — the basis of modern OSes.",
    },
  ],
  metrics: {
    title: "Scheduling Metrics",
    rows: [
      { name: "CPU Utilization", desc: "Fraction of time CPU is not idle.", goal: "Maximize" },
      { name: "Throughput", desc: "Processes completed per unit time.", goal: "Maximize" },
      { name: "Turnaround Time", desc: "Arrival to completion.", goal: "Minimize" },
      { name: "Waiting Time", desc: "Total time spent in Ready queue.", goal: "Minimize" },
      { name: "Response Time", desc: "Arrival to first response (matters for interactive).", goal: "Minimize" },
    ],
  },
  fcfsExample: {
    title: "FCFS Example — Gantt Chart",
    setup: "P1(burst=24), P2(burst=3), P3(burst=3) arrive in this order",
    gantt: "|  P1 (0→24)              | P2 (24→27) | P3 (27→30) |",
    waits: [
      "P1 wait: 0",
      "P2 wait: 24",
      "P3 wait: 27",
      "Avg: (0+24+27)/3 = 17",
    ],
    note: "If P1 were short, average waiting would be much lower → Convoy Effect",
  },
  sjfExample: {
    title: "SJF — same input",
    gantt: "| P2 (0→3) | P3 (3→6) | P1 (6→30)              |",
    waits: [
      "P2 wait: 0",
      "P3 wait: 3",
      "P1 wait: 6",
      "Avg: (0+3+6)/3 = 3",
    ],
    note: "Provably optimal average waiting time. But requires knowing burst time.",
  },
  rrExample: {
    title: "Round Robin (quantum=4)",
    gantt: "|P1|P2|P3|P1|P1|P1|P1|P1|\n   4 3 3 4 4 4 4 4",
    note: "Context-switch overhead. Quantum choice is critical.",
  },
  comparison: {
    title: "Scheduling Algorithm Comparison",
    headers: ["Algorithm", "Preemptive", "Criterion", "Waiting time", "Starvation"],
    rows: [
      ["FCFS", "✗", "Arrival order", "Long behind long → long", "✗"],
      ["SJF", "✗", "Burst time", "Optimal avg", "✓ Possible"],
      ["SRTF", "✓", "Remaining burst", "Optimal (preemptive)", "✓ Possible"],
      ["Priority", "Either", "Priority", "Depends on priority", "✓ Possible (need Aging)"],
      ["Round Robin", "✓", "Time quantum", "Depends on quantum", "✗"],
      ["MLFQ", "✓", "Dynamic priority", "Mixed", "Prevented by Aging"],
    ],
  },
  mlfq: {
    title: "MLFQ — Modern OS Core Idea",
    rules: [
      { n: "1", rule: "Multiple priority queues (Q0 highest, Qn lowest)" },
      { n: "2", rule: "New processes enter Q0" },
      { n: "3", rule: "Higher queues have shorter quanta, lower queues longer" },
      { n: "4", rule: "Use up the quantum → drop one queue (presumed CPU-bound)" },
      { n: "5", rule: "Yield for I/O → stay in same queue (presumed interactive)" },
      { n: "6", rule: "Periodically boost everyone back to Q0 (Aging — prevents starvation)" },
    ],
    note: "Linux CFS uses a different approach (virtual runtime); Windows and macOS are MLFQ-based.",
  },
  contextSwitch: {
    title: "Context Switch Cost",
    desc: "Swapping processes saves the current process's registers, PC, memory map, and loads the new one's. Typically microseconds to tens of microseconds.",
    items: [
      "Save/restore registers",
      "Save/restore PC (Program Counter)",
      "Change stack pointer",
      "Switch memory management (page tables)",
      "TLB flush (or use ASID)",
      "Cache misses spike (working set swap)",
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Process states", text: "New → Ready → Running → Waiting → Terminated. Scheduler picks Ready → Running." },
      { label: "Preemptive vs Non-preemptive", text: "Non-preemptive: voluntary yield (FCFS, SJF). Preemptive: OS forces (RR, MLFQ). Modern OSes are preemptive." },
      { label: "FCFS", text: "Simple, fair. But Convoy Effect — long job blocks everyone behind." },
      { label: "SJF/SRTF", text: "Optimal average waiting. But needs burst prediction; starvation risk." },
      { label: "Round Robin", text: "Quantum-based rotation. Fair and responsive. Quantum tuning is key." },
      { label: "Priority", text: "Priority-based. Low priorities starve → Aging gradually promotes them." },
      { label: "MLFQ", text: "Multiple queues + dynamic movement. Auto-classifies CPU/IO. Powers Windows and macOS." },
      { label: "Context switch", text: "Microseconds of overhead. Too frequent → throughput drops. Watch quantum that's too short." },
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

export default function ProcessSchedulingPage() {
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

        {/* 01 - metrics */}
        <Section number={t.sections[0].number} title={t.sections[0].title} description={t.sections[0].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.metrics.title}</h3>
            <div className="space-y-2">
              {t.metrics.rows.map((r) => (
                <div key={r.name} className="grid grid-cols-[160px_1fr_80px] items-center gap-3 text-[11px] font-mono">
                  <span className="text-orange-300/80">{r.name}</span>
                  <span className="text-zinc-500">{r.desc}</span>
                  <span className="text-emerald-400/80 text-right">{r.goal}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 02 - FCFS */}
        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-2">{t.fcfsExample.title}</h3>
            <p className="text-[11px] text-zinc-500 mb-3">{t.fcfsExample.setup}</p>
            <pre className="text-[11px] font-mono text-orange-300 mb-3">{t.fcfsExample.gantt}</pre>
            <div className="space-y-0.5">
              {t.fcfsExample.waits.map((w, i) => (
                <div key={i} className="text-[11px] font-mono text-zinc-400">{w}</div>
              ))}
            </div>
            <p className="text-[10px] text-red-400/80 italic mt-3">⚠ {t.fcfsExample.note}</p>
          </div>
        </Section>

        {/* 03 - SJF */}
        <Section number={t.sections[3].number} title={t.sections[3].title} description={t.sections[3].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.sjfExample.title}</h3>
            <pre className="text-[11px] font-mono text-emerald-300 mb-3">{t.sjfExample.gantt}</pre>
            <div className="space-y-0.5">
              {t.sjfExample.waits.map((w, i) => (
                <div key={i} className="text-[11px] font-mono text-zinc-400">{w}</div>
              ))}
            </div>
            <p className="text-[10px] text-emerald-400/80 italic mt-3">✓ {t.sjfExample.note}</p>
          </div>
        </Section>

        {/* 04 - RR */}
        <Section number={t.sections[4].number} title={t.sections[4].title} description={t.sections[4].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.rrExample.title}</h3>
            <pre className="text-[11px] font-mono text-orange-300 mb-2 whitespace-pre">{t.rrExample.gantt}</pre>
            <p className="text-[10px] text-zinc-500 italic">{t.rrExample.note}</p>
          </div>
        </Section>

        {/* 05 - comparison */}
        <Section number="05" title={t.comparison.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.comparison.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-orange-400 w-28" : "text-zinc-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.comparison.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-orange-300/80 font-semibold">{row[0]}</td>
                    <td className="py-2 text-zinc-400">{row[1]}</td>
                    <td className="py-2 text-zinc-400">{row[2]}</td>
                    <td className="py-2 text-zinc-400">{row[3]}</td>
                    <td className="py-2 text-zinc-400">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 06 - MLFQ */}
        <Section number={t.sections[5].number} title={t.sections[5].title} description={t.sections[5].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.mlfq.title}</h3>
            <div className="space-y-1.5">
              {t.mlfq.rules.map((r) => (
                <div key={r.n} className="flex items-start gap-3 text-[11px] font-mono">
                  <span className="text-orange-400/80 font-semibold min-w-[20px]">{r.n}.</span>
                  <span className="text-zinc-400">{r.rule}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500 italic mt-4">{t.mlfq.note}</p>
          </div>
        </Section>

        {/* context switch */}
        <Section number="07" title={t.contextSwitch.title} description={t.contextSwitch.desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <ul className="space-y-1">
              {t.contextSwitch.items.map((item, i) => (
                <li key={i} className="text-[11px] text-zinc-400 leading-relaxed flex gap-2">
                  <span className="text-orange-400">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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
