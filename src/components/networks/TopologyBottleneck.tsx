"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type TopoType = "star" | "bus" | "ring" | "mesh";

interface TopoDef {
  id: TopoType;
  nameKo: string;
  nameEn: string;
  descKo: string;
  descEn: string;
  bottleneckKo: string;
  bottleneckEn: string;
}

const TOPOS: TopoDef[] = [
  {
    id: "star",
    nameKo: "스타형",
    nameEn: "Star",
    descKo:
      "모든 노드가 중앙 허브/스위치에 연결. 관리가 쉽지만 중앙 장비가 SPOF(Single Point of Failure).",
    descEn:
      "All nodes connect to a central hub/switch. Easy to manage but the center is a SPOF (Single Point of Failure).",
    bottleneckKo:
      "병목: 중앙 스위치에 트래픽 집중 → 스위치 용량 초과 시 전체 네트워크 마비",
    bottleneckEn:
      "Bottleneck: Traffic concentrated at central switch → entire network down if switch is overwhelmed",
  },
  {
    id: "bus",
    nameKo: "버스형",
    nameEn: "Bus",
    descKo:
      "하나의 공유 케이블에 모든 노드가 연결. 구조가 단순하지만 충돌(collision)이 잦고, 케이블 단절 시 전체 장애.",
    descEn:
      "All nodes share a single cable. Simple but prone to collisions. A cable break takes down the entire network.",
    bottleneckKo:
      "병목: 공유 매체에서 동시 전송 시 충돌 → 재전송으로 지연 폭증",
    bottleneckEn:
      "Bottleneck: Simultaneous transmissions cause collisions → retransmissions explode latency",
  },
  {
    id: "ring",
    nameKo: "링형",
    nameEn: "Ring",
    descKo:
      "각 노드가 양쪽 이웃에 연결되어 고리를 형성. 토큰 패싱으로 충돌 방지. 한 노드 장애 시 고리 끊김.",
    descEn:
      "Each node connects to two neighbors forming a loop. Token passing avoids collisions. One node failure breaks the ring.",
    bottleneckKo:
      "병목: 단일 장애 노드가 전체 링 통신 차단 (Dual Ring으로 완화 가능)",
    bottleneckEn:
      "Bottleneck: Single node failure blocks the entire ring (mitigated by Dual Ring)",
  },
  {
    id: "mesh",
    nameKo: "메시형",
    nameEn: "Mesh",
    descKo:
      "노드들이 다중 경로로 연결. 내결함성이 높고 병목이 적지만 비용이 높음. 인터넷 백본에 사용.",
    descEn:
      "Nodes connected via multiple paths. High fault tolerance, fewer bottlenecks, but expensive. Used in internet backbone.",
    bottleneckKo:
      "병목: 특정 게이트웨이로의 경로가 집중될 때 발생 → 회선 추가로 해소",
    bottleneckEn:
      "Bottleneck: Occurs when routes concentrate at a gateway → resolved by adding links",
  },
];

// Node positions for each topology (relative % coordinates)
const NODE_POSITIONS: Record<TopoType, { x: number; y: number }[]> = {
  star: [
    { x: 50, y: 50 }, // center
    { x: 50, y: 15 },
    { x: 80, y: 35 },
    { x: 80, y: 65 },
    { x: 50, y: 85 },
    { x: 20, y: 65 },
    { x: 20, y: 35 },
  ],
  bus: [
    { x: 15, y: 50 },
    { x: 30, y: 50 },
    { x: 45, y: 50 },
    { x: 60, y: 50 },
    { x: 75, y: 50 },
    { x: 85, y: 50 },
  ],
  ring: [
    { x: 50, y: 15 },
    { x: 80, y: 35 },
    { x: 80, y: 65 },
    { x: 50, y: 85 },
    { x: 20, y: 65 },
    { x: 20, y: 35 },
  ],
  mesh: [
    { x: 30, y: 20 },
    { x: 70, y: 20 },
    { x: 85, y: 50 },
    { x: 70, y: 80 },
    { x: 30, y: 80 },
    { x: 15, y: 50 },
  ],
};

// Edges for each topology [fromIdx, toIdx]
const EDGES: Record<TopoType, [number, number][]> = {
  star: [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
  ],
  bus: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
  ],
  ring: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 0],
  ],
  mesh: [
    [0, 1],
    [0, 2],
    [0, 5],
    [1, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 0],
    [0, 3],
    [1, 4],
    [2, 5],
  ],
};

