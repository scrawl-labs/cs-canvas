"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: {
    home: "cs-canvas",
    parent: "algorithms",
    current: "dynamic programming",
  },
  hero: {
    title: "Dynamic Programming",
    desc: "큰 문제를 같은 모양의 작은 문제로 쪼개고, 답을 한 번만 계산해서 재사용합니다.\nDP = '최적 부분 구조' + '중복 부분 문제' — 두 조건이 모두 있어야 DP.",
    tags: ["Memoization", "Tabulation", "Bottom-up vs Top-down", "최적 부분 구조"],
  },
  sections: [
    {
      number: "01",
      title: "DP가 가능한 두 조건",
      desc: "1) 최적 부분 구조(Optimal Substructure): 큰 문제의 최적해 = 작은 문제들의 최적해 조합. 2) 중복 부분 문제(Overlapping Subproblems): 같은 작은 문제가 여러 번 반복됨. 둘 다 있으면 DP, 첫째만 있으면 분할 정복.",
    },
    {
      number: "02",
      title: "Top-down (재귀 + Memoization)",
      desc: "원래 재귀 풀이에 캐시를 추가. 코드가 자연스럽고 디버깅이 쉽지만, 함수 호출 오버헤드와 스택 깊이 위험이 있음.",
    },
    {
      number: "03",
      title: "Bottom-up (반복 + Tabulation)",
      desc: "작은 부분 문제부터 표(table)를 채워나감. 재귀 호출이 없어 빠르고, 공간 최적화 트릭(rolling array 등)을 적용하기 쉬움.",
    },
    {
      number: "04",
      title: "고전 예제 — Fibonacci",
      desc: "가장 간단한 DP. 단순 재귀는 O(2ⁿ), DP는 O(n). 더 나아가 공간을 O(1)로 줄일 수 있음.",
    },
    {
      number: "05",
      title: "0/1 Knapsack — 2차원 DP",
      desc: "n개 물건, 용량 W의 배낭. 각 물건을 '담는다/안 담는다' 결정. dp[i][w] = i번까지 고려, 용량 w일 때 최대 가치. O(nW).",
    },
    {
      number: "06",
      title: "LCS (Longest Common Subsequence) — 문자열 DP",
      desc: "두 문자열의 가장 긴 공통 부분 수열. dp[i][j] = X[0..i], Y[0..j]의 LCS 길이. diff 도구, DNA 비교에 사용.",
    },
  ],
  fib: {
    title: "Fibonacci — 4가지 풀이",
    versions: [
      {
        name: "단순 재귀",
        complexity: "O(2ⁿ) 시간",
        code: `int fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}`,
        note: "fib(5)를 계산할 때 fib(2)를 5번 호출 — 중복 폭증",
      },
      {
        name: "Top-down (Memo)",
        complexity: "O(n) 시간, O(n) 공간",
        code: `Map<Integer, Integer> memo = new HashMap<>();
int fib(int n) {
    if (memo.containsKey(n)) return memo.get(n);
    if (n < 2) return n;
    int result = fib(n - 1) + fib(n - 2);
    memo.put(n, result);
    return result;
}`,
        note: "한 번 계산한 값은 캐시에서 즉시 반환",
      },
      {
        name: "Bottom-up (Table)",
        complexity: "O(n) 시간, O(n) 공간",
        code: `int fib(int n) {
    int[] dp = new int[n + 1];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`,
        note: "작은 값부터 위로 — 재귀 호출 없음",
      },
      {
        name: "공간 최적화",
        complexity: "O(n) 시간, O(1) 공간",
        code: `int fib(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        int next = a + b;
        a = b;
        b = next;
    }
    return a;
}`,
        note: "직전 두 값만 필요 — 배열 불필요",
      },
    ],
  },
  knapsack: {
    title: "0/1 Knapsack — DP 표 채우기",
    setup: "물건: (무게, 가치) = (2, 3), (3, 4), (4, 5), (5, 6). 용량 W=5",
    table: [
      ["i \\ w", "0", "1", "2", "3", "4", "5"],
      ["0 (없음)", "0", "0", "0", "0", "0", "0"],
      ["1 (2,3)", "0", "0", "3", "3", "3", "3"],
      ["2 (3,4)", "0", "0", "3", "4", "4", "7"],
      ["3 (4,5)", "0", "0", "3", "4", "5", "7"],
      ["4 (5,6)", "0", "0", "3", "4", "5", "7"],
    ],
    recurrence: "dp[i][w] = max(dp[i-1][w], dp[i-1][w - wᵢ] + vᵢ)",
    answer: "→ dp[4][5] = 7 (물건 1+2 선택)",
  },
  lcs: {
    title: "LCS — 'ABCBDAB' vs 'BDCAB'",
    table: [
      ["", "", "B", "D", "C", "A", "B"],
      ["", "0", "0", "0", "0", "0", "0"],
      ["A", "0", "0", "0", "0", "1", "1"],
      ["B", "0", "1", "1", "1", "1", "2"],
      ["C", "0", "1", "1", "2", "2", "2"],
      ["B", "0", "1", "1", "2", "2", "3"],
      ["D", "0", "1", "2", "2", "2", "3"],
      ["A", "0", "1", "2", "2", "3", "3"],
      ["B", "0", "1", "2", "2", "3", "4"],
    ],
    recurrence: "X[i]==Y[j] → dp[i][j] = dp[i-1][j-1] + 1\n그 외 → dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
    answer: "→ 길이 4 (예: 'BCAB' 또는 'BDAB')",
  },
  comparison: {
    title: "Top-down vs Bottom-up",
    headers: ["", "Top-down (Memo)", "Bottom-up (Table)"],
    rows: [
      ["방향", "원래 문제 → 작은 문제", "작은 문제 → 원래 문제"],
      ["구현", "재귀 + 캐시", "반복문 + 배열"],
      ["오버헤드", "함수 호출 비용", "없음 (빠름)"],
      ["스택 위험", "깊은 재귀 시 stack overflow", "없음"],
      ["부분 문제 모두 풀이", "아니오 (필요한 것만)", "예 (전부)"],
      ["공간 최적화", "어려움", "쉬움 (rolling array)"],
    ],
  },
  approach: {
    title: "DP 문제 풀이 4단계",
    steps: [
      { n: "1", title: "상태 정의 (State)", desc: "dp[i] 또는 dp[i][j]가 무엇을 의미하는지 한 문장으로 정의. 'i번째까지 고려했을 때의 최대 가치' 같이." },
      { n: "2", title: "점화식 (Recurrence)", desc: "dp[i]를 dp[i-1], dp[i-2] 등 더 작은 상태로 표현. 선택지를 모두 나열하고 max/min/sum 적용." },
      { n: "3", title: "초기값 (Base case)", desc: "가장 작은 부분 문제의 답을 직접 채움. dp[0] = 0 또는 dp[0][w] = 0 같이." },
      { n: "4", title: "계산 순서 (Order)", desc: "Bottom-up이면 의존하는 dp 값들이 먼저 계산되도록 순서 결정. 보통 작은 인덱스부터." },
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "DP 조건", text: "최적 부분 구조 + 중복 부분 문제. 둘 다 있어야 DP. 첫째만 있으면 분할 정복." },
      { label: "Top-down", text: "재귀 + memoization. 자연스러운 표현, 필요한 부분만 계산. 스택 깊이 주의." },
      { label: "Bottom-up", text: "반복문 + 표 채우기. 빠르고 안전. 공간 최적화 트릭 적용 쉬움." },
      { label: "점화식", text: "상태 → 선택지 → max/min/sum. 점화식이 안 나오면 DP가 아닐 가능성이 큼." },
      { label: "공간 최적화", text: "dp[i]가 dp[i-1], dp[i-2]에만 의존하면 O(1) 가능. 행이 두 개만 필요하면 rolling array." },
      { label: "Fibonacci", text: "DP의 'hello world'. 단순 재귀 O(2ⁿ) → DP O(n) → 공간 최적화 O(1)." },
      { label: "Knapsack", text: "0/1: 각 물건을 '담는다/안 담는다'. dp[i][w] = max(거름, 담음). O(nW)." },
      { label: "LCS", text: "두 문자열 공통 부분 수열의 최대 길이. dp[i][j] 2차원. diff 알고리즘의 기반." },
    ],
  },
};

