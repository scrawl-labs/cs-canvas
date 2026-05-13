"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

type RecommendationKey = "for-update" | "serializable" | "read-committed" | "repeatable-read";

interface Recommendation {
  level: string;
  sql: string;
  pitfalls: { ko: string; en: string }[];
}

const RECOMMENDATIONS: Record<RecommendationKey, Recommendation> = {
  "for-update": {
    level: "REPEATABLE READ",
    sql: "BEGIN;\nSELECT balance FROM accounts WHERE id=1 FOR UPDATE;\nUPDATE accounts SET balance=balance-100 WHERE id=1;\nCOMMIT;",
    pitfalls: [
      { ko: "FOR UPDATE 없이 SELECT 후 UPDATE하면 lost update 발생", en: "SELECT then UPDATE without FOR UPDATE causes a lost update" },
      { ko: "긴 트랜잭션 유지 시 락 대기 누적", en: "Long-running transactions cause lock wait buildup" },
    ],
  },
  "serializable": {
    level: "SERIALIZABLE",
    sql: "SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;\nBEGIN;\n-- shared lock auto-acquired on reads\nSELECT SUM(amount) FROM orders;\nCOMMIT;",
    pitfalls: [
      { ko: "모든 SELECT에 공유락 → 처리량 대폭 감소", en: "Shared lock on every SELECT → significant throughput drop" },
      { ko: "Deadlock 빈도 증가", en: "Increased deadlock frequency" },
    ],
  },
  "read-committed": {
    level: "READ COMMITTED",
    sql: "SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;\nSELECT report_date, SUM(amount) FROM sales\nGROUP BY report_date;",
    pitfalls: [
      { ko: "같은 트랜잭션 내 두 번 읽으면 다른 결과 가능 (Non-Repeatable Read)", en: "Reading twice in the same transaction may return different results (Non-Repeatable Read)" },
      { ko: "MySQL에서 RC 사용 시 갭락 비활성화 → binlog STATEMENT 모드 주의", en: "RC in MySQL disables gap locks → beware binlog STATEMENT mode" },
    ],
  },
  "repeatable-read": {
    level: "REPEATABLE READ (MySQL 기본값 / MySQL default)",
    sql: "-- default (no extra config needed)\nBEGIN;\nSELECT * FROM products WHERE category='A';\n-- result unchanged even if T2 INSERTs\nCOMMIT;",
    pitfalls: [
      { ko: "인덱스 없는 UPDATE → 갭락 범위 확장 → 처리량 저하", en: "UPDATE on non-indexed column → gap lock range expands → throughput drops" },
      { ko: "긴 트랜잭션 → undo log chain 비대화 → purge 지연", en: "Long transactions → undo log chain bloat → purge delay" },
      { ko: "SELECT FOR UPDATE와 혼용 시 Phantom Read 주의", en: "Watch for Phantom Read when mixing SELECT FOR UPDATE" },
    ],
  },
};

interface TreeNode {
  id: string;
  question: { ko: string; en: string };
  children?: {
    label: { ko: string; en: string };
    node: TreeNode | { leaf: RecommendationKey };
  }[];
}

const TREE: TreeNode = {
  id: "root",
  question: { ko: "어떤 유형의 작업인가?", en: "What type of operation?" },
  children: [
    {
      label: { ko: "금전 / 재고 등 강한 정합성", en: "Financial / inventory — strong consistency" },
      node: {
        id: "financial",
        question: { ko: "동시 충돌이 많은가?", en: "High concurrent conflicts?" },
        children: [
          {
            label: { ko: "YES — 낙관적 락으로 충분하지 않음", en: "YES — optimistic lock is insufficient" },
            node: { leaf: "for-update" },
          },
          {
            label: { ko: "NO — 배치 / 정산 등 직렬화 필요", en: "NO — batch / settlement requiring serialization" },
            node: { leaf: "serializable" },
          },
        ],
      },
    },
    {
      label: { ko: "리포팅 / 분석 조회 (읽기 전용)", en: "Reporting / analytics (read-only)" },
      node: {
        id: "reporting",
        question: { ko: "약간의 비일관성 감내 가능?", en: "Can tolerate slight inconsistency?" },
        children: [
          {
            label: { ko: "YES — 최신 커밋 데이터면 충분", en: "YES — latest committed data is sufficient" },
            node: { leaf: "read-committed" },
          },
        ],
      },
    },
    {
      label: { ko: "일반 CRUD (기본값 사용)", en: "General CRUD (use default)" },
      node: { leaf: "repeatable-read" },
    },
  ],
};

const LEAF_LABEL: Record<RecommendationKey, string> = {
  "for-update": "SELECT FOR UPDATE + RR",
  "serializable": "SERIALIZABLE",
  "read-committed": "READ COMMITTED",
  "repeatable-read": "REPEATABLE READ",
};

type NodeOrLeaf = TreeNode | { leaf: RecommendationKey };

function isLeaf(n: NodeOrLeaf): n is { leaf: RecommendationKey } {
  return "leaf" in n;
}

