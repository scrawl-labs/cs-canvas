"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "operating-systems", current: "virtual memory" },
  hero: {
    title: "Virtual Memory",
    desc: "RAM보다 큰 메모리를 가진 것처럼 — 디스크를 '느린 RAM 확장'으로 사용.\nPage Fault, Demand Paging, TLB, Working Set — 가짜 메모리를 진짜처럼 보이게 하는 메커니즘.",
    tags: ["Demand Paging", "Page Fault", "TLB", "Working Set", "Swap", "Thrashing"],
  },
  sections: [
    {
      number: "01",
      title: "왜 Virtual Memory인가",
      desc: "이유 4가지: 1) 격리 (각 프로세스가 자기 주소 공간), 2) 오버서브스크립션 (RAM보다 큰 가상 공간), 3) 공유 (라이브러리 한 번만), 4) 보호 (권한 비트). 메모리 안전성과 효율의 핵심.",
    },
    {
      number: "02",
      title: "Demand Paging — 필요할 때만 적재",
      desc: "프로세스 시작 시 모든 페이지를 메모리에 올리지 않음. 실제 접근하는 페이지만 디스크에서 로드. 빠른 시작, 메모리 절약. 첫 접근은 Page Fault 발생 → 느림.",
    },
    {
      number: "03",
      title: "Page Fault — 가상이 실제로 변환되는 순간",
      desc: "1) CPU가 가상 주소 접근. 2) Page Table에서 매핑 확인. 3) 메모리에 없으면 (P bit=0) Page Fault 트랩. 4) OS가 디스크에서 페이지 읽어 빈 프레임에 적재. 5) Page Table 업데이트, TLB 무효화. 6) 명령어 재실행.",
    },
    {
      number: "04",
      title: "TLB — 매번 Page Table 조회는 너무 느림",
      desc: "Page Table 조회는 메모리 접근. 매 명령마다 그러면 너무 느림. TLB(Translation Lookaside Buffer)는 최근 매핑을 CPU 캐시에 저장. Hit: 1 cycle, Miss: page walk.",
    },
    {
      number: "05",
      title: "Working Set — 자주 쓰는 페이지 집합",
      desc: "프로세스가 일정 시간 동안 접근하는 페이지들. 이 working set이 할당된 프레임보다 크면 Thrashing. 작으면 메모리 낭비. OS는 working set을 모니터링해 프레임 할당 조정.",
    },
    {
      number: "06",
      title: "Swap — 디스크가 RAM의 연장",
      desc: "메모리 부족 시 잘 안 쓰는 페이지를 디스크 swap 공간으로 내보냄. 나중에 다시 필요하면 page fault로 가져옴. SSD 시대에 swap은 빨라졌지만, RAM 대비 100배 느림.",
    },
  ],
  reasons: {
    title: "Virtual Memory의 네 가지 효용",
    items: [
      { name: "1. Isolation", desc: "각 프로세스의 가상 주소 공간은 독립. 한 프로세스가 다른 프로세스 메모리 못 봄. 보안의 기본." },
      { name: "2. Oversubscription", desc: "RAM 16GB지만 32GB 사용 가능. 자주 안 쓰는 페이지는 swap으로." },
      { name: "3. Sharing", desc: "공유 라이브러리는 한 번만 메모리에 로드, 여러 프로세스가 매핑. 메모리 절약." },
      { name: "4. Protection", desc: "Page Table 엔트리에 read/write/execute 권한 비트. NULL 포인터 접근 시 SIGSEGV." },
    ],
  },
  pageFaultFlow: {
    title: "Page Fault 처리 흐름",
    steps: [
      { n: "1", action: "CPU: load 0x12345678" },
      { n: "2", action: "TLB miss → Page Table 조회" },
      { n: "3", action: "PTE present 비트 = 0 → Page Fault 트랩" },
      { n: "4", action: "OS handler: 디스크 위치 확인, 빈 frame 찾음" },
      { n: "5", action: "필요 시 victim page 선택 (LRU/CLOCK) → 쫓아냄 (modified면 디스크 쓰기)" },
      { n: "6", action: "디스크에서 페이지 읽어 frame에 적재 (수 ms 지연)" },
      { n: "7", action: "Page Table 업데이트, TLB 무효화" },
      { n: "8", action: "원래 명령어 재실행 → 이번엔 성공" },
    ],
    timing: "Major Page Fault: 수 ms (디스크 I/O). Minor Page Fault: 마이크로초 (매핑만 추가).",
  },
  tlbDetail: {
    title: "TLB와 Page Table의 관계",
    flow: `CPU: load 0x12345678
         │
         ▼
    ┌─────────┐
    │   TLB   │  ← 최근 변환 캐시 (수십~수백 엔트리)
    └─────────┘
       │ ▲
   hit │ │ miss → page walk
       ▼ │
    Physical address
         (1 cycle)

miss: ▼
┌──────────────┐
│  Page Table  │  ← 메모리에 위치 (4단계 트리)
└──────────────┘
       │
       ▼
    Physical address
       (~수십 cycle, 4번의 메모리 접근)`,
    insight: "TLB hit rate가 매우 높아야 (99%+) 성능 좋음. Context switch마다 TLB flush (또는 ASID 활용).",
  },
  workingSet: {
    title: "Working Set 시각화",
    desc: "어떤 시점에서 프로세스가 활발히 접근하는 페이지 집합. 시간에 따라 변함 (Phase 변화).",
    visual: `시간 →

페이지   ████░░░░░░░░░░░░  (initialization phase)
1-100    ░░██████████░░░░  (computation phase)
         ░░░░░░██████████  (output phase)

각 phase의 working set이 RAM 프레임에 맞아야 효율적.
working set > frames → thrashing.`,
  },
  thrashing: {
    title: "Thrashing — Working Set이 RAM보다 클 때",
    desc: "프로세스가 자주 쓰는 페이지가 RAM보다 많으면, 페이지가 끊임없이 swap in/out. CPU는 일을 못하고 디스크 I/O만 함.",
    chart: `CPU 활용률
  ↑
  │     ╭─── 이상적
  │    ╱
  │   ╱
  │  ╱
  │ ╱           ╲___ thrashing (급락!)
  │╱
  └──────────────────→ 메모리에 올라간 프로세스 수
                     (multiprogramming degree)`,
    solutions: [
      "Working set 모니터링 후 프레임 늘리기",
      "Multiprogramming degree 줄이기 (프로세스 일부 swap out)",
      "더 큰 페이지 사용 (2MB Huge Page → TLB miss 감소)",
      "RAM 증설 (근본 해결)",
    ],
  },
  swap: {
    title: "Swap — 디스크의 가상 RAM",
    items: [
      { name: "Swap In", desc: "디스크의 페이지를 RAM으로. Page Fault 시." },
      { name: "Swap Out (Page Out)", desc: "RAM의 페이지를 디스크로. 메모리 부족 시 victim page를 쫓아냄." },
      { name: "Swap Space", desc: "디스크의 전용 영역 (Linux: swap partition 또는 swapfile). RAM의 1~2배 권장." },
      { name: "성능 영향", desc: "RAM ≈ 100ns, SSD ≈ 100μs (1000배), HDD ≈ 10ms (100,000배). Swap 자주 발생하면 성능 급락." },
    ],
  },
  replacement: {
    title: "Page Replacement — 누구를 쫓아낼까",
    headers: ["알고리즘", "기준", "비고"],
    rows: [
      ["FIFO", "가장 먼저 적재된 페이지", "Belady's anomaly — 메모리 늘려도 더 안 좋아질 수 있음"],
      ["Optimal (OPT)", "가장 오래 안 쓸 페이지", "이론적 최적, 구현 불가 (미래 모름)"],
      ["LRU (Least Recently Used)", "가장 오래 안 쓴 페이지 (과거)", "Optimal에 가까움. 그러나 매 접근마다 갱신 비용 큼"],
      ["LRU 근사 (CLOCK / Second Chance)", "Reference bit + 원형 스캔", "실용적 LRU. 대부분 OS의 기본"],
      ["LFU (Least Frequently Used)", "사용 빈도 최저", "초기 자주 쓰인 페이지가 영원히 남는 문제"],
      ["NRU (Not Recently Used)", "최근 사용 안 한 페이지 (R bit 0)", "주기적 R bit 리셋"],
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "Virtual Memory", text: "각 프로세스의 가상 주소 공간. Isolation, Oversubscription, Sharing, Protection." },
      { label: "Demand Paging", text: "필요할 때만 적재. 첫 접근은 Page Fault, 이후엔 캐시." },
      { label: "Page Fault", text: "Major (디스크 I/O, 수 ms) vs Minor (매핑만 추가, μs)." },
      { label: "TLB", text: "Page Table 캐시. Hit rate가 성능 좌우. Context switch마다 flush." },
      { label: "Working Set", text: "활발히 접근하는 페이지 집합. 시간에 따라 변함. RAM에 맞아야 효율적." },
      { label: "Thrashing", text: "Working set > RAM → 끊임없는 swap → CPU 멈춤. 가장 위험한 상태." },
      { label: "Swap", text: "디스크가 RAM의 연장. RAM보다 100~100,000배 느림. 자주 발생하면 성능 급락." },
      { label: "Page Replacement", text: "RAM 가득 차면 페이지 쫓아냄. LRU 이상적, CLOCK 실용적. FIFO는 Belady's anomaly 위험." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "operating-systems", current: "virtual memory" },
  hero: {
    title: "Virtual Memory",
    desc: "More memory than RAM — disk as a 'slow RAM extension'.\nPage Fault, Demand Paging, TLB, Working Set — the mechanisms that make fake memory look real.",
    tags: ["Demand Paging", "Page Fault", "TLB", "Working Set", "Swap", "Thrashing"],
  },
  sections: [
    {
      number: "01",
      title: "Why Virtual Memory",
      desc: "Four reasons: 1) Isolation (each process has its own address space), 2) Oversubscription (virtual > physical), 3) Sharing (libraries loaded once), 4) Protection (permission bits). The basis of memory safety and efficiency.",
    },
    {
      number: "02",
      title: "Demand Paging — Load on Access",
      desc: "Don't preload all pages at startup. Load each page only when it's actually touched. Fast startup, low memory. First access is a Page Fault (slow); after that it's cached.",
    },
    {
      number: "03",
      title: "Page Fault — Virtual Meets Physical",
      desc: "1) CPU accesses a virtual address. 2) Page Table lookup. 3) Page not in memory (P=0) → trap. 4) OS reads the page from disk into a free frame. 5) Update page table, invalidate TLB. 6) Re-run the instruction.",
    },
    {
      number: "04",
      title: "TLB — Page Table Lookups Are Slow",
      desc: "Each Page Table walk costs memory accesses. Doing that per instruction is too slow. The TLB caches recent translations on the CPU. Hit: 1 cycle. Miss: full page walk.",
    },
    {
      number: "05",
      title: "Working Set — Pages You Use",
      desc: "The set of pages a process actively touches over a window. If it exceeds allocated frames → thrashing. Too few frames → wasted RAM. OS monitors and adjusts allocation.",
    },
    {
      number: "06",
      title: "Swap — Disk as RAM's Extension",
      desc: "Out of memory? Push lesser-used pages to swap on disk. Bring them back on next page fault. SSDs make swap faster, but it's still ~100× slower than RAM.",
    },
  ],
  reasons: {
    title: "Four Benefits of Virtual Memory",
    items: [
      { name: "1. Isolation", desc: "Per-process address spaces are independent. One process can't see another's memory. Security 101." },
      { name: "2. Oversubscription", desc: "16 GB RAM, but 32 GB usable. Rarely accessed pages live in swap." },
      { name: "3. Sharing", desc: "Shared libraries loaded once; processes map the same physical pages. Memory saver." },
      { name: "4. Protection", desc: "Per-PTE read/write/execute bits. NULL pointer access → SIGSEGV." },
    ],
  },
  pageFaultFlow: {
    title: "Page Fault Handler Flow",
    steps: [
      { n: "1", action: "CPU: load 0x12345678" },
      { n: "2", action: "TLB miss → Page Table walk" },
      { n: "3", action: "PTE present bit = 0 → page fault trap" },
      { n: "4", action: "OS handler: locate on disk, find a free frame" },
      { n: "5", action: "Choose victim if needed (LRU/CLOCK) → evict (write back if dirty)" },
      { n: "6", action: "Read the page from disk into the frame (milliseconds)" },
      { n: "7", action: "Update page table, invalidate TLB entry" },
      { n: "8", action: "Re-run the original instruction — succeeds now" },
    ],
    timing: "Major Page Fault: milliseconds (disk I/O). Minor Page Fault: microseconds (mapping only).",
  },
  tlbDetail: {
    title: "TLB and Page Table",
    flow: `CPU: load 0x12345678
         │
         ▼
    ┌─────────┐
    │   TLB   │  ← cache of recent translations (tens-hundreds of entries)
    └─────────┘
       │ ▲
   hit │ │ miss → page walk
       ▼ │
    Physical address
         (1 cycle)

miss: ▼
┌──────────────┐
│  Page Table  │  ← in memory (4-level tree)
└──────────────┘
       │
       ▼
    Physical address
       (~tens of cycles, 4 memory accesses)`,
    insight: "TLB hit rate must be very high (>99%) for performance. Flushed on context switch (or ASID used).",
  },
  workingSet: {
    title: "Working Set Visualized",
    desc: "The set of pages actively touched in a given window. Changes over time (phase shifts).",
    visual: `time →

pages   ████░░░░░░░░░░░░  (initialization phase)
1-100   ░░██████████░░░░  (computation phase)
        ░░░░░░██████████  (output phase)

Each phase's working set must fit in RAM frames to be efficient.
Working set > frames → thrashing.`,
  },
  thrashing: {
    title: "Thrashing — Working Set Exceeds RAM",
    desc: "When the actively-used page set is bigger than RAM, pages thrash in/out. CPU stops working — it's all disk I/O.",
    chart: `CPU Utilization
  ↑
  │     ╭─── ideal
  │    ╱
  │   ╱
  │  ╱
  │ ╱           ╲___ thrashing (cliff!)
  │╱
  └──────────────────→ Multiprogramming degree
                     (#processes in memory)`,
    solutions: [
      "Monitor working set and increase frames",
      "Reduce multiprogramming degree (swap some processes out)",
      "Use larger pages (2 MB Huge Pages → fewer TLB misses)",
      "Add RAM (the real fix)",
    ],
  },
  swap: {
    title: "Swap — Virtual RAM on Disk",
    items: [
      { name: "Swap In", desc: "Pull a page from disk into RAM. Triggered by a page fault." },
      { name: "Swap Out (Page Out)", desc: "Push a page from RAM to disk. Happens when memory is tight and a victim is evicted." },
      { name: "Swap Space", desc: "Dedicated area on disk (Linux: swap partition or swapfile). 1–2× RAM is a common recommendation." },
      { name: "Performance impact", desc: "RAM ≈ 100 ns, SSD ≈ 100 μs (1000×), HDD ≈ 10 ms (100,000×). Frequent swap = collapse." },
    ],
  },
  replacement: {
    title: "Page Replacement — Who Gets Evicted",
    headers: ["Algorithm", "Policy", "Note"],
    rows: [
      ["FIFO", "Evict oldest loaded", "Belady's anomaly — more memory can hurt"],
      ["Optimal (OPT)", "Evict page used farthest in future", "Theoretical optimum, impossible (no oracle)"],
      ["LRU (Least Recently Used)", "Evict least recently used (past)", "Close to optimum, but expensive to update on every access"],
      ["LRU approx (CLOCK / Second Chance)", "Reference bit + circular scan", "Practical LRU. Default in most OSes"],
      ["LFU (Least Frequently Used)", "Evict least frequently used", "Once-popular pages stick forever"],
      ["NRU (Not Recently Used)", "Pages with R bit = 0", "Periodic R bit reset"],
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Virtual Memory", text: "Per-process virtual address spaces. Isolation, Oversubscription, Sharing, Protection." },
      { label: "Demand Paging", text: "Load on access. First touch = Page Fault, then cached." },
      { label: "Page Fault", text: "Major (disk I/O, ms) vs Minor (mapping update, μs)." },
      { label: "TLB", text: "Translation cache. Hit rate makes or breaks performance. Flushed on context switch." },
      { label: "Working Set", text: "Set of actively-used pages. Phase-dependent. Must fit in RAM frames." },
      { label: "Thrashing", text: "Working set > RAM → endless swap → CPU stalls. Worst-case state." },
      { label: "Swap", text: "Disk as RAM extension. 100–100,000× slower than RAM. Frequent swap = collapse." },
      { label: "Page Replacement", text: "RAM full → evict. LRU is ideal, CLOCK is practical. FIFO risks Belady's anomaly." },
    ],
  },
};

