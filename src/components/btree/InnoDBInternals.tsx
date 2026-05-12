"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type Tab = "page" | "record" | "compare";

// ── Page Structure Tab ──────────────────────────────────────────────────────

const PAGE_SECTIONS = [
  { id: "header",   label: "Page Header",          sub: "체크섬, 페이지 번호, 타입 등 메타데이터",   h: 36, color: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.35)" },
  { id: "infimum",  label: "Infimum",               sub: "하한 sentinel record",                        h: 28, color: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)" },
  { id: "r1",       label: "Record 1  [kim@… | pk=3]",  sub: "→ next record",                           h: 34, color: "rgba(244,63,94,0.08)",   border: "rgba(244,63,94,0.25)",  record: true },
  { id: "r2",       label: "Record 2  [lee@… | pk=7]",  sub: "→ next record",                           h: 34, color: "rgba(244,63,94,0.08)",   border: "rgba(244,63,94,0.25)",  record: true },
  { id: "r3",       label: "Record 3  [park@… | pk=1]", sub: "→ Supremum",                              h: 34, color: "rgba(244,63,94,0.08)",   border: "rgba(244,63,94,0.25)",  record: true },
  { id: "supremum", label: "Supremum",              sub: "상한 sentinel record",                        h: 28, color: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)" },
  { id: "free",     label: "Free Space",            sub: "새 record가 삽입될 공간",                     h: 44, color: "rgba(255,255,255,0.01)", border: "rgba(255,255,255,0.04)" },
  { id: "dir",      label: "Page Directory",        sub: "페이지 내 binary search용 slot 배열 (4~8 records마다 1 slot)", h: 36, color: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.25)" },
];

const PAGE_NOTES = [
  "기본 크기 16 KB — InnoDB의 최소 I/O 단위",
  "Records는 물리 순서와 논리 순서가 다를 수 있음 (삽입/삭제 시 pointer만 조정)",
  "Page Directory로 페이지 내에서도 O(log n) binary search 가능",
];

// ── Record Format Tab ───────────────────────────────────────────────────────

interface ByteField {
  label: string;
  width: number; // relative flex units
  color: string;
  border: string;
  dir: "left" | "right";
  note?: string;
}

const HEADER_FIELDS: ByteField[] = [
  { label: "가변길이 목록", width: 3, color: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.4)",  dir: "left",  note: "VARCHAR 컬럼마다 실제 길이 기록" },
  { label: "NULL 비트맵",   width: 2, color: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)",  dir: "left",  note: "nullable 컬럼 수 ÷ 8 바이트" },
  { label: "고정 헤더 5B",  width: 2, color: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.4)",  dir: "left",  note: "next record pointer 등 포함" },
];

const DATA_FIELDS: ByteField[] = [
  { label: "email 값",  width: 3, color: "rgba(244,63,94,0.12)",  border: "rgba(244,63,94,0.35)",  dir: "right", note: "인덱스 컬럼" },
  { label: "pk(id) 값", width: 2, color: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.35)", dir: "right", note: "Primary Key" },
];

// ── Secondary vs Clustered Tab ──────────────────────────────────────────────

interface IndexType {
  name: string;
  sub: string;
  fields: { label: string; note: string; highlight?: boolean }[];
  color: string;
  border: string;
}

const INDEX_TYPES: IndexType[] = [
  {
    name: "Secondary Index",
    sub: "보조 인덱스 (idx_email)",
    color: "rgba(244,63,94,0.08)",
    border: "rgba(244,63,94,0.3)",
    fields: [
      { label: "email", note: "인덱스 컬럼", highlight: true },
      { label: "id (PK)", note: "Clustered Index를 찾기 위한 포인터", highlight: true },
    ],
  },
  {
    name: "Clustered Index",
    sub: "기본 인덱스 (PRIMARY)",
    color: "rgba(52,211,153,0.06)",
    border: "rgba(52,211,153,0.25)",
    fields: [
      { label: "id", note: "PK" },
      { label: "email", note: "모든 컬럼" },
      { label: "name", note: "모든 컬럼" },
      { label: "bio", note: "모든 컬럼" },
      { label: "age", note: "모든 컬럼" },
    ],
  },
];

const FLOW_STEPS = [
  {
    label: "Secondary Index 탐색",
    sub: "leaf record: [email | pk]",
    color: "border-rose-500/30 bg-rose-500/5 text-rose-400",
  },
  {
    label: "Covering?",
    sub: "SELECT 컬럼이 인덱스에 전부 있는가",
    color: "border-amber-500/30 bg-amber-500/5 text-amber-400",
  },
];

// ── Component ───────────────────────────────────────────────────────────────

