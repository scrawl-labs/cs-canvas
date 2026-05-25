"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "data-structures", current: "hash tables" },
  hero: {
    title: "Hash Tables",
    desc: "평균 O(1) 검색/삽입/삭제를 가능하게 하는 자료구조.\n해시 함수 + 충돌 해결 = 거의 모든 언어의 dict/map/object의 내부.",
    tags: ["해시 함수", "충돌", "Chaining", "Open Addressing", "Load Factor", "Rehash"],
  },
  sections: [
    {
      number: "01",
      title: "해시 테이블이란 — 키를 인덱스로",
      desc: "키(문자열, 객체 등)를 해시 함수로 정수 인덱스로 변환하고, 그 위치의 배열 슬롯에 값을 저장. 배열의 O(1) 접근을 임의 키에 대해 흉내냅니다.",
    },
    {
      number: "02",
      title: "좋은 해시 함수의 조건",
      desc: "1) 결정성: 같은 키는 항상 같은 해시. 2) 균등 분포: 출력이 모든 슬롯에 고르게. 3) 빠른 계산. 4) 작은 입력 변화에 큰 출력 변화(avalanche).",
    },
    {
      number: "03",
      title: "충돌 — 비둘기집 원리",
      desc: "키 공간이 슬롯 수보다 크면 충돌은 필연. 두 키가 같은 인덱스에 매핑되면 어떻게 처리할까? 두 가지 전통: Chaining vs Open Addressing.",
    },
    {
      number: "04",
      title: "Chaining (분리 연결법)",
      desc: "각 슬롯에 연결 리스트를 둠. 충돌하면 같은 슬롯의 리스트에 추가. 구현 단순, load factor가 1을 넘어도 동작. Java HashMap의 기본 (Java 8부터는 리스트가 길어지면 트리로 전환).",
    },
    {
      number: "05",
      title: "Open Addressing (개방 주소법)",
      desc: "충돌 시 다른 빈 슬롯을 찾아 직접 저장. Linear Probing(다음 슬롯), Quadratic Probing(i², i²+2², ...), Double Hashing(두 번째 해시 함수). 캐시 친화적, 메모리 효율 좋음.",
    },
    {
      number: "06",
      title: "Load Factor와 Resize",
      desc: "Load Factor α = n / m (원소 수 / 슬롯 수). α가 임계값(보통 0.75)을 넘으면 성능 저하 → 슬롯을 2배로 늘리고 모든 키를 새로 해싱(rehash). 비용 O(n)이지만 분할상환 O(1).",
    },
  ],
  example: {
    title: "예시 — m=7 슬롯, 해시 함수 h(k) = k mod 7",
    keys: [10, 22, 31, 4, 15],
    mapping: [
      ["10", "10 mod 7 = 3", "slot 3"],
      ["22", "22 mod 7 = 1", "slot 1"],
      ["31", "31 mod 7 = 3", "slot 3 (충돌!)"],
      ["4", "4 mod 7 = 4", "slot 4"],
      ["15", "15 mod 7 = 1", "slot 1 (충돌!)"],
    ],
  },
  chaining: {
    title: "Chaining — 위 예시 결과",
    diagram: `slot 0: ∅
slot 1: [22] → [15]
slot 2: ∅
slot 3: [10] → [31]
slot 4: [4]
slot 5: ∅
slot 6: ∅`,
    note: "검색: 슬롯 찾고 리스트 선형 탐색. 평균 O(1+α), 최악 O(n) (모두 같은 슬롯)",
  },
  openAddressing: {
    title: "Open Addressing — Linear Probing 결과",
    steps: [
      "10 → slot 3 ✓",
      "22 → slot 1 ✓",
      "31 → slot 3 충돌 → slot 4 ✓",
      "4 → slot 4 충돌 → slot 5 ✓",
      "15 → slot 1 충돌 → slot 2 ✓",
    ],
    diagram: `slot 0: ∅
slot 1: 22
slot 2: 15
slot 3: 10
slot 4: 31
slot 5: 4
slot 6: ∅`,
    note: "검색: 첫 슬롯부터 빈 슬롯 만날 때까지 선형 탐색. 클러스터링 문제 — 한쪽이 채워지면 연쇄적으로 충돌",
  },
  compare: {
    title: "Chaining vs Open Addressing",
    headers: ["", "Chaining", "Open Addressing"],
    rows: [
      ["충돌 처리", "슬롯 외부 (연결 리스트)", "슬롯 내부 (다른 슬롯 탐색)"],
      ["메모리", "포인터 오버헤드", "포인터 없음, 캐시 친화적"],
      ["Load Factor 한계", "1 초과 가능", "1 미만 필수 (0.7 권장)"],
      ["삭제", "단순 (리스트에서 제거)", "복잡 (Tombstone 필요)"],
      ["최악 시간", "O(n) 동일", "O(n) 동일 (클러스터링)"],
      ["대표 구현", "Java HashMap, Python ≤3.5", "Python ≥3.6, Go map"],
    ],
  },
  complexity: {
    title: "복잡도",
    headers: ["연산", "평균", "최악"],
    rows: [
      ["Insert", "O(1)", "O(n)"],
      ["Search", "O(1)", "O(n)"],
      ["Delete", "O(1)", "O(n)"],
      ["Resize (rehash)", "O(n)", "O(n)"],
    ],
    note: "평균이 O(1)인 것은 좋은 해시 함수와 낮은 load factor 가정. 최악은 모든 키가 한 슬롯에 몰리는 경우 (해시 충돌 공격 가능).",
  },
  realWorld: {
    title: "언어별 구현",
    rows: [
      ["Python dict", "Open Addressing (Perturbation Probing)", "3.6+ 삽입 순서 유지, 컴팩트한 메모리 레이아웃"],
      ["Java HashMap", "Chaining → 길어지면 Red-Black Tree", "충돌 공격 방지를 위해 Tree 전환"],
      ["JavaScript Object", "Open Addressing", "V8: 작은 객체는 hidden class, 큰 객체는 hash table"],
      ["Go map", "Open Addressing (bucket 단위)", "버킷마다 8개 슬롯, 충돌 시 overflow 버킷 연결"],
      ["C++ std::unordered_map", "Chaining", "STL 표준은 chaining 강제"],
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "해시 테이블", text: "키 → 정수 → 배열 인덱스. 임의 키에 대해 평균 O(1) 검색/삽입/삭제." },
      { label: "해시 함수", text: "결정적, 균등 분포, 빠름, avalanche. SHA-256은 안전하지만 느림 — DS용으론 FNV, MurmurHash 등." },
      { label: "충돌", text: "비둘기집 원리상 필연. 두 가지 전략: Chaining, Open Addressing." },
      { label: "Chaining", text: "슬롯 = 연결 리스트. 단순, load factor > 1 허용. Java HashMap." },
      { label: "Open Addressing", text: "충돌 시 다른 슬롯 탐색. 포인터 X, 캐시 친화적. load factor < 0.75 권장. Python dict, Go map." },
      { label: "Load Factor", text: "α = n/m. 너무 크면 성능 저하, 너무 작으면 메모리 낭비. 보통 0.75에서 rehash." },
      { label: "Resize", text: "슬롯을 2배로 + 모든 키 rehash. O(n)이지만 분할상환 O(1). 일시적 지연 주의." },
      { label: "최악 케이스", text: "악의적 키 입력으로 모두 같은 슬롯 → O(n). 방어: 무작위 해시 시드, Tree 전환." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "data-structures", current: "hash tables" },
  hero: {
    title: "Hash Tables",
    desc: "Average O(1) lookup/insert/delete.\nHash function + collision strategy = the engine behind every language's dict/map/object.",
    tags: ["Hash function", "Collision", "Chaining", "Open Addressing", "Load Factor", "Rehash"],
  },
  sections: [
    {
      number: "01",
      title: "Hash Table — Key to Index",
      desc: "Hash an arbitrary key (string, object, …) into an integer index, store the value in that array slot. Mimics O(1) array access for arbitrary keys.",
    },
    {
      number: "02",
      title: "What Makes a Good Hash Function",
      desc: "1) Deterministic. 2) Uniform distribution. 3) Fast. 4) Avalanche: small input change → big output change.",
    },
    {
      number: "03",
      title: "Collisions — Pigeonhole Principle",
      desc: "If key space > slot count, collisions are inevitable. Two keys mapping to the same slot must be handled. Two traditions: Chaining vs Open Addressing.",
    },
    {
      number: "04",
      title: "Chaining (Separate Chaining)",
      desc: "Each slot holds a linked list. On collision, append to the slot's list. Simple, works even with load factor > 1. Java HashMap default (turns list into a tree above a threshold in Java 8+).",
    },
    {
      number: "05",
      title: "Open Addressing",
      desc: "On collision, probe for another empty slot. Linear Probing (next slot), Quadratic Probing (i²), Double Hashing (second hash). Cache friendly, memory efficient.",
    },
    {
      number: "06",
      title: "Load Factor and Resize",
      desc: "Load factor α = n / m. Above a threshold (commonly 0.75), performance drops → grow slots ×2 and rehash all keys. O(n) but amortized O(1).",
    },
  ],
  example: {
    title: "Example — m=7 slots, hash function h(k) = k mod 7",
    keys: [10, 22, 31, 4, 15],
    mapping: [
      ["10", "10 mod 7 = 3", "slot 3"],
      ["22", "22 mod 7 = 1", "slot 1"],
      ["31", "31 mod 7 = 3", "slot 3 (collision!)"],
      ["4", "4 mod 7 = 4", "slot 4"],
      ["15", "15 mod 7 = 1", "slot 1 (collision!)"],
    ],
  },
  chaining: {
    title: "Chaining — result of example",
    diagram: `slot 0: ∅
slot 1: [22] → [15]
slot 2: ∅
slot 3: [10] → [31]
slot 4: [4]
slot 5: ∅
slot 6: ∅`,
    note: "Lookup: find slot, scan list. Avg O(1+α), worst O(n) (all collide)",
  },
  openAddressing: {
    title: "Open Addressing — Linear Probing trace",
    steps: [
      "10 → slot 3 ✓",
      "22 → slot 1 ✓",
      "31 → slot 3 collision → slot 4 ✓",
      "4 → slot 4 collision → slot 5 ✓",
      "15 → slot 1 collision → slot 2 ✓",
    ],
    diagram: `slot 0: ∅
slot 1: 22
slot 2: 15
slot 3: 10
slot 4: 31
slot 5: 4
slot 6: ∅`,
    note: "Lookup: scan from the first slot until empty. Clustering — once a region fills, collisions cascade",
  },
  compare: {
    title: "Chaining vs Open Addressing",
    headers: ["", "Chaining", "Open Addressing"],
    rows: [
      ["Collision handling", "Outside slot (linked list)", "Inside slot (probe)"],
      ["Memory", "Pointer overhead", "No pointers, cache friendly"],
      ["Load factor limit", "Can exceed 1", "Must stay < 1 (0.7 recommended)"],
      ["Delete", "Simple (remove from list)", "Tricky (tombstones)"],
      ["Worst case", "O(n)", "O(n) (clustering)"],
      ["Examples", "Java HashMap, Python ≤3.5", "Python ≥3.6, Go map"],
    ],
  },
  complexity: {
    title: "Complexity",
    headers: ["Operation", "Average", "Worst"],
    rows: [
      ["Insert", "O(1)", "O(n)"],
      ["Search", "O(1)", "O(n)"],
      ["Delete", "O(1)", "O(n)"],
      ["Resize (rehash)", "O(n)", "O(n)"],
    ],
    note: "O(1) average assumes a good hash function and low load factor. Worst case happens when all keys collide (hash flooding attacks).",
  },
  realWorld: {
    title: "How Real Languages Do It",
    rows: [
      ["Python dict", "Open Addressing (Perturbation Probing)", "Insertion-ordered since 3.6, compact layout"],
      ["Java HashMap", "Chaining → Red-Black Tree on overflow", "Tree fallback resists hash-flooding"],
      ["JavaScript Object", "Open Addressing", "V8: hidden class for small objects, hash table for big"],
      ["Go map", "Open Addressing (bucket-based)", "8 slots per bucket, overflow buckets chained"],
      ["C++ std::unordered_map", "Chaining", "STL standard mandates chaining"],
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Hash table", text: "Key → int → array index. Average O(1) lookup/insert/delete for arbitrary keys." },
      { label: "Hash function", text: "Deterministic, uniform, fast, avalanche. SHA-256 is secure but slow — for DS use FNV, MurmurHash, etc." },
      { label: "Collision", text: "Inevitable by pigeonhole. Two strategies: Chaining or Open Addressing." },
      { label: "Chaining", text: "Slot = linked list. Simple, allows load factor > 1. Java HashMap." },
      { label: "Open Addressing", text: "Probe other slots on collision. No pointers, cache friendly. Keep load factor < 0.75. Python dict, Go map." },
      { label: "Load Factor", text: "α = n/m. Too high → slow; too low → wasted memory. Resize at ~0.75." },
      { label: "Resize", text: "Double slots and rehash everything. O(n) but amortized O(1). Watch out for one-off latency spikes." },
      { label: "Worst case", text: "Adversarial keys → all collide → O(n). Defenses: random hash seed, tree fallback." },
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
          <span className="text-xs font-mono text-emerald-500/60">{number}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function HashTablesPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(52,211,153,0.05),transparent)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.home}</Link>
          <span>/</span>
          <Link href="/data-structures" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.parent}</Link>
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

        {/* 01 - mapping */}
        <Section number={t.sections[0].number} title={t.sections[0].title} description={t.sections[0].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.example.title}</h3>
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-emerald-400 w-16">key</th>
                  <th className="text-left py-2 text-zinc-500 w-40">h(k)</th>
                  <th className="text-left py-2 text-zinc-400">slot</th>
                </tr>
              </thead>
              <tbody>
                {t.example.mapping.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-emerald-300/80">{row[0]}</td>
                    <td className="py-2 text-zinc-500">{row[1]}</td>
                    <td className="py-2 text-zinc-400">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 02 - chaining */}
        <Section number={t.sections[3].number} title={t.sections[3].title} description={t.sections[3].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.chaining.title}</h3>
            <pre className="text-[11px] font-mono text-emerald-300">{t.chaining.diagram}</pre>
            <p className="text-[10px] text-zinc-500 mt-3 italic">{t.chaining.note}</p>
          </div>
        </Section>

        {/* 03 - open addressing */}
        <Section number={t.sections[4].number} title={t.sections[4].title} description={t.sections[4].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.openAddressing.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                {t.openAddressing.steps.map((s, i) => (
                  <div key={i} className="text-[11px] font-mono text-zinc-400">{s}</div>
                ))}
              </div>
              <div>
                <pre className="text-[11px] font-mono text-emerald-300">{t.openAddressing.diagram}</pre>
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 mt-3 italic">{t.openAddressing.note}</p>
          </div>
        </Section>

        {/* 04 - compare */}
        <Section number="04" title={t.compare.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.compare.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-zinc-600 w-36" : i === 1 ? "text-emerald-400" : "text-cyan-400"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.compare.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-zinc-500">{row[0]}</td>
                    <td className="py-2 text-emerald-300/80">{row[1]}</td>
                    <td className="py-2 text-cyan-300/80">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 05 - load factor / complexity */}
        <Section number={t.sections[5].number} title={t.sections[5].title} description={t.sections[5].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.complexity.title}</h3>
            <table className="w-full text-[11px] font-mono mb-3">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.complexity.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-emerald-400 w-44" : i === 1 ? "text-zinc-400 w-32" : "text-red-400"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.complexity.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-emerald-300/80">{row[0]}</td>
                    <td className="py-2 text-zinc-300">{row[1]}</td>
                    <td className="py-2 text-red-300/70">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-zinc-500 leading-relaxed">{t.complexity.note}</p>
          </div>
        </Section>

        {/* 06 - real world */}
        <Section number="06" title={t.realWorld.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <tbody>
                {t.realWorld.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 pr-3 text-emerald-300/80 align-top">{row[0]}</td>
                    <td className="py-2 pr-3 text-zinc-300">{row[1]}</td>
                    <td className="py-2 text-zinc-500 text-[10px]">{row[2]}</td>
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
                <span className="text-xs font-mono text-emerald-500/50 shrink-0 mt-0.5 min-w-[140px]">{item.label}</span>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