const KO = {
  title: "네트워크 토폴로지",
  bottleneck: "병목 시뮬레이션",
  startSim: "▶ 병목 시뮬레이션",
  resetSim: "↺ 리셋",
  cloudNote:
    "☁️ 클라우드에서는? — 물리 토폴로지는 추상화되어 보이지 않지만, 논리적 토폴로지(VPC, 서브넷, 라우트 테이블)는 여전히 동일한 원리로 동작합니다.",
  solutionNote:
    "💡 해결: 대역폭 증설만으로 안 될 때, 토폴로지를 확인하고 게이트웨이로 이어지는 회선을 추가합니다.",
};

const EN = {
  title: "Network Topology",
  bottleneck: "Bottleneck Simulation",
  startSim: "▶ Simulate Bottleneck",
  resetSim: "↺ Reset",
  cloudNote:
    "☁️ In the cloud? — Physical topology is abstracted away, but logical topology (VPC, subnets, route tables) still operates on the same principles.",
  solutionNote:
    "💡 Solution: When bandwidth upgrades alone don't help, check topology and add links to congested gateways.",
};

export default function TopologyBottleneck() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;
  const [selectedTopo, setSelectedTopo] = useState<TopoType>("star");
  const [simulating, setSimulating] = useState(false);
  const [congested, setCongested] = useState<number[]>([]);

  const topo = TOPOS.find((tp) => tp.id === selectedTopo)!;
  const nodes = NODE_POSITIONS[selectedTopo];
  const edges = EDGES[selectedTopo];

  useEffect(() => {
    if (!simulating) {
      setCongested([]);
      return;
    }

    // Simulate congestion based on topology type
    const timer = setTimeout(() => {
      switch (selectedTopo) {
        case "star":
          setCongested([0]); // center node
          break;
        case "bus":
          setCongested([2, 3]); // middle of bus
          break;
        case "ring":
          setCongested([2]); // one node fails
          break;
        case "mesh":
          setCongested([2]); // gateway node
          break;
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [simulating, selectedTopo]);

  const startSim = () => setSimulating(true);
  const resetSim = () => setSimulating(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      {/* topology tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {TOPOS.map((tp) => (
          <button
            key={tp.id}
            onClick={() => {
              setSelectedTopo(tp.id);
              setSimulating(false);
            }}
            className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
              selectedTopo === tp.id
                ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                : "border-white/10 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {lang === "ko" ? tp.nameKo : tp.nameEn}
          </button>
        ))}
      </div>

      {/* description */}
      <p className="text-xs text-zinc-400 leading-relaxed mb-4">
        {lang === "ko" ? topo.descKo : topo.descEn}
      </p>

      {/* topology graph SVG */}
      <div className="relative w-full h-48 mb-4 rounded-xl border border-white/5 bg-zinc-900/50">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* edges */}
          {edges.map(([from, to], i) => {
            const isCongested =
              simulating &&
              (congested.includes(from) || congested.includes(to));
            return (
              <line
                key={i}
                x1={nodes[from].x}
                y1={nodes[from].y}
                x2={nodes[to].x}
                y2={nodes[to].y}
                stroke={isCongested ? "#ef4444" : "#374151"}
                strokeWidth={isCongested ? 0.8 : 0.4}
                className="transition-all duration-500"
              />
            );
          })}
          {/* nodes */}
          {nodes.map((node, i) => {
            const isCongested = simulating && congested.includes(i);
            return (
              <g key={i}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={selectedTopo === "star" && i === 0 ? 4 : 3}
                  fill={isCongested ? "#ef4444" : "#3b82f6"}
                  opacity={isCongested ? 1 : 0.7}
                  className="transition-all duration-500"
                />
                {isCongested && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={6}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={0.3}
                    opacity={0.6}
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* bottleneck info */}
      {simulating && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 mb-4 transition-all">
          <p className="text-xs text-red-300 font-mono">
            {lang === "ko" ? topo.bottleneckKo : topo.bottleneckEn}
          </p>
        </div>
      )}

      {/* sim controls */}
      <div className="flex gap-2 mb-4">
        {!simulating ? (
          <button
            onClick={startSim}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors"
          >
            {t.startSim}
          </button>
        ) : (
          <button
            onClick={resetSim}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-zinc-600 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {t.resetSim}
          </button>
        )}
      </div>

      {/* cloud note */}
      <div className="space-y-2">
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            {t.solutionNote}
          </p>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            {t.cloudNote}
          </p>
        </div>
      </div>
    </div>
  );
}
