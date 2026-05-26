"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "algorithms", current: "divide & conquer" },
  hero: {
    title: "Divide & Conquer",
    desc: "큰 문제를 같은 모양의 작은 문제로 쪼개고, 각각을 해결한 뒤 결합.\nMerge Sort, Quick Sort, FFT — 재귀와 마스터 정리가 기둥입니다.",
    tags: ["분할", "정복", "결합", "Master Theorem", "재귀 트리"],
  },
  sections: [
    {
      number: "01",
      title: "3단계 — Divide · Conquer · Combine",
      desc: "Divide: 문제를 같은 종류의 부분 문제로 분할. Conquer: 충분히 작아지면 직접 해결, 아니면 재귀. Combine: 부분 해를 합쳐 전체 답.",
    },
    {
      number: "02",
      title: "DP와의 차이 — 부분 문제 중복 여부",
      desc: "DP: 같은 부분 문제가 반복 (overlapping). Divide & Conquer: 부분 문제가 서로 독립 (disjoint). 중복이 없으니 memoization 불필요.",
    },
    {
      number: "03",
      title: "대표 예제 — Merge Sort",
      desc: "배열을 반으로 분할 → 재귀 정렬 → 두 정렬 배열 병합. T(n) = 2T(n/2) + O(n) = O(n log n).",
    },
    {
      number: "04",
      title: "Master Theorem — 재귀식의 정답표",
      desc: "T(n) = aT(n/b) + f(n) 형태의 점화식을 빠르게 풀기. f(n)을 n^(log_b a)와 비교: 작으면 후자가 지배, 같으면 log 곱, 크면 전자가 지배.",
    },
    {
      number: "05",
      title: "다른 예제 — Quick Sort, Binary Search, FFT, Closest Pair",
      desc: "Quick Sort: pivot 기준 분할. Binary Search: 반으로 줄여가며 검색 — T(n)=T(n/2)+O(1). FFT: 신호를 재귀 분할, O(n log n) DFT. Closest Pair: 점들을 좌우로, O(n log n).",
    },
  ],
  steps: {
    title: "Divide & Conquer 패턴",
    code: `function dac(problem):
    if problem is small:
        return solve_directly(problem)     # base case
    subproblems = divide(problem)          # 1. Divide
    sub_solutions = [dac(s) for s in subs] # 2. Conquer (재귀)
    return combine(sub_solutions)          # 3. Combine`,
  },
  vs: {
    title: "Divide & Conquer vs DP",
    headers: ["", "Divide & Conquer", "Dynamic Programming"],
    rows: [
      ["부분 문제", "독립적 (disjoint)", "중복 (overlapping)"],
      ["메모이제이션", "불필요", "필수"],
      ["대표 예", "Merge Sort, Quick Sort, FFT", "Fibonacci, Knapsack, LCS"],
      ["접근", "Top-down 재귀", "Top-down (memo) 또는 Bottom-up (table)"],
    ],
  },
  master: {
    title: "Master Theorem 적용",
    headers: ["점화식", "f(n) vs n^(log_b a)", "결과"],
    rows: [
      ["T(n) = 2T(n/2) + O(n)", "n == n^1 → 같음", "O(n log n) — Merge Sort"],
      ["T(n) = T(n/2) + O(1)", "1 < n^0=1 → 같음", "O(log n) — Binary Search"],
      ["T(n) = 2T(n/2) + O(1)", "1 < n^1 → 후자 지배", "O(n) — 트리 순회"],
      ["T(n) = 4T(n/2) + O(n)", "n < n^2 → 후자 지배", "O(n²) — Naive 행렬 곱"],
      ["T(n) = 7T(n/2) + O(n²)", "n² < n^(log2 7)≈n^2.81 → 후자 지배", "O(n^log2 7) — Strassen"],
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "3단계", text: "Divide → Conquer (재귀) → Combine. Combine 비용이 전체 복잡도를 좌우." },
      { label: "vs DP", text: "부분 문제 독립 → D&C. 중복 → DP." },
      { label: "Master Theorem", text: "T(n) = aT(n/b) + f(n)의 빠른 풀이. f(n)과 n^(log_b a) 비교." },
      { label: "Merge Sort", text: "T(n) = 2T(n/2) + O(n) → O(n log n). 안정 정렬 + O(n) 공간." },
      { label: "Binary Search", text: "T(n) = T(n/2) + O(1) → O(log n). 정렬된 배열 필수." },
      { label: "FFT", text: "다항식 곱셈을 O(n²) → O(n log n). 신호 처리, 큰 정수 곱셈." },
      { label: "Strassen", text: "행렬 곱 O(n³) → O(n^2.81). 분할 정복으로 곱셈 횟수 감소." },
      { label: "캐싱 효과", text: "재귀의 깊은 부분은 캐시 친화적 — 같은 데이터를 짧은 시간에 반복 접근." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "algorithms", current: "divide & conquer" },
  hero: {
    title: "Divide & Conquer",
    desc: "Split a big problem into smaller copies of itself, solve each, combine.\nMerge Sort, Quick Sort, FFT — recursion and the Master Theorem are the pillars.",
    tags: ["Divide", "Conquer", "Combine", "Master Theorem", "Recursion Tree"],
  },
  sections: [
    {
      number: "01",
      title: "3 Steps — Divide · Conquer · Combine",
      desc: "Divide: split into same-kind subproblems. Conquer: solve directly if small, else recurse. Combine: merge subsolutions into the answer.",
    },
    {
      number: "02",
      title: "vs DP — Overlapping or Not",
      desc: "DP: subproblems overlap. D&C: subproblems are disjoint. No overlap → no memoization needed.",
    },
    {
      number: "03",
      title: "Canonical Example — Merge Sort",
      desc: "Split in half → recursively sort → merge two sorted halves. T(n) = 2T(n/2) + O(n) = O(n log n).",
    },
    {
      number: "04",
      title: "Master Theorem — Recurrence Cookbook",
      desc: "For T(n) = aT(n/b) + f(n), compare f(n) to n^(log_b a): smaller → the latter wins, equal → multiply by log, larger → the former wins.",
    },
    {
      number: "05",
      title: "More Examples — Quick Sort, Binary Search, FFT, Closest Pair",
      desc: "Quick Sort: partition by pivot. Binary Search: halve each step — T(n)=T(n/2)+O(1). FFT: recursive split, O(n log n) DFT. Closest Pair: split points left/right, O(n log n).",
    },
  ],
  steps: {
    title: "The D&C Pattern",
    code: `function dac(problem):
    if problem is small:
        return solve_directly(problem)     # base case
    subproblems = divide(problem)          # 1. Divide
    sub_solutions = [dac(s) for s in subs] # 2. Conquer (recurse)
    return combine(sub_solutions)          # 3. Combine`,
  },
  vs: {
    title: "Divide & Conquer vs DP",
    headers: ["", "Divide & Conquer", "Dynamic Programming"],
    rows: [
      ["Subproblems", "Disjoint (independent)", "Overlapping"],
      ["Memoization", "Not needed", "Required"],
      ["Canonical examples", "Merge Sort, Quick Sort, FFT", "Fibonacci, Knapsack, LCS"],
      ["Approach", "Top-down recursion", "Top-down (memo) or Bottom-up (table)"],
    ],
  },
  master: {
    title: "Master Theorem in Action",
    headers: ["Recurrence", "f(n) vs n^(log_b a)", "Result"],
    rows: [
      ["T(n) = 2T(n/2) + O(n)", "n == n^1 → equal", "O(n log n) — Merge Sort"],
      ["T(n) = T(n/2) + O(1)", "1 == n^0 → equal", "O(log n) — Binary Search"],
      ["T(n) = 2T(n/2) + O(1)", "1 < n^1 → latter wins", "O(n) — tree traversal"],
      ["T(n) = 4T(n/2) + O(n)", "n < n^2 → latter wins", "O(n²) — naive matrix mult"],
      ["T(n) = 7T(n/2) + O(n²)", "n² < n^(log2 7)≈n^2.81 → latter wins", "O(n^log2 7) — Strassen"],
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "3 steps", text: "Divide → Conquer (recurse) → Combine. Combine cost dictates overall complexity." },
      { label: "vs DP", text: "Disjoint subproblems → D&C. Overlapping → DP." },
      { label: "Master Theorem", text: "Quick solve for T(n) = aT(n/b) + f(n). Compare f(n) with n^(log_b a)." },
      { label: "Merge Sort", text: "T(n) = 2T(n/2) + O(n) → O(n log n). Stable + O(n) space." },
      { label: "Binary Search", text: "T(n) = T(n/2) + O(1) → O(log n). Needs sorted array." },
      { label: "FFT", text: "Polynomial multiplication O(n²) → O(n log n). Signal processing, big integers." },
      { label: "Strassen", text: "Matrix multiply O(n³) → O(n^2.81). Fewer multiplications via D&C." },
      { label: "Cache effects", text: "Deep recursion is cache friendly — same data reused in short windows." },
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

export default function DivideAndConquerPage() {
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
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.steps.title}</h3>
            <pre className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-zinc-900/30 p-3 rounded">{t.steps.code}</pre>
          </div>
        </Section>

        <Section number={t.sections[1].number} title={t.sections[1].title} description={t.sections[1].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.vs.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-zinc-600 w-32" : i === 1 ? "text-violet-400" : "text-emerald-400"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.vs.rows.map((row, i) => (
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

        <Section number={t.sections[3].number} title={t.sections[3].title} description={t.sections[3].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.master.headers.map((h, i) => (
                    <th key={i} className="text-left py-2 text-violet-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.master.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-violet-300/80">{row[0]}</td>
                    <td className="py-2 text-zinc-400">{row[1]}</td>
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
