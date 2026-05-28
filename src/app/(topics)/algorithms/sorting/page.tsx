"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: {
    home: "cs-canvas",
    parent: "algorithms",
    current: "sorting",
  },
  hero: {
    title: "Sorting Algorithms",
    desc: "정렬은 모든 알고리즘 학습의 출발점입니다.\n비교 기반 vs 비비교 기반, 안정성, in-place 여부 — 같은 결과라도 비용은 천차만별입니다.",
    tags: [
      "Bubble",
      "Insertion",
      "Merge",
      "Quick",
      "Heap",
      "Radix",
      "Stable/In-place",
    ],
  },
  sections: [
    {
      number: "01",
      title: "정렬을 분류하는 4가지 기준",
      desc: "시간 복잡도(평균/최악), 공간 복잡도, 안정성(stable), in-place 여부. 같은 O(n log n)도 메모리 사용량과 안정성에 따라 선택이 달라집니다.",
    },
    {
      number: "02",
      title: "Bubble · Insertion · Selection — O(n²) 가족",
      desc: "구현은 단순하지만 큰 입력에는 부적합. 그러나 거의 정렬된 작은 입력에서는 Insertion이 O(n log n) 알고리즘보다 빠를 수 있습니다.",
    },
    {
      number: "03",
      title: "Merge Sort — 분할 정복의 정석",
      desc: "배열을 반으로 나누고, 재귀로 각각 정렬한 뒤 병합. 항상 O(n log n) 보장, 안정 정렬, 하지만 O(n) 추가 공간 필요.",
    },
    {
      number: "04",
      title: "Quick Sort — 평균은 가장 빠르지만 최악은 O(n²)",
      desc: "Pivot을 기준으로 분할. 평균 O(n log n)이지만 정렬된 입력에 첫 원소를 pivot으로 쓰면 O(n²). Randomized pivot 또는 median-of-three로 해결.",
    },
    {
      number: "05",
      title: "Heap Sort — In-place O(n log n)",
      desc: "max-heap을 만든 뒤 루트를 마지막과 swap하고 heap 크기를 줄여가며 추출. 추가 공간 없이 O(n log n) 보장, 하지만 캐시 효율은 Merge/Quick보다 낮음.",
    },
    {
      number: "06",
      title: "Radix Sort — 비교하지 않는 정렬",
      desc: "자릿수별로 bucket에 분배 → 수집을 반복. 비교가 아닌 분배 기반이므로 O(n·k) (k=자릿수). 정수, 문자열에만 적용 가능.",
    },
  ],
  comparison: {
    title: "주요 정렬 알고리즘 비교",
    headers: ["알고리즘", "평균", "최악", "공간", "안정", "비고"],
    rows: [
      ["Bubble", "O(n²)", "O(n²)", "O(1)", "✓", "교육용"],
      ["Insertion", "O(n²)", "O(n²)", "O(1)", "✓", "거의 정렬된 데이터에 강함"],
      ["Selection", "O(n²)", "O(n²)", "O(1)", "✗", "swap 횟수 최소"],
      ["Merge", "O(n log n)", "O(n log n)", "O(n)", "✓", "외부 정렬에 적합"],
      ["Quick", "O(n log n)", "O(n²)", "O(log n)", "✗", "실전 가장 빠름"],
      ["Heap", "O(n log n)", "O(n log n)", "O(1)", "✗", "메모리 제약 시"],
      ["Radix", "O(n·k)", "O(n·k)", "O(n+k)", "✓", "정수/문자열 전용"],
      ["Tim Sort", "O(n log n)", "O(n log n)", "O(n)", "✓", "Python/Java 기본"],
    ],
  },
  stability: {
    title: "안정 정렬(Stable Sort)이란?",
    desc: "정렬 키가 같은 원소들의 원래 순서가 정렬 후에도 유지되면 안정. 한 줄로: 같은 값이라 비교할 수 없을 때 tie-breaking을 원래 순서로 한다.",
    example: {
      before: ["(A,3)", "(B,1)", "(C,3)", "(D,2)"],
      stable: ["(B,1)", "(D,2)", "(A,3)", "(C,3)"],
      unstable: ["(B,1)", "(D,2)", "(C,3)", "(A,3)"],
    },
    multiKey: {
      title: "왜 중요한가 — 다중 기준 정렬",
      desc: "1차로 가입일 정렬 → 2차로 나이 정렬을 한다고 가정. 2차 정렬이 안정이어야 '나이가 같은 사람끼리 가입일 순서'가 보존됨. 불안정이면 1차 정렬이 무의미해짐.",
      code: `// 사용자 리스트
[
  {이름: "철수", 나이: 20, 가입일: "1일"},
  {이름: "영희", 나이: 20, 가입일: "3일"},
]
// 가입일로 1차 정렬 (이미 정렬됨)
// 나이로 2차 정렬

안정:   [철수(20,1일), 영희(20,3일)]   ← 가입일 순 유지 ✓
불안정: [영희(20,3일), 철수(20,1일)]   ← 1차 정렬 깨짐 ✗`,
    },
    primitiveVsObject: {
      title: "primitive는 불안정 OK, 객체는 안정 필수",
      primitive: "int, double 같은 원시 타입은 값이 곧 전부. [3, 1, 3]에서 두 개의 3은 구별 불가능 → 순서 바뀌어도 결과가 동일 → 불안정 OK. Java가 primitive에 Dual-Pivot Quick Sort 쓰는 이유.",
      object: "객체는 정렬 키 외에 다른 필드가 있음. 키가 같아도 객체가 다르므로 순서가 바뀌면 의미가 달라짐 → 안정 필수. Java가 객체 배열에 Tim Sort 쓰는 이유.",
    },
    howStable: {
      title: "어떻게 안정성을 보장하나",
      desc: "Merge Sort의 병합 단계에서 같은 값일 때 왼쪽(원래 앞쪽) 먼저 넣음. `<` 가 아니라 `<=`를 쓰는 것 자체가 핵심.",
      code: `while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {   // ★ 같을 때 왼쪽 먼저
        result.add(left[i++]);   //   → 원래 순서 유지 (안정)
    } else {
        result.add(right[j++]);
    }
}
// 만약 < 였다면? 같을 때 오른쪽 먼저 → 불안정`,
    },
    whyQuickUnstable: "Quick Sort가 불안정한 이유: pivot 기준으로 멀리 떨어진 원소끼리 swap하는 구조 자체가 같은 값의 상대 순서를 깨뜨림.",
  },
  timsort: {
    title: "Tim Sort 깊이 보기",
    intro: "Python의 Tim Peters가 2002년 고안. Merge Sort + Insertion Sort 하이브리드. Python/Java의 기본 정렬, JavaScript도 ES2019부터 안정 보장.",
    keyIdea: "핵심 아이디어: '실제 데이터는 이미 부분적으로 정렬돼 있다'. 로그, 타임스탬프, 사용자 입력 — 완전 무작위인 경우는 드뭄.",
    steps: [
      {
        n: "1",
        title: "Run 탐색 — 이미 정렬된 구간 찾기",
        code: `[3, 5, 7, 2, 4, 6, 1, 8, 9, 10]
 └─────┘  └─────┘  └──────────┘
  run1     run2       run3
배열을 왼쪽부터 훑어 오름차순 run을 식별.
내림차순 run은 뒤집어서 오름차순으로 변환.`,
      },
      {
        n: "2",
        title: "Insertion Sort로 minRun 확장",
        code: `minRun = 32~64 (배열 크기에 따라 결정)
짧은 run은 Insertion Sort로 minRun 크기까지 늘림.

왜 Insertion Sort? — n이 작으면 의외로 가장 빠름:
  • O(n²)이지만 n=32면 절대 연산 수가 적음 (~500회)
  • 배열 순차 접근 → CPU 캐시 친화적
  • 재귀 호출 오버헤드 0
  • 이미 부분 정렬된 데이터엔 O(n)에 가까움`,
      },
      {
        n: "3",
        title: "Merge Sort로 run 병합",
        code: `정렬된 run들끼리 Merge.
  run1 + run2 → merged
  merged + run3 → final
이미 정렬된 구간을 합치므로 빠르고,
같은 값일 땐 왼쪽(앞쪽) 우선 → 안정성 보장.`,
      },
    ],
    performance: {
      title: "왜 실제로 빠른가",
      headers: ["입력 패턴", "Tim Sort", "비고"],
      rows: [
        ["완전 무작위", "O(n log n)", "Merge Sort와 동일"],
        ["이미 정렬됨", "O(n)", "run 하나로 끝, 비교만 함"],
        ["부분 정렬", "O(n log n)보다 훨씬 빠름", "실제 데이터의 일반적 패턴"],
        ["역순 정렬", "O(n)", "내림차순 run을 뒤집으면 끝"],
      ],
    },
    bigO: {
      title: "Big-O만 보면 안 되는 이유",
      desc: "n이 작을 때는 상수항이 지배하고, 같은 O(n log n)도 안정성·캐시 효율에서 갈린다. Tim Sort는 Insertion Sort의 'O(n²)인데 왜 써?'라는 의문에 답하는 좋은 예시.",
      compareN10: `n = 10 기준 실제 비교 횟수:
  Merge Sort: ~33회 + 재귀 스택 오버헤드
  Insertion Sort: 평균 25회, 캐시 친화적
  → 작을 땐 Insertion이 실제로 더 빠름

Introsort (C++ std::sort)도 같은 논리:
  큰 partition은 Quick Sort
  재귀 너무 깊으면 Heap Sort
  작은 partition (16 미만)은 Insertion Sort`,
    },
    summary: "Tim Sort = 작은 구간 Insertion + 큰 구간 Merge. 실제 데이터의 부분 정렬 패턴을 활용하고, Merge의 안정성을 그대로 가져옴. 그래서 Python·Java가 채택.",
  },
  inplace: {
    title: "In-place 정렬",
    desc: "추가 메모리를 O(1) 또는 O(log n)만 쓰는 정렬. 큰 데이터셋에서 메모리 제약이 있을 때 중요.",
    rows: [
      { name: "In-place", items: "Bubble · Insertion · Selection · Quick · Heap" },
      { name: "Not in-place", items: "Merge · Radix · Counting · Tim" },
    ],
  },
  realworld: {
    title: "실제 언어/라이브러리의 정렬",
    rows: [
      ["Python sorted/list.sort", "Tim Sort", "안정, 실제 데이터의 부분 정렬 패턴에 최적화"],
      ["Java Arrays.sort (객체)", "Tim Sort", "안정성이 요구되는 객체 배열"],
      ["Java Arrays.sort (primitive)", "Dual-Pivot Quick", "안정성 불필요한 원시 타입"],
      ["C++ std::sort", "Introsort", "Quick → Heap (재귀 깊이 초과 시) → Insertion (작은 partition)"],
      ["JavaScript Array.sort", "엔진별 다름", "V8: Tim Sort, 안정 보장 (ES2019부터)"],
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "비교 기반의 하한", text: "비교 기반 정렬은 Ω(n log n)을 깰 수 없다. 결정 트리의 잎이 n!개여야 하므로 높이는 최소 log(n!) ≈ n log n." },
      { label: "Bubble/Insertion", text: "O(n²) 단순 정렬. 작은 입력이나 거의 정렬된 데이터에 한정. 면접 외엔 실전 사용 X." },
      { label: "Merge", text: "항상 O(n log n), 안정, O(n) 공간 필요. 외부 정렬과 연결 리스트에 적합." },
      { label: "Quick", text: "평균 가장 빠름, 최악 O(n²). Pivot 전략이 핵심. 캐시 효율 좋음." },
      { label: "Heap", text: "보장 O(n log n) + O(1) 공간. 우선순위 큐가 필요할 때 자연스러움." },
      { label: "Radix", text: "비교 없이 분배. 정수/문자열만. O(n·k)지만 k가 작을 때만 유리." },
      { label: "Tim Sort", text: "실제 데이터에 최적화된 하이브리드 (Merge + Insertion). 안정. 부분 정렬된 'run' 탐지." },
      { label: "어떤 걸 쓸까", text: "대부분: 언어 기본 정렬. 메모리 제약: Heap/Quick. 외부 데이터: Merge. 작은 정수 범위: Counting/Radix." },
    ],
  },
};

