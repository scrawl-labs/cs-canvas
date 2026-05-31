"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

type HeapKind = "min" | "max";

const cmp = (kind: HeapKind, a: number, b: number) =>
  kind === "min" ? a < b : a > b;

function siftUpTrace(arr: number[], i: number, kind: HeapKind): number[] {
  const trace: number[] = [i];
  const a = [...arr];
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (cmp(kind, a[i], a[p])) {
      [a[i], a[p]] = [a[p], a[i]];
      i = p;
      trace.push(i);
    } else break;
  }
  return trace;
}

function siftDownTrace(arr: number[], i: number, n: number, kind: HeapKind): number[] {
  const trace: number[] = [i];
  const a = [...arr];
  while (true) {
    const l = 2 * i + 1,
      r = 2 * i + 2;
    let best = i;
    if (l < n && cmp(kind, a[l], a[best])) best = l;
    if (r < n && cmp(kind, a[r], a[best])) best = r;
    if (best === i) break;
    [a[i], a[best]] = [a[best], a[i]];
    i = best;
    trace.push(i);
  }
  return trace;
}

function applySiftUp(arr: number[], from: number, kind: HeapKind): number[] {
  const a = [...arr];
  let i = from;
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (cmp(kind, a[i], a[p])) {
      [a[i], a[p]] = [a[p], a[i]];
      i = p;
    } else break;
  }
  return a;
}

function applySiftDown(arr: number[], from: number, kind: HeapKind): number[] {
  const a = [...arr];
  const n = a.length;
  let i = from;
  while (true) {
    const l = 2 * i + 1,
      r = 2 * i + 2;
    let best = i;
    if (l < n && cmp(kind, a[l], a[best])) best = l;
    if (r < n && cmp(kind, a[r], a[best])) best = r;
    if (best === i) break;
    [a[i], a[best]] = [a[best], a[i]];
    i = best;
  }
  return a;
}

const COLORS = {
  normal: { fill: "rgba(52, 211, 153, 0.15)", stroke: "rgb(52, 211, 153)" },
  trail: { fill: "rgba(251, 191, 36, 0.25)", stroke: "rgb(251, 191, 36)" },
  current: { fill: "rgba(251, 146, 60, 0.35)", stroke: "rgb(251, 146, 60)" },
  removed: { fill: "rgba(239, 68, 68, 0.25)", stroke: "rgb(239, 68, 68)" },
};

const T = {
  ko: {
    title: "Heap 인터랙티브",
    placeholder: "값 입력 (예: 7)",
    insert: "Insert",
    extract: "Extract",
    reset: "초기화",
    preset: "예시 힙",
    minHeap: "Min-Heap",
    maxHeap: "Max-Heap",
    arrayView: "배열 표현",
    treeView: "트리 표현",
    size: "크기:",
    status: {
      idle: "값을 입력하고 Insert를 누르면 siftUp 애니메이션이 나옵니다.",
      insertDone: (v: number) => `${v} 삽입 — 끝에 추가 후 siftUp으로 부모와 비교하며 위로`,
      extractDone: (v: number) =>
        `${v} 추출 — 마지막을 루트로 옮긴 후 siftDown으로 자식과 비교하며 아래로`,
      empty: "힙이 비어 있습니다",
      invalid: "정수를 입력해 주세요",
    },
  },
  en: {
    title: "Heap Interactive",
    placeholder: "Enter a value (e.g., 7)",
    insert: "Insert",
    extract: "Extract",
    reset: "Reset",
    preset: "Sample Heap",
    minHeap: "Min-Heap",
    maxHeap: "Max-Heap",
    arrayView: "Array view",
    treeView: "Tree view",
    size: "Size:",
    status: {
      idle: "Enter a value and press Insert to see siftUp animate.",
      insertDone: (v: number) => `Inserted ${v} — appended at end, sifted up by comparing to parent`,
      extractDone: (v: number) =>
        `Extracted ${v} — moved last to root, sifted down by comparing with children`,
      empty: "Heap is empty",
      invalid: "Please enter an integer",
    },
  },
};

