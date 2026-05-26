"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "algorithms", current: "greedy" },
  hero: {
    title: "Greedy Algorithms",
    desc: "매 순간 '지금 가장 좋아 보이는' 선택만 하기.\n맞을 때는 단순하고 빠르지만, 항상 맞지는 않습니다 — 두 가지 조건을 만족해야 정답.",
    tags: ["국소 최적", "Greedy Choice", "최적 부분 구조", "Activity Selection", "Huffman"],
  },
  sections: [
    {
      number: "01",
      title: "Greedy의 두 조건",
      desc: "1) Greedy Choice Property: 국소 최적 선택이 전역 최적의 일부. 2) Optimal Substructure: 큰 문제의 최적 = 작은 문제의 최적 + 선택. 둘 다 만족해야 정답 보장.",
    },
    {
      number: "02",
      title: "언제 작동하고 언제 실패하나",
      desc: "Activity Selection, Huffman Coding, MST(Prim/Kruskal) — Greedy로 최적. 0/1 Knapsack — Greedy로 실패, DP 필요. Greedy가 통하는지 증명 없으면 못 믿음.",
    },
    {
      number: "03",
      title: "Activity Selection — 종료 시간 기준 정렬",
      desc: "겹치지 않는 활동을 최대한 많이 선택. 종료 시간이 빠른 순으로 정렬 → 앞에서부터 가능한 것만 선택. O(n log n).",
    },
    {
      number: "04",
      title: "Huffman Coding — 빈도 기반 가변 길이 부호",
      desc: "자주 나오는 문자에 짧은 코드, 드문 문자에 긴 코드. Min-Heap에서 가장 빈도 낮은 두 노드를 결합 → 새 노드 push 반복. 최적 prefix code 생성.",
    },
    {
      number: "05",
      title: "동전 거스름돈 — Greedy의 함정",
      desc: "[25, 10, 5, 1]센트로 30센트 만들기: Greedy(25+5) = 2개 ✓. [1, 6, 10]으로 12 만들기: Greedy(10+1+1) = 3개, 최적(6+6) = 2개 ✗. 동전 체계 따라 다름.",
    },
    {
      number: "06",
      title: "MST — Prim & Kruskal",
      desc: "Minimum Spanning Tree: 모든 노드 연결하는 최소 가중치 트리. Prim: 한 정점에서 시작해 가장 싼 간선 확장 (O(E log V)). Kruskal: 모든 간선 정렬 후 Union-Find로 사이클 피하며 추가 (O(E log E)).",
    },
  ],
  conditions: {
    title: "Greedy가 성립하려면",
    items: [
      {
        name: "Greedy Choice Property",
        desc: "지금 가장 좋아 보이는 선택이 전역 최적 해의 일부가 된다. 한 번 선택하면 되돌아보지 않음.",
        example: "Activity: 종료 가장 빠른 활동을 무조건 선택 — 그게 정답에 포함됨이 증명됨.",
      },
      {
        name: "Optimal Substructure",
        desc: "큰 문제의 최적해 = 첫 선택 후 남은 작은 문제의 최적해 + 첫 선택.",
        example: "Huffman: 가장 빈도 낮은 두 문자를 결합한 후, 나머지 문제도 같은 방식으로 풀림.",
      },
    ],
  },
  activity: {
    title: "Activity Selection — 종료 시간 정렬",
    setup: "활동: A(1-4), B(3-5), C(0-6), D(5-7), E(8-9), F(5-9), G(6-10)",
    steps: [
      "1. 종료 시간 정렬: A(4), B(5), C(6), D(7), E(9), F(9), G(10)",
      "2. A 선택 (종료 4)",
      "3. B는 A와 겹침 (시작 3 < 4) → skip",
      "4. C는 A와 겹침 → skip",
      "5. D는 A와 안 겹침 (시작 5 ≥ 4) → 선택. 종료 7.",
      "6. E는 D와 안 겹침 (시작 8 ≥ 7) → 선택. 종료 9.",
      "7. F, G는 E와 겹침 → skip",
      "→ 결과: A, D, E (3개)",
    ],
  },
  huffman: {
    title: "Huffman 트리 만들기 — 빈도 {A:5, B:9, C:12, D:13, E:16, F:45}",
    steps: [
      "1. 모든 문자를 Min-Heap에 push",
      "2. 가장 작은 두 노드 pop: (A:5, B:9) → 결합 노드 14, push",
      "3. Min-Heap: {C:12, D:13, (A+B):14, E:16, F:45}",
      "4. C, D pop → 결합 25, push",
      "5. (A+B), E pop → 결합 30, push",
      "6. (C+D), 30 pop → 결합 55, push",
      "7. F, 55 pop → 루트 100",
      "→ 왼쪽 0, 오른쪽 1로 코드 할당: F=0, C=100, ...",
    ],
  },
  greedyVsDP: {
    title: "Greedy vs DP",
    headers: ["", "Greedy", "Dynamic Programming"],
    rows: [
      ["선택", "한 번에 결정 (확정)", "모든 선택지 고려"],
      ["속도", "보통 더 빠름", "느림"],
      ["메모리", "거의 X", "테이블 O(n) 이상"],
      ["적용 가능성", "조건 충족할 때만", "최적 부분 구조 + 중복 부분 문제"],
      ["증명", "필수 (Exchange Argument)", "점화식이 증명"],
      ["대표 예", "Activity, Huffman, MST", "Knapsack, LCS, Fibonacci"],
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "Greedy 두 조건", text: "Greedy Choice + Optimal Substructure. 둘 다 만족해야 정답." },
      { label: "성공 사례", text: "Activity Selection, Huffman Coding, Prim/Kruskal MST, Dijkstra (음수 X)." },
      { label: "실패 사례", text: "0/1 Knapsack, 일반적인 동전 거스름돈, TSP. DP 또는 다른 방법 필요." },
      { label: "증명", text: "Exchange Argument: Greedy의 첫 선택을 다른 것으로 바꿔도 더 좋아지지 않음을 증명." },
      { label: "Activity Selection", text: "종료 시간 정렬 → 앞에서부터 가능한 것 선택. O(n log n)." },
      { label: "Huffman", text: "Min-Heap에서 빈도 작은 두 노드 결합 반복. 최적 prefix code." },
      { label: "MST Prim", text: "한 정점부터 시작해 가장 싼 간선 확장. 우선순위 큐 사용. O(E log V)." },
      { label: "MST Kruskal", text: "모든 간선 정렬 후 Union-Find로 사이클 피하며 추가. O(E log E)." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "algorithms", current: "greedy" },
  hero: {
    title: "Greedy Algorithms",
    desc: "Always pick what looks best right now.\nFast and simple when it works — but it doesn't always work. Two conditions guarantee correctness.",
    tags: ["Local optimum", "Greedy Choice", "Optimal Substructure", "Activity Selection", "Huffman"],
  },
  sections: [
    {
      number: "01",
      title: "Two Greedy Conditions",
      desc: "1) Greedy Choice Property: a local-optimal choice is part of the global optimum. 2) Optimal Substructure: solving the rest after that choice is itself optimal. Need both.",
    },
    {
      number: "02",
      title: "When Greedy Works vs Fails",
      desc: "Activity Selection, Huffman Coding, MST (Prim/Kruskal) — greedy is correct. 0/1 Knapsack — greedy fails, needs DP. Without proof, don't trust greedy.",
    },
    {
      number: "03",
      title: "Activity Selection — Sort by Finish Time",
      desc: "Pick the maximum number of non-overlapping activities. Sort by finish time, then greedily pick the first compatible one. O(n log n).",
    },
    {
      number: "04",
      title: "Huffman Coding — Frequency-Based Variable-Length Codes",
      desc: "Frequent characters get short codes, rare ones get long. Combine the two least frequent nodes in a min-heap and push the result. Yields optimal prefix codes.",
    },
    {
      number: "05",
      title: "Coin Change — Greedy's Pitfall",
      desc: "[25, 10, 5, 1] making 30: greedy (25+5) = 2 ✓. [1, 6, 10] making 12: greedy (10+1+1) = 3, optimal (6+6) = 2 ✗. Coin systems matter.",
    },
    {
      number: "06",
      title: "MST — Prim & Kruskal",
      desc: "Minimum Spanning Tree: connect all nodes with minimum total weight. Prim: grow from one vertex picking the cheapest edge (O(E log V)). Kruskal: sort all edges, add via Union-Find avoiding cycles (O(E log E)).",
    },
  ],
  conditions: {
    title: "What Greedy Requires",
    items: [
      {
        name: "Greedy Choice Property",
        desc: "The locally best choice is part of some global optimum. Never reconsider.",
        example: "Activity: always pick the earliest-finishing activity — proven to be in the optimum.",
      },
      {
        name: "Optimal Substructure",
        desc: "Optimal solution = first choice + optimal solution of the remaining subproblem.",
        example: "Huffman: combine the two least frequent characters; the rest is the same problem.",
      },
    ],
  },
  activity: {
    title: "Activity Selection — Sorted by Finish Time",
    setup: "Activities: A(1-4), B(3-5), C(0-6), D(5-7), E(8-9), F(5-9), G(6-10)",
    steps: [
      "1. Sort by finish: A(4), B(5), C(6), D(7), E(9), F(9), G(10)",
      "2. Pick A (ends at 4)",
      "3. B overlaps A (starts 3 < 4) → skip",
      "4. C overlaps A → skip",
      "5. D does not overlap A (5 ≥ 4) → pick. Ends at 7.",
      "6. E does not overlap D (8 ≥ 7) → pick. Ends at 9.",
      "7. F, G overlap E → skip",
      "→ Result: A, D, E (3 activities)",
    ],
  },
  huffman: {
    title: "Huffman Tree — frequencies {A:5, B:9, C:12, D:13, E:16, F:45}",
    steps: [
      "1. Push every character into a min-heap",
      "2. Pop the two smallest (A:5, B:9) → combined node 14, push",
      "3. Heap: {C:12, D:13, (A+B):14, E:16, F:45}",
      "4. Pop C, D → combined 25, push",
      "5. Pop (A+B), E → combined 30, push",
      "6. Pop (C+D), 30 → combined 55, push",
      "7. Pop F, 55 → root 100",
      "→ Left=0, right=1: F=0, C=100, ...",
    ],
  },
  greedyVsDP: {
    title: "Greedy vs DP",
    headers: ["", "Greedy", "Dynamic Programming"],
    rows: [
      ["Choice", "Commit immediately", "Consider all options"],
      ["Speed", "Usually faster", "Slower"],
      ["Memory", "Almost none", "Table O(n) or more"],
      ["Applicability", "Only when proven", "Optimal substructure + overlapping subproblems"],
      ["Proof", "Required (Exchange Argument)", "Recurrence is the proof"],
      ["Examples", "Activity, Huffman, MST", "Knapsack, LCS, Fibonacci"],
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Two conditions", text: "Greedy Choice + Optimal Substructure. Need both for correctness." },
      { label: "Wins", text: "Activity Selection, Huffman, Prim/Kruskal MST, Dijkstra (no negatives)." },
      { label: "Failures", text: "0/1 Knapsack, general coin change, TSP. Need DP or other methods." },
      { label: "Proof technique", text: "Exchange Argument: swap the greedy choice with any other — result doesn't improve." },
      { label: "Activity Selection", text: "Sort by finish, pick first compatible. O(n log n)." },
      { label: "Huffman", text: "Min-heap merge of the two smallest, repeat. Optimal prefix code." },
      { label: "MST Prim", text: "Grow from one vertex, take cheapest edge. PQ-based. O(E log V)." },
      { label: "MST Kruskal", text: "Sort edges, add via Union-Find skipping cycles. O(E log E)." },
    ],
  },
};

