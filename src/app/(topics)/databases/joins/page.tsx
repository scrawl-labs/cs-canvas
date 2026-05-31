"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";
import CodeBlock from "@/components/CodeBlock";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "databases", current: "joins" },
  hero: {
    title: "Join Algorithms",
    desc: "두 테이블을 합치는 SQL JOIN — 내부 알고리즘은 3가지.\nNested Loop, Hash Join, Sort-Merge — 옵티마이저가 데이터 크기와 인덱스를 보고 선택합니다.",
    tags: ["INNER/OUTER", "Nested Loop", "Hash Join", "Sort-Merge", "비용 모델"],
  },
  sections: [
    {
      number: "01",
      title: "JOIN의 종류 — INNER, LEFT, RIGHT, FULL",
      desc: "INNER: 양쪽에 매칭되는 행만. LEFT: 왼쪽 전부 + 매칭되는 오른쪽 (없으면 NULL). RIGHT: 반대. FULL: 둘 중 하나라도 있으면 (없는 쪽은 NULL). CROSS: 카티시안 곱.",
    },
    {
      number: "02",
      title: "Nested Loop Join — 가장 단순한 방법",
      desc: "왼쪽 테이블의 각 행마다 오른쪽 테이블 전체를 스캔하며 매칭. 기본은 O(N×M). 오른쪽에 인덱스가 있으면 O(N × log M)로 개선.",
    },
    {
      number: "03",
      title: "Hash Join — 메모리에 해시 테이블 빌드",
      desc: "1) 작은 테이블의 조인 키로 해시 테이블 빌드 (Build Phase). 2) 큰 테이블을 스캔하며 해시 테이블 조회 (Probe Phase). 평균 O(N+M). 메모리가 부족하면 디스크 분할(Grace Hash).",
    },
    {
      number: "04",
      title: "Sort-Merge Join — 정렬 후 한 번 훑기",
      desc: "양쪽 테이블을 조인 키로 정렬 후, 두 포인터로 한 번에 훑으며 매칭. O((N+M) log (N+M)) — 정렬 비용 지배. 이미 정렬돼 있으면 O(N+M).",
    },
    {
      number: "05",
      title: "옵티마이저는 무엇을 보는가",
      desc: "행 수, 인덱스 유무, 메모리 가용량, 조인 조건의 선택도(selectivity). 같은 SQL이라도 데이터 크기에 따라 다른 알고리즘이 선택됨.",
    },
    {
      number: "06",
      title: "흔한 함정 — N+1, Cartesian Explosion",
      desc: "ORM의 N+1: 부모 1개 쿼리 + 자식 N개 쿼리. JOIN 하나로 해결. Cartesian explosion: 조인 조건 누락 시 N×M 결과. 항상 ON 조건 확인.",
    },
  ],
  joinTypes: {
    title: "JOIN 결과 비교 — Users(id), Orders(user_id)",
    setup: {
      users: ["1: Alice", "2: Bob", "3: Carol"],
      orders: ["10: user=1", "20: user=2", "30: user=99"],
    },
    results: [
      { type: "INNER", rows: ["(1, Alice, 10)", "(2, Bob, 20)"], note: "양쪽 매칭만" },
      { type: "LEFT", rows: ["(1, Alice, 10)", "(2, Bob, 20)", "(3, Carol, NULL)"], note: "왼쪽 전부" },
      { type: "RIGHT", rows: ["(1, Alice, 10)", "(2, Bob, 20)", "(NULL, NULL, 30)"], note: "오른쪽 전부" },
      { type: "FULL", rows: ["(1, Alice, 10)", "(2, Bob, 20)", "(3, Carol, NULL)", "(NULL, NULL, 30)"], note: "양쪽 합집합" },
    ],
  },
  nestedLoop: {
    title: "Nested Loop Join — 의사 코드",
    code: `for (Row r : outer) {                       // 왼쪽 (작은 쪽이 좋음)
    for (Row s : inner) {                   // 오른쪽
        if (r.key.equals(s.key)) {
            output(r, s);
        }
    }
}
// 인덱스 있을 때:
for (Row r : outer) {
    for (Row s : indexLookup(inner, r.key)) {
        output(r, s);
    }
}`,
    cost: "기본 O(N × M), 인덱스 활용 O(N × log M)",
    when: "작은 outer + 인덱스 있는 inner. 매우 적은 row일 때 항상 후보.",
  },
  hashJoin: {
    title: "Hash Join — Build & Probe",
    phases: [
      {
        name: "Build Phase",
        desc: "작은 테이블 R을 스캔, 조인 키로 해시 테이블 H 빌드. 메모리에 적재.",
      },
      {
        name: "Probe Phase",
        desc: "큰 테이블 S를 스캔하며 각 행의 키로 H 조회. 매칭되면 출력.",
      },
      {
        name: "Spill (메모리 부족 시)",
        desc: "Grace Hash Join: 양쪽을 해시값 기준으로 디스크에 분할 → 각 파티션 독립 처리.",
      },
    ],
    cost: "O(N + M) 평균. 메모리 충분할 때 가장 빠름. 동등 조건(=)에만 사용.",
    when: "큰 테이블 + 큰 테이블 조인, 인덱스 없을 때, 동등 조건.",
  },
  sortMerge: {
    title: "Sort-Merge Join — 두 포인터로 훑기",
    code: `List<Row> sortedR = sort(R, Comparator.comparing(r -> r.key));
List<Row> sortedS = sort(S, Comparator.comparing(s -> s.key));
int i = 0, j = 0;
while (i < sortedR.size() && j < sortedS.size()) {
    int cmp = sortedR.get(i).key.compareTo(sortedS.get(j).key);
    if (cmp < 0) {
        i++;
    } else if (cmp > 0) {
        j++;
    } else {                                // 매칭
        output(sortedR.get(i), sortedS.get(j));
        // 중복 키 처리
        i++;   // 또는 j++
    }
}`,
    cost: "O((N+M) log (N+M)) — 정렬 비용 지배. 이미 정렬돼 있으면 O(N+M).",
    when: "인덱스로 정렬된 데이터, 범위 조인(<, > 같은 비동등 조건도 가능).",
  },
  comparison: {
    title: "JOIN 알고리즘 비교",
    headers: ["", "Nested Loop", "Hash Join", "Sort-Merge"],
    rows: [
      ["복잡도 (평균)", "O(N × M)", "O(N + M)", "O((N+M) log)"],
      ["복잡도 (인덱스)", "O(N × log M)", "—", "O(N+M)"],
      ["메모리", "낮음", "높음 (build 측 전체)", "중간 (정렬용)"],
      ["조건", "동등·범위 모두", "동등(=)만", "동등·범위 모두"],
      ["적합한 상황", "작은 N + 인덱스", "큰 N + 큰 M (메모리 OK)", "이미 정렬됨"],
      ["DB 기본 우선순위", "1번 후보", "큰 데이터에 자주", "정렬 활용 가능 시"],
    ],
  },
  optimizer: {
    title: "옵티마이저의 결정",
    items: [
      { factor: "행 수 (cardinality)", desc: "통계로 추정. 잘못 추정하면 최악의 plan 선택." },
      { factor: "인덱스 유무", desc: "Inner 측에 인덱스 있으면 Nested Loop 유리." },
      { factor: "메모리 (work_mem)", desc: "Hash Join이 메모리에 들어가는지가 관건." },
      { factor: "선택도 (selectivity)", desc: "WHERE 조건으로 미리 필터된 후 조인 — 더 작아진 쪽이 outer." },
      { factor: "Sort order 유지", desc: "다음 단계가 GROUP BY나 ORDER BY면 Sort-Merge가 이미 정렬된 결과 제공." },
    ],
  },
  pitfalls: {
    title: "흔한 함정",
    items: [
      { name: "N+1 쿼리", desc: "ORM에서 자주 발생. 부모 컬렉션 순회하며 각각 자식 조회 → JOIN 하나로 해결. ORM의 eager loading / JOIN FETCH 사용." },
      { name: "Cartesian Explosion", desc: "ON 또는 WHERE 누락. N×M 결과. 메모리·CPU 폭발. 항상 조인 조건 확인." },
      { name: "OUTER JOIN의 NULL", desc: "매칭 없는 쪽은 NULL. WHERE 절에 그 컬럼 조건 쓰면 OUTER가 INNER로 되돌아감." },
      { name: "Subquery vs JOIN", desc: "옵티마이저가 종종 같은 plan으로 변환하지만, 예외 케이스에서 성능 차이 큼. EXPLAIN으로 확인." },
      { name: "Hash Join 메모리 초과", desc: "Build 측이 work_mem 초과 → 디스크 spill, 성능 급락. work_mem 튜닝 또는 build 측 작게." },
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "JOIN 종류", text: "INNER (교집합), LEFT/RIGHT (한쪽 전부), FULL (합집합), CROSS (곱)." },
      { label: "Nested Loop", text: "O(N×M) 또는 인덱스로 O(N log M). 작은 outer + 인덱스 있는 inner에 최적." },
      { label: "Hash Join", text: "Build (해시 빌드) + Probe (조회). O(N+M). 동등(=) 조건만. 메모리 필요." },
      { label: "Sort-Merge", text: "양쪽 정렬 후 두 포인터. O((N+M) log). 이미 정렬됐거나 범위 조인에 유리." },
      { label: "옵티마이저", text: "행 수, 인덱스, 메모리, 선택도를 보고 결정. 통계가 부정확하면 잘못된 plan." },
      { label: "N+1 함정", text: "부모 1쿼리 + 자식 N쿼리. ORM에서 흔함. eager loading 또는 명시적 JOIN." },
      { label: "EXPLAIN", text: "어떤 알고리즘이 선택됐는지 확인 필수. PostgreSQL은 EXPLAIN ANALYZE, MySQL은 EXPLAIN FORMAT=JSON." },
      { label: "WHERE vs ON", text: "OUTER JOIN에서 WHERE에 outer 측 컬럼 조건 → INNER로 되돌아감. ON에 써야 OUTER 유지." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "databases", current: "joins" },
  hero: {
    title: "Join Algorithms",
    desc: "SQL JOIN combines two tables — but under the hood there are 3 algorithms.\nNested Loop, Hash Join, Sort-Merge — the optimizer picks based on size and indexes.",
    tags: ["INNER/OUTER", "Nested Loop", "Hash Join", "Sort-Merge", "Cost model"],
  },
  sections: [
    {
      number: "01",
      title: "Join Types — INNER, LEFT, RIGHT, FULL",
      desc: "INNER: rows matched on both sides. LEFT: all left + matched right (NULL if missing). RIGHT: reverse. FULL: any match (NULL fills missing side). CROSS: Cartesian product.",
    },
    {
      number: "02",
      title: "Nested Loop Join — Simplest",
      desc: "For each row of the outer table, scan the entire inner table for matches. Plain O(N×M). With an index on the inner, O(N × log M).",
    },
    {
      number: "03",
      title: "Hash Join — Build a Hash Table in Memory",
      desc: "1) Scan the smaller table, build a hash table on the join key (Build). 2) Scan the larger table, probe the hash table (Probe). O(N+M) average. If memory runs out, Grace Hash partitions to disk.",
    },
    {
      number: "04",
      title: "Sort-Merge Join — Sort, then Merge",
      desc: "Sort both sides by the join key, then walk in lockstep with two pointers. O((N+M) log (N+M)) dominated by sort. If already sorted, O(N+M).",
    },
    {
      number: "05",
      title: "What the Optimizer Considers",
      desc: "Row counts, indexes, available memory, predicate selectivity. The same SQL chooses different algorithms depending on data size.",
    },
    {
      number: "06",
      title: "Common Pitfalls — N+1, Cartesian Explosion",
      desc: "ORM N+1: 1 query for parents + N queries for children — solve with a single JOIN. Cartesian explosion: missing join condition → N×M rows. Always check ON.",
    },
  ],
  joinTypes: {
    title: "Join Results — Users(id), Orders(user_id)",
    setup: {
      users: ["1: Alice", "2: Bob", "3: Carol"],
      orders: ["10: user=1", "20: user=2", "30: user=99"],
    },
    results: [
      { type: "INNER", rows: ["(1, Alice, 10)", "(2, Bob, 20)"], note: "Matched both sides" },
      { type: "LEFT", rows: ["(1, Alice, 10)", "(2, Bob, 20)", "(3, Carol, NULL)"], note: "All left" },
      { type: "RIGHT", rows: ["(1, Alice, 10)", "(2, Bob, 20)", "(NULL, NULL, 30)"], note: "All right" },
      { type: "FULL", rows: ["(1, Alice, 10)", "(2, Bob, 20)", "(3, Carol, NULL)", "(NULL, NULL, 30)"], note: "Union" },
    ],
  },
  nestedLoop: {
    title: "Nested Loop Join — pseudocode",
    code: `for (Row r : outer) {                       // left (smaller is better)
    for (Row s : inner) {                   // right
        if (r.key.equals(s.key)) {
            output(r, s);
        }
    }
}
// with index on inner:
for (Row r : outer) {
    for (Row s : indexLookup(inner, r.key)) {
        output(r, s);
    }
}`,
    cost: "Plain O(N × M), with index O(N × log M)",
    when: "Small outer + indexed inner. Always a candidate when row count is tiny.",
  },
  hashJoin: {
    title: "Hash Join — Build & Probe",
    phases: [
      {
        name: "Build Phase",
        desc: "Scan smaller table R, build hash table H keyed on the join column. Held in memory.",
      },
      {
        name: "Probe Phase",
        desc: "Scan larger table S, look up each row's key in H. Emit matches.",
      },
      {
        name: "Spill (memory pressure)",
        desc: "Grace Hash Join: partition both sides by hash to disk → process each partition independently.",
      },
    ],
    cost: "O(N + M) average. Fastest when memory is enough. Equi-join (=) only.",
    when: "Big × big, no useful index, equi-join.",
  },
  sortMerge: {
    title: "Sort-Merge Join — Two-Pointer Merge",
    code: `List<Row> sortedR = sort(R, Comparator.comparing(r -> r.key));
List<Row> sortedS = sort(S, Comparator.comparing(s -> s.key));
int i = 0, j = 0;
while (i < sortedR.size() && j < sortedS.size()) {
    int cmp = sortedR.get(i).key.compareTo(sortedS.get(j).key);
    if (cmp < 0) {
        i++;
    } else if (cmp > 0) {
        j++;
    } else {                                // match
        output(sortedR.get(i), sortedS.get(j));
        // handle duplicates
        i++;   // or j++
    }
}`,
    cost: "O((N+M) log (N+M)) — sort dominates. Already sorted → O(N+M).",
    when: "Index-sorted data, range joins (works with <, > too — not just =).",
  },
  comparison: {
    title: "Algorithm Comparison",
    headers: ["", "Nested Loop", "Hash Join", "Sort-Merge"],
    rows: [
      ["Complexity (avg)", "O(N × M)", "O(N + M)", "O((N+M) log)"],
      ["Complexity (index)", "O(N × log M)", "—", "O(N+M)"],
      ["Memory", "Low", "High (entire build side)", "Medium (for sort)"],
      ["Predicates", "Equi + range", "Equi (=) only", "Equi + range"],
      ["Best when", "Small N + indexed inner", "Big × big (memory OK)", "Already sorted"],
      ["Default priority", "First considered", "Common on big data", "When sort is reusable"],
    ],
  },
  optimizer: {
    title: "Optimizer Decisions",
    items: [
      { factor: "Cardinality (row count)", desc: "Estimated from statistics. Bad estimates → bad plans." },
      { factor: "Index availability", desc: "Index on inner side → Nested Loop attractive." },
      { factor: "Memory (work_mem)", desc: "Whether Hash Join fits in memory is the deciding factor." },
      { factor: "Selectivity", desc: "Pre-filter with WHERE, then join — smaller side becomes outer." },
      { factor: "Sort order reuse", desc: "If the next step needs GROUP BY or ORDER BY, Sort-Merge's sorted output is free." },
    ],
  },
  pitfalls: {
    title: "Common Pitfalls",
    items: [
      { name: "N+1 queries", desc: "ORM staple. Iterating parents and fetching children one by one → fix with a single JOIN or eager loading / JOIN FETCH." },
      { name: "Cartesian Explosion", desc: "Missing ON or WHERE → N×M rows. Memory and CPU explode. Always sanity-check join conditions." },
      { name: "OUTER JOIN nulls", desc: "Unmatched side is NULL. Putting that column in WHERE turns OUTER back into INNER." },
      { name: "Subquery vs JOIN", desc: "Often the same plan, but exceptions matter. EXPLAIN to confirm." },
      { name: "Hash Join memory blowout", desc: "Build side exceeds work_mem → disk spill, performance collapse. Tune work_mem or shrink build side." },
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Join types", text: "INNER (intersection), LEFT/RIGHT (one full), FULL (union), CROSS (product)." },
      { label: "Nested Loop", text: "O(N×M), or O(N log M) with index. Great for small outer + indexed inner." },
      { label: "Hash Join", text: "Build (hash) + Probe (lookup). O(N+M). Equi-join only. Needs memory." },
      { label: "Sort-Merge", text: "Sort both then two-pointer merge. O((N+M) log). Wins when already sorted or for range joins." },
      { label: "Optimizer", text: "Row counts, indexes, memory, selectivity. Bad statistics → bad plan." },
      { label: "N+1 trap", text: "1 parent query + N child queries. Common in ORMs. Use eager loading or explicit JOIN." },
      { label: "EXPLAIN", text: "Check which algorithm was picked. PostgreSQL EXPLAIN ANALYZE, MySQL EXPLAIN FORMAT=JSON." },
      { label: "WHERE vs ON", text: "Outer-side column condition in WHERE silently demotes OUTER → INNER. Put it in ON instead." },
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

export default function JoinsPage() {
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

        {/* 01 - join types */}
        <Section number={t.sections[0].number} title={t.sections[0].title} description={t.sections[0].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.joinTypes.title}</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                <div className="text-[10px] font-mono text-zinc-500 mb-2">Users</div>
                <div className="space-y-0.5 text-[11px] font-mono text-zinc-400">
                  {t.joinTypes.setup.users.map((u, i) => <div key={i}>{u}</div>)}
                </div>
              </div>
              <div className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                <div className="text-[10px] font-mono text-zinc-500 mb-2">Orders</div>
                <div className="space-y-0.5 text-[11px] font-mono text-zinc-400">
                  {t.joinTypes.setup.orders.map((o, i) => <div key={i}>{o}</div>)}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {t.joinTypes.results.map((r) => (
                <div key={r.type} className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-rose-300 font-semibold">{r.type} JOIN</span>
                    <span className="text-[10px] text-zinc-500 italic">{r.note}</span>
                  </div>
                  <div className="space-y-0.5 text-[11px] font-mono text-zinc-400">
                    {r.rows.map((row, i) => (
                      <div key={i} className={row.includes("NULL") ? "text-amber-300/60" : ""}>{row}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 02 - nested loop */}
        <Section number={t.sections[1].number} title={t.sections[1].title} description={t.sections[1].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.nestedLoop.title}</h3>
            <CodeBlock language="java" code={t.nestedLoop.code} />
            <div className="mt-3 space-y-1">
              <div className="text-[11px] font-mono"><span className="text-rose-400">{lang === "ko" ? "비용: " : "Cost: "}</span><span className="text-zinc-400">{t.nestedLoop.cost}</span></div>
              <div className="text-[11px] font-mono"><span className="text-rose-400">{lang === "ko" ? "언제: " : "When: "}</span><span className="text-zinc-400">{t.nestedLoop.when}</span></div>
            </div>
          </div>
        </Section>

        {/* 03 - hash join */}
        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.hashJoin.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              {t.hashJoin.phases.map((p) => (
                <div key={p.name} className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
                  <div className="text-xs font-mono text-rose-300 font-semibold mb-1">{p.name}</div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-mono"><span className="text-rose-400">{lang === "ko" ? "비용: " : "Cost: "}</span><span className="text-zinc-400">{t.hashJoin.cost}</span></div>
              <div className="text-[11px] font-mono"><span className="text-rose-400">{lang === "ko" ? "언제: " : "When: "}</span><span className="text-zinc-400">{t.hashJoin.when}</span></div>
            </div>
          </div>
        </Section>

        {/* 04 - sort merge */}
        <Section number={t.sections[3].number} title={t.sections[3].title} description={t.sections[3].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.sortMerge.title}</h3>
            <CodeBlock language="java" code={t.sortMerge.code} />
            <div className="mt-3 space-y-1">
              <div className="text-[11px] font-mono"><span className="text-rose-400">{lang === "ko" ? "비용: " : "Cost: "}</span><span className="text-zinc-400">{t.sortMerge.cost}</span></div>
              <div className="text-[11px] font-mono"><span className="text-rose-400">{lang === "ko" ? "언제: " : "When: "}</span><span className="text-zinc-400">{t.sortMerge.when}</span></div>
            </div>
          </div>
        </Section>

        {/* comparison */}
        <Section number="05" title={t.comparison.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.comparison.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-zinc-600 w-40" : "text-rose-400"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.comparison.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    {row.map((cell, j) => (
                      <td key={j} className={`py-2 ${j === 0 ? "text-zinc-500" : "text-zinc-400"}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* optimizer */}
        <Section number={t.sections[4].number} title={t.sections[4].title} description={t.sections[4].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.optimizer.title}</h3>
            <div className="space-y-2">
              {t.optimizer.items.map((o) => (
                <div key={o.factor} className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                  <div className="text-xs font-mono text-rose-300 mb-1">{o.factor}</div>
                  <p className="text-[11px] text-zinc-400">{o.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* pitfalls */}
        <Section number={t.sections[5].number} title={t.sections[5].title} description={t.sections[5].desc}>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.pitfalls.title}</h3>
            <div className="space-y-2">
              {t.pitfalls.items.map((p) => (
                <div key={p.name} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                  <div className="text-xs font-mono text-amber-300 font-semibold mb-1">⚠ {p.name}</div>
                  <p className="text-[11px] text-zinc-400">{p.desc}</p>
                </div>
              ))}
            </div>
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
