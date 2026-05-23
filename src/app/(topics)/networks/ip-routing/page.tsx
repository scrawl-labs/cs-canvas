"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import IPRouting from "@/components/networks/IPRouting";
import ARPVisualizer from "@/components/networks/ARPVisualizer";
import NATVisualizer from "@/components/networks/NATVisualizer";
import { ReactNode } from "react";

const KO = {
  breadcrumb: {
    home: "cs-canvas",
    networks: "networks",
    current: "ip routing",
  },
  hero: {
    title: "IP Routing",
    desc: "패킷은 목적지를 향해 한 번에 도달하지 않습니다 — 라우터가 하나씩 '다음 홉'을 결정합니다.\n라우팅 테이블과 최장 접두사 매칭이 이 결정을 어떻게 내리는지 따라가봅니다.",
    tags: [
      "라우팅 테이블",
      "최장 접두사 매칭",
      "홉-바이-홉",
      "ARP",
      "IP 주소",
      "NAT",
    ],
  },
  sections: [
    {
      number: "01",
      title: "홉-바이-홉 패킷 여정",
      desc: "각 라우터는 전체 경로를 알 필요가 없습니다. 자신의 라우팅 테이블을 보고 다음 홉만 결정합니다. 라우팅 테이블에는 목적지 정보와 그 목적지로 가기 위한 방법(다음 홉, 인터페이스)이 들어있습니다. 게이트웨이는 다른 네트워크로 나가는 관문 역할을 합니다.",
    },
    {
      number: "02",
      title: "ARP — IP 주소에서 MAC 주소 찾기",
      desc: "패킷이 최종 목적지에 도달하려면 결국 MAC 주소를 알아야 합니다. ARP는 IP 주소(가상)와 MAC 주소(실제) 사이의 다리 역할을 하는 프로토콜입니다. 브로드캐스트로 물어보고, 유니캐스트로 답을 받습니다.",
    },
    {
      number: "03",
      title: "IP 주소 체계 — IPv4 & IPv6",
      desc: "IP 주소는 네트워크상에서 장치를 식별하는 논리적 주소입니다. IPv4(32비트, 약 43억 개)의 고갈 문제를 해결하기 위해 IPv6(128비트)가 등장했습니다.",
    },
    {
      number: "04",
      title: "NAT — 공인 IP 하나로 여러 장치가 인터넷 사용",
      desc: "인터넷 회선 하나를 개통하고 공유기를 달면 여러 PC가 연결됩니다. 이게 가능한 이유가 NAT입니다. 사설 IP를 공인 IP로 변환하여 외부와 통신하고, 외부에서는 내부 IP를 볼 수 없어 보안도 강화됩니다.",
    },
  ],
  ipInfo: {
    title: "IP 주소 체계",
    ipv4: {
      title: "IPv4",
      format: "32비트 · 4개 옥텟 · 약 43억 개",
      example: "192.168.1.1",
      desc: "점(.)으로 구분된 4개의 숫자 (각 0~255). 현재 대부분의 네트워크에서 사용.",
    },
    ipv6: {
      title: "IPv6",
      format: "128비트 · 8개 그룹 · 사실상 무한",
      example: "2001:0DB8:2002:0042:0000:0000:0000:0001",
      desc: "콜론(:)으로 구분된 8개 16진수 그룹. IPv4 고갈 문제를 해결하기 위해 등장.",
    },
    classes: [
      {
        name: "클래스 A",
        range: "0.0.0.0 ~ 127.255.255.255",
        use: "대규모 네트워크",
      },
      {
        name: "클래스 B",
        range: "128.0.0.0 ~ 191.255.255.255",
        use: "중규모 네트워크",
      },
      {
        name: "클래스 C",
        range: "192.0.0.0 ~ 223.255.255.255",
        use: "소규모 네트워크",
      },
    ],
    private:
      "사설 IP 대역: 10.x.x.x, 172.16~31.x.x, 192.168.x.x — 인터넷에서 직접 통신 불가, NAT 필요",
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      {
        label: "라우팅 테이블",
        text: "각 라우터가 보유하는 목적지 → 다음 홉 매핑 테이블. 게이트웨이로의 경로 포함.",
      },
      {
        label: "최장 접두사 매칭",
        text: "여러 경로가 매칭될 때 prefix 길이가 가장 긴 경로가 선택됩니다. /24는 /8보다 우선합니다.",
      },
      {
        label: "홉-바이-홉",
        text: "라우터는 목적지까지의 전체 경로를 모릅니다. 다음 홉만 알면 됩니다. 서브네트워크의 라우터들을 거쳐 최종 목적지에 도달.",
      },
      {
        label: "ARP",
        text: "IP 주소 → MAC 주소 변환. 브로드캐스트로 질의, 유니캐스트로 응답. RARP는 역방향(MAC→IP).",
      },
      {
        label: "NAT",
        text: "사설 IP를 공인 IP로 변환. 포트 번호로 내부 장치 구분. 보안 강화 + IP 절약. 단, 공유 시 속도 저하 가능.",
      },
      {
        label: "IPv4 / IPv6",
        text: "IPv4: 32비트(43억), 고갈 진행 중. IPv6: 128비트, 사실상 무한. 사설 IP는 NAT 없이 외부 통신 불가.",
      },
    ],
  },
};

