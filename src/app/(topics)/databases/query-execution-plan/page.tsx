"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "databases", current: "query execution plan" },
  hero: {
    title: "Query Execution Plan",
    desc: "SQL을 던지면 DB는 무엇을 어떤 순서로 실행할까?\n파싱 → 옵티마이저 → 실행 계획 (연산자 트리) → 행 처리. EXPLAIN으로 들여다봅니다.",
    tags: ["EXPLAIN", "옵티마이저", "Cost Model", "Seq/Index Scan", "Join Order"],
  },
  sections: [
    {
      number: "01",
      title: "SQL이 실행되기까지 — 4단계",
      desc: "1) Parse: SQL 문자열 → 파스 트리. 2) Rewrite: 뷰 전개, 서브쿼리 평탄화 등. 3) Optimize: 가능한 plan 중 비용 최소 선택. 4) Execute: 실행 계획을 연산자 파이프라인으로 처리.",
    },
    {
      number: "02",
      title: "옵티마이저 — 비용 기반 선택",
      desc: "Cost = CPU + I/O 추정. 통계(테이블 행 수, 컬럼 분포, 히스토그램)로 추정. 같은 SQL이라도 데이터 크기와 통계에 따라 다른 plan 선택. 통계가 부정확하면 잘못된 plan.",
    },
    {
      number: "03",
      title: "EXPLAIN — 실행 계획 들여다보기",
      desc: "EXPLAIN: 옵티마이저가 선택한 plan 출력. EXPLAIN ANALYZE: 실제 실행 후 시간·행 수 측정. plan과 실제의 차이가 크면 통계 갱신 필요.",
    },
    {
      number: "04",
      title: "주요 연산자",
      desc: "Seq Scan: 테이블 전체 스캔. Index Scan: 인덱스로 접근. Index Only Scan: 인덱스만으로 답이 나옴 (covering). Nested Loop/Hash/Merge Join. Sort, Aggregate, Limit.",
    },
    {
      number: "05",
      title: "Plan 읽는 법 — 안에서 밖으로",
      desc: "트리 형태. 가장 깊이 들여쓰여진 노드부터 실행. 부모는 자식의 결과를 받아 처리. cost=시작~종료, rows=예상, actual=실제 (EXPLAIN ANALYZE).",
    },
    {
      number: "06",
      title: "느린 쿼리 진단 패턴",
      desc: "1) Seq Scan + 큰 테이블 → 인덱스 누락. 2) 실제 행수 >> 예상 → 통계 outdated. 3) Nested Loop on huge tables → Hash Join 강제. 4) Sort 비용 큼 → 인덱스로 정렬 활용.",
    },
  ],
  pipeline: {
    title: "SQL 처리 파이프라인",
    steps: [
      { n: "1", name: "Parser", desc: "SQL 문자열 → AST (Abstract Syntax Tree). 문법 검사." },
      { n: "2", name: "Analyzer", desc: "AST + 카탈로그(스키마) → 의미 검증. 컬럼·테이블 존재 확인." },
      { n: "3", name: "Rewriter", desc: "뷰 전개, 권한, 서브쿼리 평탄화 등 변환." },
      { n: "4", name: "Planner / Optimizer", desc: "가능한 실행 계획 후보 중 비용 최저 선택." },
      { n: "5", name: "Executor", desc: "선택된 plan을 연산자 트리로 실제 실행. 행 단위(Tuple at a time) 또는 배치." },
    ],
  },
  exampleSQL: {
    title: "예시 SQL",
    sql: `SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2025-01-01'
GROUP BY u.id, u.name
ORDER BY order_count DESC
LIMIT 10;`,
  },
  examplePlan: {
    title: "예상 실행 계획 (PostgreSQL)",
    plan: `Limit  (cost=1234.56..1234.59 rows=10 width=40)
  ->  Sort  (cost=1234.56..1245.67 rows=4444 width=40)
        Sort Key: (count(o.id)) DESC
        ->  HashAggregate  (cost=987.65..1023.45 rows=4444 width=40)
              Group Key: u.id, u.name
              ->  Hash Right Join  (cost=234.56..876.54 rows=8888 width=32)
                    Hash Cond: (o.user_id = u.id)
                    ->  Seq Scan on orders o  (cost=0..345.67 rows=50000 width=8)
                    ->  Hash  (cost=123.45..123.45 rows=4444 width=24)
                          ->  Index Scan using idx_users_created on users u
                                Index Cond: (created_at >= '2025-01-01')`,
    note: "안쪽부터 실행: users 인덱스 스캔 → 해시 빌드 → orders 시퀀스 스캔과 조인 → 그룹화 → 정렬 → LIMIT.",
  },
  operators: {
    title: "주요 연산자",
    headers: ["연산자", "동작", "비용"],
    rows: [
      ["Seq Scan", "테이블 전체 순차 읽기", "O(N), 작은 테이블이나 대부분 행 필요할 때"],
      ["Index Scan", "인덱스로 행 찾고 테이블 접근", "O(log N + K), 선택도 높을 때 유리"],
      ["Index Only Scan", "인덱스만으로 답 (covering)", "O(log N + K), 테이블 접근 없음 — 가장 빠름"],
      ["Bitmap Index Scan", "여러 인덱스 결합 비트맵", "O(log N × #idx), 중간 선택도"],
      ["Nested Loop Join", "각 행마다 inner 스캔", "O(N × M), 인덱스 있으면 O(N log M)"],
      ["Hash Join", "Build hash + Probe", "O(N + M), 동등 조건"],
      ["Merge Join", "정렬 후 두 포인터 병합", "O(N log N + M log M)"],
      ["Sort", "결과 정렬", "O(N log N), work_mem 초과 시 디스크"],
      ["HashAggregate", "GROUP BY를 해시로 그룹화", "O(N), 메모리 사용"],
    ],
  },
  costModel: {
    title: "비용 추정 — 통계가 핵심",
    items: [
      { name: "Table cardinality", desc: "테이블의 행 수. pg_class.reltuples 또는 ANALYZE로 갱신." },
      { name: "Column histogram", desc: "값의 분포. WHERE 조건이 몇 % 행을 거를지 추정." },
      { name: "Distinct values (NDV)", desc: "컬럼의 고유값 수. GROUP BY, DISTINCT 비용 추정." },
      { name: "Correlation", desc: "디스크 순서와 값 순서의 상관관계. Index Scan vs Seq Scan 결정." },
      { name: "Cost factors", desc: "seq_page_cost (1.0), random_page_cost (4.0), cpu_tuple_cost (0.01) 등 가중치." },
    ],
  },
  pitfalls: {
    title: "잘못된 plan의 흔한 원인",
    items: [
      { name: "Outdated 통계", desc: "데이터는 변했지만 ANALYZE 안 함 → 예상 행 수 부정확. 자동 ANALYZE 또는 cron." },
      { name: "통계 안 잡히는 표현식", desc: "WHERE func(col)는 통계 못 씀. PostgreSQL은 expression index의 통계 활용 가능." },
      { name: "Parameter sniffing", desc: "최초 실행 시 파라미터로 plan 결정 → 다른 값에 부적합. Prepared Statement 함정." },
      { name: "작은 통계 샘플", desc: "ANALYZE는 샘플링. 데이터가 skewed면 히스토그램 정확도 부족." },
      { name: "JOIN 순서 폭발", desc: "n개 테이블 조인은 n! 가지. PostgreSQL은 GEQO 옵티마이저로 휴리스틱 적용." },
    ],
  },
  tuning: {
    title: "느린 쿼리 진단 체크리스트",
    items: [
      "1. EXPLAIN ANALYZE로 실제 vs 예상 행 수 비교",
      "2. Seq Scan이 의도된 것인지 확인 (작은 테이블/대부분 행이면 OK)",
      "3. Sort 비용이 크면 인덱스로 정렬 회피 가능?",
      "4. Nested Loop on 큰 테이블 → Hash Join으로 강제?",
      "5. ANALYZE 최신인지 확인 → 필요시 갱신",
      "6. 인덱스 unused → 함수 호출, 타입 mismatch, 잘못된 통계 의심",
      "7. work_mem 부족으로 디스크 spill → 늘리거나 쿼리 단순화",
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "4단계", text: "Parse → Rewrite → Optimize → Execute. 옵티마이저가 비용 기반으로 plan 선택." },
      { label: "비용 = CPU + I/O", text: "통계로 추정. 통계 부정확 → 잘못된 plan. ANALYZE가 핵심." },
      { label: "EXPLAIN", text: "옵티마이저의 plan만. EXPLAIN ANALYZE는 실제 실행 + 측정." },
      { label: "Plan 읽기", text: "트리, 안에서 밖으로. 들여쓰기 깊은 노드 = 먼저 실행." },
      { label: "Seq vs Index Scan", text: "Seq: 전체 스캔. Index: 일부만 찾을 때. Index Only: 인덱스에 다 있으면 가장 빠름." },
      { label: "Join 선택", text: "옵티마이저가 데이터 크기와 인덱스 보고 Nested Loop / Hash / Merge 선택." },
      { label: "Parameter Sniffing", text: "Prepared Statement의 함정. 첫 파라미터로 plan 결정 → 다른 값에 부적합." },
      { label: "튜닝 시작점", text: "EXPLAIN ANALYZE → 실제 vs 예상 행수 차이부터 확인. 통계가 거의 항상 의심 1순위." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "databases", current: "query execution plan" },
  hero: {
    title: "Query Execution Plan",
    desc: "When you submit SQL, what does the DB actually do?\nParse → Optimizer → Execution plan (operator tree) → Row processing. EXPLAIN reveals it.",
    tags: ["EXPLAIN", "Optimizer", "Cost Model", "Seq/Index Scan", "Join Order"],
  },
  sections: [
    {
      number: "01",
      title: "From SQL to Execution — 4 Stages",
      desc: "1) Parse: SQL → parse tree. 2) Rewrite: view expansion, subquery flattening. 3) Optimize: pick the cheapest of many candidate plans. 4) Execute: run the operator pipeline.",
    },
    {
      number: "02",
      title: "Optimizer — Cost-Based Selection",
      desc: "Cost = estimated CPU + I/O. Computed from statistics (row counts, column distributions, histograms). The same SQL chooses different plans by data size and stats. Stale stats → bad plans.",
    },
    {
      number: "03",
      title: "EXPLAIN — Peek at the Plan",
      desc: "EXPLAIN: optimizer's chosen plan. EXPLAIN ANALYZE: also runs the query and shows real times and row counts. Big gaps between estimated and actual = stats problem.",
    },
    {
      number: "04",
      title: "Key Operators",
      desc: "Seq Scan: full-table read. Index Scan: lookup via index. Index Only Scan: answer fully in the index (covering). Nested Loop/Hash/Merge Join. Sort, Aggregate, Limit.",
    },
    {
      number: "05",
      title: "Reading a Plan — Inside Out",
      desc: "It's a tree. The deepest-indented node executes first. Parents consume children's output. cost=startup..total, rows=estimated, actual=measured (with ANALYZE).",
    },
    {
      number: "06",
      title: "Diagnosing Slow Queries",
      desc: "1) Seq Scan on big table → missing index. 2) Actual >> estimated rows → outdated stats. 3) Nested Loop on huge tables → switch to Hash Join. 4) Heavy Sort → reuse an index ordering.",
    },
  ],
  pipeline: {
    title: "SQL Processing Pipeline",
    steps: [
      { n: "1", name: "Parser", desc: "SQL string → AST. Syntax checked." },
      { n: "2", name: "Analyzer", desc: "AST + catalog → semantic check. Columns and tables resolved." },
      { n: "3", name: "Rewriter", desc: "View expansion, permission, subquery flattening." },
      { n: "4", name: "Planner / Optimizer", desc: "Pick the cheapest candidate plan." },
      { n: "5", name: "Executor", desc: "Run the operator tree. Tuple at a time, or batched." },
    ],
  },
  exampleSQL: {
    title: "Example SQL",
    sql: `SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2025-01-01'
GROUP BY u.id, u.name
ORDER BY order_count DESC
LIMIT 10;`,
  },
  examplePlan: {
    title: "Likely Plan (PostgreSQL)",
    plan: `Limit  (cost=1234.56..1234.59 rows=10 width=40)
  ->  Sort  (cost=1234.56..1245.67 rows=4444 width=40)
        Sort Key: (count(o.id)) DESC
        ->  HashAggregate  (cost=987.65..1023.45 rows=4444 width=40)
              Group Key: u.id, u.name
              ->  Hash Right Join  (cost=234.56..876.54 rows=8888 width=32)
                    Hash Cond: (o.user_id = u.id)
                    ->  Seq Scan on orders o  (cost=0..345.67 rows=50000 width=8)
                    ->  Hash  (cost=123.45..123.45 rows=4444 width=24)
                          ->  Index Scan using idx_users_created on users u
                                Index Cond: (created_at >= '2025-01-01')`,
    note: "Inside out: index-scan users → build hash → join with orders seq scan → group → sort → LIMIT.",
  },
  operators: {
    title: "Common Operators",
    headers: ["Operator", "Behavior", "Cost"],
    rows: [
      ["Seq Scan", "Sequential full-table read", "O(N), good for small tables or most rows needed"],
      ["Index Scan", "Index lookup + table fetch", "O(log N + K), better when selective"],
      ["Index Only Scan", "Answer in index alone (covering)", "O(log N + K), no table access — fastest"],
      ["Bitmap Index Scan", "Combine multiple indexes via bitmap", "O(log N × #idx), medium selectivity"],
      ["Nested Loop Join", "Inner scan for each outer row", "O(N × M), O(N log M) with index"],
      ["Hash Join", "Build hash + probe", "O(N + M), equi-join"],
      ["Merge Join", "Sort then two-pointer merge", "O(N log N + M log M)"],
      ["Sort", "Order the rows", "O(N log N), spills to disk past work_mem"],
      ["HashAggregate", "Group by via hash table", "O(N), uses memory"],
    ],
  },
  costModel: {
    title: "Cost Model — Stats Are Everything",
    items: [
      { name: "Table cardinality", desc: "Row count. pg_class.reltuples; refreshed by ANALYZE." },
      { name: "Column histogram", desc: "Value distribution. Estimates how many rows a WHERE clause keeps." },
      { name: "Distinct values (NDV)", desc: "Number of unique values. Drives GROUP BY and DISTINCT cost." },
      { name: "Correlation", desc: "How disk order matches value order. Influences Index Scan vs Seq Scan." },
      { name: "Cost factors", desc: "seq_page_cost (1.0), random_page_cost (4.0), cpu_tuple_cost (0.01), etc." },
    ],
  },
  pitfalls: {
    title: "Why Plans Go Wrong",
    items: [
      { name: "Outdated statistics", desc: "Data has changed but ANALYZE hasn't run → wrong row estimates. Use autovacuum or cron." },
      { name: "Expressions defeat stats", desc: "WHERE func(col) can't use column stats. PostgreSQL can collect stats for expression indexes." },
      { name: "Parameter sniffing", desc: "Prepared statement picks plan on first parameter — bad for skewed params." },
      { name: "Small ANALYZE sample", desc: "ANALYZE samples rows; on skewed data the histogram may be inaccurate." },
      { name: "Join order explosion", desc: "n tables → n! orderings. PostgreSQL uses GEQO past a threshold." },
    ],
  },
  tuning: {
    title: "Slow Query Checklist",
    items: [
      "1. EXPLAIN ANALYZE — compare actual vs estimated row counts",
      "2. Is Seq Scan intentional? (small table or most rows needed → OK)",
      "3. Heavy Sort? Can an index provide the ordering?",
      "4. Nested Loop on big tables? Force Hash Join?",
      "5. Is ANALYZE recent? Update if not",
      "6. Index unused? Suspect functions, type mismatch, or bad stats",
      "7. work_mem too low → spills to disk; increase or simplify the query",
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "4 stages", text: "Parse → Rewrite → Optimize → Execute. The optimizer picks the plan by cost." },
      { label: "Cost = CPU + I/O", text: "Estimated from statistics. Bad stats → bad plans. ANALYZE is critical." },
      { label: "EXPLAIN", text: "Shows the plan. EXPLAIN ANALYZE additionally executes and measures it." },
      { label: "Reading plans", text: "Tree, inside out. Deepest indented node runs first." },
      { label: "Seq vs Index Scan", text: "Seq for full scans, Index for selective lookups, Index Only when the index has everything." },
      { label: "Join selection", text: "Optimizer chooses Nested Loop / Hash / Merge based on sizes and indexes." },
      { label: "Parameter Sniffing", text: "Prepared statement trap — first param fixes the plan; bad for skewed values." },
      { label: "Where to start tuning", text: "Look at estimate vs actual rows in EXPLAIN ANALYZE first. Stats are nearly always suspect #1." },
    ],
  },
};

