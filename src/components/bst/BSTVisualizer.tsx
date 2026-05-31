"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

type BSTNode = {
  key: number;
  id: string; // stable id for animations
  left: BSTNode | null;
  right: BSTNode | null;
};

let _nextId = 0;
const newId = () => `n${_nextId++}`;

function insertNode(root: BSTNode | null, key: number): BSTNode {
  if (root === null) return { key, id: newId(), left: null, right: null };
  if (key === root.key) return root;
  if (key < root.key) return { ...root, left: insertNode(root.left, key) };
  return { ...root, right: insertNode(root.right, key) };
}

function minNode(node: BSTNode): BSTNode {
  while (node.left) node = node.left;
  return node;
}

function deleteNode(root: BSTNode | null, key: number): BSTNode | null {
  if (root === null) return null;
  if (key < root.key) return { ...root, left: deleteNode(root.left, key) };
  if (key > root.key) return { ...root, right: deleteNode(root.right, key) };
  // found
  if (!root.left) return root.right;
  if (!root.right) return root.left;
  const succ = minNode(root.right);
  return {
    ...root,
    key: succ.key, // copy key (keep id of root)
    right: deleteNode(root.right, succ.key),
  };
}

function findPath(root: BSTNode | null, key: number): string[] {
  const path: string[] = [];
  let cur = root;
  while (cur) {
    path.push(cur.id);
    if (key === cur.key) return path;
    cur = key < cur.key ? cur.left : cur.right;
  }
  return path; // last node = NULL position (not found)
}

// Layout: in-order traversal assigns x indices, depth assigns y.
type LayoutNode = { node: BSTNode; x: number; y: number };

function layout(root: BSTNode | null): { nodes: LayoutNode[]; edges: { from: string; to: string; x1: number; y1: number; x2: number; y2: number }[]; width: number; height: number } {
  const nodes: LayoutNode[] = [];
  const edges: { from: string; to: string; x1: number; y1: number; x2: number; y2: number }[] = [];
  let counter = 0;
  let maxDepth = 0;

  function walk(node: BSTNode | null, depth: number) {
    if (!node) return;
    walk(node.left, depth + 1);
    const x = counter++;
    nodes.push({ node, x, y: depth });
    if (depth > maxDepth) maxDepth = depth;
    walk(node.right, depth + 1);
  }
  walk(root, 0);

  // Build edges using parent-child relationships
  function findLayoutById(id: string): LayoutNode | undefined {
    return nodes.find((n) => n.node.id === id);
  }
  for (const ln of nodes) {
    if (ln.node.left) {
      const child = findLayoutById(ln.node.left.id);
      if (child) edges.push({ from: ln.node.id, to: child.node.id, x1: ln.x, y1: ln.y, x2: child.x, y2: child.y });
    }
    if (ln.node.right) {
      const child = findLayoutById(ln.node.right.id);
      if (child) edges.push({ from: ln.node.id, to: child.node.id, x1: ln.x, y1: ln.y, x2: child.x, y2: child.y });
    }
  }

  return { nodes, edges, width: Math.max(1, counter), height: maxDepth + 1 };
}

const COLORS = {
  normal: { fill: "rgba(52, 211, 153, 0.15)", stroke: "rgb(52, 211, 153)" },
  highlight: { fill: "rgba(251, 191, 36, 0.25)", stroke: "rgb(251, 191, 36)" },
  found: { fill: "rgba(34, 197, 94, 0.3)", stroke: "rgb(34, 197, 94)" },
  notFound: { fill: "rgba(239, 68, 68, 0.25)", stroke: "rgb(239, 68, 68)" },
};