const EN = {
  breadcrumb: {
    home: "cs-canvas",
    parent: "algorithms",
    current: "dynamic programming",
  },
  hero: {
    title: "Dynamic Programming",
    desc: "Break a big problem into smaller copies of itself, compute each answer once, reuse forever.\nDP = optimal substructure + overlapping subproblems. Both must hold.",
    tags: ["Memoization", "Tabulation", "Bottom-up vs Top-down", "Optimal substructure"],
  },
  sections: [
    {
      number: "01",
      title: "Two Conditions for DP",
      desc: "1) Optimal substructure: the optimum of a big problem = combination of optimal subproblem solutions. 2) Overlapping subproblems: the same subproblem appears many times. Both → DP. Only the first → divide and conquer.",
    },
    {
      number: "02",
      title: "Top-down (Recursion + Memoization)",
      desc: "Add a cache to the natural recursive solution. Easy to write and debug, but pays function-call overhead and risks deep recursion.",
    },
    {
      number: "03",
      title: "Bottom-up (Iteration + Tabulation)",
      desc: "Fill a table starting from the smallest subproblems. No recursion → faster, and space optimization tricks (rolling array) are easy to apply.",
    },
    {
      number: "04",
      title: "Classic — Fibonacci",
      desc: "The simplest DP. Naive recursion is O(2ⁿ), DP is O(n), and we can shrink space to O(1).",
    },
    {
      number: "05",
      title: "0/1 Knapsack — 2D DP",
      desc: "n items, capacity W. For each item decide take/skip. dp[i][w] = best value considering items 1..i with capacity w. O(nW).",
    },
    {
      number: "06",
      title: "LCS (Longest Common Subsequence) — String DP",
      desc: "Longest subsequence common to two strings. dp[i][j] = LCS length of X[0..i], Y[0..j]. Foundation of diff tools and DNA comparison.",
    },
  ],
  fib: {
    title: "Fibonacci — 4 Implementations",
    versions: [
      {
        name: "Naive Recursion",
        complexity: "O(2ⁿ) time",
        code: `int fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}`,
        note: "fib(5) calls fib(2) five times — duplication explodes",
      },
      {
        name: "Top-down (Memo)",
        complexity: "O(n) time, O(n) space",
        code: `Map<Integer, Integer> memo = new HashMap<>();
int fib(int n) {
    if (memo.containsKey(n)) return memo.get(n);
    if (n < 2) return n;
    int result = fib(n - 1) + fib(n - 2);
    memo.put(n, result);
    return result;
}`,
        note: "Once computed, values return from the cache instantly",
      },
      {
        name: "Bottom-up (Table)",
        complexity: "O(n) time, O(n) space",
        code: `int fib(int n) {
    int[] dp = new int[n + 1];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`,
        note: "From small to big — no recursion",
      },
      {
        name: "Space Optimized",
        complexity: "O(n) time, O(1) space",
        code: `int fib(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        int next = a + b;
        a = b;
        b = next;
    }
    return a;
}`,
        note: "Only the last two values matter — no array needed",
      },
    ],
  },
  knapsack: {
    title: "0/1 Knapsack — Filling the DP Table",
    setup: "Items: (weight, value) = (2, 3), (3, 4), (4, 5), (5, 6). Capacity W=5",
    table: [
      ["i \\ w", "0", "1", "2", "3", "4", "5"],
      ["0 (none)", "0", "0", "0", "0", "0", "0"],
      ["1 (2,3)", "0", "0", "3", "3", "3", "3"],
      ["2 (3,4)", "0", "0", "3", "4", "4", "7"],
      ["3 (4,5)", "0", "0", "3", "4", "5", "7"],
      ["4 (5,6)", "0", "0", "3", "4", "5", "7"],
    ],
    recurrence: "dp[i][w] = max(dp[i-1][w], dp[i-1][w - wᵢ] + vᵢ)",
    answer: "→ dp[4][5] = 7 (take items 1+2)",
  },
  lcs: {
    title: "LCS — 'ABCBDAB' vs 'BDCAB'",
    table: [
      ["", "", "B", "D", "C", "A", "B"],
      ["", "0", "0", "0", "0", "0", "0"],
      ["A", "0", "0", "0", "0", "1", "1"],
      ["B", "0", "1", "1", "1", "1", "2"],
      ["C", "0", "1", "1", "2", "2", "2"],
      ["B", "0", "1", "1", "2", "2", "3"],
      ["D", "0", "1", "2", "2", "2", "3"],
      ["A", "0", "1", "2", "2", "3", "3"],
      ["B", "0", "1", "2", "2", "3", "4"],
    ],
    recurrence: "X[i]==Y[j] → dp[i][j] = dp[i-1][j-1] + 1\nelse → dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
    answer: "→ length 4 (e.g. 'BCAB' or 'BDAB')",
  },
  comparison: {
    title: "Top-down vs Bottom-up",
    headers: ["", "Top-down (Memo)", "Bottom-up (Table)"],
    rows: [
      ["Direction", "Original → subproblems", "Subproblems → original"],
      ["Implementation", "Recursion + cache", "Loop + array"],
      ["Overhead", "Function calls", "None (fast)"],
      ["Stack risk", "Deep recursion → overflow", "None"],
      ["Solves all subproblems", "No (only needed)", "Yes (all)"],
      ["Space optimization", "Harder", "Easier (rolling array)"],
    ],
  },
  approach: {
    title: "4 Steps to Solve a DP Problem",
    steps: [
      { n: "1", title: "Define state", desc: "What does dp[i] or dp[i][j] mean? Write it in one sentence — 'best value considering items up to i' for example." },
      { n: "2", title: "Recurrence", desc: "Express dp[i] in terms of smaller states. Enumerate all choices, then take max/min/sum." },
      { n: "3", title: "Base case", desc: "Fill in the smallest subproblem(s) directly. Like dp[0] = 0 or dp[0][w] = 0." },
      { n: "4", title: "Computation order", desc: "Bottom-up: make sure dependent dp values are computed first. Usually small index up." },
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "When DP applies", text: "Optimal substructure + overlapping subproblems. Both needed. Only first → divide and conquer." },
      { label: "Top-down", text: "Recursion + memoization. Natural expression, computes only needed parts. Mind stack depth." },
      { label: "Bottom-up", text: "Loop + table. Fast and safe. Space optimization tricks are easy to apply." },
      { label: "Recurrence", text: "State → choices → max/min/sum. If you can't write a recurrence, it probably isn't DP." },
      { label: "Space optimization", text: "If dp[i] only depends on dp[i-1], dp[i-2] → O(1) is possible. If only two rows needed → rolling array." },
      { label: "Fibonacci", text: "DP 'hello world'. Naive O(2ⁿ) → DP O(n) → space-optimized O(1)." },
      { label: "Knapsack", text: "0/1: take or skip each item. dp[i][w] = max(skip, take). O(nW)." },
      { label: "LCS", text: "Longest common subsequence of two strings. 2D dp[i][j]. Foundation of diff." },
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
          <span className="text-xs font-mono text-violet-500/60">{number}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function DynamicProgrammingPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(139,92,246,0.06),transparent)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">
            {t.breadcrumb.home}
          </Link>
          <span>/</span>
          <Link href="/algorithms" className="hover:text-zinc-400 transition-colors">
            {t.breadcrumb.parent}
          </Link>
          <span>/</span>
          <span className="text-zinc-400">{t.breadcrumb.current}</span>
        </div>

        {/* hero */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-white font-mono mb-4">
            {t.hero.title}
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-2xl mb-6 whitespace-pre-line">
            {t.hero.desc}
          </p>
          <div className="flex items-center gap-0 text-xs font-mono flex-wrap">
            {t.hero.tags.map((label, i, arr) => (
              <span key={label} className="flex items-center">
                <span className="text-zinc-500 px-2 py-1 rounded border border-white/[0.06] bg-white/[0.02]">
                  {label}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-zinc-700 mx-1.5">→</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* 01 - DP conditions */}
        <Section
          number={t.sections[0].number}
          title={t.sections[0].title}
          description={t.sections[0].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">
              {t.approach.title}
            </h3>
            <div className="space-y-2">
              {t.approach.steps.map((s) => (
                <div
                  key={s.n}
                  className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-violet-400/80 font-mono text-xs font-semibold min-w-[20px]">
                      {s.n}.
                    </span>
                    <div>
                      <div className="text-xs font-mono text-white">{s.title}</div>
                      <p className="text-[11px] text-zinc-500 mt-1">{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 02+03 - Top-down vs Bottom-up */}
        <Section
          number={t.sections[1].number}
          title={`${t.sections[1].title} & ${t.sections[2].title.split(" — ")[0] || t.sections[2].title}`}
          description={t.sections[1].desc + " " + t.sections[2].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.comparison.headers.map((h, i) => (
                    <th
                      key={i}
                      className={`text-left py-2 ${
                        i === 0 ? "text-zinc-600 w-44" : i === 1 ? "text-violet-400" : "text-emerald-400"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.comparison.rows.map((row, i) => (
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

        {/* 04 - Fibonacci */}
        <Section
          number={t.sections[3].number}
          title={t.sections[3].title}
          description={t.sections[3].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">
              {t.fib.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.fib.versions.map((v) => (
                <div
                  key={v.name}
                  className="rounded-xl border border-zinc-700/40 bg-zinc-900/30 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-violet-300 font-semibold">
                      {v.name}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400/70">
                      {v.complexity}
                    </span>
                  </div>
                  <pre className="text-[10px] text-zinc-400 font-mono mb-2 leading-relaxed overflow-x-auto">
                    {v.code}
                  </pre>
                  <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                    {v.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 05 - Knapsack */}
        <Section
          number={t.sections[4].number}
          title={t.sections[4].title}
          description={t.sections[4].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-2">
              {t.knapsack.title}
            </h3>
            <p className="text-[11px] text-zinc-500 mb-4">{t.knapsack.setup}</p>
            <div className="overflow-x-auto">
              <table className="text-[11px] font-mono">
                <tbody>
                  {t.knapsack.table.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={`border border-zinc-800 px-3 py-1.5 text-center ${
                            i === 0
                              ? "text-violet-400 bg-violet-500/5"
                              : j === 0
                                ? "text-violet-400 bg-violet-500/5"
                                : i === 4 && j === 5
                                  ? "text-emerald-300 font-bold"
                                  : "text-zinc-400"
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
              <div className="text-[10px] text-zinc-500 font-mono mb-1">
                {lang === "ko" ? "점화식" : "Recurrence"}
              </div>
              <code className="text-[11px] text-violet-300">{t.knapsack.recurrence}</code>
              <div className="text-[11px] text-emerald-300 mt-2">{t.knapsack.answer}</div>
            </div>
          </div>
        </Section>

        {/* 06 - LCS */}
        <Section
          number={t.sections[5].number}
          title={t.sections[5].title}
          description={t.sections[5].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-4">
              {t.lcs.title}
            </h3>
            <div className="overflow-x-auto">
              <table className="text-[11px] font-mono">
                <tbody>
                  {t.lcs.table.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={`border border-zinc-800 px-2.5 py-1 text-center ${
                            i === 0 || j === 0
                              ? "text-violet-400 bg-violet-500/5"
                              : i === 8 && j === 6
                                ? "text-emerald-300 font-bold"
                                : "text-zinc-400"
                          }`}
                        >
                          {cell || " "}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
              <div className="text-[10px] text-zinc-500 font-mono mb-1">
                {lang === "ko" ? "점화식" : "Recurrence"}
              </div>
              <pre className="text-[11px] text-violet-300 whitespace-pre-wrap">{t.lcs.recurrence}</pre>
              <div className="text-[11px] text-emerald-300 mt-2">{t.lcs.answer}</div>
            </div>
          </div>
        </Section>

        {/* summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold text-sm font-mono mb-5">
            {t.summary.title}
          </h3>
          <div className="space-y-3">
            {t.summary.items.map((item) => (
              <div key={item.label} className="flex gap-3 items-start">
                <span className="text-xs font-mono text-violet-500/50 shrink-0 mt-0.5 min-w-[140px]">
                  {item.label}
                </span>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
