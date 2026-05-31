"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";
import CodeBlock from "@/components/CodeBlock";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "computer-architecture", current: "cache hierarchy" },
  hero: {
    title: "Cache Hierarchy",
    desc: "CPU는 빠르고, RAM은 느리다 — 그 격차가 1000배.\n작고 빠른 캐시를 CPU 옆에 두어 평균 메모리 접근 시간을 줄이는 마법.",
    tags: ["L1/L2/L3", "Hit/Miss", "지역성", "Write-Back", "Cache Line", "Coherence"],
  },
  sections: [
    {
      number: "01",
      title: "왜 캐시 — 메모리 벽 (Memory Wall)",
      desc: "CPU 클럭은 GHz 단위로 빨라졌지만, RAM 접근은 100ns 이상. CPU가 매번 RAM을 기다리면 99% 시간이 idle. 캐시가 이 격차를 메움.",
    },
    {
      number: "02",
      title: "지역성 — 캐시가 작동하는 이유",
      desc: "Temporal Locality (시간적): 최근 접근한 데이터를 다시 접근할 가능성 큼. Spatial Locality (공간적): 한 주소를 접근하면 그 근처도 곧 접근. 두 특성이 캐시의 효율을 만듦.",
    },
    {
      number: "03",
      title: "L1, L2, L3 — 다단계 캐시",
      desc: "L1 (32KB, 1 cycle): 가장 가까움, 명령어/데이터 분리. L2 (256KB, 10 cycles): 코어당. L3 (수십 MB, 30 cycles): 코어 공유. 아래로 갈수록 크지만 느림.",
    },
    {
      number: "04",
      title: "Cache Line — 캐싱의 단위",
      desc: "캐시는 byte가 아니라 64-byte 단위 (Cache Line)로 저장. 한 byte 요청해도 64 byte 가져옴 — 공간 지역성 활용. False Sharing의 원인이기도.",
    },
    {
      number: "05",
      title: "Mapping — Direct, Set-Associative, Full",
      desc: "Direct Mapped: 주소 mod N으로 한 자리만 가능. 빠르지만 충돌 잦음. Set-Associative: N개 자리 중 하나 (보통 8-way). Fully Associative: 어디든 OK. L1은 보통 8-way.",
    },
    {
      number: "06",
      title: "Write Policy — Write-Through vs Write-Back",
      desc: "Write-Through: 캐시와 메모리 동시 쓰기, 일관성 좋지만 느림. Write-Back: 캐시에만 쓰고 dirty bit, 나중에 메모리 쓰기, 빠르지만 복잡. 대부분의 현대 CPU는 Write-Back.",
    },
    {
      number: "07",
      title: "Cache Coherence — 멀티코어의 일관성",
      desc: "코어 1이 자기 L1에 X=10, 코어 2도 자기 L1에 X=10. 코어 1이 X=20으로 변경하면? MESI 프로토콜로 다른 코어의 캐시 라인을 Invalidate.",
    },
  ],
  latency: {
    title: "메모리 계층 — 실제 지연 시간 (Intel CPU 기준)",
    rows: [
      { level: "Register", size: "수십 개", latency: "0.3 ns", cycles: "1 cycle" },
      { level: "L1 Cache", size: "32 KB / core", latency: "1 ns", cycles: "4 cycles" },
      { level: "L2 Cache", size: "256 KB / core", latency: "3 ns", cycles: "12 cycles" },
      { level: "L3 Cache", size: "16-64 MB shared", latency: "10 ns", cycles: "40 cycles" },
      { level: "RAM (DRAM)", size: "16-256 GB", latency: "100 ns", cycles: "300 cycles" },
      { level: "NVMe SSD", size: "1 TB+", latency: "100 μs", cycles: "300,000 cycles" },
      { level: "HDD", size: "TB+", latency: "10 ms", cycles: "30,000,000 cycles" },
    ],
  },
  locality: {
    title: "지역성 코드 예시",
    good: {
      label: "Good — 순차 접근",
      code: `// 행 우선 (row-major) 배열을 순서대로
for (int i = 0; i < N; i++) {
    for (int j = 0; j < N; j++) {
        sum += arr[i][j];   // 인접한 메모리 → 캐시 히트
    }
}`,
      note: "공간 지역성 활용. Cache Line 단위로 미리 prefetch.",
    },
    bad: {
      label: "Bad — 점프 접근",
      code: `// 열 우선으로 접근 (행 우선 저장된 배열)
for (int j = 0; j < N; j++) {
    for (int i = 0; i < N; i++) {
        sum += arr[i][j];   // 매번 다른 라인 → 캐시 미스
    }
}`,
      note: "같은 작업이지만 10배 이상 느릴 수 있음. 캐시 미스 → RAM 접근.",
    },
  },
  mapping: {
    title: "Mapping 방식 비교",
    headers: ["방식", "각 주소가 갈 수 있는 곳", "장단점"],
    rows: [
      ["Direct Mapped", "1자리 (주소 mod N)", "하드웨어 단순, 충돌 잦음"],
      ["2-way Set Associative", "2자리", "충돌 절반으로"],
      ["8-way Set Associative", "8자리 (L1 일반)", "충돌 거의 없음, 약간 느림"],
      ["Fully Associative", "어디든", "최적 충돌 회피, 매우 비쌈 (TLB 정도)"],
    ],
  },
  cacheLine: {
    title: "Cache Line과 False Sharing",
    desc: "64-byte 라인 단위로 캐시. 다른 변수지만 같은 라인에 있으면, 한쪽 코어 수정 시 다른 코어의 캐시 라인이 무효화됨 — 성능 급락.",
    example: `// 잘못된 예
struct {
    int counterA;    // thread 1이 수정
    int counterB;    // thread 2가 수정
} shared;            // 두 변수가 같은 64-byte 라인

// 해결: padding으로 분리
struct {
    int counterA;
    char pad[60];    // 64-byte로 정렬
    int counterB;
} shared;`,
  },
  metrics: {
    title: "성능 지표",
    items: [
      { name: "Hit Rate", desc: "캐시에서 찾은 비율. L1은 95%+, L2/L3는 더 낮음." },
      { name: "Miss Rate", desc: "1 - Hit Rate. Compulsory (첫 접근), Capacity (캐시 작음), Conflict (매핑 충돌)." },
      { name: "AMAT (Average Memory Access Time)", desc: "Hit Time + Miss Rate × Miss Penalty. Miss Penalty가 크기에 hit rate가 결정적." },
      { name: "Cache Throughput", desc: "초당 처리할 수 있는 캐시 요청 수. 멀티 포트로 증가." },
    ],
  },
  mesi: {
    title: "MESI Cache Coherence Protocol",
    rows: [
      { state: "M (Modified)", desc: "이 캐시에만 있고, 메모리와 다름 (dirty)" },
      { state: "E (Exclusive)", desc: "이 캐시에만 있고, 메모리와 같음" },
      { state: "S (Shared)", desc: "여러 캐시에 있고, 메모리와 같음" },
      { state: "I (Invalid)", desc: "유효하지 않음 (다른 코어가 수정함)" },
    ],
    note: "MESI 외에도 MOESI, MESIF 등 변형. 코어 간 통신으로 일관성 유지 (Bus Snooping).",
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "Memory Wall", text: "CPU와 RAM 속도 격차 1000배. 캐시로 평균 접근 시간 단축." },
      { label: "지역성", text: "Temporal (최근 접근 재접근) + Spatial (인접 주소 접근). 캐시 효율의 근거." },
      { label: "L1/L2/L3", text: "L1 가장 빠르고 작음, L3 느리고 큼. 다단계로 hit rate ↑." },
      { label: "Cache Line", text: "64-byte 단위로 저장. 공간 지역성 활용. False Sharing 주의." },
      { label: "Mapping", text: "Direct → Set-Associative → Fully. 일반적으로 8-way가 균형." },
      { label: "Write-Back", text: "캐시에만 쓰고 dirty 표시. 나중에 메모리 쓰기. 대부분의 CPU." },
      { label: "Cache Miss 종류", text: "Compulsory (첫 접근), Capacity (작음), Conflict (충돌). 종류별 해결책 다름." },
      { label: "MESI", text: "멀티코어 일관성 프로토콜. Modified/Exclusive/Shared/Invalid. 한 코어 수정 시 다른 코어 Invalidate." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "computer-architecture", current: "cache hierarchy" },
  hero: {
    title: "Cache Hierarchy",
    desc: "CPUs are fast, RAM is slow — a 1000× gap.\nSmall, fast caches next to the CPU close the gap by lowering average memory access time.",
    tags: ["L1/L2/L3", "Hit/Miss", "Locality", "Write-Back", "Cache Line", "Coherence"],
  },
  sections: [
    {
      number: "01",
      title: "Why Caches — The Memory Wall",
      desc: "CPU clocks reached GHz; RAM still takes 100+ ns. Waiting for RAM every time means the CPU sits idle 99% of the time. Caches close that gap.",
    },
    {
      number: "02",
      title: "Locality — Why Caches Work",
      desc: "Temporal locality: recently accessed data is likely to be accessed again. Spatial locality: nearby addresses come soon after. Both make caching efficient.",
    },
    {
      number: "03",
      title: "L1, L2, L3 — The Cache Levels",
      desc: "L1 (32 KB, 1 cycle): closest, split instruction/data. L2 (256 KB, ~10 cycles): per core. L3 (tens of MB, ~30 cycles): shared. Larger but slower as you go down.",
    },
    {
      number: "04",
      title: "Cache Line — The Caching Unit",
      desc: "Caches store data in 64-byte lines, not bytes. Request one byte, fetch 64 — leveraging spatial locality. Also the cause of False Sharing.",
    },
    {
      number: "05",
      title: "Mapping — Direct, Set-Associative, Full",
      desc: "Direct mapped: address mod N, one slot. Fast but conflict-prone. Set-Associative: N slots (usually 8-way). Fully Associative: anywhere. L1 is usually 8-way.",
    },
    {
      number: "06",
      title: "Write Policy — Write-Through vs Write-Back",
      desc: "Write-Through: write cache and memory together, consistent but slow. Write-Back: cache + dirty bit, write to memory later, fast but complex. Modern CPUs use Write-Back.",
    },
    {
      number: "07",
      title: "Cache Coherence — Multi-Core Consistency",
      desc: "Core 1 has X=10 in its L1, Core 2 too. Core 1 updates X=20 — what about Core 2's copy? MESI protocol invalidates other cores' cache lines.",
    },
  ],
  latency: {
    title: "Memory Hierarchy — Real Latencies (Intel CPUs)",
    rows: [
      { level: "Register", size: "few dozens", latency: "0.3 ns", cycles: "1 cycle" },
      { level: "L1 Cache", size: "32 KB / core", latency: "1 ns", cycles: "4 cycles" },
      { level: "L2 Cache", size: "256 KB / core", latency: "3 ns", cycles: "12 cycles" },
      { level: "L3 Cache", size: "16-64 MB shared", latency: "10 ns", cycles: "40 cycles" },
      { level: "RAM (DRAM)", size: "16-256 GB", latency: "100 ns", cycles: "300 cycles" },
      { level: "NVMe SSD", size: "1 TB+", latency: "100 μs", cycles: "300,000 cycles" },
      { level: "HDD", size: "TB+", latency: "10 ms", cycles: "30,000,000 cycles" },
    ],
  },
  locality: {
    title: "Locality in Code",
    good: {
      label: "Good — Sequential Access",
      code: `// Row-major array, in order
for (int i = 0; i < N; i++) {
    for (int j = 0; j < N; j++) {
        sum += arr[i][j];   // adjacent memory → cache hit
    }
}`,
      note: "Spatial locality. Cache lines are prefetched ahead.",
    },
    bad: {
      label: "Bad — Striding Access",
      code: `// Column-major access on a row-major array
for (int j = 0; j < N; j++) {
    for (int i = 0; i < N; i++) {
        sum += arr[i][j];   // different line each step → cache miss
    }
}`,
      note: "Same work, can be 10× slower. Cache miss → RAM access.",
    },
  },
  mapping: {
    title: "Mapping Comparison",
    headers: ["Scheme", "Slots per address", "Pros / Cons"],
    rows: [
      ["Direct Mapped", "1 (address mod N)", "Simple HW, frequent conflicts"],
      ["2-way Set Associative", "2", "Conflicts halved"],
      ["8-way Set Associative", "8 (typical L1)", "Few conflicts, slightly slower"],
      ["Fully Associative", "Anywhere", "Best conflict avoidance, expensive (TLB-scale only)"],
    ],
  },
  cacheLine: {
    title: "Cache Line & False Sharing",
    desc: "Caches use 64-byte lines. Different variables on the same line invalidate each other's caches on write — performance collapse.",
    example: `// Bad
struct {
    int counterA;    // updated by thread 1
    int counterB;    // updated by thread 2
} shared;            // both in the same 64-byte line

// Fix: pad them apart
struct {
    int counterA;
    char pad[60];    // 64-byte aligned
    int counterB;
} shared;`,
  },
  metrics: {
    title: "Performance Metrics",
    items: [
      { name: "Hit Rate", desc: "Fraction of accesses served by the cache. L1 usually 95%+; L2/L3 lower." },
      { name: "Miss Rate", desc: "1 - Hit Rate. Compulsory (first access), Capacity (cache too small), Conflict (mapping clash)." },
      { name: "AMAT (Avg Memory Access Time)", desc: "Hit Time + Miss Rate × Miss Penalty. Penalty dominates, so hit rate matters most." },
      { name: "Cache Throughput", desc: "Requests served per second. Multi-port designs increase it." },
    ],
  },
  mesi: {
    title: "MESI Cache Coherence Protocol",
    rows: [
      { state: "M (Modified)", desc: "Only this cache has it, and it differs from memory (dirty)" },
      { state: "E (Exclusive)", desc: "Only this cache has it, matches memory" },
      { state: "S (Shared)", desc: "Multiple caches have it, matches memory" },
      { state: "I (Invalid)", desc: "Not valid (another core has modified)" },
    ],
    note: "Variants exist: MOESI, MESIF. Inter-core communication (bus snooping) maintains consistency.",
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Memory Wall", text: "1000× CPU vs RAM speed gap. Caches lower average access time." },
      { label: "Locality", text: "Temporal (re-access) + Spatial (nearby access). The reason caches work." },
      { label: "L1/L2/L3", text: "L1 fastest and smallest; L3 slowest and largest. Hierarchy boosts hit rate." },
      { label: "Cache Line", text: "64-byte storage unit. Exploits spatial locality. Watch False Sharing." },
      { label: "Mapping", text: "Direct → Set-Associative → Fully. 8-way is a typical sweet spot." },
      { label: "Write-Back", text: "Write to cache, mark dirty, flush later. Default in modern CPUs." },
      { label: "Miss types", text: "Compulsory, Capacity, Conflict. Different remedies each." },
      { label: "MESI", text: "Coherence protocol for multi-core. Modified/Exclusive/Shared/Invalid. Writes invalidate others." },
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

export default function CacheHierarchyPage() {
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
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.latency.title}</h3>
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-slate-400 w-36">Level</th>
                  <th className="text-left py-2 text-zinc-500 w-44">Size</th>
                  <th className="text-left py-2 text-cyan-400 w-28">Latency</th>
                  <th className="text-left py-2 text-zinc-500">Cycles</th>
                </tr>
              </thead>
              <tbody>
                {t.latency.rows.map((r, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-slate-300/80 font-semibold">{r.level}</td>
                    <td className="py-2 text-zinc-400">{r.size}</td>
                    <td className="py-2 text-cyan-300/80">{r.latency}</td>
                    <td className="py-2 text-zinc-500 text-[10px]">{r.cycles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section number={t.sections[1].number} title={t.sections[1].title} description={t.sections[1].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.locality.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-mono text-emerald-400 mb-2">✓ {t.locality.good.label}</div>
                <CodeBlock language="java" code={t.locality.good.code} showHeader={false} />
                <p className="text-[10px] text-zinc-500 italic mt-2">{t.locality.good.note}</p>
              </div>
              <div>
                <div className="text-[11px] font-mono text-red-400 mb-2">✗ {t.locality.bad.label}</div>
                <CodeBlock language="java" code={t.locality.bad.code} showHeader={false} />
                <p className="text-[10px] text-red-400/80 italic mt-2">{t.locality.bad.note}</p>
              </div>
            </div>
          </div>
        </Section>

        <Section number={t.sections[4].number} title={t.sections[4].title} description={t.sections[4].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.mapping.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-slate-400 w-44" : "text-zinc-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.mapping.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-slate-300/80 font-semibold">{row[0]}</td>
                    <td className="py-2 text-zinc-400">{row[1]}</td>
                    <td className="py-2 text-zinc-500 text-[10px]">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section number={t.sections[3].number} title={t.sections[3].title} description={t.sections[3].desc}>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-2">{t.cacheLine.title}</h3>
            <p className="text-[11px] text-zinc-500 mb-3">{t.cacheLine.desc}</p>
            <CodeBlock language="java" code={t.cacheLine.example} />
          </div>
        </Section>

        <Section number={t.sections[6].number} title={t.sections[6].title} description={t.sections[6].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.mesi.title}</h3>
            <div className="space-y-2 mb-3">
              {t.mesi.rows.map((r) => (
                <div key={r.state} className="grid grid-cols-[140px_1fr] gap-3 text-[11px] font-mono">
                  <span className="text-slate-300/80 font-semibold">{r.state}</span>
                  <span className="text-zinc-400">{r.desc}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500 italic">{t.mesi.note}</p>
          </div>
        </Section>

        <Section number="06" title={t.metrics.title} description="">
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
