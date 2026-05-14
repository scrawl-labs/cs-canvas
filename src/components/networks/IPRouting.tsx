"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// ─── Types ───────────────────────────────────────────────────────────────────

interface RouteEntry {
  destination: string;
  nextHop: string;
  iface: string;
  matched: boolean;
}

interface Step {
  activeNodeIndex: number; // which node holds the packet
  packetFrom: number;      // -1 = none
  packetTo: number;        // -1 = none
  routingTable: RouteEntry[] | null;
  headlineKo: string;
  headlineEn: string;
  descKo: string;
  descEn: string;
}

interface Scenario {
  nodes: string[];
  sublabels: string[];
  steps: Step[];
}

// ─── Simple Scenario ─────────────────────────────────────────────────────────

const SIMPLE: Scenario = {
  nodes: ["PC", "Router A", "Router B", "Server"],
  sublabels: ["192.168.1.10", "10.0.0.1", "10.0.1.1", "10.0.2.5"],
  steps: [
    {
      activeNodeIndex: 0,
      packetFrom: -1,
      packetTo: -1,
      routingTable: null,
      headlineKo: "패킷 생성 — 목적지: 10.0.2.5",
      headlineEn: "Packet Created — Destination: 10.0.2.5",
      descKo: "PC가 서버(10.0.2.5)로 보낼 패킷을 만듭니다. PC의 라우팅 테이블에는 10.0.2.5와 매칭되는 구체적인 경로가 없으므로 기본 경로(0.0.0.0/0)를 통해 Router A로 전달합니다.",
      descEn: "The PC creates a packet for 10.0.2.5. Its routing table has no specific match, so it uses the default route (0.0.0.0/0) and forwards to Router A.",
    },
    {
      activeNodeIndex: 1,
      packetFrom: 0,
      packetTo: 1,
      routingTable: [
        { destination: "10.0.2.0/24", nextHop: "10.0.1.2", iface: "eth1", matched: false },
        { destination: "10.0.0.0/8",  nextHop: "10.0.1.2", iface: "eth1", matched: false },
        { destination: "0.0.0.0/0",   nextHop: "—",         iface: "eth0", matched: true  },
      ],
      headlineKo: "Router A — 기본 경로로 전달",
      headlineEn: "Router A — Forwarded via Default Route",
      descKo: "Router A가 라우팅 테이블을 조회합니다. 가장 구체적인 경로(longest prefix match)를 우선합니다. 10.0.2.0/24와 10.0.0.0/8 모두 매칭되지 않으므로 기본 경로(0.0.0.0/0)로 Router B에 전달합니다.",
      descEn: "Router A checks its routing table using longest prefix match. Neither 10.0.2.0/24 nor 10.0.0.0/8 match, so it falls back to the default route (0.0.0.0/0) and forwards to Router B.",
    },
    {
      activeNodeIndex: 2,
      packetFrom: 1,
      packetTo: 2,
      routingTable: [
        { destination: "10.0.2.0/24", nextHop: "10.0.2.5", iface: "eth1", matched: true  },
        { destination: "10.0.0.0/8",  nextHop: "10.0.0.1", iface: "eth0", matched: false },
        { destination: "0.0.0.0/0",   nextHop: "10.0.0.1", iface: "eth0", matched: false },
      ],
      headlineKo: "Router B — 최장 접두사 매칭",
      headlineEn: "Router B — Longest Prefix Match",
      descKo: "Router B의 테이블에서 10.0.2.0/24가 목적지 10.0.2.5와 매칭됩니다. 10.0.0.0/8보다 더 구체적(prefix 길이 24 > 8)이므로 이 경로가 선택됩니다. 패킷을 서버로 직접 전달합니다.",
      descEn: "Router B finds 10.0.2.0/24 matching 10.0.2.5. It's more specific than 10.0.0.0/8 (prefix length 24 > 8), so this route wins. Packet delivered directly to the server.",
    },
    {
      activeNodeIndex: 3,
      packetFrom: 2,
      packetTo: 3,
      routingTable: null,
      headlineKo: "서버 도착",
      headlineEn: "Packet Arrived at Server",
      descKo: "패킷이 서버(10.0.2.5)에 도착했습니다. 각 라우터는 전체 경로를 몰라도 됩니다 — 다음 홉(next hop)만 알면 충분합니다. 이것이 홉-바이-홉 라우팅의 핵심입니다.",
      descEn: "The packet reaches the server (10.0.2.5). Each router only needed to know the next hop — not the full path. This is the essence of hop-by-hop routing.",
    },
  ],
};

// ─── Real World Scenario ──────────────────────────────────────────────────────

