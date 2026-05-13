"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface BTreeNode {
  keys: number[];
  id: string;
  isLeaf: boolean;
  isNew?: boolean;
  isSplitting?: boolean;
}

interface BTreeEdge {
  from: string;
  to: string;
}

interface BTreeStep {
  label: string;
  description: string;
  nodes: (BTreeNode & { x: number; y: number })[];
  edges: BTreeEdge[];
  highlight?: number[];
  insertingKey?: number;
}

const SCENARIOS: {
  title: string;
  subtitle: string;
  steps: BTreeStep[];
}[] = [
  {
    title: "순차 삽입 & Split",
    subtitle: "1, 2, 3, 4, 5를 차수 3 B+Tree에 삽입 — 리프 분열 시 separator를 COPY합니다",
    steps: [
      {
        label: "1, 2 삽입",
        description:
          "루트 노드(리프)에 1, 2가 들어갑니다. 차수 3 B+Tree는 노드당 최대 2개의 키를 가집니다.",
        insertingKey: 2,
        nodes: [{ id: "root", keys: [1, 2], x: 260, y: 80, isLeaf: true }],
        edges: [],
      },
      {
        label: "3 삽입 → Leaf Split (COPY)",
        description:
          "3을 삽입하면 리프가 [1,2,3] overflow. B+Tree는 중간값 2를 '복사(COPY)'해서 internal node로 올립니다. 2는 separator로도 존재하고, 오른쪽 리프 [2,3]에도 실제 데이터로 남습니다. B-Tree와 다른 점입니다.",
        insertingKey: 3,
        nodes: [
          { id: "root", keys: [2], x: 260, y: 60, isLeaf: false },
          { id: "left", keys: [1], x: 80, y: 155, isLeaf: true, isNew: true },
          { id: "right", keys: [2, 3], x: 400, y: 155, isLeaf: true, isNew: true },
        ],
        edges: [
          { from: "root", to: "left" },
          { from: "root", to: "right" },
        ],
      },
      {
        label: "4 삽입 → Leaf Split (COPY)",
        description:
          "4는 2보다 크므로 오른쪽 리프 [2,3]에 삽입 → [2,3,4] overflow. 중간값 3을 COPY해 루트가 [2,3]이 됩니다. 3은 새로운 오른쪽 리프에도 남습니다.",
        insertingKey: 4,
        nodes: [
          { id: "root", keys: [2, 3], x: 220, y: 60, isLeaf: false },
          { id: "n1", keys: [1], x: 40, y: 155, isLeaf: true },
          { id: "n2", keys: [2], x: 190, y: 155, isLeaf: true, isNew: true },
          { id: "n3", keys: [3, 4], x: 400, y: 155, isLeaf: true, isNew: true },
        ],
        edges: [
          { from: "root", to: "n1" },
          { from: "root", to: "n2" },
          { from: "root", to: "n3" },
        ],
      },
      {
        label: "5 삽입 → Root Split",
        description:
          "5가 [3,4]에 들어가 overflow → 4를 COPY해 루트로 올리면 루트가 [2,3,4] overflow. 루트를 분열할 땐 internal node 규칙이 적용돼 중간값 3이 MOVE(이동)됩니다. 리프는 4개, 트리가 3단계가 됩니다.",
        insertingKey: 5,
        nodes: [
          { id: "root", keys: [3], x: 250, y: 15, isLeaf: false },
          { id: "lb", keys: [2], x: 80, y: 105, isLeaf: false, isNew: true },
          { id: "rb", keys: [4], x: 400, y: 105, isLeaf: false, isNew: true },
          { id: "n1", keys: [1], x: 10, y: 185, isLeaf: true },
          { id: "n2", keys: [2], x: 120, y: 185, isLeaf: true },
          { id: "n3", keys: [3], x: 330, y: 185, isLeaf: true, isNew: true },
          { id: "n4", keys: [4, 5], x: 450, y: 185, isLeaf: true, isNew: true },
        ],
        edges: [
          { from: "root", to: "lb" },
          { from: "root", to: "rb" },
          { from: "lb", to: "n1" },
          { from: "lb", to: "n2" },
          { from: "rb", to: "n3" },
          { from: "rb", to: "n4" },
        ],
      },
    ],
  },
  {
    title: "검색 경로 추적",
    subtitle: "값 4를 검색 — B+Tree에서 internal node의 키는 라우팅용 구분자, 실제 데이터는 항상 리프에만 있습니다",
    steps: [
      {
        label: "루트 키는 구분자(separator)일 뿐",
        description:
          "B+Tree internal node(루트/브랜치)의 키는 '실제 데이터'가 아니라 어느 서브트리로 내려갈지 안내하는 라우팅 구분자입니다. 루트에 4가 보여도, 실제 row는 리프로 내려가야 찾을 수 있습니다.",
        highlight: [],
        nodes: [
          { id: "root", keys: [2, 4], x: 260, y: 60, isLeaf: false },
          { id: "n1", keys: [1], x: 60, y: 160, isLeaf: true },
          { id: "n2", keys: [2, 3], x: 240, y: 160, isLeaf: true },
          { id: "n3", keys: [4, 5], x: 440, y: 160, isLeaf: true },
        ],
        edges: [
          { from: "root", to: "n1" },
          { from: "root", to: "n2" },
          { from: "root", to: "n3" },
        ],
      },
      {
        label: "4 ≥ 4 → n3 포인터로 이동",
        description:
          "탐색값 4가 루트의 두 번째 구분자 4 이상이므로 세 번째 포인터(n3)를 따라 내려갑니다. 루트는 경로를 알려줄 뿐, 여기서 탐색이 끝나지 않습니다.",
        highlight: [4],
        nodes: [
          { id: "root", keys: [2, 4], x: 260, y: 60, isLeaf: false, isSplitting: true },
          { id: "n1", keys: [1], x: 60, y: 160, isLeaf: true },
          { id: "n2", keys: [2, 3], x: 240, y: 160, isLeaf: true },
          { id: "n3", keys: [4, 5], x: 440, y: 160, isLeaf: true },
        ],
        edges: [
          { from: "root", to: "n1" },
          { from: "root", to: "n2" },
          { from: "root", to: "n3" },
        ],
      },
      {
        label: "리프 n3에서 4 발견",
        description:
          "n3 리프 노드에서 실제 데이터 키 4를 찾았습니다. B+Tree는 실제 레코드(row)가 항상 리프에만 존재합니다. 리프들은 연결 리스트로 연결되어 있어 범위 탐색(4 이상 전체) 도 연속으로 스캔할 수 있습니다.",
        highlight: [4],
        nodes: [
          { id: "root", keys: [2, 4], x: 260, y: 60, isLeaf: false },
          { id: "n1", keys: [1], x: 60, y: 160, isLeaf: true },
          { id: "n2", keys: [2, 3], x: 240, y: 160, isLeaf: true },
          { id: "n3", keys: [4, 5], x: 440, y: 160, isLeaf: true, isSplitting: true },
        ],
        edges: [
          { from: "root", to: "n1" },
          { from: "root", to: "n2" },
          { from: "root", to: "n3" },
        ],
      },
    ],
  },
];