interface SectionProps { number: string; title: string; description: string; children: ReactNode; }
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

export default function QueryExecutionPlanPage() {
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

        <Section number={t.sections[0].number} title={t.sections[0].title} description={t.sections[0].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.pipeline.title}</h3>
            <div className="space-y-2">
              {t.pipeline.steps.map((s) => (
                <div key={s.n} className="grid grid-cols-[40px_140px_1fr] items-baseline gap-3 text-[11px] font-mono">
                  <span className="text-rose-400/80 font-semibold">{s.n}.</span>
                  <span className="text-rose-300/80">{s.name}</span>
                  <span className="text-zinc-400">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
            <div>
              <h3 className="text-xs font-mono text-zinc-400 mb-2">{t.exampleSQL.title}</h3>
              <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed bg-zinc-900/30 p-3 rounded">{t.exampleSQL.sql}</pre>
            </div>
            <div>
              <h3 className="text-xs font-mono text-zinc-400 mb-2">{t.examplePlan.title}</h3>
              <pre className="text-[10px] font-mono text-rose-300/80 leading-relaxed bg-zinc-900/30 p-3 rounded overflow-x-auto">{t.examplePlan.plan}</pre>
              <p className="text-[10px] text-zinc-500 italic mt-2">{t.examplePlan.note}</p>
            </div>
          </div>
        </Section>

        <Section number={t.sections[3].number} title={t.sections[3].title} description={t.sections[3].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.operators.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-rose-400 w-44" : i === 1 ? "text-zinc-400 w-56" : "text-zinc-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.operators.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-rose-300/80 font-semibold">{row[0]}</td>
                    <td className="py-2 text-zinc-400">{row[1]}</td>
                    <td className="py-2 text-zinc-500 text-[10px]">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section number={t.sections[1].number} title={t.sections[1].title} description={t.sections[1].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.costModel.title}</h3>
            <div className="space-y-2">
              {t.costModel.items.map((c) => (
                <div key={c.name} className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                  <div className="text-xs font-mono text-rose-300 font-semibold mb-1">{c.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section number="05" title={t.pitfalls.title} description="">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-6">
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

        <Section number={t.sections[5].number} title={t.sections[5].title} description={t.sections[5].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.tuning.title}</h3>
            <ul className="space-y-1.5">
              {t.tuning.items.map((it, i) => (
                <li key={i} className="text-[11px] font-mono text-zinc-400 leading-relaxed">{it}</li>
              ))}
            </ul>
          </div>
        </Section>

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
