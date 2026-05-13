"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const KO = {
  home: "← cs-canvas",
  title: "Networks",
  desc: "TCP 핸드셰이크, OSI 계층, 라우팅 — 패킷이 여행하는 경로를 시각화합니다.",
  ready: "바로가기 →",
  soon: "준비 중",
  subtopics: [
    {
      name: "TCP Three-Way Handshake",
      description: "SYN, SYN-ACK, ACK — 클라이언트와 서버 사이의 패킷 교환을 단계별로 시각화합니다.",
      href: "/networks/tcp-handshake",
    },
    {
      name: "OSI Layers",
      description: "계층별 캡슐화 — 헤더가 페이로드를 감싸는 과정을 확인합니다.",
      href: "/networks/osi-layers",
    },
    {
      name: "IP Routing",
      description: "라우팅 테이블, 최장 접두사 매칭 — 홉-바이-홉 패킷 경로를 따라갑니다.",
      href: undefined,
    },
    {
      name: "DNS Resolution",
      description: "재귀적 vs 반복적 — 리졸버 체인을 단계별로 확인합니다.",
      href: undefined,
    },
  ],
};

const EN = {
  home: "← cs-canvas",
  title: "Networks",
  desc: "TCP handshakes, OSI layers, routing — see packets travel.",
  ready: "ready →",
  soon: "soon",
  subtopics: [
    {
      name: "TCP Three-Way Handshake",
      description: "SYN, SYN-ACK, ACK — packet exchange animated between client and server.",
      href: "/networks/tcp-handshake",
    },
    {
      name: "OSI Layers",
      description: "Layer-by-layer encapsulation — see headers wrap around payload.",
      href: "/networks/osi-layers",
    },
    {
      name: "IP Routing",
      description: "Routing tables, longest prefix match — hop-by-hop packet journey.",
      href: undefined,
    },
    {
      name: "DNS Resolution",
      description: "Recursive vs iterative — resolver chain shown step by step.",
      href: undefined,
    },
  ],
};

export default function NetworksPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(59,130,246,0.06),transparent)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        {/* breadcrumb */}
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
          >
            {t.home}
          </Link>
        </div>

        {/* header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white font-mono mb-3">{t.title}</h1>
          <p className="text-zinc-400 text-base max-w-lg leading-relaxed">{t.desc}</p>
        </div>

        {/* subtopics grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {t.subtopics.map((subtopic) => {
            const isReady = !!subtopic.href;
            const inner = (
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">{subtopic.name}</h3>
                  <span
                    className={`text-xs border rounded px-1.5 py-0.5 ${
                      isReady
                        ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                        : "text-zinc-600 border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    {isReady ? t.ready : t.soon}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">{subtopic.description}</p>
              </div>
            );

            return (
              <div
                key={subtopic.name}
                className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-5 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br from-blue-500 to-cyan-600" />
                {isReady ? (
                  <Link href={subtopic.href!} className="block">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