interface SectionProps { number: string; title: string; description: string; children: ReactNode; }
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

export default function VirtualMemoryPage() {
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

        <Section number={t.sections[0].number} title={t.sections[0].title} description={t.sections[0].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.reasons.items.map((r) => (
                <div key={r.name} className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                  <div className="text-xs font-mono text-orange-300 font-semibold mb-1">{r.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.pageFaultFlow.title}</h3>
            <div className="space-y-1.5">
              {t.pageFaultFlow.steps.map((s) => (
                <div key={s.n} className="flex items-start gap-3 text-[11px] font-mono">
                  <span className="text-orange-400/80 font-semibold min-w-[20px]">{s.n}.</span>
                  <span className="text-zinc-400">{s.action}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500 italic mt-4">{t.pageFaultFlow.timing}</p>
          </div>
        </Section>

        <Section number={t.sections[3].number} title={t.sections[3].title} description={t.sections[3].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.tlbDetail.title}</h3>
            <pre className="text-[11px] font-mono text-orange-300 whitespace-pre leading-relaxed">{t.tlbDetail.flow}</pre>
            <p className="text-[10px] text-zinc-500 italic mt-3">{t.tlbDetail.insight}</p>
          </div>
        </Section>

        <Section number={t.sections[4].number} title={t.sections[4].title} description={t.sections[4].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-2">{t.workingSet.title}</h3>
            <p className="text-[11px] text-zinc-500 mb-3">{t.workingSet.desc}</p>
            <pre className="text-[11px] font-mono text-orange-300/80 whitespace-pre leading-relaxed bg-zinc-900/30 p-3 rounded">{t.workingSet.visual}</pre>
          </div>
        </Section>

        <Section number="05" title={t.thrashing.title} description={t.thrashing.desc}>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6">
            <pre className="text-[11px] font-mono text-red-300/80 whitespace-pre leading-relaxed bg-zinc-900/30 p-3 rounded mb-4">{t.thrashing.chart}</pre>
            <div className="text-[11px] font-mono text-zinc-400 mb-2">
              {lang === "ko" ? "해결 방법" : "Solutions"}:
            </div>
            <ul className="space-y-1">
              {t.thrashing.solutions.map((s, i) => (
                <li key={i} className="text-[11px] text-zinc-400 leading-relaxed flex gap-2">
                  <span className="text-red-400">→</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section number={t.sections[5].number} title={t.sections[5].title} description={t.sections[5].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.swap.title}</h3>
            <div className="space-y-2">
              {t.swap.items.map((s) => (
                <div key={s.name} className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                  <div className="text-xs font-mono text-orange-300 font-semibold mb-1">{s.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section number="07" title={t.replacement.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.replacement.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-orange-400 w-56" : i === 1 ? "text-zinc-400 w-56" : "text-zinc-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.replacement.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-orange-300/80 font-semibold">{row[0]}</td>
                    <td className="py-2 text-zinc-400">{row[1]}</td>
                    <td className="py-2 text-zinc-500 text-[10px]">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

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
