"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: {
    home: "cs-canvas",
    parent: "data-structures",
    current: "binary search trees",
  },
  hero: {
    title: "Binary Search Trees",
    desc: "정렬된 배열의 빠른 검색 + 연결 리스트의 빠른 삽입을 결합한 트리.\n균형이 잡히면 O(log n), 한쪽으로 쏠리면 O(n) — 균형이 핵심입니다.",
    tags: ["BST 속성", "삽입/삭제", "순회", "균형 트리", "AVL", "Red-Black"],
  },
  sections: [
    {
      number: "01",
      title: "BST 속성",
      desc: "각 노드 X에 대해: 왼쪽 서브트리의 모든 키 < X.key < 오른쪽 서브트리의 모든 키. 이 단순한 불변 규칙 하나로 정렬된 데이터를 logarithmic 시간에 찾을 수 있게 됩니다.",
    },
    {
      number: "02",
      title: "삽입 — 비교하며 내려가다 빈자리에",
      desc: "루트에서 시작. 키가 작으면 왼쪽, 크면 오른쪽으로 이동. NULL을 만나면 그 자리에 새 노드 부착. O(h) — 균형 트리면 O(log n).",
    },
    {
      number: "03",
      title: "삭제 — 3가지 경우",
      desc: "자식 0개: 그냥 제거. 자식 1개: 자식으로 대체. 자식 2개: 오른쪽 서브트리의 최솟값(in-order successor)으로 대체 후 그것을 삭제.",
    },
    {
      number: "04",
      title: "순회 — In/Pre/Post/Level Order",
      desc: "In-order(왼-루-오): 정렬된 순서로 출력. Pre-order(루-왼-오): 트리 복제. Post-order(왼-오-루): 트리 삭제, 후위 계산. Level-order(BFS): 레벨별.",
    },
    {
      number: "05",
      title: "균형이 깨지면 — 최악 O(n)",
      desc: "이미 정렬된 데이터를 순서대로 삽입하면 트리가 연결 리스트로 변형. 검색/삽입/삭제 모두 O(n). 해결: 자동 균형 트리 (AVL, Red-Black, B-Tree).",
    },
    {
      number: "06",
      title: "자가 균형 트리 — AVL vs Red-Black",
      desc: "AVL: 엄격한 균형 (좌우 높이 차 ≤ 1), 검색 빠름, 회전 잦음. Red-Black: 느슨한 균형 (검은 노드 높이만 같음), 삽입/삭제 빠름. 대부분의 표준 라이브러리는 Red-Black.",
    },
  ],
  property: {
    title: "BST 구조 예시",
    diagram: `         8
        / \\
       3   10
      / \\    \\
     1   6    14
        / \\   /
       4   7 13`,
    invariant: "모든 노드 X에 대해: left 서브트리 < X < right 서브트리",
    inOrder: "In-order 순회: 1, 3, 4, 6, 7, 8, 10, 13, 14 (정렬됨)",
  },
  insertExample: {
    title: "삽입 — 5를 위 트리에 삽입",
    steps: [
      "1. 루트 8과 비교: 5 < 8 → 왼쪽",
      "2. 노드 3과 비교: 5 > 3 → 오른쪽",
      "3. 노드 6과 비교: 5 < 6 → 왼쪽",
      "4. 노드 4와 비교: 5 > 4 → 오른쪽",
      "5. NULL → 5를 4의 오른쪽 자식으로 부착",
    ],
  },
  deleteCase: {
    title: "삭제의 3가지 경우",
    cases: [
      {
        name: "Case 1: leaf",
        desc: "자식 없음",
        example: "삭제(13): 그냥 부모(14)의 자식 포인터를 NULL로",
      },
      {
        name: "Case 2: 자식 1개",
        desc: "자식 하나만 있음",
        example: "삭제(10): 자식(14)을 10의 자리로 끌어올림",
      },
      {
        name: "Case 3: 자식 2개",
        desc: "후속자 사용",
        example: "삭제(3): 오른쪽 서브트리 최솟값(4)을 3의 자리에 복사, 원래 4 제거",
      },
    ],
  },
  traversal: {
    title: "트리 순회 비교",
    headers: ["순회", "순서", "결과 (위 트리)"],
    rows: [
      ["In-order", "왼 → 루트 → 오", "1, 3, 4, 6, 7, 8, 10, 13, 14"],
      ["Pre-order", "루트 → 왼 → 오", "8, 3, 1, 6, 4, 7, 10, 14, 13"],
      ["Post-order", "왼 → 오 → 루트", "1, 4, 7, 6, 3, 13, 14, 10, 8"],
      ["Level-order", "BFS (큐 사용)", "8, 3, 10, 1, 6, 14, 4, 7, 13"],
    ],
  },
  unbalanced: {
    title: "불균형 BST — 정렬된 입력 [1,2,3,4,5] 삽입",
    diagram: `1
 \\
  2
   \\
    3
     \\
      4
       \\
        5`,
    note: "연결 리스트와 동일 — 검색/삽입/삭제 모두 O(n)",
  },
  complexity: {
    title: "복잡도 비교",
    headers: ["연산", "평균 (균형)", "최악 (편향)", "AVL/RB"],
    rows: [
      ["Search", "O(log n)", "O(n)", "O(log n) 보장"],
      ["Insert", "O(log n)", "O(n)", "O(log n) 보장"],
      ["Delete", "O(log n)", "O(n)", "O(log n) 보장"],
      ["Min/Max", "O(log n)", "O(n)", "O(log n) 보장"],
      ["In-order traversal", "O(n)", "O(n)", "O(n)"],
    ],
  },
  balancedCompare: {
    title: "AVL vs Red-Black",
    headers: ["", "AVL", "Red-Black"],
    rows: [
      ["균형 기준", "좌우 높이 차 ≤ 1", "검은 노드 높이만 동일"],
      ["트리 높이", "더 낮음 (≤ 1.44 log n)", "더 높음 (≤ 2 log n)"],
      ["검색 속도", "더 빠름", "약간 느림"],
      ["삽입/삭제", "회전 많음 → 느림", "회전 적음 → 빠름"],
      ["사용처", "검색 위주 (DB 인덱스)", "범용 (C++ map, Java TreeMap)"],
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "BST 속성", text: "left < node < right. 이 단순 규칙 하나가 O(log n) 검색의 기반." },
      { label: "삽입", text: "비교하며 내려가 NULL 지점에 부착. O(h)." },
      { label: "삭제", text: "leaf → 제거, 자식 1개 → 대체, 자식 2개 → in-order successor로 대체 후 제거." },
      { label: "In-order 순회", text: "BST의 가장 중요한 속성: 정렬된 순서로 방문. 정렬된 배열을 얻을 수 있음." },
      { label: "최악 케이스", text: "정렬된 입력 → 편향 트리 → 연결 리스트와 동일한 O(n). 균형 트리로 해결." },
      { label: "AVL", text: "엄격한 균형. 회전이 잦지만 트리 높이가 낮음. 검색 위주 환경에 유리." },
      { label: "Red-Black", text: "느슨한 균형. 삽입/삭제가 빠름. C++ std::map, Java TreeMap의 기반." },
      { label: "B-Tree와의 차이", text: "BST는 자식 2개, B-Tree는 다수. 디스크 페이지 단위 I/O에 최적화 → DB 인덱스에 사용." },
    ],
  },
};

