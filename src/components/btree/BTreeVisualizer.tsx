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
    subtitle: "1, 2, 3, 4, 5를 차수 3 B-Tree에 삽입 — 노드가 꽉 차면 분열됩니다",
    steps: [
      {
        label: "1, 2 삽입",
        description:
          "루트 노드에 1, 2가 들어갑니다. 차수 3 B-Tree는 노드당 최대 2개의 키를 가집니다.",
        insertingKey: 2,
        nodes: [{ id: "root", keys: [1, 2], x: 300, y: 60, isLeaf: true }],
        edges: [],
      },
      {
        label: "3 삽입 → Split 발생",
        description:
          "3을 삽입하면 노드가 [1,2,3]이 돼 overflow. 중간값 2가 위로 올라가고 노드가 둘로 분열됩니다.",
        insertingKey: 3,
        nodes: [
          { id: "root", keys: [2], x: 300, y: 60, isLeaf: false },
          {
            id: "left",
            keys: [1],
            x: 160,
            y: 160,
            isLeaf: true,
            isNew: true,
          },
          {
            id: "right",
            keys: [3],
            x: 440,
            y: 160,
            isLeaf: true,
            isNew: true,
          },
        ],
        edges: [
          { from: "root", to: "left" },
          { from: "root", to: "right" },
        ],
      },
      {
        label: "4 삽입",
        description:
          "4는 루트의 2보다 크므로 오른쪽 리프(3)에 삽입됩니다. [3,4] — 아직 공간 있음.",
        insertingKey: 4,
        nodes: [
          { id: "root", keys: [2], x: 300, y: 60, isLeaf: false },
          { id: "left", keys: [1], x: 160, y: 160, isLeaf: true },
          { id: "right", keys: [3, 4], x: 440, y: 160, isLeaf: true },
        ],
        edges: [
          { from: "root", to: "left" },
          { from: "root", to: "right" },
        ],
      },
      {
        label: "5 삽입 → Split 연쇄",
        description:
          "5 삽입 시 오른쪽 리프가 overflow. 중간값 4가 루트로 올라가고 [3], [5]로 분열됩니다.",
        insertingKey: 5,
        nodes: [
          { id: "root", keys: [2, 4], x: 300, y: 60, isLeaf: false },
          { id: "n1", keys: [1], x: 100, y: 160, isLeaf: true },
          { id: "n2", keys: [3], x: 300, y: 160, isLeaf: true, isNew: true },
          { id: "n3", keys: [5], x: 500, y: 160, isLeaf: true, isNew: true },
        ],
        edges: [
          { from: "root", to: "n1" },
          { from: "root", to: "n2" },
          { from: "root", to: "n3" },
        ],
      },
    ],
  },
  {
    title: "검색 경로 추적",
    subtitle: "값 4를 검색할 때 Root → Branch → Leaf 순서로 내려갑니다",
    steps: [
      {
        label: "루트에서 시작",
        description:
          "루트 노드의 키 [2, 4]와 비교합니다. 루트/Branch 노드는 거의 항상 Buffer Pool(메모리)에 상주합니다.",
        highlight: [],
        nodes: [
          { id: "root", keys: [2, 4], x: 300, y: 60, isLeaf: false },
          { id: "n1", keys: [1], x: 100, y: 160, isLeaf: true },
          { id: "n2", keys: [3], x: 300, y: 160, isLeaf: true },
          { id: "n3", keys: [5], x: 500, y: 160, isLeaf: true },
        ],
        edges: [
          { from: "root", to: "n1" },
          { from: "root", to: "n2" },
          { from: "root", to: "n3" },
        ],
      },
      {
        label: "4 ≤ 4 → 오른쪽으로",
        description:
          "찾는 값 4가 루트의 두 번째 키 4와 같거나 크면 세 번째 포인터를 따라 내려갑니다.",
        highlight: [4],
        nodes: [
          {
            id: "root",
            keys: [2, 4],
            x: 300,
            y: 60,
            isLeaf: false,
            isSplitting: true,
          },
          { id: "n1", keys: [1], x: 100, y: 160, isLeaf: true },
          { id: "n2", keys: [3], x: 300, y: 160, isLeaf: true },
          { id: "n3", keys: [5], x: 500, y: 160, isLeaf: true },
        ],
        edges: [
          { from: "root", to: "n1" },
          { from: "root", to: "n2" },
          { from: "root", to: "n3" },
        ],
      },
      {
        label: "리프에서 발견!",
        description:
          "리프 노드 [5]에서 4를 찾지 못하고, 인접 리프를 확인합니다. B+Tree는 리프가 연결 리스트로 연결되어 있어 범위 탐색이 효율적입니다.",
        highlight: [4],
        nodes: [
          { id: "root", keys: [2, 4], x: 300, y: 60, isLeaf: false },
          { id: "n1", keys: [1], x: 100, y: 160, isLeaf: true },
          { id: "n2", keys: [3], x: 300, y: 160, isLeaf: true },
          {
            id: "n3",
            keys: [4, 5],
            x: 500,
            y: 160,
            isLeaf: true,
            isSplitting: true,
          },
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
          <svg width="100%" viewBox="0 0 600 240" className="block">
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
                      fill={node.isLeaf ? "rgba(161,161,170,0.5)" : "rgba(139,92,246,0.5)"}
                      fontSize={9}
                      fontFamily="monospace"
                    >
                      {node.isLeaf ? "leaf" : "branch"}
                    </text>
                  </motion.g>
                );
              })}
            </AnimatePresence>
          </svg>
        </div>

        {/* step info */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-rose-400">
                Step {stepIdx + 1}/{scenario.steps.length}
              </span>
              <span className="text-white text-sm font-semibold">{step.label}</span>
              {step.insertingKey !== undefined && (
                <span className="text-xs font-mono bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded px-1.5 py-0.5">
                  insert {step.insertingKey}
                </span>
              )}
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-lg">
              {step.description}
            </p>
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