const REAL_WORLD: Scenario = {
  nodes: ["PC", "Home Router", "ISP Router", "Backbone", "CDN Edge", "Server"],
  sublabels: ["192.168.1.10", "NAT / 203.0.113.1", "AS7922", "AS3356 (Lumen)", "Cloudflare PoP", "104.21.0.1"],
  steps: [
    {
      activeNodeIndex: 0,
      packetFrom: -1,
      packetTo: -1,
      routingTable: null,
      headlineKo: "패킷 생성 — 목적지: 104.21.0.1",
      headlineEn: "Packet Created — Destination: 104.21.0.1",
      descKo: "PC(사설 IP 192.168.1.10)가 104.21.0.1로 패킷을 전송합니다. 목적지가 같은 서브넷이 아니므로 기본 게이트웨이(홈 라우터)로 패킷을 전달합니다.",
      descEn: "PC (private IP 192.168.1.10) sends a packet to 104.21.0.1. The destination is outside the local subnet, so it forwards to the default gateway — the home router.",
    },
    {
      activeNodeIndex: 1,
      packetFrom: 0,
      packetTo: 1,
      routingTable: [
        { destination: "192.168.1.0/24", nextHop: "—",            iface: "LAN",  matched: false },
        { destination: "0.0.0.0/0",       nextHop: "ISP Gateway",  iface: "WAN",  matched: true  },
      ],
      headlineKo: "Home Router — NAT 변환",
      headlineEn: "Home Router — NAT Translation",
      descKo: "홈 라우터가 패킷의 출발지 IP를 사설 주소(192.168.1.10)에서 공인 IP(203.0.113.1)로 교체합니다. 이것이 NAT(Network Address Translation)입니다. 공인 IP만이 인터넷에서 라우팅 가능합니다.",
      descEn: "The home router replaces the private source IP (192.168.1.10) with a public IP (203.0.113.1). This is NAT. Only public IPs are routable on the internet.",
    },
    {
      activeNodeIndex: 2,
      packetFrom: 1,
      packetTo: 2,
      routingTable: [
        { destination: "104.21.0.0/16",  nextHop: "Backbone peer", iface: "uplink", matched: true  },
        { destination: "0.0.0.0/0",       nextHop: "Backbone peer", iface: "uplink", matched: false },
      ],
      headlineKo: "ISP Router — BGP 경로 선택",
      headlineEn: "ISP Router — BGP Route Selection",
      descKo: "ISP 라우터(AS7922)는 BGP로 수신한 경로 중 104.21.0.0/16이 Cloudflare 소유임을 알고 있습니다. 백본 피어(AS3356)로 패킷을 전달합니다.",
      descEn: "The ISP router (AS7922) knows via BGP that 104.21.0.0/16 belongs to Cloudflare. It forwards to its backbone peer (AS3356).",
    },
    {
      activeNodeIndex: 3,
      packetFrom: 2,
      packetTo: 3,
      routingTable: [
        { destination: "104.21.0.0/20",  nextHop: "CDN PoP",  iface: "peering", matched: true  },
        { destination: "104.21.0.0/16",  nextHop: "CDN PoP",  iface: "peering", matched: false },
      ],
      headlineKo: "Backbone — 더 구체적인 경로 선택",
      headlineEn: "Backbone — More Specific Route Wins",
      descKo: "Tier-1 백본(AS3356)은 Cloudflare로부터 여러 prefix를 수신합니다. /20이 /16보다 더 구체적이므로 최장 접두사 매칭에 의해 /20 경로가 선택됩니다. 가장 가까운 CDN PoP으로 전달합니다.",
      descEn: "The Tier-1 backbone receives multiple prefixes from Cloudflare. /20 is more specific than /16, so the longest prefix match picks /20. Packet goes to the nearest CDN PoP.",
    },
    {
      activeNodeIndex: 4,
      packetFrom: 3,
      packetTo: 4,
      routingTable: null,
      headlineKo: "CDN Edge — 애니캐스트 라우팅",
      headlineEn: "CDN Edge — Anycast Routing",
      descKo: "104.21.0.1은 Cloudflare의 애니캐스트 IP입니다. 전 세계 수백 개의 PoP이 동일한 IP를 광고합니다. BGP가 자동으로 가장 가까운 PoP으로 패킷을 유도한 것입니다. 여기서 캐시된 응답을 반환하거나 오리진 서버로 전달합니다.",
      descEn: "104.21.0.1 is Cloudflare's anycast IP. Hundreds of PoPs worldwide advertise the same IP. BGP automatically routed to the nearest one. The PoP serves a cached response or pulls from the origin.",
    },
    {
      activeNodeIndex: 5,
      packetFrom: 4,
      packetTo: 5,
      routingTable: null,
      headlineKo: "서버 도착",
      headlineEn: "Packet Arrived at Server",
      descKo: "패킷이 목적지에 도달했습니다. 인터넷을 가로질러 수십 개의 라우터가 각자 '다음 홉'만 결정했고, 그 결정들이 모여 전체 경로를 완성했습니다.",
      descEn: "The packet reached its destination. Dozens of routers across the internet each decided only the next hop — together those decisions formed the complete path.",
    },
  ],
};

