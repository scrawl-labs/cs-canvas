"use client";

import ComingSoonPage from "@/components/ComingSoonPage";
import { useLanguage } from "@/contexts/LanguageContext";

const KO = {
  title: "알고리즘",
  description: "정렬, 그래프 탐색, 동적 계획법 — 실행 과정을 시각화로 따라갑니다.",
  subtopics: [
    {
      name: "정렬 알고리즘",
      description: "Bubble, Merge, Quick, Heap — 비교 기반 vs 비비교 기반, 안정성과 in-place까지.",
      href: "/algorithms/sorting",
    },
    {
      name: "그래프 탐색",
      description: "BFS와 DFS, 위상 정렬과 Dijkstra — 큐와 스택의 두 가지 길.",
      href: "/algorithms/graphs",
    },
    {
      name: "동적 계획법",
      description: "Fibonacci, Knapsack, LCS — 점화식 4단계와 Top-down vs Bottom-up.",
      href: "/algorithms/dynamic-programming",
    },
    {
      name: "분할 정복",
      description: "재귀 트리와 부분 문제 분해 — Merge Sort, Quick Sort의 기반 아이디어.",
    },
    {
      name: "탐욕 알고리즘",
      description: "Dijkstra, Prim, Activity Selection — 국소 선택이 전역 최적이 되는 조건.",
    },
    {
      name: "백트래킹",
      description: "N-Queens, Sudoku — 탐색 트리의 가지치기.",
    },
    {
      name: "문자열 알고리즘",
      description: "KMP, Rabin-Karp — 패턴 매칭 단계별.",
    },
    {
      name: "최단 경로",
      description: "Bellman-Ford vs Dijkstra — 음수 간선과 relaxation.",
    },
  ],
};

const EN = {
  title: "Algorithms",
  description: "Sorting, graph traversal, dynamic programming — watch them run step by step.",
  subtopics: [
    {
      name: "Sorting Algorithms",
      description: "Bubble, Merge, Quick, Heap — comparison vs non-comparison, stability and in-place.",
      href: "/algorithms/sorting",
    },
    {
      name: "Graph Traversal",
      description: "BFS and DFS, topological sort, Dijkstra — the two paths of queues and stacks.",
      href: "/algorithms/graphs",
    },
    {
      name: "Dynamic Programming",
      description: "Fibonacci, Knapsack, LCS — the 4 steps of recurrence and top-down vs bottom-up.",
      href: "/algorithms/dynamic-programming",
    },
    {
      name: "Divide & Conquer",
      description: "Recursion trees and subproblem breakdown — the idea behind Merge and Quick.",
    },
    {
      name: "Greedy Algorithms",
      description: "Dijkstra, Prim, activity selection — when local choices yield global optima.",
    },
    {
      name: "Backtracking",
      description: "N-Queens, Sudoku — pruning the search tree.",
    },
    {
      name: "String Algorithms",
      description: "KMP, Rabin-Karp — pattern matching step by step.",
    },
    {
      name: "Shortest Path",
      description: "Bellman-Ford vs Dijkstra — negative edges and relaxation.",
    },
  ],
};

export default function AlgorithmsPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <ComingSoonPage
      title={t.title}
      icon="⚡"
      color="from-violet-500 to-purple-600"
      description={t.description}
      subtopics={t.subtopics}
    />
  );
}