const EN = {
  breadcrumb: {
    home: "cs-canvas",
    networks: "networks",
    current: "ip routing",
  },
  hero: {
    title: "IP Routing",
    desc: "A packet doesn't reach its destination in one leap — routers decide the next hop one at a time.\nFollow how routing tables and longest prefix match drive every forwarding decision.",
    tags: [
      "Routing Table",
      "Longest Prefix Match",
      "Hop-by-Hop",
      "ARP",
      "IP Address",
      "NAT",
    ],
  },
  sections: [
    {
      number: "01",
      title: "Hop-by-Hop Packet Journey",
      desc: "Each router only needs to know the next hop — not the full path. The routing table contains destination info and the method to reach it (next hop, interface). A gateway acts as the door to other networks.",
    },
    {
      number: "02",
      title: "ARP — Finding MAC from IP Address",
      desc: "To reach the final destination, the packet ultimately needs a MAC address. ARP bridges IP addresses (logical) and MAC addresses (physical). It asks via broadcast and receives answers via unicast.",
    },
    {
      number: "03",
      title: "IP Addressing — IPv4 & IPv6",
      desc: "IP addresses are logical identifiers for devices on a network. IPv6 (128-bit) was created to solve IPv4's (32-bit, ~4.3 billion) exhaustion problem.",
    },
    {
      number: "04",
      title: "NAT — Multiple Devices, One Public IP",
      desc: "Get one internet line, plug in a router, and multiple PCs can connect. NAT makes this possible by translating private IPs to a public IP. External networks can't see internal IPs — security bonus.",
    },
  ],
  ipInfo: {
    title: "IP Address System",
    ipv4: {
      title: "IPv4",
      format: "32-bit · 4 octets · ~4.3 billion addresses",
      example: "192.168.1.1",
      desc: "Four numbers (0-255) separated by dots. Used by most networks today.",
    },
    ipv6: {
      title: "IPv6",
      format: "128-bit · 8 groups · virtually unlimited",
      example: "2001:0DB8:2002:0042:0000:0000:0000:0001",
      desc: "Eight groups of hexadecimal separated by colons. Created to solve IPv4 exhaustion.",
    },
    classes: [
      {
        name: "Class A",
        range: "0.0.0.0 ~ 127.255.255.255",
        use: "Large networks",
      },
      {
        name: "Class B",
        range: "128.0.0.0 ~ 191.255.255.255",
        use: "Medium networks",
      },
      {
        name: "Class C",
        range: "192.0.0.0 ~ 223.255.255.255",
        use: "Small networks",
      },
    ],
    private:
      "Private IP ranges: 10.x.x.x, 172.16-31.x.x, 192.168.x.x — cannot communicate on internet directly, NAT required",
  },
  summary: {
    title: "Key Concepts",
    items: [
      {
        label: "Routing Table",
        text: "A table each router holds mapping destinations to next hops. Includes gateway routes.",
      },
      {
        label: "Longest Prefix Match",
        text: "When multiple routes match, the most specific one (longest prefix) wins. /24 beats /8.",
      },
      {
        label: "Hop-by-Hop",
        text: "Routers don't know the full path — only the next hop. Packets traverse subnet routers to reach the final destination.",
      },
      {
        label: "ARP",
        text: "IP → MAC translation. Query via broadcast, reply via unicast. RARP does the reverse (MAC→IP).",
      },
      {
        label: "NAT",
        text: "Translates private IP to public IP. Distinguishes devices by port. Better security + saves IPs. But shared access can slow things down.",
      },
      {
        label: "IPv4 / IPv6",
        text: "IPv4: 32-bit (4.3B), exhausting. IPv6: 128-bit, virtually infinite. Private IPs can't reach internet without NAT.",
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
          <span className="text-xs font-mono text-emerald-500/60">
            {number}
          </span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function IPRoutingPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(52,211,153,0.05),transparent)]" />

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

        {/* 01 - Hop-by-Hop */}
        <Section
          number={t.sections[0].number}
          title={t.sections[0].title}
          description={t.sections[0].desc}
        >
          <IPRouting />
        </Section>

        {/* 02 - ARP */}
        <Section
          number={t.sections[1].number}
          title={t.sections[1].title}
          description={t.sections[1].desc}
        >
          <ARPVisualizer />
        </Section>

        {/* 03 - IP Addressing */}
        <Section
          number={t.sections[2].number}
          title={t.sections[2].title}
          description={t.sections[2].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-5">
            {/* IPv4 */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex items-baseline gap-3 mb-2">
                <h5 className="text-sm font-semibold text-blue-300">
                  {t.ipInfo.ipv4.title}
                </h5>
                <span className="text-[10px] font-mono text-zinc-500">
                  {t.ipInfo.ipv4.format}
                </span>
              </div>
              <div className="font-mono text-lg text-white mb-2 tracking-wider">
                {t.ipInfo.ipv4.example}
              </div>
              <p className="text-[11px] text-zinc-400">{t.ipInfo.ipv4.desc}</p>
            </div>

            {/* IPv6 */}
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
              <div className="flex items-baseline gap-3 mb-2">
                <h5 className="text-sm font-semibold text-violet-300">
                  {t.ipInfo.ipv6.title}
                </h5>
                <span className="text-[10px] font-mono text-zinc-500">
                  {t.ipInfo.ipv6.format}
                </span>
              </div>
              <div className="font-mono text-sm text-white mb-2 tracking-wider break-all">
                {t.ipInfo.ipv6.example}
              </div>
              <p className="text-[11px] text-zinc-400">{t.ipInfo.ipv6.desc}</p>
            </div>

            {/* Classes */}
            <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-4">
              <table className="w-full text-[11px] font-mono">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-1.5 text-zinc-600">Class</th>
                    <th className="text-left py-1.5 text-zinc-600">Range</th>
                    <th className="text-left py-1.5 text-zinc-600">Use</th>
                  </tr>
                </thead>
                <tbody>
                  {t.ipInfo.classes.map((c) => (
                    <tr key={c.name} className="border-b border-zinc-800/50">
                      <td className="py-1.5 text-emerald-400">{c.name}</td>
                      <td className="py-1.5 text-zinc-400">{c.range}</td>
                      <td className="py-1.5 text-zinc-500">{c.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Private IP note */}
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-[11px] text-amber-300/80">
                {t.ipInfo.private}
              </p>
            </div>
          </div>
        </Section>

        {/* 04 - NAT */}
        <Section
          number={t.sections[3].number}
          title={t.sections[3].title}
          description={t.sections[3].desc}
        >
          <NATVisualizer />
        </Section>

        {/* summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold text-sm font-mono mb-5">
            {t.summary.title}
          </h3>
          <div className="space-y-3">
            {t.summary.items.map((item) => (
              <div key={item.label} className="flex gap-3 items-start">
                <span className="text-xs font-mono text-emerald-500/50 shrink-0 mt-0.5 min-w-[120px]">
                  {item.label}
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