export default function HeapVisualizer() {
  const { lang } = useLanguage();
  const t = T[lang === "ko" ? "ko" : "en"];

  const [arr, setArr] = useState<number[]>([]);
  const [kind, setKind] = useState<HeapKind>("min");
  const [input, setInput] = useState("");
  const [trailIndices, setTrailIndices] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [status, setStatus] = useState(t.status.idle);
  const animTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => () => {
    if (animTimer.current) clearTimeout(animTimer.current);
  }, []);

  function clearAnim() {
    if (animTimer.current) clearTimeout(animTimer.current);
    animTimer.current = null;
  }

  function animateTrace(trace: number[], finalArr: number[]) {
    clearAnim();
    setTrailIndices([]);
    setCurrentIdx(trace[0]);
    let step = 1;
    const tick = () => {
      if (step >= trace.length) {
        setArr(finalArr);
        setCurrentIdx(null);
        setTrailIndices([]);
        return;
      }
      setTrailIndices((prev) => [...prev, trace[step - 1]]);
      setCurrentIdx(trace[step]);
      step++;
      animTimer.current = setTimeout(tick, 450);
    };
    animTimer.current = setTimeout(tick, 450);
  }

  function onInsert() {
    if (input.trim() === "") return;
    const v = parseInt(input, 10);
    if (isNaN(v)) {
      setStatus(t.status.invalid);
      return;
    }
    const appended = [...arr, v];
    setArr(appended);
    const trace = siftUpTrace(appended, appended.length - 1, kind);
    const finalArr = applySiftUp(appended, appended.length - 1, kind);
    setStatus(t.status.insertDone(v));
    setInput("");
    animateTrace(trace, finalArr);
  }

  function onExtract() {
    if (arr.length === 0) return;
    const root = arr[0];
    if (arr.length === 1) {
      setArr([]);
      setStatus(t.status.extractDone(root));
      return;
    }
    // move last to root
    const next = [...arr];
    next[0] = next[next.length - 1];
    next.pop();
    const trace = siftDownTrace(next, 0, next.length, kind);
    const finalArr = applySiftDown(next, 0, kind);
    setArr(next);
    setStatus(t.status.extractDone(root));
    animateTrace(trace, finalArr);
  }

  function onReset() {
    clearAnim();
    setArr([]);
    setTrailIndices([]);
    setCurrentIdx(null);
    setStatus(t.status.idle);
    setInput("");
  }

  function onPreset() {
    clearAnim();
    const seed = kind === "min" ? [1, 3, 5, 4, 8, 6, 9, 7, 12, 10] : [50, 30, 40, 10, 20, 35, 25];
    // Build properly with siftDown
    let a = [...seed];
    for (let i = (a.length >> 1) - 1; i >= 0; i--) {
      a = applySiftDown(a, i, kind);
    }
    setArr(a);
    setTrailIndices([]);
    setCurrentIdx(null);
    setStatus(t.status.idle);
  }

  function toggleKind(next: HeapKind) {
    if (next === kind) return;
    clearAnim();
    // Re-heapify with new kind
    let a = [...arr];
    for (let i = (a.length >> 1) - 1; i >= 0; i--) {
      a = applySiftDown(a, i, next);
    }
    setKind(next);
    setArr(a);
    setTrailIndices([]);
    setCurrentIdx(null);
  }

  // Tree positions for complete binary tree of size n
  const depth = arr.length === 0 ? 0 : Math.floor(Math.log2(arr.length)) + 1;
  const NODE_R = 22;
  const V_SPACING = 70;
  const PAD = 30;
  const widthByLevel = (lvl: number) => Math.pow(2, lvl);
  const svgWidth = Math.max(560, widthByLevel(depth - 1) * 54 + PAD * 2);
  const svgHeight = Math.max(160, depth * V_SPACING + PAD * 2);

  function posOf(i: number): { x: number; y: number } {
    if (i === 0) return { x: svgWidth / 2, y: PAD };
    const level = Math.floor(Math.log2(i + 1));
    const posInLevel = i - (Math.pow(2, level) - 1);
    const slots = Math.pow(2, level);
    const slotWidth = (svgWidth - PAD * 2) / slots;
    const x = PAD + slotWidth * posInLevel + slotWidth / 2;
    const y = PAD + level * V_SPACING;
    return { x, y };
  }

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-sm font-mono text-emerald-300 font-semibold">{t.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => toggleKind("min")}
            className={`px-3 py-1 text-[10px] font-mono rounded border transition-colors ${
              kind === "min"
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-zinc-700 bg-zinc-900/60 text-zinc-500 hover:bg-zinc-800"
            }`}
          >
            {t.minHeap}
          </button>
          <button
            onClick={() => toggleKind("max")}
            className={`px-3 py-1 text-[10px] font-mono rounded border transition-colors ${
              kind === "max"
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-zinc-700 bg-zinc-900/60 text-zinc-500 hover:bg-zinc-800"
            }`}
          >
            {t.maxHeap}
          </button>
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
        <button onClick={onExtract} className="px-3 py-1.5 text-[11px] font-mono rounded border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors">
          ⤴ {t.extract}
        </button>
        <button onClick={onPreset} className="px-3 py-1.5 text-[11px] font-mono rounded border border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 transition-colors">
          {t.preset}
        </button>
        <button onClick={onReset} className="px-3 py-1.5 text-[11px] font-mono rounded border border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 transition-colors">
          ↺ {t.reset}
        </button>
      </div>

      {/* Status */}
      <div className="rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2 mb-3 text-[11px] font-mono text-zinc-400 min-h-[32px]">
        {status}
      </div>

      {/* Array view */}
      <div className="mb-3">
        <div className="text-[10px] font-mono text-zinc-500 mb-1.5">
          {t.arrayView} <span className="text-zinc-600">({t.size} {arr.length})</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {arr.length === 0 && (
            <span className="text-[10px] font-mono text-zinc-600 italic">{t.status.empty}</span>
          )}
          {arr.map((v, i) => {
            const isCurrent = currentIdx === i;
            const isTrail = trailIndices.includes(i);
            const color = isCurrent
              ? COLORS.current
              : isTrail
                ? COLORS.trail
                : COLORS.normal;
            return (
              <motion.div
                key={`${i}`}
                layout
                className="flex flex-col items-center"
              >
                <div
                  className="w-10 h-10 flex items-center justify-center text-[12px] font-mono rounded border"
                  style={{
                    backgroundColor: color.fill,
                    borderColor: color.stroke,
                    color: isCurrent || isTrail ? color.stroke : "rgb(229, 231, 235)",
                  }}
                >
                  {v}
                </div>
                <span className="text-[9px] font-mono text-zinc-600 mt-0.5">{i}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tree view */}
      <div>
        <div className="text-[10px] font-mono text-zinc-500 mb-1.5">{t.treeView}</div>
        <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/40">
          <svg width={svgWidth} height={svgHeight} className="block">
            {/* edges */}
            {arr.map((_, i) => {
              if (i === 0) return null;
              const p = (i - 1) >> 1;
              const from = posOf(p);
              const to = posOf(i);
              return (
                <line
                  key={`e-${i}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={1.5}
                />
              );
            })}

            {/* nodes */}
            <AnimatePresence>
              {arr.map((v, i) => {
                const p = posOf(i);
                const isCurrent = currentIdx === i;
                const isTrail = trailIndices.includes(i);
                const color = isCurrent
                  ? COLORS.current
                  : isTrail
                    ? COLORS.trail
                    : COLORS.normal;
                return (
                  <motion.g
                    key={`n-${i}-${v}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: p.x,
                      y: p.y,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <circle
                      r={NODE_R}
                      fill={color.fill}
                      stroke={color.stroke}
                      strokeWidth={isCurrent || isTrail ? 2.5 : 1.5}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[12px] font-mono"
                      fill={isCurrent || isTrail ? color.stroke : "rgb(229, 231, 235)"}
                      fontWeight={isCurrent || isTrail ? 700 : 500}
                    >
                      {v}
                    </text>
                  </motion.g>
                );
              })}
            </AnimatePresence>

            {arr.length === 0 && (
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
      </div>
    </div>
  );
}
