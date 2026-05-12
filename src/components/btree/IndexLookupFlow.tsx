"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export type LookupMode = "normal" | "covering";

interface NodeDef {
  x: number;
  y: number;
  topLabel: string;
  bottomLabel: string;
  isLeaf: boolean;
}

const W = 76;
const H = 30;
const MEM_Y = 155;

const IDX: Record<string, NodeDef> = {
  root:  { x: 112, y: 38,  topLabel: "root",   bottomLabel: "email_idx", isLeaf: false },
  bL:    { x: 50,  y: 113, topLabel: "branch", bottomLabel: "A – M",    isLeaf: false },
  bR:    { x: 172, y: 113, topLabel: "branch", bottomLabel: "N – Z",    isLeaf: false },
  l1:    { x: 14,  y: 193, topLabel: "leaf",   bottomLabel: "kim→12",   isLeaf: true  },
  l2:    { x: 98,  y: 193, topLabel: "leaf",   bottomLabel: "lee→583",  isLeaf: true  },
  l3:    { x: 178, y: 193, topLabel: "leaf",   bottomLabel: "park→91",  isLeaf: true  },
};

const DATA: Record<string, NodeDef> = {
  root:  { x: 466, y: 38,  topLabel: "root",   bottomLabel: "PRIMARY",  isLeaf: false },
  bL:    { x: 404, y: 113, topLabel: "branch", bottomLabel: "1 – 300",  isLeaf: false },
  bR:    { x: 526, y: 113, topLabel: "branch", bottomLabel: "301–999",  isLeaf: false },
  l1:    { x: 368, y: 193, topLabel: "leaf",   bottomLabel: "pk=12",    isLeaf: true  },
  l2:    { x: 452, y: 193, topLabel: "leaf",   bottomLabel: "pk=583",   isLeaf: true  },
  l3:    { x: 536, y: 193, topLabel: "leaf",   bottomLabel: "pk=91",    isLeaf: true  },
};

const IDX_EDGES = [["root","bL"],["root","bR"],["bL","l1"],["bL","l2"],["bR","l3"]];
const DATA_EDGES = [["root","bL"],["root","bR"],["bL","l1"],["bL","l2"],["bR","l3"]];

function cx(n: NodeDef) { return n.x + W / 2; }
function cy(n: NodeDef) { return n.y + H / 2; }

interface Step {
  label: string;
  description: string;
  idxHL: string[];
  dataHL: string[];
  arrow: boolean;
  tag: string;
  tagColor: string;
  done?: boolean;
}

const NORMAL: Step[] = [
  {
    label: "인덱스 Root 탐색",
    description: "Root 노드는 Buffer Pool에 항상 상주합니다. 디스크 접근 없이 메모리에서 키를 비교합니다.",
    idxHL: ["root"], dataHL: [], arrow: false,
    tag: "Buffer Pool", tagColor: "text-violet-400",
  },
  {
    label: "Branch 탐색 (메모리)",
    description: "'lee@...'는 N-Z 범위이므로 bR 포인터를 따라 내려갑니다. Branch도 자주 접근되어 거의 항상 캐시됩니다.",
    idxHL: ["root", "bR"], dataHL: [], arrow: false,
    tag: "Buffer Pool", tagColor: "text-violet-400",
  },
  {
    label: "Leaf 도달 — PK 획득",
    description: "인덱스 Leaf에는 (email, PK=583)만 있습니다. 실제 row 데이터는 없어요. Leaf는 LRU eviction 대상이라 Disk I/O가 발생할 수 있습니다.",
    idxHL: ["l2"], dataHL: [], arrow: false,
    tag: "Disk I/O 가능", tagColor: "text-amber-400",
  },
  {
    label: "Random I/O — Data B+Tree 접근",
    description: "PK=583으로 클러스터드 인덱스(Data B+Tree)에 접근합니다. 인덱스 Leaf와 Data 페이지는 물리적으로 다른 위치 → 랜덤 I/O 발생. 이게 인덱스가 있어도 느려질 수 있는 핵심 이유입니다.",
    idxHL: ["l2"], dataHL: ["root"], arrow: true,
    tag: "Random I/O", tagColor: "text-rose-400",
  },
  {
    label: "Data B+Tree에서 실제 Row 반환",
    description: "Data B+Tree를 내려가 pk=583의 실제 row를 읽습니다. 이 페이지도 캐시에 없으면 추가 Disk I/O. SELECT *이고 대량 조회면 이 비용이 N번 반복됩니다.",
    idxHL: [], dataHL: ["root", "bR", "l2"], arrow: false,
    tag: "Disk I/O", tagColor: "text-rose-400",
  },
];

