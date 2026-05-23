"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import NetworkQualities from "@/components/networks/NetworkQualities";
import ThroughputBandwidth from "@/components/networks/ThroughputBandwidth";
import LatencyVisualizer from "@/components/networks/LatencyVisualizer";
import TopologyBottleneck from "@/components/networks/TopologyBottleneck";
import NetworkScale from "@/components/networks/NetworkScale";
import NetstatLive from "@/components/networks/NetstatLive";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", networks: "networks", current: "network basics" },
  hero: {
    title: "Network Basics",
    desc: "좋은 네트워크란 무엇인가?\n처리량, 지연 시간, 토폴로지, 네트워크 규모 — 패킷이 흐르는 세계의 기본 개념을 시각화합니다.",
    tags: ["처리량", "대역폭", "레이턴시", "토폴로지", "LAN/WAN", "NETSTAT"],
  },
  sections: [
    {
      number: "01",
      title: "좋은 네트워크의 조건",
      desc: "높은 처리량, 낮은 지연 시간, 높은 내결함성, 강한 보안 — 네트워크 품질을 결정하는 네 가지 핵심 요소를 알아봅니다.",
    },
    {
      number: "02",
      title: "처리량 · 트래픽 · 대역폭",
      desc: "트래픽은 '흐르고 있는 양', 처리량은 '성공적으로 전달된 양', 대역폭은 '최대 용량'. 파이프에 물이 흐르는 비유로 세 개념의 차이를 확인합니다.",
    },
    {
      number: "03",
      title: "레이턴시 (Latency)",
      desc: "메시지가 두 장치 사이를 왕복하는 시간. 전파, 전송, 큐잉, 처리 지연이 합쳐져 RTT를 만듭니다.",
    },
    {
      number: "04",
      title: "토폴로지 & 병목현상",
      desc: "네트워크 구조(토폴로지)를 아는 것이 왜 중요할까? 병목현상을 찾고, 대역폭 증설만으로 해결 안 될 때 회선 추가로 해소하는 방법을 시뮬레이션합니다.",
    },
    {
      number: "05",
      title: "네트워크 규모 — LAN · MAN · WAN",
      desc: "사무실(LAN), 도시(MAN), 세계(WAN) 규모의 네트워크. AWS VPC/Subnet/NAT Gateway와의 매핑도 함께 확인합니다.",
    },
    {
      number: "06",
      title: "NETSTAT 라이브 데모",
      desc: "netstat으로 볼 수 있는 것들 — 연결 상태, 포트, 프로토콜. 실제 요청을 보내고 연결이 어떻게 생기고 사라지는지 관찰합니다.",
    },
  ],
  summary: {
    title: "한 줄 요약",
    items: [
      { num: "01", text: "좋은 네트워크 = 높은 처리량 + 낮은 지연 + 적은 장애 + 강한 보안. 이 네 가지가 기준." },
      { num: "02", text: "Bandwidth(최대 bps) ≥ Traffic(흐르는 양) ≥ Throughput(성공 전달량). 파이프 크기를 넘으면 패킷 손실." },
      { num: "03", text: "Latency = 전파 + 전송 + 큐잉 + 처리 지연. RTT는 이것의 왕복. 거리와 부하에 비례." },
      { num: "04", text: "토폴로지는 병목 진단의 지도. 대역폭 증설보다 경로 추가가 답일 수 있다." },
      { num: "05", text: "LAN/WAN은 범위. NAT는 주소 변환 기술. AWS에서 VPC=LAN, IGW/NAT GW=WAN 연결." },
      { num: "06", text: "netstat = 현재 열린 연결들의 스냅샷. 프로토콜, 주소, 포트, 상태로 문제 진단." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", networks: "networks", current: "network basics" },
  hero: {
    title: "Network Basics",
    desc: "What makes a good network?\nThroughput, latency, topology, scale — visualize the fundamentals of how packets flow.",
    tags: ["Throughput", "Bandwidth", "Latency", "Topology", "LAN/WAN", "NETSTAT"],
  },
  sections: [
    {
      number: "01",
      title: "Qualities of a Good Network",
      desc: "High throughput, low latency, fault tolerance, strong security — the four pillars that define network quality.",
    },
    {
      number: "02",
      title: "Throughput · Traffic · Bandwidth",
      desc: "Traffic is 'what's flowing', throughput is 'what arrived successfully', bandwidth is 'max capacity'. See the difference with a pipe analogy.",
    },
    {
      number: "03",
      title: "Latency",
      desc: "Round-trip time for a message between two devices. Propagation, transmission, queuing, and processing delays combine to form RTT.",
    },
    {
      number: "04",
      title: "Topology & Bottlenecks",
      desc: "Why does network structure matter? Simulate bottlenecks and see how adding gateway links can resolve congestion that bandwidth upgrades cannot.",
    },
    {
      number: "05",
      title: "Network Scale — LAN · MAN · WAN",
      desc: "Office (LAN), city (MAN), world (WAN) scale networks. Mapped to AWS VPC/Subnet/NAT Gateway equivalents.",
    },
    {
      number: "06",
      title: "NETSTAT Live Demo",
      desc: "What netstat reveals — connection states, ports, protocols. Send a real request and watch connections appear and transition.",
    },
  ],
  summary: {
    title: "One-line Summary",
    items: [
      { num: "01", text: "Good network = high throughput + low latency + fault tolerance + strong security." },
      { num: "02", text: "Bandwidth(max bps) ≥ Traffic(flowing) ≥ Throughput(delivered). Exceed pipe size → packet loss." },
      { num: "03", text: "Latency = propagation + transmission + queuing + processing. RTT is round-trip. Proportional to distance and load." },
      { num: "04", text: "Topology is the map for bottleneck diagnosis. Adding routes may work better than upgrading bandwidth." },
      { num: "05", text: "LAN/WAN = scope. NAT = address translation tech. In AWS: VPC=LAN, IGW/NAT GW=WAN bridge." },
      { num: "06", text: "netstat = snapshot of open connections. Diagnose issues via protocol, address, port, state columns." },
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
          <span className="text-xs font-mono text-blue-500/60">{number}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function NetworkBasicsPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(59,130,246,0.05),transparent)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.home}</Link>
          <span>/</span>
          <Link href="/networks" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.networks}</Link>
          <span>/</span>
          <span className="text-zinc-400">{t.breadcrumb.current}</span>
        </div>

        {/* hero */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-white font-mono mb-4">{t.hero.title}</h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-2xl mb-6 whitespace-pre-line">
            {t.hero.desc}
          </p>
          <div className="flex items-center gap-0 text-xs font-mono flex-wrap">
            {t.hero.tags.map((label, i, arr) => (
              <span key={label} className="flex items-center">
                <span className="text-zinc-500 px-2 py-1 rounded border border-white/[0.06] bg-white/[0.02]">{label}</span>
                {i < arr.length - 1 && <span className="text-zinc-700 mx-1.5">→</span>}
              </span>
            ))}
          </div>
        </div>

        {/* 01 */}
        <Section
          number={t.sections[0].number}
          title={t.sections[0].title}
          description={t.sections[0].desc}
        >
          <NetworkQualities />
        </Section>

        {/* 02 */}
        <Section
          number={t.sections[1].number}
          title={t.sections[1].title}
          description={t.sections[1].desc}
        >
          <ThroughputBandwidth />
        </Section>

        {/* 03 */}
        <Section
          number={t.sections[2].number}
          title={t.sections[2].title}
          description={t.sections[2].desc}
        >
          <LatencyVisualizer />
        </Section>

        {/* 04 */}
        <Section
          number={t.sections[3].number}
          title={t.sections[3].title}
          description={t.sections[3].desc}
        >
          <TopologyBottleneck />
        </Section>

        {/* 05 */}
        <Section
          number={t.sections[4].number}
          title={t.sections[4].title}
          description={t.sections[4].desc}
        >
          <NetworkScale />
        </Section>

        {/* 06 */}
        <Section
          number={t.sections[5].number}
          title={t.sections[5].title}
          description={t.sections[5].desc}
        >
          <NetstatLive />
        </Section>

        {/* summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold text-sm font-mono mb-5">{t.summary.title}</h3>
          <div className="space-y-3">
            {t.summary.items.map((item) => (
              <div key={item.num} className="flex gap-3 items-start">
                <span className="text-xs font-mono text-blue-500/50 shrink-0 mt-0.5">{item.num}</span>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
