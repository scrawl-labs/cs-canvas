"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";
import CodeBlock from "@/components/CodeBlock";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "algorithms", current: "backtracking" },
  hero: {
    title: "Backtracking",
    desc: "가능한 모든 후보를 탐색하되, 막다른 길이면 즉시 되돌아오기.\nDFS + 가지치기(pruning) — N-Queens, Sudoku, 부분집합/순열 생성의 표준 패턴.",
    tags: ["DFS", "Pruning", "탐색 트리", "N-Queens", "Sudoku", "Permutation"],
  },
  sections: [
    {
      number: "01",
      title: "Backtracking이란 — 탐색 + 가지치기",
      desc: "모든 가능성을 트리로 펼쳐 DFS하되, 현재 부분 해가 제약을 위반하면 그 가지를 잘라냄. 완전 탐색보다 훨씬 빠를 수 있지만 최악은 지수 시간.",
    },
    {
      number: "02",
      title: "기본 패턴",
      desc: "1) 결정할 변수 선택. 2) 가능한 값들을 시도. 3) 유효하면 재귀. 4) 막다른 길이면 되돌아옴(backtrack). 5) 답을 찾았으면 기록/반환.",
    },
    {
      number: "03",
      title: "N-Queens — N×N 보드에 N개의 퀸",
      desc: "서로 공격하지 않게 배치. 행 단위로 진행: i행에 퀸을 놓으려면 이전 행들과 같은 열·대각선이 아니어야 함. 8-Queens는 92가지 해.",
    },
    {
      number: "04",
      title: "Sudoku — 9×9 격자",
      desc: "각 행·열·3x3 박스에 1-9가 정확히 한 번. 빈 칸을 찾아 가능한 숫자 시도 → 재귀. 막히면 되돌아옴. 가지치기로 사람보다 훨씬 빠름.",
    },
    {
      number: "05",
      title: "Subset & Permutation 생성",
      desc: "부분집합: 각 원소 '포함/미포함' 결정 → 2^n. 순열: 매 단계 남은 원소 중 하나 선택 → n! . 둘 다 backtracking의 전형적 응용.",
    },
    {
      number: "06",
      title: "가지치기 (Pruning) — 효율의 핵심",
      desc: "현재 부분 해로 절대 유효한 답이 안 나오면 미리 포기. 제약 위반 즉시 백트랙. 좋은 pruning이 지수 시간을 다항 시간 수준까지 줄일 수 있음.",
    },
  ],
  pattern: {
    title: "Backtracking 일반 패턴",
    code: `void backtrack(State state) {
    if (isSolution(state)) {
        record(state);
        return;
    }
    for (Choice choice : choices(state)) {
        if (isValid(state, choice)) {     // 제약 검사 (pruning)
            state.add(choice);
            backtrack(state);             // 재귀
            state.remove(choice);         // 백트랙 (상태 복원)
        }
    }
}`,
  },
  nqueens: {
    title: "4-Queens 탐색 트리 일부",
    tree: `행0: 열0
  행1: 열0 ✗ (같은 열)
  행1: 열1 ✗ (대각선)
  행1: 열2 ✓
    행2: 열0 ✗ (대각선)
    행2: 열1 ✗ (같은 열)
    행2: 열2 ✗ (같은 열)
    행2: 열3 ✗ (대각선) → 백트랙
  행1: 열3 ✓
    행2: 열0 ✓
      행3: 열0 ✗ (같은 열)
      행3: 열1 ✗ (같은 열)
      ...`,
    note: "각 행마다 N개 시도, 제약 위반하면 즉시 백트랙.",
  },
  permutation: {
    title: "Permutation [1, 2, 3] — 탐색 트리",
    tree: `start: []
├── 1
│   ├── 2
│   │   └── 3 → [1, 2, 3]
│   └── 3
│       └── 2 → [1, 3, 2]
├── 2
│   ├── 1
│   │   └── 3 → [2, 1, 3]
│   └── 3
│       └── 1 → [2, 3, 1]
└── 3
    ├── 1
    │   └── 2 → [3, 1, 2]
    └── 2
        └── 1 → [3, 2, 1]`,
    note: "총 3! = 6개 순열. 각 단계 남은 원소 중 선택, 사용 후 빼고 재귀.",
  },
  subset: {
    title: "Subset {1, 2, 3} — 포함/미포함 결정",
    tree: `start: []
├── 1 미포함
│   ├── 2 미포함
│   │   ├── 3 미포함 → {}
│   │   └── 3 포함   → {3}
│   └── 2 포함
│       ├── 3 미포함 → {2}
│       └── 3 포함   → {2, 3}
└── 1 포함
    ├── 2 미포함
    │   ├── 3 미포함 → {1}
    │   └── 3 포함   → {1, 3}
    └── 2 포함
        ├── 3 미포함 → {1, 2}
        └── 3 포함   → {1, 2, 3}`,
    note: "총 2^3 = 8개. 각 원소 포함/미포함의 2진 결정.",
  },
  pruning: {
    title: "가지치기 예시 — Sum이 K를 넘어가면 중단",
    desc: "배열에서 합이 K인 부분집합 찾기. 현재 합이 이미 K 초과면 더 추가해도 의미 없음 → 즉시 백트랙.",
    code: `void backtrack(int idx, int currentSum, List<Integer> subset) {
    if (currentSum == K) {
        record(subset);
        return;
    }
    if (currentSum > K || idx == n) {   // ★ 가지치기
        return;
    }
    // 포함
    subset.add(arr[idx]);
    backtrack(idx + 1, currentSum + arr[idx], subset);
    subset.remove(subset.size() - 1);
    // 미포함
    backtrack(idx + 1, currentSum, subset);
}`,
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "Backtracking", text: "탐색 트리를 DFS + 제약 위반 시 백트랙. 완전 탐색의 효율적 버전." },
      { label: "패턴", text: "선택 → 유효성 검사 → 재귀 → 상태 복원 → 다음 선택." },
      { label: "vs 완전 탐색", text: "이론상 같은 최악이지만, pruning으로 평균은 훨씬 빠름." },
      { label: "vs DP", text: "DP는 중복 부분 문제 활용. Backtracking은 일반적으로 부분 해를 누적하며 탐색." },
      { label: "N-Queens", text: "행 단위로 진행. 열·대각선 충돌 검사. 8-Queens는 92해." },
      { label: "Sudoku", text: "빈 칸에 1-9 시도. 행/열/박스 위반 즉시 백트랙." },
      { label: "Permutation/Subset", text: "Backtracking의 기본 응용. n!개 / 2^n개 생성." },
      { label: "Pruning", text: "효율의 핵심. 좋은 제약 검사로 지수→다항 시간 가능." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "algorithms", current: "backtracking" },
  hero: {
    title: "Backtracking",
    desc: "Explore all candidates, but back off immediately when a dead end appears.\nDFS + pruning — the standard pattern for N-Queens, Sudoku, subsets, permutations.",
    tags: ["DFS", "Pruning", "Search tree", "N-Queens", "Sudoku", "Permutation"],
  },
  sections: [
    {
      number: "01",
      title: "Backtracking — Search + Prune",
      desc: "DFS through the tree of possibilities, but cut a branch the moment the partial solution violates a constraint. Can be far faster than brute force, though worst case is exponential.",
    },
    {
      number: "02",
      title: "Standard Pattern",
      desc: "1) Pick the next variable to decide. 2) Try each candidate value. 3) Recurse if valid. 4) Backtrack on dead end. 5) Record when complete.",
    },
    {
      number: "03",
      title: "N-Queens — N queens on N×N",
      desc: "Place queens so they don't attack. Row-by-row: column and diagonal must be free from previous rows. 8-Queens has 92 solutions.",
    },
    {
      number: "04",
      title: "Sudoku — 9×9 grid",
      desc: "Each row/col/3x3 box contains 1-9 exactly once. Find an empty cell, try valid digits, recurse, backtrack on failure. Pruning beats humans handily.",
    },
    {
      number: "05",
      title: "Subset & Permutation Generation",
      desc: "Subsets: include/exclude each element → 2^n. Permutations: pick from remaining at each step → n!. Both are classic backtracking applications.",
    },
    {
      number: "06",
      title: "Pruning — The Real Speedup",
      desc: "Abandon a branch the moment it can't yield a valid answer. Good pruning brings exponential trees down to near-polynomial in practice.",
    },
  ],
  pattern: {
    title: "General Backtracking Pattern",
    code: `void backtrack(State state) {
    if (isSolution(state)) {
        record(state);
        return;
    }
    for (Choice choice : choices(state)) {
        if (isValid(state, choice)) {     // constraint check (pruning)
            state.add(choice);
            backtrack(state);             // recurse
            state.remove(choice);         // backtrack (restore)
        }
    }
}`,
  },
  nqueens: {
    title: "4-Queens — partial search tree",
    tree: `row0: col0
  row1: col0 ✗ (same column)
  row1: col1 ✗ (diagonal)
  row1: col2 ✓
    row2: col0 ✗ (diagonal)
    row2: col1 ✗ (same column)
    row2: col2 ✗ (same column)
    row2: col3 ✗ (diagonal) → backtrack
  row1: col3 ✓
    row2: col0 ✓
      row3: col0 ✗ (same column)
      row3: col1 ✗ (same column)
      ...`,
    note: "Try N columns per row, backtrack instantly on conflict.",
  },
  permutation: {
    title: "Permutations of [1, 2, 3]",
    tree: `start: []
├── 1
│   ├── 2
│   │   └── 3 → [1, 2, 3]
│   └── 3
│       └── 2 → [1, 3, 2]
├── 2
│   ├── 1
│   │   └── 3 → [2, 1, 3]
│   └── 3
│       └── 1 → [2, 3, 1]
└── 3
    ├── 1
    │   └── 2 → [3, 1, 2]
    └── 2
        └── 1 → [3, 2, 1]`,
    note: "3! = 6 permutations. Pick from remaining, mark used, recurse, unmark.",
  },
  subset: {
    title: "Subsets of {1, 2, 3} — include/exclude tree",
    tree: `start: []
├── 1 excluded
│   ├── 2 excluded
│   │   ├── 3 excluded → {}
│   │   └── 3 included → {3}
│   └── 2 included
│       ├── 3 excluded → {2}
│       └── 3 included → {2, 3}
└── 1 included
    ├── 2 excluded
    │   ├── 3 excluded → {1}
    │   └── 3 included → {1, 3}
    └── 2 included
        ├── 3 excluded → {1, 2}
        └── 3 included → {1, 2, 3}`,
    note: "2^3 = 8 subsets. Binary decision per element.",
  },
  pruning: {
    title: "Pruning Example — stop when sum exceeds K",
    desc: "Find subsets summing to K. If the running sum already exceeds K, adding more can't help → backtrack immediately.",
    code: `void backtrack(int idx, int currentSum, List<Integer> subset) {
    if (currentSum == K) {
        record(subset);
        return;
    }
    if (currentSum > K || idx == n) {   // ★ prune
        return;
    }
    // include
    subset.add(arr[idx]);
    backtrack(idx + 1, currentSum + arr[idx], subset);
    subset.remove(subset.size() - 1);
    // exclude
    backtrack(idx + 1, currentSum, subset);
}`,
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Backtracking", text: "DFS over the search tree + backtrack on constraint violation. Smarter brute force." },
      { label: "Pattern", text: "Choose → check validity → recurse → restore state → next choice." },
      { label: "vs Brute force", text: "Same worst case in theory, but pruning makes the average much faster." },
      { label: "vs DP", text: "DP exploits overlapping subproblems; backtracking explores choices and accumulates partial solutions." },
      { label: "N-Queens", text: "Row by row. Check column and diagonal clashes. 92 solutions for N=8." },
      { label: "Sudoku", text: "Try 1-9 in empty cells. Backtrack on row/col/box violation." },
      { label: "Permutation/Subset", text: "Backtracking 101. Generate n! / 2^n combinations." },
      { label: "Pruning", text: "The key to performance. Good cuts turn exponential trees into near-polynomial work." },
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

export default function BacktrackingPage() {
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
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.pattern.title}</h3>
            <CodeBlock language="java" code={t.pattern.code} />
          </div>
        </Section>

        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.nqueens.title}</h3>
            <pre className="text-[11px] font-mono text-violet-300 whitespace-pre">{t.nqueens.tree}</pre>
            <p className="text-[10px] text-zinc-500 italic mt-3">{t.nqueens.note}</p>
          </div>
        </Section>

        <Section number={t.sections[4].number} title={t.sections[4].title} description={t.sections[4].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
            <div>
              <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.permutation.title}</h3>
              <pre className="text-[11px] font-mono text-violet-300 whitespace-pre">{t.permutation.tree}</pre>
              <p className="text-[10px] text-zinc-500 italic mt-2">{t.permutation.note}</p>
            </div>
            <div className="border-t border-zinc-800 pt-4">
              <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.subset.title}</h3>
              <pre className="text-[11px] font-mono text-violet-300 whitespace-pre">{t.subset.tree}</pre>
              <p className="text-[10px] text-zinc-500 italic mt-2">{t.subset.note}</p>
            </div>
          </div>
        </Section>

        <Section number={t.sections[5].number} title={t.sections[5].title} description={t.sections[5].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-2">{t.pruning.title}</h3>
            <p className="text-[11px] text-zinc-500 mb-3">{t.pruning.desc}</p>
            <CodeBlock language="java" code={t.pruning.code} />
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