export default function InnoDBInternals() {
  const [tab, setTab] = useState<Tab>("page");
  const [activeRecord, setActiveRecord] = useState<string | null>(null);
  const [showCovering, setShowCovering] = useState(true);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      {/* tabs */}
      <div className="flex border-b border-white/10">
        {([
          ["page",    "Page 구조"],
          ["record",  "Record 파싱"],
          ["compare", "Secondary vs Clustered"],
        ] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-mono transition-colors ${
              tab === t
                ? "text-white border-b-2 border-rose-500 bg-white/[0.04]"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── PAGE STRUCTURE ─────────────────────────────────────────── */}
        {tab === "page" && (
          <motion.div
            key="page"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
              InnoDB는 디스크를 <span className="text-zinc-300">16KB 페이지</span> 단위로 읽고 씁니다.
              B+Tree의 각 노드가 하나의 페이지입니다. 아래는 Secondary Index leaf page의 내부 구조입니다.
            </p>

            <div className="flex gap-6">
              {/* page diagram */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-zinc-600 mb-2">16KB Page (Secondary Index Leaf)</p>
                <div className="rounded-lg border border-white/10 overflow-hidden">
                  {PAGE_SECTIONS.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => setActiveRecord(activeRecord === sec.id ? null : sec.id)}
                      className="w-full text-left transition-all"
                      style={{
                        background: activeRecord === sec.id ? sec.color.replace("0.08", "0.18").replace("0.15","0.25").replace("0.03","0.08").replace("0.01","0.04") : sec.color,
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        padding: "8px 12px",
                        minHeight: sec.h,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div
                        className="w-1 self-stretch rounded-full shrink-0"
                        style={{ background: sec.border, minHeight: 16 }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-white/80 truncate">{sec.label}</p>
                        {activeRecord === sec.id && (
                          <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed whitespace-normal">{sec.sub}</p>
                        )}
                      </div>
                      {sec.record && (
                        <span className="text-xs font-mono text-rose-400/60 shrink-0">→</span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-zinc-700 font-mono mt-2">← 클릭하면 설명 표시</p>
              </div>

              {/* notes */}
              <div className="w-56 shrink-0 space-y-3">
                <p className="text-xs font-mono text-zinc-600 mb-2">핵심 포인트</p>
                {PAGE_NOTES.map((note, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-xs font-mono text-rose-500/50 shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-xs text-zinc-400 leading-relaxed">{note}</p>
                  </div>
                ))}

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs font-mono text-zinc-600 mb-2">Page Directory 역할</p>
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      레코드 전체를 순차 스캔하지 않고,
                      slot 배열로 페이지 내 binary search 가능 →
                      <span className="text-emerald-400"> O(log n)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── RECORD FORMAT ──────────────────────────────────────────── */}
        {tab === "record" && (
          <motion.div
            key="record"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              Secondary Index의 leaf record는 Map이 아니라{" "}
              <span className="text-zinc-300">직렬화된 연속 바이트 배열(C struct)</span>입니다.
              필드명 없이 값만 저장되며, InnoDB가 스키마를 알기 때문에 파싱할 수 있습니다.
            </p>

            {/* record pointer diagram */}
            <div className="mb-6">
              <p className="text-xs font-mono text-zinc-600 mb-3">Record 구조 — pointer가 중간을 가리킴</p>
              <div className="rounded-xl border border-white/10 bg-black/20 p-5 overflow-x-auto">
                <div className="flex items-stretch min-w-[480px]">
                  {/* header (left, read backwards) */}
                  <div className="flex flex-row-reverse gap-1 flex-1">
                    {HEADER_FIELDS.map((f) => (
                      <div
                        key={f.label}
                        className="rounded-lg border px-2 py-2 text-center flex-1"
                        style={{ background: f.color, borderColor: f.border }}
                      >
                        <p className="text-xs font-mono text-zinc-300 whitespace-nowrap">{f.label}</p>
                        {f.note && <p className="text-[10px] text-zinc-600 mt-0.5 whitespace-nowrap">{f.note}</p>}
                      </div>
                    ))}
                  </div>

                  {/* pointer */}
                  <div className="flex flex-col items-center mx-2 shrink-0">
                    <div className="flex-1 border-l-2 border-dashed border-rose-500/40" />
                    <div className="text-[10px] font-mono text-rose-400 rotate-90 whitespace-nowrap my-1">pointer</div>
                    <div className="flex-1 border-l-2 border-dashed border-rose-500/40" />
                  </div>

                  {/* data (right, read forwards) */}
                  <div className="flex gap-1 flex-1">
                    {DATA_FIELDS.map((f) => (
                      <div
                        key={f.label}
                        className="rounded-lg border px-2 py-2 text-center flex-1"
                        style={{ background: f.color, borderColor: f.border }}
                      >
                        <p className="text-xs font-mono text-zinc-300 whitespace-nowrap">{f.label}</p>
                        {f.note && <p className="text-[10px] text-zinc-500 mt-0.5 whitespace-nowrap">{f.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* direction arrows */}
                <div className="flex mt-2 min-w-[480px]">
                  <div className="flex-1 text-center text-[10px] text-zinc-700 font-mono">← 역방향으로 읽음 (header)</div>
                  <div className="w-8 shrink-0" />
                  <div className="flex-1 text-center text-[10px] text-zinc-700 font-mono">정방향으로 읽음 (data) →</div>
                </div>
              </div>
            </div>

            {/* key insight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-xs font-semibold text-amber-300 mb-2">Self-describing format이 아님</p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  record 자체에 &quot;여기까지가 헤더&quot;라는 표시가 없습니다.
                  InnoDB가 <span className="text-zinc-300">인덱스 스키마(데이터 딕셔너리)</span>를 이미 알기 때문에
                  VARCHAR 길이, NULL 컬럼 수를 계산해 파싱합니다.
                </p>
              </div>
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                <p className="text-xs font-semibold text-violet-300 mb-2">인덱스 스키마 기준으로 파싱</p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  테이블에 VARCHAR 컬럼이 3개여도,
                  Secondary Index에 1개만 있으면 가변길이 목록엔 1개 엔트리만 들어갑니다.
                  파싱 기준은 <span className="text-zinc-300">테이블 스키마가 아닌 인덱스 스키마</span>입니다.
                </p>
              </div>
            </div>

            {/* struct equivalent */}
            <div className="mt-4">
              <p className="text-xs font-mono text-zinc-600 mb-2">개념적으로 이런 C struct</p>
              <div className="rounded-lg border border-white/10 bg-black/30 p-4 font-mono text-xs text-zinc-300 leading-relaxed">
                <pre>{`struct SecondaryIndexRecord {
  RecordHeader header;   // 고정 5B + NULL bitmap + 가변길이 목록
  byte[]  email;         // 인덱스 컬럼
  int64   id;            // Primary Key → Clustered Index 포인터
};`}</pre>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── COMPARE ────────────────────────────────────────────────── */}
        {tab === "compare" && (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              같은 테이블이라도 Secondary Index leaf와 Clustered Index leaf에 저장되는 내용이 다릅니다.
            </p>

            {/* index leaf comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {INDEX_TYPES.map((idx) => (
                <div
                  key={idx.name}
                  className="rounded-xl border p-4"
                  style={{ background: idx.color, borderColor: idx.border }}
                >
                  <p className="text-xs font-mono text-zinc-400 mb-0.5">{idx.sub}</p>
                  <p className="text-sm font-bold text-white mb-3">{idx.name} Leaf</p>
                  <div className="flex gap-1 flex-wrap">
                    {idx.fields.map((f) => (
                      <div
                        key={f.label}
                        className={`rounded border px-2 py-1 text-center ${
                          f.highlight
                            ? "border-rose-500/40 bg-rose-500/10"
                            : "border-white/10 bg-white/[0.03]"
                        }`}
                      >
                        <p className={`text-xs font-mono font-semibold ${f.highlight ? "text-rose-300" : "text-zinc-400"}`}>
                          {f.label}
                        </p>
                        <p className="text-[10px] text-zinc-600">{f.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* query flow */}
            <div>
              <p className="text-xs font-mono text-zinc-600 mb-3">조회 흐름</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-zinc-600 font-mono">모드:</span>
                <button
                  onClick={() => setShowCovering(true)}
                  className={`px-2 py-1 rounded text-xs font-mono transition-colors ${showCovering ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-zinc-500 border border-white/10"}`}
                >
                  Covering Index
                </button>
                <button
                  onClick={() => setShowCovering(false)}
                  className={`px-2 py-1 rounded text-xs font-mono transition-colors ${!showCovering ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "text-zinc-500 border border-white/10"}`}
                >
                  Non-Covering
                </button>
              </div>

              <div className="flex items-start gap-2 flex-wrap">
                {/* step 1 */}
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 text-xs font-mono">
                  <p className="text-rose-400 font-semibold">Secondary Index</p>
                  <p className="text-zinc-500 mt-0.5">leaf: [email | pk]</p>
                  <p className="text-zinc-600 mt-0.5">B+Tree traverse</p>
                </div>

                <div className="flex flex-col items-center justify-center self-center">
                  <span className="text-zinc-600 text-sm">→</span>
                  <span className="text-[10px] text-zinc-700 font-mono">
                    {showCovering ? "컬럼 충족" : "컬럼 부족"}
                  </span>
                </div>

                {showCovering ? (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs font-mono">
                    <p className="text-emerald-400 font-semibold">끝 — Using index</p>
                    <p className="text-zinc-500 mt-0.5">I/O 1회</p>
                    <p className="text-zinc-600 mt-0.5">Random I/O 없음</p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs font-mono">
                      <p className="text-amber-400 font-semibold">Random I/O</p>
                      <p className="text-zinc-500 mt-0.5">PK로 Clustered Index</p>
                      <p className="text-zinc-600 mt-0.5">다른 페이지 위치</p>
                    </div>
                    <span className="text-zinc-600 text-sm self-center">→</span>
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs font-mono">
                      <p className="text-emerald-400 font-semibold">Clustered Index</p>
                      <p className="text-zinc-500 mt-0.5">leaf: 모든 컬럼</p>
                      <p className="text-zinc-600 mt-0.5">I/O 2회+</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
