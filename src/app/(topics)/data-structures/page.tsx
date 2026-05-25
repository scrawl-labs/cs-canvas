"use client";

import ComingSoonPage from "@/components/ComingSoonPage";
import { useLanguage } from "@/contexts/LanguageContext";

const KO = {
  title: "자료구조",
  description: "트리, 힙, 연결 리스트 — 모든 연산을 손으로 직접 짚어가며 이해합니다.",
  subtopics: [
    {
      name: "이진 탐색 트리",
      description: "삽입, 삭제, 순회와 균형 — 정렬된 데이터에 O(log n) 검색.",
      href: "/data-structures/binary-search-trees",
    },
    {
      name: "힙 (Heaps)",
      description: "Min/Max Heap, Heapify, 우선순위 큐 — 항상 최댓값/최솟값을 O(1)에.",
      href: "/data-structures/heaps",
    },
    {
      name: "연결 리스트",
      description: "Singly, Doubly, Circular — Two Pointer 기법까지.",
      href: "/data-structures/linked-lists",
    },
    {
      name: "해시 테이블",
      description: "Chaining vs Open Addressing, Load Factor, Rehash — dict/map의 내부.",
      href: "/data-structures/hash-tables",
    },
    {
      name: "트라이 (Tries)",
      description: "접두사 트리 — 자동완성과 검색 강조.",
    },
    {
      name: "그래프",
      description: "인접 리스트 vs 행렬 — 메모리 레이아웃과 순회를 나란히.",
    },
  ],
};

const EN = {
  title: "Data Structures",
  description: "Trees, heaps, linked lists — interact with every operation.",
  subtopics: [
    {
      name: "Binary Search Trees",
      description: "Insert, delete, traversal, balance — O(log n) on sorted data.",
      href: "/data-structures/binary-search-trees",
    },
    {
      name: "Heaps",
      description: "Min/Max Heap, Heapify, Priority Queue — top element in O(1).",
      href: "/data-structures/heaps",
    },
    {
      name: "Linked Lists",
      description: "Singly, doubly, circular — plus the Two-Pointer trick.",
      href: "/data-structures/linked-lists",
    },
    {
      name: "Hash Tables",
      description: "Chaining vs Open Addressing, Load Factor, Rehash — under the hood of dict/map.",
      href: "/data-structures/hash-tables",
    },
    {
      name: "Tries",
      description: "Prefix trees — autocomplete and search highlighted.",
    },
    {
      name: "Graphs",
      description: "Adjacency list vs matrix — memory layout and traversal side by side.",
    },
  ],
};

export default function DataStructuresPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <ComingSoonPage
      title={t.title}
      icon="🌲"
      color="from-emerald-500 to-teal-600"
      description={t.description}
      subtopics={t.subtopics}
    />
  );
}
