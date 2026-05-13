"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import TCPHandshakeVisualizer from "@/components/networks/TCPHandshakeVisualizer";
import TCPStateTransitions from "@/components/networks/TCPStateTransitions";
import TCPWhyThreeWay from "@/components/networks/TCPWhyThreeWay";
import TCPFourWayHandshake from "@/components/networks/TCPFourWayHandshake";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", networks: "networks", current: "tcp handshake" },
  hero: {
    title: "TCP Three-Way Handshake",
    desc: "연결은 패킷 교환으로 시작됩니다.\nSYN → SYN-ACK → ACK 세 단계가 왜 필요한지 직접 확인합니다.",
    tags: ["연결 설정", "패킷 교환", "상태 전이", "Half-Open", "포트 & 시퀀스", "4-Way 종료"],
  },
  sections: [
    {
      number: "01",
      title: "Three-Way Handshake",
      desc: "클라이언트와 서버가 SYN, SYN-ACK, ACK 세 패킷을 교환하며 연결을 수립합니다. 각 단계에서 상태가 어떻게 전이되고 시퀀스 번호가 어떻게 사용되는지 확인합니다.",
    },
    {
      number: "02",
      title: "상태 전이",
      desc: "TCP는 유한 상태 기계(FSM)입니다. 연결 수립 구간에서 클라이언트와 서버가 어떤 상태를 거치는지 확인합니다.",
    },
    {
      number: "03",
      title: "왜 정확히 3단계인가?",
      desc: "1단계나 2단계로는 왜 불충분한지, 그리고 3단계가 양방향 통신 능력을 확인하는 최솟값인 이유를 알아봅니다. SYN Flood 공격도 살펴봅니다.",
    },
    {
      number: "04",
      title: "Four-Way Handshake — 연결 종료",
      desc: "연결 종료는 4단계입니다. FIN → ACK → FIN → ACK. 서버가 데이터를 다 보낼 때까지 Half-Close 상태를 유지하며, TIME_WAIT가 2MSL 동안 지속됩니다.",
    },
  ],
  summary: {
    title: "한 줄 요약",
    items: [
      { num: "01", text: "SYN(seq=x) → SYN-ACK(seq=y, ack=x+1) → ACK(ack=y+1). 3번 교환으로 양방향 시퀀스 번호 동기화 완료." },
      { num: "02", text: "클라이언트: CLOSED → SYN_SENT → ESTABLISHED. 서버: CLOSED → LISTEN → SYN_RECEIVED → ESTABLISHED." },
      { num: "03", text: "3단계는 양쪽이 '상대방이 보낼 수 있고 받을 수 있다'를 확인하는 최솟값. SYN Flood는 이 Half-Open 상태를 악용한 DoS 공격." },
      { num: "04", text: "4-Way Teardown: FIN→ACK→FIN→ACK. Server Half-Close로 데이터 전송 완료 후 종료. TIME_WAIT(2MSL)로 지연 패킷 처리." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", networks: "networks", current: "tcp handshake" },
  hero: {
    title: "TCP Three-Way Handshake",
    desc: "Every connection starts with a packet exchange.\nSee why SYN → SYN-ACK → ACK takes exactly three steps.",
    tags: ["Connection Setup", "Packet Exchange", "State Transition", "Half-Open", "Port & Sequence", "4-Way Teardown"],
  },
  sections: [
    {
      number: "01",
      title: "Three-Way Handshake",
      desc: "Client and server exchange three packets — SYN, SYN-ACK, ACK — to establish a connection. Follow how states transition and how sequence numbers are negotiated at each step.",
    },
    {
      number: "02",
      title: "State Transitions",
      desc: "TCP is a finite state machine (FSM). See which states client and server pass through during the connection setup phase.",
    },
    {
      number: "03",
      title: "Why Exactly Three Steps?",
      desc: "Understand why one or two steps are insufficient, and why three is the minimum needed to confirm bidirectional communication capability. Includes a look at the SYN Flood attack.",
    },
    {
      number: "04",
      title: "Four-Way Handshake — Connection Teardown",
      desc: "Teardown takes four steps. FIN → ACK → FIN → ACK. The server stays in Half-Close until it finishes sending data. TIME_WAIT persists for 2MSL to handle delayed packets.",
    },
  ],
  summary: {
    title: "One-line Summary",
    items: [
      { num: "01", text: "SYN(seq=x) → SYN-ACK(seq=y, ack=x+1) → ACK(ack=y+1). Three exchanges synchronize sequence numbers in both directions." },
      { num: "02", text: "Client: CLOSED → SYN_SENT → ESTABLISHED. Server: CLOSED → LISTEN → SYN_RECEIVED → ESTABLISHED." },
      { num: "03", text: "3 steps is the minimum for both sides to verify 'the other can send and receive.' SYN Flood exploits the Half-Open state as a DoS attack." },
      { num: "04", text: "4-Way Teardown: FIN→ACK→FIN→ACK. Server Half-Close until data done. TIME_WAIT (2MSL) handles delayed packets." },
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

export default function TCPHandshakePage() {
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
          <TCPHandshakeVisualizer />
        </Section>

        {/* 02 */}
        <Section
          number={t.sections[1].number}
          title={t.sections[1].title}
          description={t.sections[1].desc}
        >
          <TCPStateTransitions />
        </Section>

        {/* 03 */}
        <Section
          number={t.sections[2].number}
          title={t.sections[2].title}
          description={t.sections[2].desc}
        >
          <TCPWhyThreeWay />
        </Section>

        {/* 04 */}
        <Section
          number={t.sections[3].number}
          title={t.sections[3].title}
          description={t.sections[3].desc}
        >
          <TCPFourWayHandshake />
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
