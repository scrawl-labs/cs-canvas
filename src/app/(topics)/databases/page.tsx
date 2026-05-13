"use client";

import ComingSoonPage from "@/components/ComingSoonPage";
import { useLanguage } from "@/contexts/LanguageContext";

const KO = {
  title: "데이터베이스",
  description: "B-트리, 트랜잭션, 조인 — 내부에서 무슨 일이 일어나는지 이해하기.",
  subtopics: [
    {
      name: "B-Tree 인덱스",
      description: "삽입과 분할 연산 — 노드 구조를 시각적으로 확인.",
      href: "/databases/b-tree",
    },
    {
      name: "트랜잭션 & ACID",
      description: "커밋, 롤백, 격리 수준 — 동시 트랜잭션 타임라인.",
      href: "/databases/transactions",
    },
    {
      name: "조인 알고리즘",
      description: "중첩 루프, 해시 조인, 병합 조인 — 비용 모델 비교.",
    },
    {
      name: "쿼리 실행 계획",
      description: "파스 트리에서 실행 계획까지 — 연산자 파이프라인 표시.",
    },
    {
      name: "정규화",
      description: "1NF → 3NF 분해 — 함수적 종속 화살표 실시간 표시.",
    },
  ],
};

const EN = {
  title: "Databases",
  description: "B-Trees, transactions, joins — understand what happens inside.",
  subtopics: [
    {
      name: "B-Tree Index",
      description: "Insert and split operations — node structure updated visually.",
      href: "/databases/b-tree",
    },
    {
      name: "Transactions & ACID",
      description: "Commit, rollback, isolation levels — concurrent txn timelines.",
      href: "/databases/transactions",
    },
    {
      name: "Join Algorithms",
      description: "Nested loop, hash join, merge join — cost model side by side.",
    },
    {
      name: "Query Execution Plan",
      description: "Parse tree to execution plan — operator pipeline shown.",
    },
    {
      name: "Normalization",
      description: "1NF → 3NF decomposition — dependency arrows live.",
    },
  ],
};

export default function DatabasesPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <ComingSoonPage
      title={t.title}
      icon="🗄️"
      color="from-rose-500 to-pink-600"
      description={t.description}
      subtopics={t.subtopics}
    />
  );
}