const T = {
  ko: {
    title: "BST 인터랙티브",
    placeholder: "값 입력 (예: 50)",
    insert: "삽입",
    delete: "삭제",
    search: "검색",
    reset: "초기화",
    preset: "예시 트리",
    status: {
      idle: "값을 입력하고 버튼을 눌러보세요. 같은 값은 중복 무시됨.",
      insert: (v: number) => `${v} 삽입 — 비교하며 내려가다 NULL 자리에 부착`,
      delete: (v: number, found: boolean) =>
        found ? `${v} 삭제 — 3가지 케이스 중 하나로 처리됨` : `${v} 없음 — 삭제할 노드 X`,
      search: (v: number, found: boolean) =>
        found ? `${v} 찾음 ✓` : `${v} 없음 — NULL 지점까지 탐색 후 종료`,
      invalid: "정수를 입력해 주세요",
      empty: "트리가 비어 있습니다",
    },
    inorder: "In-order:",
    nodeCount: "노드 수:",
    height: "높이:",
  },
  en: {
    title: "BST Interactive",
    placeholder: "Enter a value (e.g., 50)",
    insert: "Insert",
    delete: "Delete",
    search: "Search",
    reset: "Reset",
    preset: "Sample Tree",
    status: {
      idle: "Enter a value and pick an action. Duplicates are ignored.",
      insert: (v: number) => `Inserted ${v} — walked down comparisons and attached at NULL`,
      delete: (v: number, found: boolean) =>
        found ? `Deleted ${v} — handled by one of the three cases` : `${v} not in tree — nothing to delete`,
      search: (v: number, found: boolean) =>
        found ? `Found ${v} ✓` : `${v} not found — search reached a NULL slot`,
      invalid: "Please enter an integer",
      empty: "Tree is empty",
    },
    inorder: "In-order:",
    nodeCount: "Nodes:",
    height: "Height:",
  },
};

function inorderList(root: BSTNode | null): number[] {
  const out: number[] = [];
  const walk = (n: BSTNode | null) => {
    if (!n) return;
    walk(n.left);
    out.push(n.key);
    walk(n.right);
  };
  walk(root);
  return out;
}

function treeHeight(root: BSTNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(treeHeight(root.left), treeHeight(root.right));
}

