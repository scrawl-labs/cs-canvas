"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "operating-systems", current: "memory management" },
  hero: {
    title: "Memory Management",
    desc: "RAM은 한정된 자원. 각 프로세스는 자기만의 메모리가 있다고 믿는다 — 어떻게 가능한가?\n페이징, 가상 메모리, TLB — 현대 OS의 메모리 마법.",
    tags: ["가상 메모리", "Paging", "Segmentation", "Page Table", "TLB", "Page Fault"],
  },
  sections: [
    {
      number: "01",
      title: "가상 메모리 — 각 프로세스의 환상",
      desc: "프로세스는 자기가 메모리 전체(예: 64비트 시스템에서 2^48 바이트)를 가졌다고 믿음. 실제로는 OS가 가상 주소를 물리 주소로 매핑. 메모리 격리·보호·확장의 기반.",
    },
    {
      number: "02",
      title: "Paging — 고정 크기 페이지로 분할",
      desc: "가상 주소 공간을 같은 크기의 페이지(보통 4KB)로 나누고, 물리 메모리를 같은 크기의 프레임으로 나눔. Page Table이 페이지 → 프레임 매핑을 저장. 외부 단편화 없음.",
    },
    {
      number: "03",
      title: "Page Table — 다단계 구조",
      desc: "64비트에서 단일 page table은 너무 큼 → 다단계(Multi-level). x86-64는 4단계(PML4 → PDPT → PD → PT). 빈 영역은 page table 생략 가능 → 공간 절약.",
    },
    {
      number: "04",
      title: "TLB — 페이지 테이블 캐시",
      desc: "매번 메모리 접근에 page table 조회는 너무 느림. TLB(Translation Lookaside Buffer)는 최근 변환 결과를 CPU에 캐시. TLB Hit: 1 cycle, Miss: page table walk (수십 cycle).",
    },
    {
      number: "05",
      title: "Page Fault — 페이지가 메모리에 없다",
      desc: "프로세스가 접근한 페이지가 RAM에 없으면 page fault 발생. OS가 디스크에서 페이지를 읽어와 빈 프레임에 적재. 가짜 메모리(가상)와 실제 메모리(물리)의 가교.",
    },
    {
      number: "06",
      title: "Page Replacement — 누구를 쫓아낼까",
      desc: "RAM이 꽉 차서 새 페이지가 들어올 공간이 없으면 기존 페이지를 디스크로 내보냄. LRU(Least Recently Used)가 이상적이지만 비용 크다 → CLOCK(Second Chance) 알고리즘이 실용적.",
    },
  ],
  virtualVsPhysical: {
    title: "가상 vs 물리 주소",
    items: [
      {
        kind: "가상 주소 (Virtual)",
        desc: "프로세스가 보는 주소. 각 프로세스마다 독립. 64비트 시스템에서 2^48 ~ 2^57 사용 가능.",
        example: "0x00007fff'b1c2'3000",
      },
      {
        kind: "물리 주소 (Physical)",
        desc: "실제 RAM의 위치. 모든 프로세스가 공유. 보통 가상보다 작음 (RAM 크기 만큼).",
        example: "0x0000'a4f3'2000",
      },
    ],
    why: "가상 메모리의 장점: 격리(보안), 확장(RAM > 사용 메모리 환상), 공유(라이브러리 한 번만 로드), 보호(권한 비트).",
  },
  paging: {
    title: "Paging — 주소 변환",
    desc: "가상 주소 = [Page Number | Offset]. Page Number로 Page Table 조회 → Frame Number 획득. 물리 주소 = [Frame Number | Offset].",
    example: {
      vaddr: "Virtual: 0x12345678",
      split: "Page=0x12345 (page table index), Offset=0x678",
      pte: "Page Table[0x12345] = Frame 0x87",
      paddr: "Physical: 0x87678",
    },
  },
  tlb: {
    title: "TLB의 효과",
    flow: [
      { step: "CPU가 가상 주소 접근", action: "TLB 조회 (병렬)" },
      { step: "TLB Hit", action: "1 cycle — 즉시 물리 주소 변환" },
      { step: "TLB Miss", action: "Page table walk: 4단계 메모리 접근 (~수십 cycle)" },
      { step: "Walk 후", action: "TLB에 결과 저장 (다음을 위해)" },
      { step: "Context switch", action: "TLB flush (또는 ASID 활용) — 새 프로세스의 page table 사용" },
    ],
    insight: "TLB Hit Rate가 99%여도 1%의 miss가 평균 시간을 크게 좌우. Page table walk 비용이 100배 큼.",
  },
  pageFault: {
    title: "Page Fault — 발생 시나리오와 처리",
    cases: [
      { name: "Minor Fault", desc: "페이지가 이미 메모리에 있지만 page table에 매핑이 없음. 매핑만 추가 → 빠름." },
      { name: "Major Fault", desc: "페이지가 디스크(swap)에 있음. 디스크 I/O 필요 → 수 ms 지연." },
      { name: "Invalid Fault", desc: "접근 권한 없음 또는 매핑 안 된 영역. SIGSEGV (segfault)." },
    ],
    handling: [
      "1. CPU가 page fault 트랩 발생",
      "2. OS가 fault handler 진입",
      "3. 원인 분석 (minor / major / invalid)",
      "4. major이면 디스크에서 페이지 읽기",
      "5. 빈 프레임 찾기 (없으면 page replacement)",
      "6. Page table 업데이트, TLB 무효화",
      "7. 프로세스 재개",
    ],
  },
  replacement: {
    title: "Page Replacement 알고리즘",
    headers: ["알고리즘", "방식", "장단점"],
    rows: [
      ["FIFO", "가장 먼저 들어온 페이지", "단순. Belady의 모순 (메모리 늘려도 더 안 좋아질 수 있음)"],
      ["Optimal", "가장 오래 안 쓸 페이지 (미래)", "이론적 최적. 구현 불가 (미래 모름) — 벤치마크용"],
      ["LRU", "가장 오래 안 쓴 페이지 (과거)", "Optimal에 근사. 그러나 매 접근마다 갱신 비용 큼"],
      ["LRU 근사 (CLOCK)", "Reference bit + 원형 스캔", "LRU에 가까운 성능, 비용 저렴. 실제 OS에서 사용"],
      ["LFU", "사용 빈도 가장 낮은 페이지", "초기 자주 쓰인 페이지가 영원히 남는 문제"],
    ],
  },
  thrashing: {
    title: "Thrashing — 페이지 폴트가 너무 잦으면",
    desc: "프로세스의 working set(자주 쓰는 페이지 집합)이 할당된 프레임보다 크면, 페이지가 끊임없이 swap in/out — CPU가 일을 못함. 해결: working set 모니터링, 프로세스 수 줄이기 (load control).",
  },
  segmentation: {
    title: "Segmentation vs Paging",
    headers: ["", "Segmentation", "Paging"],
    rows: [
      ["분할 단위", "논리적 (code, data, stack)", "고정 크기 (4KB)"],
      ["크기", "가변", "고정"],
      ["단편화", "외부 단편화", "내부 단편화 (페이지 내부)"],
      ["프로그래머 시점", "보임 (코드/데이터 명확)", "투명 (자동)"],
      ["현대 사용", "거의 안 씀 (x86 legacy)", "표준"],
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "가상 메모리", text: "각 프로세스는 자기만의 메모리가 있다고 믿음. 격리, 보호, 확장의 기반." },
      { label: "Paging", text: "가상/물리 주소를 같은 크기 페이지/프레임으로. 외부 단편화 없음." },
      { label: "Page Table", text: "Page → Frame 매핑. 64비트는 다단계 (x86-64는 4단계)." },
      { label: "TLB", text: "Page table 캐시. Hit 1 cycle, Miss 수십 cycle. context switch마다 flush." },
      { label: "Page Fault", text: "접근한 페이지가 RAM에 없음. Minor (매핑만 추가), Major (디스크 I/O), Invalid (segfault)." },
      { label: "Page Replacement", text: "RAM 가득 차면 페이지 쫓아냄. LRU가 이상적, CLOCK이 실용적." },
      { label: "Thrashing", text: "Working set > RAM → 끊임없는 swap. CPU 일을 못함. Load control 필요." },
      { label: "Segmentation", text: "논리적 분할. 외부 단편화. 현대 OS는 거의 paging만 사용." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "operating-systems", current: "memory management" },
  hero: {
    title: "Memory Management",
    desc: "RAM is finite. Yet every process believes it owns the entire address space — how?\nPaging, virtual memory, TLB — the memory magic of modern OSes.",
    tags: ["Virtual memory", "Paging", "Segmentation", "Page Table", "TLB", "Page Fault"],
  },
  sections: [
    {
      number: "01",
      title: "Virtual Memory — The Illusion",
      desc: "Every process thinks it owns the whole address space (e.g., 2^48 bytes on 64-bit). OS actually maps virtual → physical. Foundation of isolation, protection, and oversubscription.",
    },
    {
      number: "02",
      title: "Paging — Fixed-Size Pages",
      desc: "Split the virtual address space into pages (usually 4 KB) and physical memory into frames of the same size. A Page Table maps pages → frames. No external fragmentation.",
    },
    {
      number: "03",
      title: "Page Table — Multi-Level",
      desc: "A flat 64-bit page table would be enormous → use multiple levels. x86-64 uses 4 (PML4 → PDPT → PD → PT). Unused regions need no lower-level tables, saving memory.",
    },
    {
      number: "04",
      title: "TLB — The Page Table Cache",
      desc: "Walking the page table on every memory access is too slow. TLB (Translation Lookaside Buffer) caches recent translations on the CPU. Hit: 1 cycle. Miss: page table walk, tens of cycles.",
    },
    {
      number: "05",
      title: "Page Fault — Page Not in RAM",
      desc: "When the requested page isn't in RAM, a page fault fires. OS reads the page from disk into a free frame. The bridge between virtual (fake) and physical (real) memory.",
    },
    {
      number: "06",
      title: "Page Replacement — Who Gets Evicted?",
      desc: "When RAM is full and a new page needs to come in, an old one must leave. LRU is ideal but expensive → CLOCK (Second Chance) is the practical implementation.",
    },
  ],
  virtualVsPhysical: {
    title: "Virtual vs Physical Address",
    items: [
      {
        kind: "Virtual address",
        desc: "Process's view. Independent per process. On 64-bit, 2^48 ~ 2^57 usable.",
        example: "0x00007fff'b1c2'3000",
      },
      {
        kind: "Physical address",
        desc: "Actual RAM location. Shared across all processes. Smaller than virtual (bounded by RAM).",
        example: "0x0000'a4f3'2000",
      },
    ],
    why: "Why virtual memory? Isolation (security), oversubscription (RAM > used illusion), sharing (libraries loaded once), protection (permission bits).",
  },
  paging: {
    title: "Paging — Address Translation",
    desc: "Virtual address = [Page Number | Offset]. Use page number to index the Page Table → get Frame Number. Physical address = [Frame Number | Offset].",
    example: {
      vaddr: "Virtual: 0x12345678",
      split: "Page=0x12345 (page table index), Offset=0x678",
      pte: "Page Table[0x12345] = Frame 0x87",
      paddr: "Physical: 0x87678",
    },
  },
  tlb: {
    title: "TLB Effects",
    flow: [
      { step: "CPU accesses virtual address", action: "TLB lookup (parallel)" },
      { step: "TLB Hit", action: "1 cycle — instant translation" },
      { step: "TLB Miss", action: "Page table walk: 4 memory accesses (~tens of cycles)" },
      { step: "After walk", action: "Cache result in TLB" },
      { step: "Context switch", action: "TLB flush (or use ASID) — new process needs its own translations" },
    ],
    insight: "Even at 99% TLB hit rate, the 1% miss dominates the average time. A page table walk is ~100× slower.",
  },
  pageFault: {
    title: "Page Fault — Causes and Handling",
    cases: [
      { name: "Minor Fault", desc: "Page is already in memory but mapping is missing in the page table. Just add the mapping → fast." },
      { name: "Major Fault", desc: "Page lives on disk (swap). Disk I/O required → milliseconds of latency." },
      { name: "Invalid Fault", desc: "No permission or unmapped region. SIGSEGV (segfault)." },
    ],
    handling: [
      "1. CPU traps on page fault",
      "2. OS enters fault handler",
      "3. Classify cause (minor / major / invalid)",
      "4. If major, read page from disk",
      "5. Find a free frame (run page replacement if none)",
      "6. Update page table, invalidate TLB",
      "7. Resume the process",
    ],
  },
  replacement: {
    title: "Page Replacement Algorithms",
    headers: ["Algorithm", "Policy", "Pros / Cons"],
    rows: [
      ["FIFO", "Evict oldest loaded", "Simple. Belady's anomaly (more memory may worsen behavior)"],
      ["Optimal", "Evict page used farthest in future", "Theoretical optimum. Impossible (no oracle) — benchmark only"],
      ["LRU", "Evict least recently used (past)", "Close to Optimal. Per-access updates are expensive"],
      ["LRU approx (CLOCK)", "Reference bit + circular scan", "Near-LRU quality, low overhead. Used by real OSes"],
      ["LFU", "Evict least frequently used", "Once-popular pages get stuck forever"],
    ],
  },
  thrashing: {
    title: "Thrashing — When Page Faults Dominate",
    desc: "If a process's working set (its frequently used pages) exceeds its allocated frames, pages swap in/out endlessly — CPU can't make progress. Fix: monitor working set, reduce process count (load control).",
  },
  segmentation: {
    title: "Segmentation vs Paging",
    headers: ["", "Segmentation", "Paging"],
    rows: [
      ["Unit", "Logical (code, data, stack)", "Fixed size (4 KB)"],
      ["Size", "Variable", "Fixed"],
      ["Fragmentation", "External", "Internal (within page)"],
      ["Programmer view", "Visible (code/data explicit)", "Transparent (automatic)"],
      ["Modern use", "Rare (x86 legacy)", "Standard"],
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Virtual memory", text: "Every process believes it owns the address space. Foundation of isolation, protection, oversubscription." },
      { label: "Paging", text: "Fixed-size pages (virtual) and frames (physical). No external fragmentation." },
      { label: "Page table", text: "Page → frame mapping. 64-bit uses multiple levels (x86-64 has 4)." },
      { label: "TLB", text: "Page table cache. Hit 1 cycle, miss tens of cycles. Flushed on context switch." },
      { label: "Page fault", text: "Requested page not in RAM. Minor (mapping only), Major (disk I/O), Invalid (segfault)." },
      { label: "Page replacement", text: "When RAM is full, evict a page. LRU is ideal; CLOCK is the practical choice." },
      { label: "Thrashing", text: "Working set > RAM → endless swap. CPU stalls. Needs load control." },
      { label: "Segmentation", text: "Logical division. External fragmentation. Modern OSes basically just use paging." },
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

export default function MemoryManagementPage() {
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

        {/* 01 - virtual vs physical */}
        <Section number={t.sections[0].number} title={t.sections[0].title} description={t.sections[0].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.virtualVsPhysical.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {t.virtualVsPhysical.items.map((it) => (
                <div key={it.kind} className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                  <div className="text-xs font-mono text-orange-300 font-semibold mb-2">{it.kind}</div>
                  <p className="text-[11px] text-zinc-400 mb-2 leading-relaxed">{it.desc}</p>
                  <div className="text-[11px] font-mono text-emerald-300/80 bg-zinc-900/30 px-2 py-1 rounded">{it.example}</div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-zinc-500 italic">{t.virtualVsPhysical.why}</p>
          </div>
        </Section>

        {/* 02 - paging */}
        <Section number={t.sections[1].number} title={t.sections[1].title} description={t.sections[1].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-[11px] text-zinc-500 mb-4">{t.paging.desc}</p>
            <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4 font-mono text-[11px] space-y-1">
              <div className="text-orange-300/80">{t.paging.example.vaddr}</div>
              <div className="text-zinc-400">↓ {t.paging.example.split}</div>
              <div className="text-zinc-400">↓ {t.paging.example.pte}</div>
              <div className="text-emerald-300">{t.paging.example.paddr}</div>
            </div>
          </div>
        </Section>

        {/* 04 - TLB */}
        <Section number={t.sections[3].number} title={t.sections[3].title} description={t.sections[3].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.tlb.title}</h3>
            <div className="space-y-2">
              {t.tlb.flow.map((f, i) => (
                <div key={i} className="grid grid-cols-[200px_1fr] gap-3 text-[11px] font-mono">
                  <span className="text-orange-300/80">{f.step}</span>
                  <span className="text-zinc-400">{f.action}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500 italic mt-4 leading-relaxed">{t.tlb.insight}</p>
          </div>
        </Section>

        {/* 05 - page fault */}
        <Section number={t.sections[4].number} title={t.sections[4].title} description={t.sections[4].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.pageFault.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {t.pageFault.cases.map((c) => (
                <div key={c.name} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                  <div className="text-xs font-mono text-amber-300 font-semibold mb-1">{c.name}</div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
              <div className="text-[10px] font-mono text-zinc-500 mb-2">{lang === "ko" ? "처리 순서" : "Handler flow"}</div>
              <div className="space-y-0.5">
                {t.pageFault.handling.map((h, i) => (
                  <div key={i} className="text-[11px] font-mono text-zinc-400">{h}</div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* 06 - replacement */}
        <Section number={t.sections[5].number} title={t.sections[5].title} description={t.sections[5].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.replacement.title}</h3>
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.replacement.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-orange-400 w-36" : i === 1 ? "text-zinc-400 w-44" : "text-zinc-500"}`}>{h}</th>
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

        {/* thrashing */}
        <Section number="07" title={t.thrashing.title} description={t.thrashing.desc}>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6">
            <pre className="text-[11px] font-mono text-zinc-400 leading-relaxed">{`CPU Utilization
  ↑
  │     ╭─── ideal
  │    ╱
  │   ╱
  │  ╱
  │ ╱           ╲___ thrashing
  │╱
  └────────────────→ Multiprogramming
                    (too many processes)`}</pre>
          </div>
        </Section>

        {/* segmentation */}
        <Section number="08" title={t.segmentation.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.segmentation.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-zinc-600 w-32" : i === 1 ? "text-amber-400" : "text-emerald-400"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.segmentation.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-zinc-500">{row[0]}</td>
                    <td className="py-2 text-amber-300/80">{row[1]}</td>
                    <td className="py-2 text-emerald-300/80">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