const NODE_W = 80;
const NODE_H = 36;

function getNodeCenter(x: number, y: number) {
  return { cx: x + NODE_W / 2, cy: y + NODE_H / 2 };
}

export default function BTreeVisualizer() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  const scenario = SCENARIOS[scenarioIdx];
  const step = scenario.steps[stepIdx];

  function goNext() {
    if (stepIdx < scenario.steps.length - 1) {
      setStepIdx((s) => s + 1);
    }
  }
  function goPrev() {
    if (stepIdx > 0) setStepIdx((s) => s - 1);
  }
  function changeScenario(idx: number) {
    setScenarioIdx(idx);
    setStepIdx(0);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      {/* scenario tabs */}
      <div className="flex border-b border-white/10">
        {SCENARIOS.map((s, i) => (
          <button
            key={i}
            onClick={() => changeScenario(i)}
            className={`px-4 py-3 text-xs font-mono transition-colors ${
              scenarioIdx === i
                ? "text-white border-b-2 border-rose-500 bg-white/[0.04]"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="p-6">
        <p className="text-xs text-zinc-500 mb-6 font-mono">{scenario.subtitle}</p>

        {/* SVG canvas */}
        <div className="relative bg-black/20 rounded-xl border border-white/5 mb-6 overflow-hidden">
          <svg width="100%" viewBox="0 0 600 250" className="block">
            {/* edges */}
            {step.edges.map((edge) => {
              const fromNode = step.nodes.find((n) => n.id === edge.from);
              const toNode = step.nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              const { cx: x1, cy: y1 } = getNodeCenter(fromNode.x, fromNode.y);
              const { cx: x2, cy: y2 } = getNodeCenter(toNode.x, toNode.y);
              return (
                <motion.line
                  key={`${edge.from}-${edge.to}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x1={x1}
                  y1={y1 + NODE_H / 2}
                  x2={x2}
                  y2={y2 - NODE_H / 2}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth={1.5}
                />
              );
            })}

            {/* nodes */}
            <AnimatePresence mode="popLayout">
              {step.nodes.map((node) => {
                const isHighlighted = node.isSplitting;
                const isNew = node.isNew;
                return (
                  <motion.g
                    key={node.id}
                    initial={isNew ? { opacity: 0, scale: 0.7 } : { opacity: 1 }}
                    animate={{ opacity: 1, scale: 1, x: node.x, y: node.y }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {/* node box */}
                    <rect
                      width={NODE_W}
                      height={NODE_H}
                      rx={6}
                      fill={
                        isHighlighted
                          ? "rgba(244,63,94,0.18)"
                          : node.isLeaf
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(139,92,246,0.12)"
                      }
                      stroke={
                        isHighlighted
                          ? "rgba(244,63,94,0.6)"
                          : node.isLeaf
                          ? "rgba(255,255,255,0.12)"
                          : "rgba(139,92,246,0.4)"
                      }
                      strokeWidth={1.5}
                    />

                    {/* dividers between keys */}
                    {node.keys.length > 1 &&
                      node.keys.slice(0, -1).map((_, i) => (
                        <line
                          key={i}
                          x1={NODE_W * ((i + 1) / node.keys.length)}
                          y1={4}
                          x2={NODE_W * ((i + 1) / node.keys.length)}
                          y2={NODE_H - 4}
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth={1}
                        />
                      ))}

                    {/* key labels */}
                    {node.keys.map((key, i) => (
                      <text
                        key={i}
                        x={NODE_W * ((i + 0.5) / node.keys.length)}
                        y={NODE_H / 2 + 1}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isHighlighted ? "#fb7185" : "#e4e4e7"}
                        fontSize={13}
                        fontFamily="monospace"
                        fontWeight={600}
                      >
                        {key}
                      </text>
                    ))}

                    {/* leaf/branch label */}
                    <text
                      x={NODE_W / 2}
                      y={NODE_H + 12}
                      textAnchor="middle"
                      fill={node.isLeaf ? "rgba(161,161,170,0.4)" : "rgba(139,92,246,0.5)"}
                      fontSize={9}
                      fontFamily="monospace"
                    >
                      {node.isLeaf ? "leaf · 실제 데이터" : "separator · 라우팅만"}
                    </text>
                  </motion.g>
                );
              })}
            </AnimatePresence>
          </svg>
        </div>

        {/* step info */}
        <div className="flex flex-col gap-3">
          {/* top row: step counter + buttons */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono text-rose-400 shrink-0">
                Step {stepIdx + 1}/{scenario.steps.length}
              </span>
              <span className="text-white text-sm font-semibold truncate">{step.label}</span>
              {step.insertingKey !== undefined && (
                <span className="text-xs font-mono bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded px-1.5 py-0.5 shrink-0">
                  insert {step.insertingKey}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={goPrev}
                disabled={stepIdx === 0}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-zinc-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-mono"
              >
                ← prev
              </button>
              <button
                onClick={goNext}
                disabled={stepIdx === scenario.steps.length - 1}
                className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs text-rose-400 hover:bg-rose-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-mono"
              >
                next →
              </button>
            </div>
          </div>
          {/* description */}
          <p className="text-zinc-400 text-xs leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* step dots */}
        <div className="flex gap-1.5 mt-4">
          {scenario.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStepIdx(i)}
              className={`h-1 rounded-full transition-all ${
                i === stepIdx ? "w-6 bg-rose-500" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