const EN = {
  breadcrumb: {
    home: "cs-canvas",
    parent: "data-structures",
    current: "binary search trees",
  },
  hero: {
    title: "Binary Search Trees",
    desc: "Combines the fast search of a sorted array with the fast insert of a linked list.\nBalanced → O(log n). Skewed → O(n). Balance is everything.",
    tags: ["BST property", "Insert/Delete", "Traversal", "Balanced trees", "AVL", "Red-Black"],
  },
  sections: [
    {
      number: "01",
      title: "BST Property",
      desc: "For every node X: all keys in left subtree < X.key < all keys in right subtree. This single invariant gives you logarithmic search on sorted data.",
    },
    {
      number: "02",
      title: "Insert — Walk Down and Attach",
      desc: "Start at root. Smaller key → go left, bigger → go right. On NULL, attach the new node there. O(h) — O(log n) when balanced.",
    },
    {
      number: "03",
      title: "Delete — Three Cases",
      desc: "Zero children: just remove. One child: replace with the child. Two children: replace with right subtree's minimum (in-order successor), then delete that.",
    },
    {
      number: "04",
      title: "Traversals — In/Pre/Post/Level Order",
      desc: "In-order (L-N-R): sorted output. Pre-order (N-L-R): clone tree. Post-order (L-R-N): delete tree, postfix eval. Level-order (BFS): by depth.",
    },
    {
      number: "05",
      title: "When Balance Breaks — O(n) Worst",
      desc: "Insert already-sorted data in order → tree degenerates to a linked list. Search/insert/delete become O(n). Fix: self-balancing trees (AVL, Red-Black, B-Tree).",
    },
    {
      number: "06",
      title: "Self-Balancing — AVL vs Red-Black",
      desc: "AVL: strict balance (height diff ≤ 1), fast search, many rotations. Red-Black: loose balance (only black-height matches), faster insert/delete. Most std libraries use Red-Black.",
    },
  ],
  property: {
    title: "Example BST",
    diagram: `         8
        / \\
       3   10
      / \\    \\
     1   6    14
        / \\   /
       4   7 13`,
    invariant: "For every node X: left subtree < X < right subtree",
    inOrder: "In-order: 1, 3, 4, 6, 7, 8, 10, 13, 14 (sorted)",
  },
  insertExample: {
    title: "Insert — adding 5 to the tree above",
    steps: [
      "1. Compare with root 8: 5 < 8 → go left",
      "2. Compare with 3: 5 > 3 → go right",
      "3. Compare with 6: 5 < 6 → go left",
      "4. Compare with 4: 5 > 4 → go right",
      "5. NULL → attach 5 as right child of 4",
    ],
  },
  deleteCase: {
    title: "3 Deletion Cases",
    cases: [
      {
        name: "Case 1: leaf",
        desc: "No children",
        example: "delete(13): just set parent(14)'s child pointer to NULL",
      },
      {
        name: "Case 2: one child",
        desc: "Single child",
        example: "delete(10): pull up the child (14) into 10's position",
      },
      {
        name: "Case 3: two children",
        desc: "Use successor",
        example: "delete(3): copy right-subtree-min (4) into 3's slot, then delete the original 4",
      },
    ],
  },
  traversal: {
    title: "Traversal Comparison",
    headers: ["Traversal", "Order", "Result (tree above)"],
    rows: [
      ["In-order", "L → N → R", "1, 3, 4, 6, 7, 8, 10, 13, 14"],
      ["Pre-order", "N → L → R", "8, 3, 1, 6, 4, 7, 10, 14, 13"],
      ["Post-order", "L → R → N", "1, 4, 7, 6, 3, 13, 14, 10, 8"],
      ["Level-order", "BFS with queue", "8, 3, 10, 1, 6, 14, 4, 7, 13"],
    ],
  },
  unbalanced: {
    title: "Unbalanced BST — insert sorted [1,2,3,4,5]",
    diagram: `1
 \\
  2
   \\
    3
     \\
      4
       \\
        5`,
    note: "Same as a linked list — search/insert/delete all O(n)",
  },
  complexity: {
    title: "Complexity Comparison",
    headers: ["Op", "Average (balanced)", "Worst (skewed)", "AVL/RB"],
    rows: [
      ["Search", "O(log n)", "O(n)", "O(log n) guaranteed"],
      ["Insert", "O(log n)", "O(n)", "O(log n) guaranteed"],
      ["Delete", "O(log n)", "O(n)", "O(log n) guaranteed"],
      ["Min/Max", "O(log n)", "O(n)", "O(log n) guaranteed"],
      ["In-order traversal", "O(n)", "O(n)", "O(n)"],
    ],
  },
  balancedCompare: {
    title: "AVL vs Red-Black",
    headers: ["", "AVL", "Red-Black"],
    rows: [
      ["Balance criterion", "Height diff ≤ 1", "Black height equal"],
      ["Tree height", "Lower (≤ 1.44 log n)", "Higher (≤ 2 log n)"],
      ["Search", "Faster", "Slightly slower"],
      ["Insert/Delete", "More rotations → slower", "Fewer rotations → faster"],
      ["Where used", "Read-heavy (DB indexes)", "General (C++ map, Java TreeMap)"],
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "BST property", text: "left < node < right. That single rule enables O(log n) search." },
      { label: "Insert", text: "Walk down comparing keys; attach at the NULL slot. O(h)." },
      { label: "Delete", text: "Leaf → remove. One child → replace with child. Two children → swap with in-order successor, then delete that." },
      { label: "In-order traversal", text: "The most important BST property: visits in sorted order. Yields a sorted array." },
      { label: "Worst case", text: "Sorted input → skewed tree → linked-list-style O(n). Fix with balanced trees." },
      { label: "AVL", text: "Strict balance, many rotations, but shorter tree. Better for read-heavy workloads." },
      { label: "Red-Black", text: "Loose balance, faster insert/delete. Used by C++ std::map and Java TreeMap." },
      { label: "vs B-Tree", text: "BST has 2 children; B-Tree has many. B-Tree is optimized for disk page I/O → DB indexes." },
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

export default function BSTPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(52,211,153,0.05),transparent)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">
            {t.breadcrumb.home}
          </Link>
          <span>/</span>
          <Link href="/data-structures" className="hover:text-zinc-400 transition-colors">
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

        {/* 01 - property */}
        <Section
          number={t.sections[0].number}
          title={t.sections[0].title}
          description={t.sections[0].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">
              {t.property.title}
            </h3>
            <pre className="text-[11px] font-mono text-emerald-300 mb-4">
              {t.property.diagram}
            </pre>
            <div className="space-y-2">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <div className="text-[10px] text-zinc-500 font-mono mb-1">
                  {lang === "ko" ? "불변 규칙" : "Invariant"}
                </div>
                <p className="text-[11px] text-emerald-300/80">{t.property.invariant}</p>
              </div>
              <div className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                <p className="text-[11px] text-zinc-400">{t.property.inOrder}</p>
              </div>
            </div>
          </div>
        </Section>

        {/* 02 - insert */}
        <Section
          number={t.sections[1].number}
          title={t.sections[1].title}
          description={t.sections[1].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">
              {t.insertExample.title}
            </h3>
            <div className="space-y-1">
              {t.insertExample.steps.map((s, i) => (
                <div key={i} className="text-[11px] font-mono text-zinc-400">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 03 - delete */}
        <Section
          number={t.sections[2].number}
          title={t.sections[2].title}
          description={t.sections[2].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">
              {t.deleteCase.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {t.deleteCase.cases.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"
                >
                  <div className="text-xs font-mono text-emerald-300 font-semibold mb-1">
                    {c.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 mb-2">{c.desc}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {c.example}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 04 - traversal */}
        <Section
          number={t.sections[3].number}
          title={t.sections[3].title}
          description={t.sections[3].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.traversal.headers.map((h, i) => (
                    <th
                      key={i}
                      className={`text-left py-2 ${
                        i === 0 ? "text-emerald-400 w-28" : i === 1 ? "text-zinc-500 w-32" : "text-zinc-400"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.traversal.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-emerald-300/80 font-semibold">{row[0]}</td>
                    <td className="py-2 text-zinc-500">{row[1]}</td>
                    <td className="py-2 text-zinc-400">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 05 - unbalanced */}
        <Section
          number={t.sections[4].number}
          title={t.sections[4].title}
          description={t.sections[4].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-mono text-zinc-400 mb-3">
                  {t.unbalanced.title}
                </h3>
                <pre className="text-[11px] font-mono text-red-300/80">
                  {t.unbalanced.diagram}
                </pre>
                <p className="text-[10px] text-red-400/80 mt-3 italic">
                  {t.unbalanced.note}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-mono text-zinc-400 mb-3">
                  {t.complexity.title}
                </h3>
                <table className="w-full text-[10px] font-mono">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {t.complexity.headers.map((h, i) => (
                        <th key={i} className="text-left py-1 text-zinc-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.complexity.rows.map((row, i) => (
                      <tr key={i} className="border-b border-zinc-800/50">
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={`py-1 ${
                              j === 0
                                ? "text-emerald-300/80"
                                : j === 2
                                  ? "text-red-300/70"
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
          </div>
        </Section>

        {/* 06 - AVL vs RB */}
        <Section
          number={t.sections[5].number}
          title={t.sections[5].title}
          description={t.sections[5].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.balancedCompare.headers.map((h, i) => (
                    <th
                      key={i}
                      className={`text-left py-2 ${
                        i === 0 ? "text-zinc-600 w-32" : i === 1 ? "text-emerald-400" : "text-cyan-400"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.balancedCompare.rows.map((row, i) => (
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

        {/* summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold text-sm font-mono mb-5">
            {t.summary.title}
          </h3>
          <div className="space-y-3">
            {t.summary.items.map((item) => (
              <div key={item.label} className="flex gap-3 items-start">
                <span className="text-xs font-mono text-emerald-500/50 shrink-0 mt-0.5 min-w-[140px]">
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
