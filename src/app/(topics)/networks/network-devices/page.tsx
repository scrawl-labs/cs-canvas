"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import NetworkDevicesViz from "@/components/networks/NetworkDevices";
import { ReactNode } from "react";

const KO = {
  breadcrumb: {
    home: "cs-canvas",
    networks: "networks",
    current: "network devices",
  },
  hero: {
    title: "Network Devices",
    desc: "추상적인 OSI 계층 뒤에는 실제 장비가 있습니다.\n각 계층의 장비가 무엇을 하는지, 일상 비유로 쉽게 이해합니다.",
    tags: ["L7 로드밸런서", "L4 스위치", "라우터", "L2 스위치", "NIC", "AP"],
  },
  sections: [
    {
      number: "01",
      title: "계층별 장비 한눈에",
      desc: "OSI 계층마다 담당하는 실제 장비가 다릅니다. 각 장비를 클릭하면 '우리 엄마도 이해할 수 있는' 비유와 함께 역할을 확인합니다.",
    },
  ],
  summary: {
    title: "한 줄 요약",
    items: [
      {
        num: "L7",
        text: "로드밸런서 (ALB) — 호텔 컨시어지. URL·쿠키를 읽고 적절한 서버로 안내. 필터링·모니터링 가능.",
      },
      {
        num: "L4",
        text: "L4 스위치 (NLB) — 톨게이트. IP·포트만 보고 빠르게 분배. 내용은 모름.",
      },
      {
        num: "L3",
        text: "라우터 — 우체국. IP 주소(우편번호)를 보고 다른 네트워크로 최적 경로 전달.",
      },
      {
        num: "L2",
        text: "L2 스위치 — 아파트 우편함. MAC 주소(호수)를 보고 같은 LAN 내에서 정확 전달.",
      },
      {
        num: "L1",
        text: "NIC & AP — 전화기 & 기지국. 비트를 실제 신호로 변환. MAC 주소는 NIC의 주민번호.",
      },
    ],
  },
};

const EN = {
  breadcrumb: {
    home: "cs-canvas",
    networks: "networks",
    current: "network devices",
  },
  hero: {
    title: "Network Devices",
    desc: "Behind the abstract OSI layers are real devices.\nUnderstand what each layer's equipment does — with everyday analogies anyone can get.",
    tags: ["L7 Load Balancer", "L4 Switch", "Router", "L2 Switch", "NIC", "AP"],
  },
  sections: [
    {
      number: "01",
      title: "Devices by Layer",
      desc: "Each OSI layer has different physical devices. Click each one to see its role explained with everyday analogies that even your mom would understand.",
    },
  ],
  summary: {
    title: "One-line Summary",
    items: [
      {
        num: "L7",
        text: "Load Balancer (ALB) — Hotel concierge. Reads URL/cookies and routes to the right server. Can filter and monitor.",
      },
      {
        num: "L4",
        text: "L4 Switch (NLB) — Toll gate. Only checks IP+port, routes fast. Can't read content.",
      },
      {
        num: "L3",
        text: "Router — Post office. Reads IP (zip code), forwards to other networks via optimal path.",
      },
      {
        num: "L2",
        text: "L2 Switch — Apartment mailbox. Reads MAC (unit number), delivers within same LAN only.",
      },
      {
        num: "L1",
        text: "NIC & AP — Phone & cell tower. Converts bits to actual signals. MAC address is NIC's unique ID.",
      },
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

export default function NetworkDevicesPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(59,130,246,0.05),transparent)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">
            {t.breadcrumb.home}
          </Link>
          <span>/</span>
          <Link
            href="/networks"
            className="hover:text-zinc-400 transition-colors"
          >
            {t.breadcrumb.networks}
          </Link>
          <span>/</span>
          <span className="text-zinc-400">{t.breadcrumb.current}</span>
        </div>

        {/* hero */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-white font-mono mb-4">
            {t.hero.title}
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-2xl mb-6 whitespace-pre-line">
            {t.hero.desc}
          </p>
          <div className="flex items-center gap-0 text-xs font-mono flex-wrap">
            {t.hero.tags.map((label, i, arr) => (
              <span key={label} className="flex items-center">
                <span className="text-zinc-500 px-2 py-1 rounded border border-white/[0.06] bg-white/[0.02]">
                  {label}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-zinc-700 mx-1.5">→</span>
                )}
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
          <NetworkDevicesViz />
        </Section>

        {/* summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold text-sm font-mono mb-5">
            {t.summary.title}
          </h3>
          <div className="space-y-3">
            {t.summary.items.map((item) => (
              <div key={item.num} className="flex gap-3 items-start">
                <span className="text-xs font-mono text-blue-500/50 shrink-0 mt-0.5">
                  {item.num}
                </span>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
