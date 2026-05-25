"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "databases", current: "normalization" },
  hero: {
    title: "Normalization",
    desc: "중복 데이터는 일관성의 적.\n정규화는 테이블을 쪼개 중복을 제거하고, 한 사실은 한 곳에만 저장되도록 만드는 설계 방법입니다.",
    tags: ["1NF", "2NF", "3NF", "BCNF", "함수적 종속", "비정규화"],
  },
  sections: [
    {
      number: "01",
      title: "왜 정규화인가 — 갱신 이상",
      desc: "한 사실이 여러 행에 중복되면 세 가지 이상(anomaly)이 발생: 갱신 이상(일부만 수정), 삽입 이상(다른 정보 때문에 못 넣음), 삭제 이상(중요 정보가 같이 사라짐).",
    },
    {
      number: "02",
      title: "함수적 종속 (Functional Dependency)",
      desc: "X → Y: X의 값이 정해지면 Y가 결정됨. 예: student_id → student_name. 함수적 종속은 정규화의 출발점.",
    },
    {
      number: "03",
      title: "1NF — 원자값",
      desc: "각 컬럼의 값이 더 이상 쪼갤 수 없는 원자값(atomic). 리스트, JSON, 콤마로 구분한 문자열은 1NF 위반. 반복 그룹도 안 됨.",
    },
    {
      number: "04",
      title: "2NF — 부분 함수 종속 제거",
      desc: "1NF + 모든 비-키 컬럼이 기본키 전체에 의존. 복합키의 일부에만 의존하는 컬럼이 있으면 분리. 단일 PK면 자동으로 2NF.",
    },
    {
      number: "05",
      title: "3NF — 이행 함수 종속 제거",
      desc: "2NF + 비-키 컬럼이 다른 비-키 컬럼에 의존하지 않음. PK → A → B 형태(이행 종속)면 A를 별도 테이블로.",
    },
    {
      number: "06",
      title: "BCNF — 더 엄격한 3NF",
      desc: "모든 함수적 종속 X → Y에서 X가 super key여야 함. 3NF에서 살아남은 마지막 변칙 케이스를 제거. 실무에서는 보통 3NF까지가 표준.",
    },
    {
      number: "07",
      title: "비정규화 — 성능을 위한 의도적 중복",
      desc: "JOIN 비용이 크거나 읽기가 압도적이면 의도적으로 중복 허용. 데이터 웨어하우스의 별 스키마, NoSQL 임베딩이 대표적. 갱신 이상은 애플리케이션 책임.",
    },
  ],
  anomalies: {
    title: "갱신 이상 — 비정규화 테이블 예시",
    badTable: {
      headers: ["student_id", "name", "course_id", "course_name", "instructor"],
      rows: [
        ["1", "Alice", "CS101", "Data Structures", "Kim"],
        ["1", "Alice", "CS201", "Algorithms", "Lee"],
        ["2", "Bob", "CS101", "Data Structures", "Kim"],
        ["3", "Carol", "CS101", "Data Structures", "Kim"],
      ],
    },
    problems: [
      { type: "갱신 이상", desc: "Kim 교수의 이름이 바뀌면 모든 행을 수정해야 함. 누락되면 일관성 깨짐." },
      { type: "삽입 이상", desc: "수강생이 없는 새 과목은 student_id 없이 못 넣음." },
      { type: "삭제 이상", desc: "마지막 수강생을 지우면 과목 정보도 사라짐." },
    ],
  },
  fd: {
    title: "함수적 종속 — 예시",
    rules: [
      { fd: "student_id → name", desc: "학번은 이름을 결정" },
      { fd: "course_id → course_name", desc: "과목 코드는 과목명을 결정" },
      { fd: "course_id → instructor", desc: "과목은 담당 교수를 결정" },
      { fd: "(student_id, course_id) → grade", desc: "학생-과목 조합이 성적을 결정 (복합키)" },
    ],
    note: "이 종속들이 정규화의 지도. 어떤 종속이 어떤 PK에 어떻게 의존하는지가 1~3NF 분해의 근거.",
  },
  oneNF: {
    title: "1NF — 원자값",
    bad: {
      title: "위반 (1NF 아님)",
      headers: ["id", "name", "phones"],
      rows: [
        ["1", "Alice", "010-1111, 010-2222"],
        ["2", "Bob", "010-3333"],
      ],
    },
    good: {
      title: "1NF 만족",
      headers: ["id", "name", "phone"],
      rows: [
        ["1", "Alice", "010-1111"],
        ["1", "Alice", "010-2222"],
        ["2", "Bob", "010-3333"],
      ],
    },
  },
  twoNF: {
    title: "2NF — 부분 종속 제거",
    bad: {
      title: "위반: PK=(student_id, course_id), 그러나 name은 student_id에만 의존",
      headers: ["student_id*", "course_id*", "grade", "name"],
      rows: [
        ["1", "CS101", "A", "Alice"],
        ["1", "CS201", "B", "Alice"],
        ["2", "CS101", "C", "Bob"],
      ],
    },
    good: {
      title: "2NF: Students 분리",
      tables: [
        {
          name: "Enrollments",
          headers: ["student_id*", "course_id*", "grade"],
          rows: [["1", "CS101", "A"], ["1", "CS201", "B"], ["2", "CS101", "C"]],
        },
        {
          name: "Students",
          headers: ["student_id*", "name"],
          rows: [["1", "Alice"], ["2", "Bob"]],
        },
      ],
    },
  },
  threeNF: {
    title: "3NF — 이행 종속 제거",
    bad: {
      title: "위반: PK=course_id → instructor → instructor_office (이행 종속)",
      headers: ["course_id*", "course_name", "instructor", "instructor_office"],
      rows: [
        ["CS101", "Data Structures", "Kim", "Room 301"],
        ["CS201", "Algorithms", "Lee", "Room 305"],
        ["CS301", "Networks", "Kim", "Room 301"],
      ],
    },
    good: {
      title: "3NF: Instructors 분리",
      tables: [
        {
          name: "Courses",
          headers: ["course_id*", "course_name", "instructor_id"],
          rows: [["CS101", "Data Structures", "K1"], ["CS201", "Algorithms", "L1"], ["CS301", "Networks", "K1"]],
        },
        {
          name: "Instructors",
          headers: ["instructor_id*", "name", "office"],
          rows: [["K1", "Kim", "Room 301"], ["L1", "Lee", "Room 305"]],
        },
      ],
    },
  },
  comparison: {
    title: "정규형 비교",
    headers: ["정규형", "조건", "제거하는 문제"],
    rows: [
      ["1NF", "원자값, 반복 그룹 없음", "비-원자값 컬럼"],
      ["2NF", "1NF + 부분 종속 없음", "복합키 일부에만 의존하는 컬럼"],
      ["3NF", "2NF + 이행 종속 없음", "비-키 → 비-키 의존"],
      ["BCNF", "모든 결정자가 super key", "3NF에서 남은 극단적 이상"],
      ["4NF", "BCNF + 다치 종속 없음", "독립적인 다값 관계"],
      ["5NF", "BCNF + 조인 종속 없음", "분해 시 손실 발생하는 케이스"],
    ],
  },
  tradeoff: {
    title: "정규화 vs 비정규화 — 트레이드오프",
    headers: ["", "정규화 (3NF+)", "비정규화"],
    rows: [
      ["중복", "최소", "허용"],
      ["일관성", "DB가 보장", "애플리케이션 책임"],
      ["저장 공간", "절약", "더 사용"],
      ["쓰기 성능", "빠름 (한 곳만)", "느림 (여러 곳)"],
      ["읽기 성능", "JOIN 비용", "빠름 (한 행으로)"],
      ["적합 시스템", "OLTP, 트랜잭션", "OLAP, 분석, 캐시"],
      ["대표 예시", "은행 거래, 주문", "데이터 웨어하우스, 리포트"],
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "정규화의 목적", text: "중복 제거 → 갱신/삽입/삭제 이상 방지. 한 사실은 한 곳에만." },
      { label: "함수적 종속", text: "X → Y. 정규화의 기본 단위. 어떤 FD가 있는지가 분해의 출발점." },
      { label: "1NF", text: "원자값. 리스트, JSON, CSV 문자열 금지. 반복 그룹 금지." },
      { label: "2NF", text: "1NF + 모든 비-키 컬럼이 PK 전체에 의존. 복합키 일부에만 의존하는 컬럼 분리." },
      { label: "3NF", text: "2NF + 이행 종속 없음. PK → A → B 형태면 A 분리." },
      { label: "BCNF", text: "모든 결정자가 super key. 3NF에서 살아남는 변칙을 제거. 실무는 보통 3NF까지." },
      { label: "비정규화", text: "성능을 위한 의도적 중복. OLAP·캐시·NoSQL 임베딩. 일관성은 앱이 책임." },
      { label: "실전 권장", text: "OLTP는 3NF부터 시작 → 성능 측정 → 필요시 부분 비정규화. 처음부터 비정규화는 위험." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "databases", current: "normalization" },
  hero: {
    title: "Normalization",
    desc: "Duplication is the enemy of consistency.\nNormalization splits tables to eliminate duplication so each fact lives in exactly one place.",
    tags: ["1NF", "2NF", "3NF", "BCNF", "Functional dependency", "Denormalization"],
  },
  sections: [
    {
      number: "01",
      title: "Why Normalize — Update Anomalies",
      desc: "When one fact repeats across rows, three anomalies appear: update anomaly (partial update), insert anomaly (can't insert one fact without another), delete anomaly (deleting one row loses other facts).",
    },
    {
      number: "02",
      title: "Functional Dependency",
      desc: "X → Y: knowing X determines Y. Example: student_id → student_name. FDs are the starting point of normalization.",
    },
    {
      number: "03",
      title: "1NF — Atomic Values",
      desc: "Every column holds a single, atomic value. Lists, JSON arrays, comma-separated strings violate 1NF. No repeating groups.",
    },
    {
      number: "04",
      title: "2NF — No Partial Dependency",
      desc: "1NF + every non-key column depends on the entire primary key. If something depends on only part of a composite key, split it out. With a single-column PK, you're automatically in 2NF.",
    },
    {
      number: "05",
      title: "3NF — No Transitive Dependency",
      desc: "2NF + no non-key column depends on another non-key column. If PK → A → B (transitive), split A into its own table.",
    },
    {
      number: "06",
      title: "BCNF — Stricter 3NF",
      desc: "For every functional dependency X → Y, X must be a super key. Removes the last edge cases that survive 3NF. In practice, 3NF is usually the production standard.",
    },
    {
      number: "07",
      title: "Denormalization — Intentional Duplication for Speed",
      desc: "When JOIN cost is too high or reads dominate, you allow duplication on purpose. Data warehouse star schemas and NoSQL document embedding are the canonical examples. Update anomalies become the app's responsibility.",
    },
  ],
  anomalies: {
    title: "Update Anomalies — Unnormalized Table",
    badTable: {
      headers: ["student_id", "name", "course_id", "course_name", "instructor"],
      rows: [
        ["1", "Alice", "CS101", "Data Structures", "Kim"],
        ["1", "Alice", "CS201", "Algorithms", "Lee"],
        ["2", "Bob", "CS101", "Data Structures", "Kim"],
        ["3", "Carol", "CS101", "Data Structures", "Kim"],
      ],
    },
    problems: [
      { type: "Update anomaly", desc: "If Kim's name changes, every row must be updated. Miss one → inconsistent." },
      { type: "Insert anomaly", desc: "Can't add a new course until at least one student enrolls (student_id needed)." },
      { type: "Delete anomaly", desc: "Deleting the last enrolled student also wipes the course info." },
    ],
  },
  fd: {
    title: "Functional Dependencies — Example",
    rules: [
      { fd: "student_id → name", desc: "Student ID determines name" },
      { fd: "course_id → course_name", desc: "Course code determines name" },
      { fd: "course_id → instructor", desc: "Course determines instructor" },
      { fd: "(student_id, course_id) → grade", desc: "Student-course pair determines grade (composite PK)" },
    ],
    note: "These FDs are the map. They drive the 1→2→3NF decomposition.",
  },
  oneNF: {
    title: "1NF — Atomic Values",
    bad: {
      title: "Violation (not 1NF)",
      headers: ["id", "name", "phones"],
      rows: [
        ["1", "Alice", "010-1111, 010-2222"],
        ["2", "Bob", "010-3333"],
      ],
    },
    good: {
      title: "1NF",
      headers: ["id", "name", "phone"],
      rows: [
        ["1", "Alice", "010-1111"],
        ["1", "Alice", "010-2222"],
        ["2", "Bob", "010-3333"],
      ],
    },
  },
  twoNF: {
    title: "2NF — Remove Partial Dependency",
    bad: {
      title: "Violation: PK=(student_id, course_id), but name depends only on student_id",
      headers: ["student_id*", "course_id*", "grade", "name"],
      rows: [
        ["1", "CS101", "A", "Alice"],
        ["1", "CS201", "B", "Alice"],
        ["2", "CS101", "C", "Bob"],
      ],
    },
    good: {
      title: "2NF: split out Students",
      tables: [
        {
          name: "Enrollments",
          headers: ["student_id*", "course_id*", "grade"],
          rows: [["1", "CS101", "A"], ["1", "CS201", "B"], ["2", "CS101", "C"]],
        },
        {
          name: "Students",
          headers: ["student_id*", "name"],
          rows: [["1", "Alice"], ["2", "Bob"]],
        },
      ],
    },
  },
  threeNF: {
    title: "3NF — Remove Transitive Dependency",
    bad: {
      title: "Violation: PK=course_id → instructor → instructor_office (transitive)",
      headers: ["course_id*", "course_name", "instructor", "instructor_office"],
      rows: [
        ["CS101", "Data Structures", "Kim", "Room 301"],
        ["CS201", "Algorithms", "Lee", "Room 305"],
        ["CS301", "Networks", "Kim", "Room 301"],
      ],
    },
    good: {
      title: "3NF: split out Instructors",
      tables: [
        {
          name: "Courses",
          headers: ["course_id*", "course_name", "instructor_id"],
          rows: [["CS101", "Data Structures", "K1"], ["CS201", "Algorithms", "L1"], ["CS301", "Networks", "K1"]],
        },
        {
          name: "Instructors",
          headers: ["instructor_id*", "name", "office"],
          rows: [["K1", "Kim", "Room 301"], ["L1", "Lee", "Room 305"]],
        },
      ],
    },
  },
  comparison: {
    title: "Normal Form Comparison",
    headers: ["Form", "Condition", "Removes"],
    rows: [
      ["1NF", "Atomic values, no repeating groups", "Non-atomic columns"],
      ["2NF", "1NF + no partial dependency", "Columns depending on part of composite key"],
      ["3NF", "2NF + no transitive dependency", "Non-key → non-key chains"],
      ["BCNF", "Every determinant is a super key", "Edge cases surviving 3NF"],
      ["4NF", "BCNF + no multivalued dependency", "Independent many-valued relations"],
      ["5NF", "BCNF + no join dependency", "Lossy decomposition cases"],
    ],
  },
  tradeoff: {
    title: "Normalize vs Denormalize — Trade-offs",
    headers: ["", "Normalized (3NF+)", "Denormalized"],
    rows: [
      ["Duplication", "Minimal", "Allowed"],
      ["Consistency", "Enforced by DB", "App responsibility"],
      ["Storage", "Saved", "More used"],
      ["Write performance", "Fast (single place)", "Slow (many places)"],
      ["Read performance", "JOIN cost", "Fast (single row)"],
      ["Fits", "OLTP, transactions", "OLAP, analytics, caches"],
      ["Examples", "Banking, orders", "Data warehouses, reports"],
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Goal", text: "Eliminate duplication → prevent update/insert/delete anomalies. One fact, one place." },
      { label: "Functional dependency", text: "X → Y. The fundamental unit. Identifying FDs is the first step of decomposition." },
      { label: "1NF", text: "Atomic values. No lists, JSON, or CSV strings. No repeating groups." },
      { label: "2NF", text: "1NF + every non-key column depends on the full PK. Split partial-dependency columns out." },
      { label: "3NF", text: "2NF + no transitive dependencies. If PK → A → B, move A to its own table." },
      { label: "BCNF", text: "Every determinant is a super key. Removes edge cases left after 3NF. Production usually stops at 3NF." },
      { label: "Denormalization", text: "Intentional duplication for speed. OLAP, caches, NoSQL embedding. App owns consistency." },
      { label: "Practical advice", text: "Start at 3NF for OLTP → measure → denormalize selectively if needed. Don't start denormalized." },
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
          <span className="text-xs font-mono text-rose-500/60">{number}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

function TinyTable({
  headers,
  rows,
  highlight,
}: {
  headers: string[];
  rows: string[][];
  highlight?: "bad" | "good";
}) {
  const color =
    highlight === "bad"
      ? "text-red-300/70 border-red-500/20"
      : highlight === "good"
        ? "text-emerald-300/70 border-emerald-500/20"
        : "text-zinc-400 border-zinc-800";
  return (
    <div className="overflow-x-auto">
      <table className="text-[11px] font-mono">
        <thead>
          <tr className={`border-b ${color}`}>
            {headers.map((h, i) => (
              <th key={i} className="text-left py-1.5 pr-4 text-rose-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-800/50">
              {row.map((cell, j) => (
                <td key={j} className={`py-1 pr-4 ${color}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function NormalizationPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(244,63,94,0.05),transparent)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.home}</Link>
          <span>/</span>
          <Link href="/databases" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.parent}</Link>
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

        {/* 01 - anomalies */}
        <Section number={t.sections[0].number} title={t.sections[0].title} description={t.sections[0].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.anomalies.title}</h3>
            <TinyTable headers={t.anomalies.badTable.headers} rows={t.anomalies.badTable.rows} highlight="bad" />
            <div className="mt-4 space-y-2">
              {t.anomalies.problems.map((p) => (
                <div key={p.type} className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                  <div className="text-xs font-mono text-red-300 font-semibold mb-1">⚠ {p.type}</div>
                  <p className="text-[11px] text-zinc-400">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 02 - functional dependency */}
        <Section number={t.sections[1].number} title={t.sections[1].title} description={t.sections[1].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.fd.title}</h3>
            <div className="space-y-2">
              {t.fd.rules.map((r, i) => (
                <div key={i} className="grid grid-cols-[1fr_1.5fr] gap-3 text-[11px] font-mono">
                  <code className="text-rose-300">{r.fd}</code>
                  <span className="text-zinc-500">{r.desc}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500 italic mt-4 leading-relaxed">{t.fd.note}</p>
          </div>
        </Section>

        {/* 03 - 1NF */}
        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
            <div>
              <div className="text-[11px] font-mono text-red-400 mb-2">✗ {t.oneNF.bad.title}</div>
              <TinyTable headers={t.oneNF.bad.headers} rows={t.oneNF.bad.rows} highlight="bad" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-emerald-400 mb-2">✓ {t.oneNF.good.title}</div>
              <TinyTable headers={t.oneNF.good.headers} rows={t.oneNF.good.rows} highlight="good" />
            </div>
          </div>
        </Section>

        {/* 04 - 2NF */}
        <Section number={t.sections[3].number} title={t.sections[3].title} description={t.sections[3].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
            <div>
              <div className="text-[11px] font-mono text-red-400 mb-2">✗ {t.twoNF.bad.title}</div>
              <TinyTable headers={t.twoNF.bad.headers} rows={t.twoNF.bad.rows} highlight="bad" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-emerald-400 mb-2">✓ {t.twoNF.good.title}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.twoNF.good.tables.map((tab) => (
                  <div key={tab.name}>
                    <div className="text-[10px] font-mono text-emerald-400 mb-1">{tab.name}</div>
                    <TinyTable headers={tab.headers} rows={tab.rows} highlight="good" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* 05 - 3NF */}
        <Section number={t.sections[4].number} title={t.sections[4].title} description={t.sections[4].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
            <div>
              <div className="text-[11px] font-mono text-red-400 mb-2">✗ {t.threeNF.bad.title}</div>
              <TinyTable headers={t.threeNF.bad.headers} rows={t.threeNF.bad.rows} highlight="bad" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-emerald-400 mb-2">✓ {t.threeNF.good.title}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.threeNF.good.tables.map((tab) => (
                  <div key={tab.name}>
                    <div className="text-[10px] font-mono text-emerald-400 mb-1">{tab.name}</div>
                    <TinyTable headers={tab.headers} rows={tab.rows} highlight="good" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* 06 - normal form comparison */}
        <Section number={t.sections[5].number} title={t.sections[5].title} description={t.sections[5].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.comparison.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-rose-400 w-20" : "text-zinc-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.comparison.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-rose-300/80 font-semibold">{row[0]}</td>
                    <td className="py-2 text-zinc-400">{row[1]}</td>
                    <td className="py-2 text-zinc-500">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 07 - tradeoff */}
        <Section number={t.sections[6].number} title={t.sections[6].title} description={t.sections[6].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.tradeoff.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-zinc-600 w-36" : i === 1 ? "text-emerald-400" : "text-amber-400"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.tradeoff.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-zinc-500">{row[0]}</td>
                    <td className="py-2 text-emerald-300/80">{row[1]}</td>
                    <td className="py-2 text-amber-300/80">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold text-sm font-mono mb-5">{t.summary.title}</h3>
          <div className="space-y-3">
            {t.summary.items.map((item) => (
              <div key={item.label} className="flex gap-3 items-start">
                <span className="text-xs font-mono text-rose-500/50 shrink-0 mt-0.5 min-w-[140px]">{item.label}</span>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