const COVERING: Step[] = [
  {
    label: "인덱스 Root 탐색",
    description: "Root 노드 탐색. Buffer Pool에 상주. 디스크 접근 없음.",
    idxHL: ["root"], dataHL: [], arrow: false,
    tag: "Buffer Pool", tagColor: "text-violet-400",
  },
  {
    label: "Branch 탐색 (메모리)",
    description: "Branch도 메모리 캐시. 포인터를 따라 내려갑니다.",
    idxHL: ["root", "bR"], dataHL: [], arrow: false,
    tag: "Buffer Pool", tagColor: "text-violet-400",
  },
  {
    label: "Leaf — 모든 컬럼 있음, 여기서 끝",
    description: "SELECT email, status → 인덱스 (status, email)에 두 컬럼 모두 포함됩니다. Data B+Tree에 접근할 이유가 없습니다. EXPLAIN Extra: Using index.",
    idxHL: ["l2"], dataHL: [], arrow: false,
    tag: "Using index", tagColor: "text-emerald-400",
    done: true,
  },
];

function Nodes({
  nodes, edges, hl, isCovering, done, prefix,
}: {
  nodes: Record<string, NodeDef>;
  edges: string[][];
  hl: string[];
  isCovering?: boolean;
  done?: boolean;
  prefix: string;
}) {
  return (
    <>
      {edges.map(([f, t]) => {
        const fn = nodes[f], tn = nodes[t];
        if (!fn || !tn) return null;
        return (
          <line
            key={`${prefix}-${f}-${t}`}
            x1={cx(fn)} y1={fn.y + H}
            x2={cx(tn)} y2={tn.y}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1.5}
          />
        );
      })}
      {Object.entries(nodes).map(([id, node]) => {
        const isHL = hl.includes(id);
        const inMem = node.y < MEM_Y;

        let border = inMem ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.08)";
        let bg = node.isLeaf ? "rgba(255,255,255,0.02)" : "rgba(139,92,246,0.06)";
        let textFill = "#71717a";

        if (isHL) {
          if (done || isCovering) {
            border = "rgba(52,211,153,0.6)"; bg = "rgba(52,211,153,0.08)"; textFill = "#6ee7b7";
          } else {
            border = "rgba(244,63,94,0.6)";  bg = "rgba(244,63,94,0.08)";  textFill = "#fb7185";
          }
        }

        return (
          <g key={`${prefix}-${id}`}>
            <motion.rect
              x={node.x} y={node.y} width={W} height={H} rx={5}
              animate={{ fill: bg, stroke: border }}
              transition={{ duration: 0.25 }}
              strokeWidth={1.5}
            />
            <text x={cx(node)} y={node.y + H / 2 - 5}
              textAnchor="middle"
              fill={inMem && !isHL ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.2)"}
              fontSize={7} fontFamily="monospace"
            >
              {node.topLabel}
            </text>
            <motion.text
              x={cx(node)} y={node.y + H / 2 + 6}
              textAnchor="middle"
              animate={{ fill: textFill }}
              transition={{ duration: 0.25 }}
              fontSize={9} fontFamily="monospace" fontWeight={600}
            >
              {node.bottomLabel}
            </motion.text>
          </g>
        );
      })}
    </>
  );
}

interface Props {
  initialMode?: LookupMode;
  showToggle?: boolean;
}