interface TreeNodeProps {
  node: NodeOrLeaf;
  depth: number;
  selected: RecommendationKey | null;
  onSelect: (key: RecommendationKey) => void;
  lang: "ko" | "en";
}

function TreeNodeView({ node, depth, selected, onSelect, lang }: TreeNodeProps) {
  if (isLeaf(node)) {
    const key = node.leaf;
    const isSelected = selected === key;
    return (
      <button
        onClick={() => onSelect(key)}
        className={`text-left px-3 py-2 rounded font-mono text-xs border transition-colors ${
          isSelected
            ? "border-rose-500/60 bg-rose-500/10 text-rose-300"
            : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-zinc-300"
        }`}
      >
        {LEAF_LABEL[key]}
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-zinc-400 font-mono">{node.question[lang]}</p>
      <div className={`space-y-2 ${depth > 0 ? "pl-4 border-l border-white/10" : ""}`}>
        {node.children?.map((child, i) => (
          <div key={i} className="space-y-1">
            <p className="text-[11px] text-zinc-500">{child.label[lang]}</p>
            <TreeNodeView
              node={child.node}
              depth={depth + 1}
              selected={selected}
              onSelect={onSelect}
              lang={lang}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IsolationDecisionGuide() {
  const [selected, setSelected] = useState<RecommendationKey | null>(null);
  const rec = selected ? RECOMMENDATIONS[selected] : null;
  const { lang } = useLanguage();

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-6">
      <div>
        <h2 className="font-mono text-lg text-zinc-100">{lang === "ko" ? "Isolation Level 결정 가이드" : "Isolation Level Decision Guide"}</h2>
        <p className="text-sm text-zinc-500 mt-1">{lang === "ko" ? "작업 유형에 따라 적절한 격리 수준 선택" : "Choose the right isolation level for your workload"}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <p className="text-xs text-zinc-500 font-mono">{lang === "ko" ? "결정 트리 — 항목을 클릭해 권장안 확인" : "Decision tree — click an item to see the recommendation"}</p>
          <TreeNodeView
            node={TREE}
            depth={0}
            selected={selected}
            onSelect={setSelected}
            lang={lang}
          />
        </div>

        <div>
          <AnimatePresence mode="wait">
            {rec ? (
              <motion.div
                key={selected}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="border border-rose-500/30 bg-rose-500/[0.06] rounded-lg p-3">
                  <p className="text-[10px] text-zinc-500 font-mono mb-1">{lang === "ko" ? "권장 격리 수준" : "Recommended Isolation Level"}</p>
                  <p className="font-mono text-sm text-rose-300">{rec.level}</p>
                </div>

                <div className="border border-white/10 bg-white/[0.02] rounded-lg p-3 space-y-1">
                  <p className="text-[10px] text-zinc-500 font-mono mb-2">{lang === "ko" ? "SQL 예시" : "SQL Example"}</p>
                  <pre className="font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed whitespace-pre">
                    {rec.sql}
                  </pre>
                </div>

                <div className="border border-rose-500/20 bg-rose-500/[0.04] rounded-lg p-3 space-y-2">
                  <p className="text-[10px] text-rose-400 font-mono">{lang === "ko" ? "주의해야 할 함정" : "Pitfalls to Watch"}</p>
                  <ul className="space-y-1.5">
                    {rec.pitfalls.map((p, i) => (
                      <li key={i} className="flex gap-2 text-xs text-zinc-400">
                        <span className="text-rose-500 mt-px shrink-0">-</span>
                        {p[lang]}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-40 border border-dashed border-white/10 rounded-lg"
              >
                <p className="text-xs text-zinc-600 font-mono">{lang === "ko" ? "왼쪽 트리에서 항목 선택" : "Select an item from the tree on the left"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="border-t border-white/10 pt-5 space-y-3">
        <p className="text-xs text-zinc-500 font-mono">{lang === "ko" ? "실무 체크리스트" : "Production Checklist"}</p>
        <ul className="space-y-2">
          {(lang === "ko" ? [
            "인덱스 없는 컬럼 WHERE로 UPDATE — 갭락 범위 전체 확장 주의",
            "트랜잭션 내 외부 API 호출 금지 — 락 보유 시간 증가로 대기 누적",
            "긴 트랜잭션 — SHOW ENGINE INNODB STATUS로 undo log 크기 주기적 확인",
            "READ COMMITTED + binlog STATEMENT 혼용 — 복제 불일치 가능",
          ] : [
            "UPDATE with WHERE on non-indexed column — gap lock range expands to full table",
            "No external API calls inside transactions — increases lock hold time and wait buildup",
            "Long transactions — periodically check undo log size with SHOW ENGINE INNODB STATUS",
            "READ COMMITTED + binlog STATEMENT mix — possible replication inconsistency",
          ]).map((item, i) => (
            <li key={i} className="flex gap-2 text-xs text-zinc-400">
              <span className="text-zinc-600 shrink-0 font-mono">{i + 1}.</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