const EN = {
  breadcrumb: {
    home: "cs-canvas",
    parent: "algorithms",
    current: "sorting",
  },
  hero: {
    title: "Sorting Algorithms",
    desc: "Sorting is the starting point of algorithm study.\nComparison vs non-comparison, stability, in-place — the same output, vastly different cost.",
    tags: [
      "Bubble",
      "Insertion",
      "Merge",
      "Quick",
      "Heap",
      "Radix",
      "Stable/In-place",
    ],
  },
  sections: [
    {
      number: "01",
      title: "4 Ways to Classify a Sort",
      desc: "Time complexity (avg/worst), space complexity, stability, in-place. Even within O(n log n), the right choice depends on memory and stability needs.",
    },
    {
      number: "02",
      title: "Bubble · Insertion · Selection — The O(n²) Family",
      desc: "Simple to implement, bad on large inputs. Insertion sort can actually beat O(n log n) on small, nearly-sorted inputs due to low overhead.",
    },
    {
      number: "03",
      title: "Merge Sort — Classical Divide and Conquer",
      desc: "Split in half, recursively sort each, then merge. Always O(n log n), stable — but needs O(n) extra space.",
    },
    {
      number: "04",
      title: "Quick Sort — Fastest on average, worst case O(n²)",
      desc: "Partition around a pivot. Average O(n log n) but choosing the first element of a sorted input as pivot yields O(n²). Randomized or median-of-three pivots fix it.",
    },
    {
      number: "05",
      title: "Heap Sort — In-place O(n log n)",
      desc: "Build a max-heap, swap root with the last element, shrink the heap, repeat. O(n log n) with no extra space — but cache locality is worse than Merge/Quick.",
    },
    {
      number: "06",
      title: "Radix Sort — Non-comparison sort",
      desc: "Distribute into buckets digit by digit. Not comparison-based, so O(n·k) where k = number of digits. Limited to integers and fixed-length strings.",
    },
  ],
  comparison: {
    title: "Sorting Algorithm Comparison",
    headers: ["Algorithm", "Average", "Worst", "Space", "Stable", "Note"],
    rows: [
      ["Bubble", "O(n²)", "O(n²)", "O(1)", "✓", "Educational"],
      ["Insertion", "O(n²)", "O(n²)", "O(1)", "✓", "Great on nearly-sorted data"],
      ["Selection", "O(n²)", "O(n²)", "O(1)", "✗", "Minimum swap count"],
      ["Merge", "O(n log n)", "O(n log n)", "O(n)", "✓", "Good for external sort"],
      ["Quick", "O(n log n)", "O(n²)", "O(log n)", "✗", "Fastest in practice"],
      ["Heap", "O(n log n)", "O(n log n)", "O(1)", "✗", "When memory is tight"],
      ["Radix", "O(n·k)", "O(n·k)", "O(n+k)", "✓", "Integers/strings only"],
      ["Tim Sort", "O(n log n)", "O(n log n)", "O(n)", "✓", "Python/Java default"],
    ],
  },
  stability: {
    title: "What is a Stable Sort?",
    desc: "Elements with equal keys keep their original order. One line: when the comparator can't decide, break the tie by original position.",
    example: {
      before: ["(A,3)", "(B,1)", "(C,3)", "(D,2)"],
      stable: ["(B,1)", "(D,2)", "(A,3)", "(C,3)"],
      unstable: ["(B,1)", "(D,2)", "(C,3)", "(A,3)"],
    },
    multiKey: {
      title: "Why It Matters — Multi-Key Sorting",
      desc: "Sort by join date first, then by age. If the second sort is stable, users of the same age stay in their join-date order. Unstable wipes out the first sort.",
      code: `// Users
[
  {name: "Alice", age: 20, joined: "Day 1"},
  {name: "Bob",   age: 20, joined: "Day 3"},
]
// 1) Sort by join date (done)
// 2) Sort by age

Stable:   [Alice(20,Day1), Bob(20,Day3)]   ← join order kept ✓
Unstable: [Bob(20,Day3), Alice(20,Day1)]   ← first sort ruined ✗`,
    },
    primitiveVsObject: {
      title: "Primitives don't need it, objects do",
      primitive: "For int/double, the value is everything. In [3, 1, 3], the two 3s are indistinguishable → swapping them doesn't change the result → unstable is fine. That's why Java uses Dual-Pivot Quick Sort for primitives.",
      object: "Objects carry fields beyond the sort key. Same key, different identity — order matters. That's why Java uses Tim Sort for object arrays.",
    },
    howStable: {
      title: "How Stability Is Guaranteed",
      desc: "In Merge Sort's merge step, prefer the left (earlier) element on equality. Using `<=` instead of `<` is what enforces it.",
      code: `while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {   // ★ on tie, take from the left
        result.add(left[i++]);   //   → original order preserved (stable)
    } else {
        result.add(right[j++]);
    }
}
// If it were '<' instead? On tie, take from right → unstable.`,
    },
    whyQuickUnstable: "Quick Sort is unstable because partitioning swaps elements that are far apart, breaking the original order of equal keys.",
  },
  timsort: {
    title: "Tim Sort — Deeper Look",
    intro: "Designed by Tim Peters (Python) in 2002. A hybrid of Merge Sort + Insertion Sort. Default sort in Python and Java; JavaScript also guarantees stability since ES2019.",
    keyIdea: "Key insight: 'real-world data is already partially sorted'. Logs, timestamps, user input — fully random is the exception, not the rule.",
    steps: [
      {
        n: "1",
        title: "Run Detection — Find Already-Sorted Ranges",
        code: `[3, 5, 7, 2, 4, 6, 1, 8, 9, 10]
 └─────┘  └─────┘  └──────────┘
  run1     run2       run3
Scan left to right, identify ascending runs.
Descending runs are reversed into ascending.`,
      },
      {
        n: "2",
        title: "Extend Short Runs with Insertion Sort",
        code: `minRun = 32~64 (chosen based on array size)
Runs shorter than minRun are extended by Insertion Sort.

Why Insertion Sort? — it's actually fastest for small n:
  • O(n²) but at n=32, absolute work is tiny (~500 ops)
  • Sequential array access → cache-friendly
  • Zero recursion overhead
  • Near O(n) on already-partly-sorted data`,
      },
      {
        n: "3",
        title: "Merge Sort the Runs",
        code: `Merge the now-sorted runs.
  run1 + run2 → merged
  merged + run3 → final
Merging pre-sorted runs is fast,
and on equal keys we pick from the left → stable.`,
      },
    ],
    performance: {
      title: "Why It's Fast in Practice",
      headers: ["Input pattern", "Tim Sort", "Note"],
      rows: [
        ["Fully random", "O(n log n)", "Same as Merge Sort"],
        ["Already sorted", "O(n)", "One run, just compare"],
        ["Partially sorted", "Much faster than O(n log n)", "The common real-world pattern"],
        ["Reverse sorted", "O(n)", "Detect descending run, flip"],
      ],
    },
    bigO: {
      title: "Why Big-O Alone Isn't Enough",
      desc: "For small n, constant factors dominate, and even within O(n log n), stability and cache behavior differ. Tim Sort answers the question 'why use Insertion Sort when it's O(n²)?'",
      compareN10: `At n = 10, actual comparison counts:
  Merge Sort: ~33 + recursion overhead
  Insertion Sort: ~25 on average, cache-friendly
  → Insertion is genuinely faster at small n

Introsort (C++ std::sort) follows the same logic:
  Big partitions → Quick Sort
  Deep recursion → Heap Sort
  Small partitions (< 16) → Insertion Sort`,
    },
    summary: "Tim Sort = Insertion for small chunks + Merge to combine them. Exploits real-data partial order and inherits Merge's stability. That's why Python and Java picked it.",
  },
  inplace: {
    title: "In-place Sorting",
    desc: "Uses only O(1) or O(log n) extra memory. Important on large datasets with memory constraints.",
    rows: [
      { name: "In-place", items: "Bubble · Insertion · Selection · Quick · Heap" },
      { name: "Not in-place", items: "Merge · Radix · Counting · Tim" },
    ],
  },
  realworld: {
    title: "Sorting in Real Languages/Libraries",
    rows: [
      ["Python sorted / list.sort", "Tim Sort", "Stable, optimized for real-world partial order"],
      ["Java Arrays.sort (objects)", "Tim Sort", "Stable object array sorting"],
      ["Java Arrays.sort (primitive)", "Dual-Pivot Quick", "No stability needed for primitives"],
      ["C++ std::sort", "Introsort", "Quick → Heap (on deep recursion) → Insertion (small partitions)"],
      ["JavaScript Array.sort", "Engine-dependent", "V8: Tim Sort, stable guaranteed since ES2019"],
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Comparison lower bound", text: "Comparison-based sort cannot beat Ω(n log n). Decision tree needs n! leaves → height ≥ log(n!) ≈ n log n." },
      { label: "Bubble/Insertion", text: "Simple O(n²). Only for small or nearly-sorted inputs. Not used in practice outside interviews." },
      { label: "Merge", text: "Always O(n log n), stable, O(n) space. Great for external sort and linked lists." },
      { label: "Quick", text: "Fastest on average, O(n²) worst. Pivot strategy matters. Cache friendly." },
      { label: "Heap", text: "Guaranteed O(n log n) + O(1) space. Natural choice when you need a priority queue." },
      { label: "Radix", text: "Distribution, no comparison. Integers/strings only. O(n·k), good only when k is small." },
      { label: "Tim Sort", text: "Hybrid of Merge + Insertion, tuned for real data. Stable. Detects pre-sorted 'runs'." },
      { label: "Which to pick", text: "Default: language built-in. Tight memory: Heap/Quick. External data: Merge. Small integer range: Counting/Radix." },
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

export default function SortingPage() {
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

        {/* 01 - classification + comparison table */}
        <Section
          number={t.sections[0].number}
          title={t.sections[0].title}
          description={t.sections[0].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">
              {t.comparison.title}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] font-mono">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {t.comparison.headers.map((h, i) => (
                      <th
                        key={i}
                        className={`text-left py-2 px-2 ${
                          i === 0 ? "text-violet-400" : "text-zinc-500"
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
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={`py-2 px-2 ${
                            j === 0
                              ? "text-violet-300/80 font-semibold"
                              : j === 4
                                ? cell === "✓"
                                  ? "text-emerald-400"
                                  : "text-red-400"
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
          </div>
        </Section>

        {/* 02 - O(n²) family */}
        <Section
          number={t.sections[1].number}
          title={t.sections[1].title}
          description={t.sections[1].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  name: "Bubble",
                  desc: lang === "ko" ? "인접한 두 원소를 비교하며 swap. 가장 큰 원소가 거품처럼 위로." : "Compare adjacent pairs and swap. Largest bubbles to the end.",
                  trait: lang === "ko" ? "n번 패스마다 1개 확정" : "1 settled per pass",
                },
                {
                  name: "Insertion",
                  desc: lang === "ko" ? "왼쪽 정렬된 부분에 새 원소를 알맞은 위치에 삽입." : "Insert each element into the correct slot of the sorted left part.",
                  trait: lang === "ko" ? "거의 정렬된 데이터에 O(n)" : "O(n) on nearly-sorted",
                },
                {
                  name: "Selection",
                  desc: lang === "ko" ? "남은 원소 중 최솟값을 찾아 맨 앞과 swap." : "Find the min in the remainder and swap to front.",
                  trait: lang === "ko" ? "swap 횟수 최소 (n-1)" : "Minimum swaps (n-1)",
                },
              ].map((alg) => (
                <div
                  key={alg.name}
                  className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4"
                >
                  <div className="text-sm font-mono text-violet-300 font-semibold mb-2">
                    {alg.name}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
                    {alg.desc}
                  </p>
                  <div className="text-[10px] text-violet-400/70 font-mono border-t border-violet-500/20 pt-2">
                    {alg.trait}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 03 - Merge sort */}
        <Section
          number={t.sections[2].number}
          title={t.sections[2].title}
          description={t.sections[2].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="font-mono text-[11px] text-zinc-400 space-y-1.5">
              <div className="text-center text-violet-300">[5, 2, 8, 1, 9, 3, 7, 4]</div>
              <div className="text-center text-zinc-600">↓ split</div>
              <div className="text-center text-zinc-400">[5, 2, 8, 1]   [9, 3, 7, 4]</div>
              <div className="text-center text-zinc-600">↓ split</div>
              <div className="text-center text-zinc-400">[5, 2] [8, 1] [9, 3] [7, 4]</div>
              <div className="text-center text-zinc-600">↓ split</div>
              <div className="text-center text-zinc-500">[5] [2] [8] [1] [9] [3] [7] [4]</div>
              <div className="text-center text-zinc-600">↓ merge (sorted)</div>
              <div className="text-center text-zinc-400">[2, 5] [1, 8] [3, 9] [4, 7]</div>
              <div className="text-center text-zinc-600">↓ merge</div>
              <div className="text-center text-zinc-400">[1, 2, 5, 8]   [3, 4, 7, 9]</div>
              <div className="text-center text-zinc-600">↓ merge</div>
              <div className="text-center text-emerald-300">[1, 2, 3, 4, 5, 7, 8, 9]</div>
            </div>
            <div className="mt-4 text-[11px] text-zinc-500 leading-relaxed">
              {lang === "ko"
                ? "각 단계의 비용은 O(n), 단계 수는 log n → 총 O(n log n). 병합 시 두 정렬된 배열을 두 포인터로 훑으며 작은 쪽을 선택."
                : "Each level costs O(n), levels = log n → total O(n log n). Merging uses two pointers across sorted halves, always picking the smaller front."}
            </div>
          </div>
        </Section>

        {/* 04 - Quick sort */}
        <Section
          number={t.sections[3].number}
          title={t.sections[3].title}
          description={t.sections[3].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
            <div className="font-mono text-[11px]">
              <div className="text-zinc-500 mb-2">{lang === "ko" ? "예시: pivot=5" : "Example: pivot=5"}</div>
              <div className="space-y-1.5">
                <div>
                  <span className="text-zinc-600">input:  </span>
                  <span className="text-zinc-300">[3, 8, 2, 5, 1, 9, 4, 7, 6]</span>
                </div>
                <div>
                  <span className="text-zinc-600">pivot:  </span>
                  <span className="text-violet-300">5</span>
                </div>
                <div>
                  <span className="text-zinc-600">left:   </span>
                  <span className="text-emerald-300">[3, 2, 1, 4]</span>
                  <span className="text-zinc-600"> &lt; 5</span>
                </div>
                <div>
                  <span className="text-zinc-600">right:  </span>
                  <span className="text-amber-300">[8, 9, 7, 6]</span>
                  <span className="text-zinc-600"> &gt; 5</span>
                </div>
                <div className="text-zinc-600 mt-2">↓ recurse on left and right</div>
                <div className="text-emerald-300">→ [1, 2, 3, 4, 5, 6, 7, 8, 9]</div>
              </div>
            </div>
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <div className="text-[11px] text-red-400 font-mono mb-1">
                ⚠ {lang === "ko" ? "최악 케이스" : "Worst Case"}
              </div>
              <p className="text-[11px] text-red-300/80 leading-relaxed">
                {lang === "ko"
                  ? "이미 정렬된 입력 [1,2,3,4,5]에 첫 원소를 pivot으로 쓰면, 분할이 [] vs [2,3,4,5]로 한쪽으로만 치우쳐 O(n²)이 됩니다. 해결: 무작위 pivot, median-of-three."
                  : "On already-sorted input [1,2,3,4,5] using the first as pivot, partitions become [] vs [2,3,4,5], one-sided → O(n²). Fix: random pivot, median-of-three."}
              </p>
            </div>
          </div>
        </Section>

        {/* 05 - Heap sort */}
        <Section
          number={t.sections[4].number}
          title={t.sections[4].title}
          description={t.sections[4].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-zinc-700/40 bg-zinc-900/30 p-4">
                <div className="text-xs font-mono text-violet-300 mb-2 font-semibold">
                  Step 1. {lang === "ko" ? "max-heap 만들기" : "Build max-heap"}
                </div>
                <pre className="text-[10px] text-zinc-400 font-mono leading-relaxed">
{`       9
      / \\
     7   8
    / \\ / \\
   3  5 1  4
   /\\
  2  6  (heapify down from end)`}
                </pre>
              </div>
              <div className="rounded-xl border border-zinc-700/40 bg-zinc-900/30 p-4">
                <div className="text-xs font-mono text-violet-300 mb-2 font-semibold">
                  Step 2. {lang === "ko" ? "루트 추출 반복" : "Extract root repeatedly"}
                </div>
                <pre className="text-[10px] text-zinc-400 font-mono leading-relaxed">
{`swap(root, last)
heap size -= 1
heapify-down(root)
→ [..., 7, 8, 9]
→ [..., 8, 9]
→ [..., 9]
→ sorted!`}
                </pre>
              </div>
            </div>
            <div className="mt-4 text-[11px] text-zinc-500 leading-relaxed">
              {lang === "ko"
                ? "Heap을 배열로 표현 (i의 부모 = (i-1)/2, 자식 = 2i+1, 2i+2). 추가 공간 없이 정렬 완료."
                : "Heap as array: parent of i = (i-1)/2, children = 2i+1, 2i+2. Sort completes in place."}
            </div>
          </div>
        </Section>

        {/* 06 - Radix sort */}
        <Section
          number={t.sections[5].number}
          title={t.sections[5].title}
          description={t.sections[5].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="font-mono text-[11px] space-y-2">
              <div>
                <span className="text-zinc-500">{lang === "ko" ? "입력" : "Input"}: </span>
                <span className="text-zinc-300">[170, 45, 75, 90, 802, 24, 2, 66]</span>
              </div>
              <div className="text-zinc-600">↓ {lang === "ko" ? "일의 자리 기준 정렬" : "sort by ones digit"}</div>
              <div className="text-zinc-400">[170, 90, 802, 2, 24, 45, 75, 66]</div>
              <div className="text-zinc-600">↓ {lang === "ko" ? "십의 자리 기준 정렬 (안정)" : "sort by tens digit (stable)"}</div>
              <div className="text-zinc-400">[802, 2, 24, 45, 66, 170, 75, 90]</div>
              <div className="text-zinc-600">↓ {lang === "ko" ? "백의 자리 기준 정렬 (안정)" : "sort by hundreds digit (stable)"}</div>
              <div className="text-emerald-300">[2, 24, 45, 66, 75, 90, 170, 802]</div>
            </div>
            <div className="mt-4 text-[11px] text-zinc-500 leading-relaxed">
              {lang === "ko"
                ? "각 패스에서 안정 정렬(주로 Counting Sort)이 필요. 자릿수 k가 작아야 효율적 — 큰 숫자나 무한 정밀도에는 부적합."
                : "Each pass needs a stable sort (usually Counting Sort). Only efficient when digit count k is small — bad for huge or arbitrary-precision numbers."}
            </div>
          </div>
        </Section>

        {/* 07 - Stability (deep) */}
        <Section
          number="07"
          title={t.stability.title}
          description={t.stability.desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-5">
            {/* basic example */}
            <div className="font-mono text-[11px] space-y-2">
              <div>
                <span className="text-zinc-500">{lang === "ko" ? "정렬 전" : "Before"} (key=숫자): </span>
                <span className="text-zinc-300">{t.stability.example.before.join(" ")}</span>
              </div>
              <div>
                <span className="text-emerald-400">{lang === "ko" ? "안정 정렬 후" : "Stable result"}: </span>
                <span className="text-emerald-300">{t.stability.example.stable.join(" ")}</span>
                <span className="text-zinc-600"> ← A, C{lang === "ko" ? "의 순서 유지" : " original order kept"}</span>
              </div>
              <div>
                <span className="text-red-400">{lang === "ko" ? "불안정 정렬 후" : "Unstable result"}: </span>
                <span className="text-red-300">{t.stability.example.unstable.join(" ")}</span>
                <span className="text-zinc-600"> ← A, C{lang === "ko" ? "의 순서 뒤바뀜" : " order swapped"}</span>
              </div>
            </div>

            {/* multi-key example */}
            <div className="border-t border-zinc-800 pt-5">
              <h4 className="text-xs font-mono text-violet-300 mb-2 font-semibold">
                {t.stability.multiKey.title}
              </h4>
              <p className="text-[11px] text-zinc-500 mb-3">{t.stability.multiKey.desc}</p>
              <pre className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-zinc-900/30 p-3 rounded">{t.stability.multiKey.code}</pre>
            </div>

            {/* primitive vs object */}
            <div className="border-t border-zinc-800 pt-5">
              <h4 className="text-xs font-mono text-violet-300 mb-3 font-semibold">
                {t.stability.primitiveVsObject.title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                  <div className="text-[10px] font-mono text-amber-400 font-semibold mb-1">primitive (int, double)</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{t.stability.primitiveVsObject.primitive}</p>
                </div>
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <div className="text-[10px] font-mono text-emerald-400 font-semibold mb-1">{lang === "ko" ? "객체 배열" : "Object array"}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{t.stability.primitiveVsObject.object}</p>
                </div>
              </div>
            </div>

            {/* how stability is enforced */}
            <div className="border-t border-zinc-800 pt-5">
              <h4 className="text-xs font-mono text-violet-300 mb-2 font-semibold">
                {t.stability.howStable.title}
              </h4>
              <p className="text-[11px] text-zinc-500 mb-3">{t.stability.howStable.desc}</p>
              <pre className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-zinc-900/30 p-3 rounded">{t.stability.howStable.code}</pre>
              <p className="text-[10px] text-zinc-500 italic mt-3">⚠ {t.stability.whyQuickUnstable}</p>
            </div>

            {/* in-place sub-section */}
            <div className="border-t border-zinc-800 pt-5">
              <h4 className="text-xs font-mono text-zinc-400 mb-2">
                {t.inplace.title}
              </h4>
              <p className="text-[11px] text-zinc-500 mb-3">{t.inplace.desc}</p>
              {t.inplace.rows.map((r) => (
                <div key={r.name} className="flex gap-3 text-[11px] font-mono mb-1">
                  <span className="text-violet-400/70 min-w-[100px]">{r.name}</span>
                  <span className="text-zinc-400">{r.items}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 08 - Tim Sort deep dive */}
        <Section
          number="08"
          title={t.timsort.title}
          description={t.timsort.intro}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-5">
            {/* key idea */}
            <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
              <p className="text-[11px] text-violet-300 leading-relaxed">💡 {t.timsort.keyIdea}</p>
            </div>

            {/* 3 steps */}
            <div className="space-y-3">
              {t.timsort.steps.map((s) => (
                <div key={s.n} className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-4">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-violet-400/80 font-mono text-sm font-bold">{s.n}.</span>
                    <h4 className="text-xs font-mono text-white font-semibold">{s.title}</h4>
                  </div>
                  <pre className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-black/30 p-3 rounded whitespace-pre-wrap">{s.code}</pre>
                </div>
              ))}
            </div>

            {/* performance table */}
            <div className="border-t border-zinc-800 pt-5">
              <h4 className="text-xs font-mono text-violet-300 mb-3 font-semibold">{t.timsort.performance.title}</h4>
              <table className="w-full text-[11px] font-mono">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {t.timsort.performance.headers.map((h, i) => (
                      <th key={i} className={`text-left py-2 ${i === 0 ? "text-violet-400 w-32" : i === 1 ? "text-emerald-400 w-44" : "text-zinc-500"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.timsort.performance.rows.map((row, i) => (
                    <tr key={i} className="border-b border-zinc-800/50">
                      <td className="py-2 text-violet-300/80 font-semibold">{row[0]}</td>
                      <td className="py-2 text-emerald-300/80">{row[1]}</td>
                      <td className="py-2 text-zinc-500 text-[10px]">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* big-O caveat */}
            <div className="border-t border-zinc-800 pt-5">
              <h4 className="text-xs font-mono text-violet-300 mb-2 font-semibold">{t.timsort.bigO.title}</h4>
              <p className="text-[11px] text-zinc-500 mb-3">{t.timsort.bigO.desc}</p>
              <pre className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-zinc-900/30 p-3 rounded">{t.timsort.bigO.compareN10}</pre>
            </div>

            {/* one-line summary */}
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-[11px] text-emerald-300 leading-relaxed">📌 {t.timsort.summary}</p>
            </div>
          </div>
        </Section>

        {/* 09 - Real world */}
        <Section
          number="09"
          title={t.realworld.title}
          description=""
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <tbody>
                {t.realworld.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 pr-3 text-violet-300/80">{row[0]}</td>
                    <td className="py-2 pr-3 text-zinc-300 font-semibold">{row[1]}</td>
                    <td className="py-2 text-zinc-500 text-[10px]">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