export default function IndexLookupFlow({ initialMode = "normal", showToggle = true }: Props) {
  const [mode, setMode] = useState<LookupMode>(initialMode);
  const [step, setStep] = useState(0);

  const steps = mode === "covering" ? COVERING : NORMAL;
  const cur = steps[Math.min(step, steps.length - 1)];

  function switchMode(m: LookupMode) { setMode(m); setStep(0); }

  // Arrow: index l2 right edge → data root left edge
  const fromX = IDX.l2.x + W;
  const fromY = IDX.l2.y + H / 2;
  const toX   = DATA.root.x;
  const toY   = DATA.root.y + H / 2;
  const arrowPath = `M ${fromX} ${fromY} C ${fromX + 90} ${fromY} ${toX - 90} ${toY} ${toX} ${toY}`;
  const labelX = (fromX + toX) / 2;
  const labelY = (fromY + toY) / 2 - 14;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      {showToggle && (
        <div className="flex border-b border-white/10">
          {(["normal", "covering"] as LookupMode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`px-4 py-2.5 text-xs font-mono transition-colors ${
                mode === m
                  ? "text-white border-b-2 border-rose-500 bg-white/[0.04]"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {m === "normal" ? "일반 인덱스" : "커버링 인덱스"}
            </button>
          ))}
        </div>
      )}

      <div className="p-6">
        <div className="relative bg-black/20 rounded-xl border border-white/5 mb-5 overflow-hidden">
          <svg width="100%" viewBox="0 0 640 265" className="block">
            {/* zones */}
            <rect x={0} y={0} width={640} height={MEM_Y} fill="rgba(139,92,246,0.04)" />
            <rect x={0} y={MEM_Y} width={640} height={265 - MEM_Y} fill="rgba(0,0,0,0.18)" />
            <line x1={0} y1={MEM_Y} x2={640} y2={MEM_Y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4 3" />

            {/* zone labels */}
            <text x={8} y={13} fill="rgba(139,92,246,0.45)" fontSize={8} fontFamily="monospace">Buffer Pool (메모리)</text>
            <text x={8} y={MEM_Y + 13} fill="rgba(255,255,255,0.18)" fontSize={8} fontFamily="monospace">Disk</text>

            {/* tree labels */}
            <text x={150} y={26} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={9} fontFamily="monospace">
              Index B+Tree (보조 인덱스)
            </text>
            <text x={504} y={26} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={9} fontFamily="monospace">
              Data B+Tree (클러스터드)
            </text>

            {/* leaf linked-list hint */}
            <line x1={IDX.l1.x + W} y1={IDX.l1.y + H / 2} x2={IDX.l2.x} y2={IDX.l2.y + H / 2}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="2 2" />
            <line x1={IDX.l2.x + W} y1={IDX.l2.y + H / 2} x2={IDX.l3.x} y2={IDX.l3.y + H / 2}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="2 2" />
            <line x1={DATA.l1.x + W} y1={DATA.l1.y + H / 2} x2={DATA.l2.x} y2={DATA.l2.y + H / 2}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="2 2" />
            <line x1={DATA.l2.x + W} y1={DATA.l2.y + H / 2} x2={DATA.l3.x} y2={DATA.l3.y + H / 2}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="2 2" />

            {/* index tree */}
            <Nodes nodes={IDX} edges={IDX_EDGES} hl={cur.idxHL} isCovering={mode === "covering"} done={cur.done} prefix="idx" />

            {/* data tree */}
            <Nodes nodes={DATA} edges={DATA_EDGES} hl={cur.dataHL} prefix="data" />

            {/* random I/O arrow */}
            {cur.arrow && (
              <motion.g key="arrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.path
                  d={arrowPath}
                  fill="none"
                  stroke="rgba(244,63,94,0.65)"
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7 }}
                />
                <polygon
                  points={`${toX},${toY} ${toX - 7},${toY - 4} ${toX - 7},${toY + 4}`}
                  fill="rgba(244,63,94,0.65)"
                />
                <text x={labelX} y={labelY} textAnchor="middle"
                  fill="rgba(244,63,94,0.75)" fontSize={8} fontFamily="monospace">
                  Random I/O
                </text>
              </motion.g>
            )}

            {/* covering done — stop indicator */}
            {mode === "covering" && cur.done && (
              <motion.g key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect
                  x={IDX.l2.x + W + 6} y={IDX.l2.y - 2}
                  width={68} height={H + 4} rx={4}
                  fill="rgba(52,211,153,0.08)" stroke="rgba(52,211,153,0.35)" strokeWidth={1}
                />
                <text x={IDX.l2.x + W + 40} y={IDX.l2.y + H / 2 + 4}
                  textAnchor="middle" fill="rgba(52,211,153,0.75)" fontSize={8} fontFamily="monospace">
                  Using index
                </text>
              </motion.g>
            )}
          </svg>
        </div>

        {/* step info */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-xs font-mono ${cur.tagColor}`}>{cur.tag}</span>
              <span className="text-white text-sm font-semibold">{cur.label}</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">{cur.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed font-mono transition-all"
            >
              ← prev
            </button>
            <button
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              disabled={step === steps.length - 1}
              className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs text-rose-400 hover:bg-rose-500/20 disabled:opacity-30 disabled:cursor-not-allowed font-mono transition-all"
            >
              next →
            </button>
          </div>
        </div>

        <div className="flex gap-1.5 mt-4">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1 rounded-full transition-all ${
                i === step ? "w-6 bg-rose-500" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
