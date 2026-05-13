"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import OSILayerStack from "@/components/networks/OSILayerStack";
import OSIEncapsulation from "@/components/networks/OSIEncapsulation";
import OSIRealWorld from "@/components/networks/OSIRealWorld";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", networks: "networks", current: "osi layers" },
  hero: {
    title: "OSI 7 Layers",
    desc: "패킷은 단순히 이동하지 않습니다 — 각 계층에서 포장되고 벗겨집니다.\n송신 측에서 헤더가 쌓이고, 수신 측에서 역순으로 벗겨지는 과정을 확인합니다.",
    tags: ["캡슐화", "PDU", "프로토콜 스택", "헤더", "역캡슐화"],
  },
  sections: [
    {
      number: "01",
      title: "계층 스택 개요",
      desc: "OSI 모델의 7개 계층을 위에서 아래로 살펴봅니다. 각 계층을 클릭하면 역할, 프로토콜, 해당 계층에서 추가되는 헤더 정보를 확인할 수 있습니다.",
    },
    {
      number: "02",
      title: "캡슐화 & 역캡슐화",
      desc: "송신 측에서 애플리케이션 데이터가 각 계층을 거치며 헤더가 쌓이는 과정과, 수신 측에서 역순으로 헤더가 벗겨지는 과정을 단계별로 시각화합니다.",
    },
    {
      number: "03",
      title: "실제 세계 매핑",
      desc: "https://example.com 을 방문할 때 각 OSI 계층에서 실제로 무슨 일이 일어나는지 구체적인 헤더 값과 함께 확인합니다.",
    },
  ],
  summary: {
    title: "한 줄 요약",
    items: [
      { num: "07", text: "Application — HTTP, DNS, SMTP. 사용자 애플리케이션과 직접 상호작용하는 최상위 계층." },
      { num: "06", text: "Presentation — TLS/SSL, JPEG, gzip. 암호화, 압축, 인코딩으로 데이터 형식을 변환." },
      { num: "05", text: "Session — NetBIOS, RPC. 애플리케이션 간 세션(대화)을 수립·유지·종료." },
      { num: "04", text: "Transport — TCP, UDP. 포트 기반 종단 간 통신. TCP는 신뢰성, UDP는 저지연." },
      { num: "03", text: "Network — IP, ICMP, OSPF. IP 주소 기반 라우팅으로 다른 네트워크까지 패킷 전달." },
      { num: "02", text: "Data Link — Ethernet, ARP, MAC. 동일 네트워크 내 노드 간 프레임 전송 및 오류 감지." },
      { num: "01", text: "Physical — Cable, Wi-Fi, NIC. 비트를 전기·광·전파 신호로 변환해 물리 매체로 전송." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", networks: "networks", current: "osi layers" },
  hero: {
    title: "OSI 7 Layers",
    desc: "A packet doesn't just travel — it gets wrapped and unwrapped at every layer.\nSee how headers stack on the sender side and get stripped on the receiver side.",
    tags: ["Encapsulation", "PDU", "Protocol Stack", "Headers", "Decapsulation"],
  },
  sections: [
    {
      number: "01",
      title: "Layer Stack Overview",
      desc: "Explore all seven OSI layers from top to bottom. Click any layer to expand its role, key protocols, and what gets added at that layer.",
    },
    {
      number: "02",
      title: "Encapsulation & Decapsulation",
      desc: "Step through how application data accumulates headers as it descends through each layer on the sender side, then watch them get stripped in reverse on the receiver side.",
    },
    {
      number: "03",
      title: "Real-World Mapping",
      desc: "See exactly what happens at each OSI layer when you visit https://example.com — with concrete header values and protocol details.",
    },
  ],
  summary: {
    title: "One-line Summary",
    items: [
      { num: "07", text: "Application — HTTP, DNS, SMTP. The topmost layer that interfaces directly with user applications." },
      { num: "06", text: "Presentation — TLS/SSL, JPEG, gzip. Transforms data format via encryption, compression, and encoding." },
      { num: "05", text: "Session — NetBIOS, RPC. Establishes, maintains, and terminates sessions between applications." },
      { num: "04", text: "Transport — TCP, UDP. End-to-end communication via ports. TCP for reliability, UDP for low latency." },
      { num: "03", text: "Network — IP, ICMP, OSPF. Routes packets across networks using IP addressing and routing tables." },
      { num: "02", text: "Data Link — Ethernet, ARP, MAC. Transfers frames between nodes on the same network with error detection." },
      { num: "01", text: "Physical — Cable, Wi-Fi, NIC. Converts bits into electrical, optical, or radio signals over the physical medium." },
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

export default function OSILayersPage() {
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
          <OSILayerStack />
        </Section>

        {/* 02 */}
        <Section
          number={t.sections[1].number}
          title={t.sections[1].title}
          description={t.sections[1].desc}
        >
          <OSIEncapsulation />
        </Section>

        {/* 03 */}
        <Section
          number={t.sections[2].number}
          title={t.sections[2].title}
          description={t.sections[2].desc}
        >
          <OSIRealWorld />
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
