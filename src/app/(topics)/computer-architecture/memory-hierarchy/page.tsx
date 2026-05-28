"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "computer-architecture", current: "memory hierarchy" },
  hero: {
    title: "Memory Hierarchy",
    desc: "빠르고 작은 메모리부터 느리고 거대한 저장소까지.\nRegister → L1 → L2 → L3 → RAM → SSD → HDD → Network — 단계 사이의 격차는 항상 1000배.",
    tags: ["피라미드", "Latency", "Bandwidth", "Cost", "Volatile vs Non-volatile"],
  },
  sections: [
    {
      number: "01",
      title: "왜 계층 구조 — 빠름·큼·쌈은 동시에 불가",
      desc: "이상적으론 빠르고 크고 싸야 함. 현실은 셋 중 둘. 작고 빠른 SRAM, 크고 느린 DRAM, 거대하고 느린 디스크를 계층으로 쌓아 평균적으로 빠르고 거대한 척.",
    },
    {
      number: "02",
      title: "각 계층의 특성",
      desc: "Register (0.3ns, 수십 byte): CPU 안. L1/L2/L3 Cache (1-30ns, KB-MB): SRAM. RAM (100ns, GB): DRAM. SSD (100μs, TB): NAND Flash. HDD (10ms, TB): 자기 디스크.",
    },
    {
      number: "03",
      title: "Volatile vs Non-Volatile",
      desc: "Volatile (휘발성): 전원 끄면 사라짐 — Register, Cache, RAM. Non-Volatile (비휘발성): 전원 꺼도 유지 — SSD, HDD, NVRAM. 휘발성이 빠른 게 일반적.",
    },
    {
      number: "04",
      title: "Bandwidth vs Latency — 다른 두 지표",
      desc: "Latency: 첫 byte까지 걸리는 시간. Bandwidth: 초당 처리량. SSD는 latency는 좋지만 RAM 대비 bandwidth는 낮음. 둘 다 중요.",
    },
    {
      number: "05",
      title: "Locality — 캐시 계층이 작동하는 이유",
      desc: "Temporal + Spatial 지역성. 평균 접근 시간 ≈ Hit rate가 높은 가까운 계층의 시간. L1 hit이 99%면 평균은 거의 L1 속도.",
    },
    {
      number: "06",
      title: "현대 트렌드 — NVMe, Optane, CXL",
      desc: "전통적 경계가 흐려짐. NVMe SSD: PCIe로 빠른 SSD. Optane: RAM-급 빠른 비휘발성. CXL: CPU-메모리 fabric, 메모리 풀링.",
    },
  ],
  pyramid: {
    title: "메모리 피라미드 — 작고 빠른 → 크고 느린",
    diagram: `        ▲ 빠름·비쌈·작음
        │
        │   ┌──────────┐
        │   │ Register │  0.3 ns, 수십 byte
        │   └──────────┘
        │   ┌────────────┐
        │   │ L1 Cache   │  1 ns, 32 KB
        │   └────────────┘
        │   ┌──────────────┐
        │   │ L2 Cache     │  3 ns, 256 KB
        │   └──────────────┘
        │   ┌──────────────────┐
        │   │ L3 Cache         │  10 ns, ~32 MB
        │   └──────────────────┘
        │   ┌──────────────────────┐
        │   │ RAM (DRAM)           │  100 ns, ~32 GB
        │   └──────────────────────┘
        │   ┌──────────────────────────────┐
        │   │ NVMe SSD                     │  100 μs, ~1 TB
        │   └──────────────────────────────┘
        │   ┌──────────────────────────────────────┐
        │   │ HDD / Cold storage                   │  10 ms, ~10 TB
        │   └──────────────────────────────────────┘
        │   ┌──────────────────────────────────────────────┐
        │   │ Network / Cloud (S3)                         │  100 ms, ∞
        │   └──────────────────────────────────────────────┘
        ▼ 느림·쌈·큼`,
  },
  table: {
    title: "메모리 계층 상세 표",
    headers: ["계층", "크기", "Latency", "Bandwidth", "Volatile", "Cost/GB"],
    rows: [
      ["Register", "~500 B", "0.3 ns", "—", "Yes", "—"],
      ["L1 Cache", "32 KB", "1 ns", "~1 TB/s", "Yes", "$$$$$"],
      ["L2 Cache", "256 KB", "3 ns", "~500 GB/s", "Yes", "$$$$"],
      ["L3 Cache", "16-64 MB", "10 ns", "~200 GB/s", "Yes", "$$$"],
      ["DRAM", "16-256 GB", "100 ns", "~50 GB/s", "Yes", "~$5"],
      ["Optane (PMEM)", "100 GB-1 TB", "300 ns", "~10 GB/s", "No", "~$3"],
      ["NVMe SSD", "1-8 TB", "100 μs", "~7 GB/s", "No", "~$0.1"],
      ["SATA SSD", "1-4 TB", "200 μs", "~500 MB/s", "No", "~$0.07"],
      ["HDD", "1-20 TB", "10 ms", "~150 MB/s", "No", "~$0.02"],
      ["Tape (LTO-9)", "18 TB", "수십 초", "~400 MB/s", "No", "~$0.005"],
      ["Network (LAN)", "—", "100 μs", "~1 GB/s (10G)", "—", "—"],
      ["Network (Internet)", "—", "10-100 ms", "~100 MB/s", "—", "—"],
    ],
  },
  ratios: {
    title: "절대 차이를 사람의 시간으로 환산",
    desc: "L1 hit을 1초라 가정하면...",
    rows: [
      { level: "L1 Cache", real: "1 ns", human: "1초" },
      { level: "L2 Cache", real: "3 ns", human: "3초" },
      { level: "L3 Cache", real: "10 ns", human: "10초" },
      { level: "RAM", real: "100 ns", human: "1분 40초" },
      { level: "NVMe SSD", real: "100 μs", human: "27시간" },
      { level: "HDD", real: "10 ms", human: "115일" },
      { level: "Network (LAN)", real: "100 μs", human: "27시간" },
      { level: "Network (Internet)", real: "100 ms", human: "3.2년" },
    ],
    note: "이런 격차 때문에 디스크 I/O를 피하고 메모리에 캐싱하는 게 압도적으로 중요.",
  },
  tradeoffs: {
    title: "각 계층의 트레이드오프",
    items: [
      { name: "Speed (속도)", desc: "위로 갈수록 빠름. 빠른 메모리는 회로가 복잡하고 비쌈." },
      { name: "Size (용량)", desc: "아래로 갈수록 큼. 같은 가격에 더 큰 용량." },
      { name: "Cost (가격)", desc: "GB당 가격 위로 갈수록 비쌈. L1 ≈ $10000/GB vs HDD ≈ $0.02/GB." },
      { name: "Power (전력)", desc: "SRAM은 빠르지만 전력 많이 씀. DRAM은 refresh 필요. SSD는 idle 시 적게." },
      { name: "Volatility (휘발성)", desc: "위는 모두 volatile. 영구 저장은 아래 계층." },
      { name: "Granularity (단위)", desc: "Cache는 64B line, RAM은 byte, SSD/HDD는 4KB block. 작은 쓰기도 큰 단위 비용." },
    ],
  },
  software: {
    title: "소프트웨어가 신경 써야 할 것",
    items: [
      { name: "Cache-friendly 알고리즘", desc: "순차 접근 > 무작위 접근. Row-major 배열은 row 순으로." },
      { name: "Working Set ≤ RAM", desc: "초과하면 Page Fault → SSD/HDD 접근 → 성능 100배 저하." },
      { name: "메모리 정렬", desc: "Cache Line 경계에 맞춰 정렬, False Sharing 회피." },
      { name: "Prefetching", desc: "CPU 자동 prefetch + 명시적 __builtin_prefetch. 미리 가져와 miss 회피." },
      { name: "Data Compression", desc: "Cache line/RAM에 더 많은 데이터 → 효과적 용량 증가. 압축/해제 비용과 트레이드오프." },
      { name: "Pinning / Locking pages", desc: "중요한 페이지가 swap out 안 되게 mlock (Linux). DB·실시간 시스템에서 사용." },
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "메모리 피라미드", text: "Register → Cache → RAM → SSD → HDD → Network. 위로 갈수록 빠르고 작고 비쌈." },
      { label: "왜 계층", text: "빠름·큼·쌈을 동시에 못 함. 평균적으로 빠르고 거대해 보이게 계층화." },
      { label: "1000× 격차", text: "각 단계 사이 약 10-1000배 격차. 캐시 hit이 결정적." },
      { label: "Latency vs Bandwidth", text: "첫 byte 도착 시간 vs 초당 처리량. 두 지표가 다르고 둘 다 중요." },
      { label: "Volatile vs Non-volatile", text: "Cache, RAM은 volatile. SSD, HDD는 non-volatile. 빠를수록 휘발성." },
      { label: "Locality", text: "Temporal + Spatial. 캐시 계층이 효과적인 이유. 코드 작성 시 항상 고려." },
      { label: "Cost/GB", text: "L1 ≈ $10000/GB, HDD ≈ $0.02/GB. 50만 배 차이. 그래서 계층이 필요." },
      { label: "현대 트렌드", text: "NVMe로 SSD 빠름, Optane으로 DRAM ↔ SSD 사이 채움, CXL로 메모리 풀링." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "computer-architecture", current: "memory hierarchy" },
  hero: {
    title: "Memory Hierarchy",
    desc: "From tiny-fast to vast-slow.\nRegister → L1 → L2 → L3 → RAM → SSD → HDD → Network — each step is roughly 1000× away.",
    tags: ["Pyramid", "Latency", "Bandwidth", "Cost", "Volatile vs Non-volatile"],
  },
  sections: [
    {
      number: "01",
      title: "Why a Hierarchy — Fast, Big, Cheap: Pick Two",
      desc: "Ideally we'd have fast, large, cheap memory. We can have two at a time. Stack small-fast SRAM, large-slow DRAM, and huge-slow disks so that on average we feel fast and large.",
    },
    {
      number: "02",
      title: "Per-Level Characteristics",
      desc: "Register (0.3 ns, ~bytes): inside the CPU. L1/L2/L3 Cache (1-30 ns, KB-MB): SRAM. RAM (100 ns, GB): DRAM. SSD (100 μs, TB): NAND Flash. HDD (10 ms, TB): magnetic.",
    },
    {
      number: "03",
      title: "Volatile vs Non-Volatile",
      desc: "Volatile: lost on power off — Register, Cache, RAM. Non-volatile: persistent — SSD, HDD, NVRAM. Faster usually means volatile.",
    },
    {
      number: "04",
      title: "Bandwidth vs Latency — Two Metrics",
      desc: "Latency: time to first byte. Bandwidth: throughput. SSDs have good latency but lower bandwidth than RAM. Both matter.",
    },
    {
      number: "05",
      title: "Locality — Why the Hierarchy Works",
      desc: "Temporal + spatial locality. Average access time ≈ time of the nearest level with a high hit rate. 99% L1 hit ≈ L1 speed overall.",
    },
    {
      number: "06",
      title: "Modern Trends — NVMe, Optane, CXL",
      desc: "Boundaries blur. NVMe SSD: PCIe-attached SSDs. Optane: RAM-speed non-volatile. CXL: CPU-memory fabric, memory pooling.",
    },
  ],
  pyramid: {
    title: "Memory Pyramid — Small-Fast → Big-Slow",
    diagram: `        ▲ Fast · Expensive · Small
        │
        │   ┌──────────┐
        │   │ Register │  0.3 ns, dozens of bytes
        │   └──────────┘
        │   ┌────────────┐
        │   │ L1 Cache   │  1 ns, 32 KB
        │   └────────────┘
        │   ┌──────────────┐
        │   │ L2 Cache     │  3 ns, 256 KB
        │   └──────────────┘
        │   ┌──────────────────┐
        │   │ L3 Cache         │  10 ns, ~32 MB
        │   └──────────────────┘
        │   ┌──────────────────────┐
        │   │ RAM (DRAM)           │  100 ns, ~32 GB
        │   └──────────────────────┘
        │   ┌──────────────────────────────┐
        │   │ NVMe SSD                     │  100 μs, ~1 TB
        │   └──────────────────────────────┘
        │   ┌──────────────────────────────────────┐
        │   │ HDD / Cold storage                   │  10 ms, ~10 TB
        │   └──────────────────────────────────────┘
        │   ┌──────────────────────────────────────────────┐
        │   │ Network / Cloud (S3)                         │  100 ms, ∞
        │   └──────────────────────────────────────────────┘
        ▼ Slow · Cheap · Large`,
  },
  table: {
    title: "Detailed Memory Hierarchy",
    headers: ["Level", "Size", "Latency", "Bandwidth", "Volatile", "Cost/GB"],
    rows: [
      ["Register", "~500 B", "0.3 ns", "—", "Yes", "—"],
      ["L1 Cache", "32 KB", "1 ns", "~1 TB/s", "Yes", "$$$$$"],
      ["L2 Cache", "256 KB", "3 ns", "~500 GB/s", "Yes", "$$$$"],
      ["L3 Cache", "16-64 MB", "10 ns", "~200 GB/s", "Yes", "$$$"],
      ["DRAM", "16-256 GB", "100 ns", "~50 GB/s", "Yes", "~$5"],
      ["Optane (PMEM)", "100 GB-1 TB", "300 ns", "~10 GB/s", "No", "~$3"],
      ["NVMe SSD", "1-8 TB", "100 μs", "~7 GB/s", "No", "~$0.1"],
      ["SATA SSD", "1-4 TB", "200 μs", "~500 MB/s", "No", "~$0.07"],
      ["HDD", "1-20 TB", "10 ms", "~150 MB/s", "No", "~$0.02"],
      ["Tape (LTO-9)", "18 TB", "tens of seconds", "~400 MB/s", "No", "~$0.005"],
      ["Network (LAN)", "—", "100 μs", "~1 GB/s (10G)", "—", "—"],
      ["Network (Internet)", "—", "10-100 ms", "~100 MB/s", "—", "—"],
    ],
  },
  ratios: {
    title: "If L1 Hit = 1 second, then…",
    desc: "Scale absolute times into human time:",
    rows: [
      { level: "L1 Cache", real: "1 ns", human: "1 sec" },
      { level: "L2 Cache", real: "3 ns", human: "3 sec" },
      { level: "L3 Cache", real: "10 ns", human: "10 sec" },
      { level: "RAM", real: "100 ns", human: "1 min 40 sec" },
      { level: "NVMe SSD", real: "100 μs", human: "27 hours" },
      { level: "HDD", real: "10 ms", human: "115 days" },
      { level: "Network (LAN)", real: "100 μs", human: "27 hours" },
      { level: "Network (Internet)", real: "100 ms", human: "3.2 years" },
    ],
    note: "These gaps are why avoiding disk I/O — and caching in memory — dominates real-world performance.",
  },
  tradeoffs: {
    title: "Trade-offs Across Levels",
    items: [
      { name: "Speed", desc: "Faster up the pyramid. Fast memory uses complex, expensive circuits." },
      { name: "Size", desc: "Bigger down the pyramid. More capacity per dollar." },
      { name: "Cost/GB", desc: "L1 ≈ $10,000/GB vs HDD ≈ $0.02/GB. Massive spread." },
      { name: "Power", desc: "SRAM is fast but power hungry. DRAM needs refresh. SSDs idle cheaply." },
      { name: "Volatility", desc: "Top levels are volatile. Persistence happens below." },
      { name: "Granularity", desc: "Cache 64 B lines, RAM byte-level, SSD/HDD 4 KB blocks. Small writes pay big-unit cost." },
    ],
  },
  software: {
    title: "What Software Should Care About",
    items: [
      { name: "Cache-friendly algorithms", desc: "Sequential > random access. Row-major arrays in row order." },
      { name: "Working set ≤ RAM", desc: "Exceed it → page fault → SSD/HDD access → 100× slowdown." },
      { name: "Alignment", desc: "Align to cache-line boundaries, avoid False Sharing." },
      { name: "Prefetching", desc: "Hardware prefetch + explicit __builtin_prefetch. Fetch early to hide misses." },
      { name: "Data compression", desc: "More data fits per cache line / RAM. Trade compute for capacity." },
      { name: "Pinning / locking pages", desc: "Prevent swap-out for hot pages: mlock (Linux). Used in DBs and real-time." },
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "The pyramid", text: "Register → Cache → RAM → SSD → HDD → Network. Up = fast, small, expensive." },
      { label: "Why a hierarchy", text: "Can't have fast, big, cheap together. Layering creates the illusion." },
      { label: "1000× gaps", text: "Each step roughly 10-1000× away. Cache hits are decisive." },
      { label: "Latency vs Bandwidth", text: "Time to first byte vs throughput. Different metrics, both matter." },
      { label: "Volatile vs Non-volatile", text: "Cache and RAM are volatile; SSD and HDD persist. Faster usually means volatile." },
      { label: "Locality", text: "Temporal + Spatial. The reason caches work. Code with locality in mind." },
      { label: "Cost/GB", text: "L1 ≈ $10,000/GB, HDD ≈ $0.02/GB. 500,000× spread. Hence the hierarchy." },
      { label: "Modern trends", text: "Fast NVMe SSDs, Optane bridging DRAM↔SSD, CXL enabling memory pooling." },
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

export default function MemoryHierarchyPage() {
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
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.pyramid.title}</h3>
            <pre className="text-[10px] font-mono text-slate-300/80 whitespace-pre leading-relaxed">{t.pyramid.diagram}</pre>
          </div>
        </Section>

        <Section number={t.sections[1].number} title={t.sections[1].title} description={t.sections[1].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.table.title}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] font-mono">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {t.table.headers.map((h, i) => (
                      <th key={i} className={`text-left py-2 pr-3 ${i === 0 ? "text-slate-400" : "text-zinc-500"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.table.rows.map((row, i) => (
                    <tr key={i} className="border-b border-zinc-800/50">
                      {row.map((cell, j) => (
                        <td key={j} className={`py-2 pr-3 ${j === 0 ? "text-slate-300/80 font-semibold" : "text-zinc-400"}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        <Section number="03" title={t.ratios.title} description={t.ratios.desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-slate-400 w-44">Level</th>
                  <th className="text-left py-2 text-zinc-500 w-28">Real time</th>
                  <th className="text-left py-2 text-cyan-400">Human time</th>
                </tr>
              </thead>
              <tbody>
                {t.ratios.rows.map((r) => (
                  <tr key={r.level} className="border-b border-zinc-800/50">
                    <td className="py-1.5 text-slate-300/80">{r.level}</td>
                    <td className="py-1.5 text-zinc-400">{r.real}</td>
                    <td className="py-1.5 text-cyan-300/80 font-semibold">{r.human}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-zinc-500 italic mt-3">{t.ratios.note}</p>
          </div>
        </Section>

        <Section number="04" title={t.tradeoffs.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.tradeoffs.items.map((tr) => (
                <div key={tr.name} className="rounded-lg border border-slate-500/20 bg-slate-500/5 p-3">
                  <div className="text-xs font-mono text-slate-300 font-semibold mb-1">{tr.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{tr.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section number="05" title={t.software.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="space-y-2">
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