// ─── Routing Table Component ──────────────────────────────────────────────────

function RoutingTable({ entries, lang }: { entries: RouteEntry[]; lang: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
      <div className="px-3 py-1.5 border-b border-white/10 flex items-center gap-2">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          {lang === "ko" ? "라우팅 테이블" : "Routing Table"}
        </span>
      </div>
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left px-3 py-1.5 text-zinc-600 font-normal">
              {lang === "ko" ? "목적지" : "Destination"}
            </th>
            <th className="text-left px-3 py-1.5 text-zinc-600 font-normal">Next Hop</th>
            <th className="text-left px-3 py-1.5 text-zinc-600 font-normal">Interface</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-white/5 last:border-0 transition-colors ${
                row.matched
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "text-zinc-500"
              }`}
            >
              <td className="px-3 py-1.5">{row.destination}</td>
              <td className="px-3 py-1.5">{row.nextHop}</td>
              <td className="px-3 py-1.5">{row.iface}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Topology Bar ─────────────────────────────────────────────────────────────

function TopologyBar({
  nodes,
  sublabels,
  activeNodeIndex,
  packetFrom,
  packetTo,
}: {
  nodes: string[];
  sublabels: string[];
  activeNodeIndex: number;
  packetFrom: number;
  packetTo: number;
}) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-2">
      {nodes.map((node, i) => (
        <div key={i} className="flex items-center">
          {/* Node */}
          <div className="flex flex-col items-center gap-1 min-w-[72px]">
            <div
              className={`w-10 h-10 rounded-lg border flex items-center justify-center text-xs font-mono font-bold transition-all duration-500 ${
                i === activeNodeIndex
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.2)]"
                  : "border-white/10 bg-white/[0.03] text-zinc-500"
              }`}
            >
              {i === 0 ? "💻" : i === nodes.length - 1 ? "🖥" : "📡"}
            </div>
            <span className="text-[9px] font-mono text-zinc-400 text-center leading-tight max-w-[70px]">
              {node}
            </span>
            <span className="text-[8px] font-mono text-zinc-600 text-center leading-tight max-w-[70px]">
              {sublabels[i]}
            </span>
          </div>

          {/* Connector */}
          {i < nodes.length - 1 && (
            <div className="relative w-8 flex items-center justify-center flex-shrink-0">
              <div className="w-full h-px bg-white/10" />
              {/* Packet dot */}
              {packetFrom === i && packetTo === i + 1 && (
                <div className="absolute w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-bounce" />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = "simple" | "real";

export default function IPRouting() {
  const { lang } = useLanguage();
  const [tab, setTab] = useState<Tab>("simple");
  const [stepIndex, setStepIndex] = useState(0);

  const scenario = tab === "simple" ? SIMPLE : REAL_WORLD;
  const step = scenario.steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === scenario.steps.length - 1;

  function switchTab(t: Tab) {
    setTab(t);
    setStepIndex(0);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {(["simple", "real"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={`px-5 py-3 text-xs font-mono transition-colors ${
              tab === t
                ? "text-white border-b-2 border-emerald-500 -mb-px"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t === "simple"
              ? lang === "ko" ? "기본 토폴로지" : "Simple"
              : lang === "ko" ? "실제 인터넷" : "Real World"}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-5">
        {/* Topology */}
        <TopologyBar
          nodes={scenario.nodes}
          sublabels={scenario.sublabels}
          activeNodeIndex={step.activeNodeIndex}
          packetFrom={step.packetFrom}
          packetTo={step.packetTo}
        />

        {/* Routing Table */}
        {step.routingTable && (
          <RoutingTable entries={step.routingTable} lang={lang} />
        )}

        {/* Description */}
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-white">
            {lang === "ko" ? step.headlineKo : step.headlineEn}
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {lang === "ko" ? step.descKo : step.descEn}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-xs font-mono text-zinc-600">
            {lang === "ko" ? "단계" : "Step"} {stepIndex + 1} / {scenario.steps.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setStepIndex((s) => s - 1)}
              disabled={isFirst}
              className="px-4 py-1.5 text-xs font-mono rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {lang === "ko" ? "← 이전" : "← prev"}
            </button>
            <button
              onClick={() => setStepIndex((s) => s + 1)}
              disabled={isLast}
              className="px-4 py-1.5 text-xs font-mono rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {lang === "ko" ? "다음 →" : "next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