export default function BSTVisualizer() {
  const { lang } = useLanguage();
  const t = T[lang === "ko" ? "ko" : "en"];

  const [root, setRoot] = useState<BSTNode | null>(null);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<string>(t.status.idle);
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);
  const [resultClass, setResultClass] = useState<"highlight" | "found" | "notFound">("highlight");
  const animTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => () => {
    if (animTimer.current) clearTimeout(animTimer.current);
  }, []);

  function animatePath(path: string[], finalClass: "found" | "notFound", onDone?: () => void) {
    setResultClass("highlight");
    setHighlightedIds([]);
    if (animTimer.current) clearTimeout(animTimer.current);
    let step = 0;
    const tick = () => {
      if (step >= path.length) {
        setResultClass(finalClass);
        if (onDone) onDone();
        return;
      }
      setHighlightedIds(path.slice(0, step + 1));
      step++;
      animTimer.current = setTimeout(tick, 350);
    };
    tick();
  }

  function parseInput(): number | null {
    if (input.trim() === "") return null;
    const v = parseInt(input, 10);
    if (isNaN(v)) {
      setStatus(t.status.invalid);
      return null;
    }
    return v;
  }

  function onInsert() {
    const v = parseInput();
    if (v === null) return;
    const path = findPath(root, v);
    setRoot(insertNode(root, v));
    setStatus(t.status.insert(v));
    animatePath(path, "found");
    setInput("");
  }

  function onDelete() {
    const v = parseInput();
    if (v === null) return;
    const path = findPath(root, v);
    const last = path[path.length - 1];
    const lastNode = last
      ? (() => {
          const find = (n: BSTNode | null): BSTNode | null => {
            if (!n) return null;
            if (n.id === last) return n;
            return find(n.left) ?? find(n.right);
          };
          return find(root);
        })()
      : null;
    const found = lastNode !== null && lastNode.key === v;
    if (found) setRoot(deleteNode(root, v));
    setStatus(t.status.delete(v, found));
    animatePath(path, found ? "found" : "notFound");
    setInput("");
  }

  function onSearch() {
    const v = parseInput();
    if (v === null) return;
    const path = findPath(root, v);
    const last = path[path.length - 1];
    const lastNode = last
      ? (() => {
          const find = (n: BSTNode | null): BSTNode | null => {
            if (!n) return null;
            if (n.id === last) return n;
            return find(n.left) ?? find(n.right);
          };
          return find(root);
        })()
      : null;
    const found = lastNode !== null && lastNode.key === v;
    setStatus(t.status.search(v, found));
    animatePath(path, found ? "found" : "notFound");
  }

  function onReset() {
    setRoot(null);
    setHighlightedIds([]);
    setStatus(t.status.idle);
    setInput("");
  }

  function onPreset() {
    const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];
    let r: BSTNode | null = null;
    for (const v of values) r = insertNode(r, v);
    setRoot(r);
    setHighlightedIds([]);
    setStatus(t.status.idle);
    setInput("");
  }

  const { nodes, edges, width, height } = useMemo(() => layout(root), [root]);

  const NODE_R = 22;
  const H_SPACING = 56;
  const V_SPACING = 70;
  const PAD = 36;
  const svgWidth = Math.max(560, width * H_SPACING + PAD * 2);
  const svgHeight = Math.max(180, height * V_SPACING + PAD * 2);

  const xOf = (lx: number) => PAD + lx * H_SPACING;
  const yOf = (ly: number) => PAD + ly * V_SPACING;

  const inorder = inorderList(root);

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono text-emerald-300 font-semibold">{t.title}</h3>
        <div className="flex gap-4 text-[10px] font-mono text-zinc-500">
          <span>{t.nodeCount} <span className="text-emerald-400">{nodes.length}</span></span>
          <span>{t.height} <span className="text-emerald-400">{treeHeight(root)}</span></span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") onInsert();
          }}
          className="flex-1 min-w-[120px] px-3 py-1.5 text-[11px] font-mono bg-zinc-900/60 border border-zinc-700 rounded text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60"
        />
        <button onClick={onInsert} className="px-3 py-1.5 text-[11px] font-mono rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors">
          + {t.insert}
        </button>
        <button onClick={onDelete} className="px-3 py-1.5 text-[11px] font-mono rounded border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors">
          − {t.delete}
        </button>
        <button onClick={onSearch} className="px-3 py-1.5 text-[11px] font-mono rounded border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors">
          🔍 {t.search}
        </button>
        <button onClick={onPreset} className="px-3 py-1.5 text-[11px] font-mono rounded border border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 transition-colors">
          {t.preset}
        </button>
        <button onClick={onReset} className="px-3 py-1.5 text-[11px] font-mono rounded border border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 transition-colors">
          ↺ {t.reset}
        </button>
      </div>

      {/* Status bar */}
      <div className="rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2 mb-3 text-[11px] font-mono text-zinc-400 min-h-[32px]">
        {status}
      </div>

      {/* SVG canvas */}
      <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/40">
        <svg width={svgWidth} height={svgHeight} className="block">
          {/* Edges */}
          {edges.map((e) => (
            <line
              key={`${e.from}-${e.to}`}
              x1={xOf(e.x1)}
              y1={yOf(e.y1)}
              x2={xOf(e.x2)}
              y2={yOf(e.y2)}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={1.5}
            />
          ))}

          {/* Nodes */}
          <AnimatePresence>
            {nodes.map((ln) => {
              const isHighlighted = highlightedIds.includes(ln.node.id);
              const isLastInPath = highlightedIds[highlightedIds.length - 1] === ln.node.id;
              const color = !isHighlighted
                ? COLORS.normal
                : isLastInPath
                  ? COLORS[resultClass]
                  : COLORS.highlight;
              return (
                <motion.g
                  key={ln.node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: xOf(ln.x),
                    y: yOf(ln.y),
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <circle
                    r={NODE_R}
                    fill={color.fill}
                    stroke={color.stroke}
                    strokeWidth={isHighlighted ? 2.5 : 1.5}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-[12px] font-mono"
                    fill={isHighlighted ? color.stroke : "rgb(229, 231, 235)"}
                    fontWeight={isHighlighted ? 700 : 500}
                  >
                    {ln.node.key}
                  </text>
                </motion.g>
              );
            })}
          </AnimatePresence>

          {nodes.length === 0 && (
            <text
              x={svgWidth / 2}
              y={svgHeight / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(255,255,255,0.25)"
              className="text-[11px] font-mono"
            >
              {t.status.empty}
            </text>
          )}
        </svg>
      </div>

      {/* In-order output */}
      {nodes.length > 0 && (
        <div className="mt-3 text-[11px] font-mono">
          <span className="text-zinc-500">{t.inorder} </span>
          <span className="text-emerald-300">[{inorder.join(", ")}]</span>
        </div>
      )}
    </div>
  );
}