interface SectionProps { number: string; title: string; description: string; children: ReactNode; }
function Section({ number, title, description, children }: SectionProps) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-xs font-mono text-violet-500/60">{number}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function GreedyPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;
  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(139,92,246,0.06),transparent)]" />
      <div className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.home}</Link>
          <span>/</span>
          <Link href="/algorithms" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.parent}</Link>
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
              {t.conditions.items.map((c) => (
                <div key={c.name} className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                  <div className="text-sm font-mono text-violet-300 font-semibold mb-2">{c.name}</div>
                  <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">{c.desc}</p>
                  <div className="text-[10px] text-zinc-500 italic border-t border-violet-500/20 pt-2">{c.example}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-[11px] text-zinc-500 mb-3">{t.activity.setup}</p>
            <div className="space-y-1">
              {t.activity.steps.map((s, i) => (
                <div key={i} className="text-[11px] font-mono text-zinc-400">{s}</div>
              ))}
            </div>
          </div>
        </Section>

        <Section number={t.sections[3].number} title={t.sections[3].title} description={t.sections[3].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.huffman.title}</h3>
            <div className="space-y-1">
              {t.huffman.steps.map((s, i) => (
                <div key={i} className="text-[11px] font-mono text-zinc-400">{s}</div>
              ))}
            </div>
          </div>
        </Section>

        <Section number="05" title={t.greedyVsDP.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.greedyVsDP.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-zinc-600 w-28" : i === 1 ? "text-violet-400" : "text-emerald-400"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.greedyVsDP.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-zinc-500">{row[0]}</td>
                    <td className="py-2 text-violet-300/80">{row[1]}</td>
                    <td className="py-2 text-emerald-300/80">{row[2]}</td>
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
                <span className="text-xs font-mono text-violet-500/50 shrink-0 mt-0.5 min-w-[140px]">{item.label}</span>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
