"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import IPRouting from "@/components/networks/IPRouting";

const KO = {
  breadcrumb: { home: "cs-canvas", networks: "networks", current: "ip routing" },
  hero: {
    title: "IP Routing",
    desc: "패킷은 목적지를 향해 한 번에 도달하지 않습니다 — 라우터가 하나씩 '다음 홉'을 결정합니다.\n라우팅 테이블과 최장 접두사 매칭이 이 결정을 어떻게 내리는지 따라가봅니다.",
    tags: ["라우팅 테이블", "최장 접두사 매칭", "홉-바이-홉", "NAT", "BGP"],
  },
  section: {
    number: "01",
    title: "홉-바이-홉 패킷 여정",
    desc: "각 라우터는 전체 경로를 알 필요가 없습니다. 자신의 라우팅 테이블을 보고 다음 홉만 결정합니다. 단계별로 따라가며 최장 접두사 매칭이 어떻게 작동하는지 확인하세요.",
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "라우팅 테이블", text: "각 라우터가 보유하는 목적지 → 다음 홉 매핑 테이블." },
      { label: "최장 접두사 매칭", text: "여러 경로가 매칭될 때 prefix 길이가 가장 긴 경로가 선택됩니다. /24는 /8보다 우선합니다." },
      { label: "기본 경로 (0.0.0.0/0)", text: "아무 경로도 매칭되지 않을 때 사용하는 마지막 수단. 기본 게이트웨이로 전달합니다." },
      { label: "홉-바이-홉", text: "라우터는 목적지까지의 전체 경로를 모릅니다. 다음 홉만 알면 됩니다." },
      { label: "NAT", text: "사설 IP를 공인 IP로 변환합니다. 가정용 라우터에서 항상 발생합니다." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", networks: "networks", current: "ip routing" },
  hero: {
    title: "IP Routing",
    desc: "A packet doesn't reach its destination in one leap — routers decide the next hop one at a time.\nFollow how routing tables and longest prefix match drive every forwarding decision.",
    tags: ["Routing Table", "Longest Prefix Match", "Hop-by-Hop", "NAT", "BGP"],
  },
  section: {
    number: "01",
    title: "Hop-by-Hop Packet Journey",
    desc: "Each router only needs to know the next hop — not the full path. Step through the journey to see longest prefix match in action.",
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Routing Table", text: "A table each router holds mapping destinations to next hops." },
      { label: "Longest Prefix Match", text: "When multiple routes match, the most specific one (longest prefix) wins. /24 beats /8." },
      { label: "Default Route (0.0.0.0/0)", text: "Used when no other route matches. Packets fall back to the default gateway." },
      { label: "Hop-by-Hop", text: "Routers don't know the full path to the destination — only the next hop." },
      { label: "NAT", text: "Translates private IPs to a public IP. Always happens at your home router." },
    ],
  },
};

export default function IPRoutingPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(52,211,153,0.05),transparent)]" />

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

        {/* section */}
        <section className="mb-16">
          <div className="mb-6">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-xs font-mono text-emerald-500/60">{t.section.number}</span>
              <h2 className="text-xl font-bold text-white">{t.section.title}</h2>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">{t.section.desc}</p>
          </div>
          <IPRouting />
        </section>

        {/* summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold text-sm font-mono mb-5">{t.summary.title}</h3>
          <div className="space-y-3">
            {t.summary.items.map((item) => (
              <div key={item.label} className="flex gap-3 items-start">
                <span className="text-xs font-mono text-emerald-500/50 shrink-0 mt-0.5 min-w-[120px]">{item.label}</span>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
