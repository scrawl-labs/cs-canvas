"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: {
    home: "cs-canvas",
    networks: "networks",
    current: "dns resolution",
  },
  hero: {
    title: "DNS Resolution",
    desc: "google.com을 어떻게 142.250.196.110으로 바꿀까?\nDNS는 인터넷의 전화번호부 — 도메인 이름을 IP 주소로 번역하는 계층적 분산 시스템입니다.",
    tags: [
      "DNS",
      "Recursive vs Iterative",
      "Root/TLD/Authoritative",
      "캐시 계층",
      "레코드 타입",
      "TTL",
    ],
  },
  sections: [
    {
      number: "01",
      title: "DNS란 무엇인가",
      desc: "사람은 'google.com'을 외우고 기계는 '142.250.196.110'을 다룹니다. DNS(Domain Name System)는 둘 사이를 번역하는 전 세계 분산 데이터베이스입니다. 1983년 이전에는 hosts.txt 파일 하나로 모든 호스트를 관리했지만, 인터넷이 커지면서 계층 구조로 진화했습니다.",
    },
    {
      number: "02",
      title: "DNS 계층 구조 — Root · TLD · Authoritative",
      desc: "도메인 이름은 오른쪽에서 왼쪽으로 읽습니다. `www.google.com.` — 끝의 점은 루트(.), 그다음 .com(TLD), 그다음 google.com(권한 서버). 각 계층은 다음 계층의 위치만 알고 있어, 책임을 분산합니다.",
    },
    {
      number: "03",
      title: "재귀적(Recursive) vs 반복적(Iterative) 쿼리",
      desc: "클라이언트는 로컬 DNS 서버(Recursive Resolver)에 '대신 찾아줘'라고 부탁합니다(재귀적). 로컬 DNS 서버는 루트부터 TLD, 권한 서버를 한 단계씩 직접 물어가며 답을 찾습니다(반복적). 클라이언트는 한 번만 물어도 되고, 일은 리졸버가 다 합니다.",
    },
    {
      number: "04",
      title: "DNS 조회 순서 — 캐시 계층",
      desc: "실제 DNS 쿼리가 발생하기 전에 여러 캐시를 거칩니다. 브라우저 → OS → hosts → 로컬 DNS 캐시 → (없으면) 외부 조회. 대부분의 요청은 캐시에서 끝납니다.",
    },
    {
      number: "05",
      title: "DNS 레코드 타입",
      desc: "DNS는 단순히 IP만 저장하지 않습니다. A, AAAA, CNAME, MX, NS, TXT — 각각 다른 종류의 정보를 담고 있습니다.",
    },
    {
      number: "06",
      title: "TTL과 캐싱",
      desc: "각 DNS 레코드는 TTL(Time To Live)을 가집니다. TTL이 짧으면 변경이 빠르게 반영되지만 부하가 늘고, 길면 빠르지만 변경 반영이 느립니다. CDN과 장애 조치(failover)는 짧은 TTL, 일반 웹사이트는 긴 TTL을 씁니다.",
    },
  ],
  hierarchy: {
    title: "도메인 계층 구조",
    levels: [
      { label: "Root", domain: ".", desc: "전 세계 13개 루트 서버 (a~m.root-servers.net)" },
      { label: "TLD", domain: ".com", desc: "Top-Level Domain — .com, .org, .net, .kr 등" },
      { label: "Authoritative", domain: "google.com", desc: "도메인 소유자가 운영하는 권한 서버" },
      { label: "Subdomain", domain: "www.google.com", desc: "권한 서버 안의 호스트 이름" },
    ],
  },
  queryFlow: {
    title: "google.com 조회 단계 (캐시 미스 가정)",
    steps: [
      { n: "1", from: "클라이언트", to: "로컬 DNS", q: "google.com 의 IP?", type: "재귀적" },
      { n: "2", from: "로컬 DNS", to: "Root 서버", q: ".com 권한 서버는?", type: "반복적" },
      { n: "3", from: "Root", to: "로컬 DNS", q: "a.gtld-servers.net 으로 가봐", type: "Referral" },
      { n: "4", from: "로컬 DNS", to: "TLD 서버", q: "google.com 권한 서버는?", type: "반복적" },
      { n: "5", from: "TLD", to: "로컬 DNS", q: "ns1.google.com 으로 가봐", type: "Referral" },
      { n: "6", from: "로컬 DNS", to: "권한 서버", q: "google.com 의 IP?", type: "반복적" },
      { n: "7", from: "권한 서버", to: "로컬 DNS", q: "142.250.196.110", type: "Answer" },
      { n: "8", from: "로컬 DNS", to: "클라이언트", q: "142.250.196.110 (TTL=300s)", type: "Answer" },
    ],
  },
  cacheLayers: {
    title: "DNS 캐시 계층 (위에서 아래로 조회)",
    layers: [
      { layer: "Browser Cache", desc: "Chrome: chrome://net-internals/#dns 에서 확인 가능. 보통 분 단위 캐시." },
      { layer: "OS Cache", desc: "운영체제의 DNS 캐시. Windows: ipconfig /displaydns, macOS: dscacheutil." },
      { layer: "hosts 파일", desc: "수동 매핑. /etc/hosts (Unix) 또는 C:\\Windows\\System32\\drivers\\etc\\hosts. 항상 우선." },
      { layer: "Local DNS (Resolver)", desc: "ISP 또는 8.8.8.8, 1.1.1.1 같은 퍼블릭 리졸버. 재귀 조회를 대신 수행." },
      { layer: "외부 DNS 서버", desc: "Root → TLD → Authoritative. 캐시가 모두 실패했을 때만 도달." },
    ],
  },
  records: {
    title: "주요 DNS 레코드 타입",
    headers: ["타입", "역할", "예시"],
    rows: [
      ["A", "도메인 → IPv4 주소", "google.com → 142.250.196.110"],
      ["AAAA", "도메인 → IPv6 주소", "google.com → 2404:6800:4004:80c::200e"],
      ["CNAME", "도메인 → 다른 도메인 (별명)", "www.example.com → example.com"],
      ["MX", "메일 서버 지정", "google.com → smtp.google.com (우선순위 10)"],
      ["NS", "권한 네임서버 지정", "google.com → ns1.google.com"],
      ["TXT", "임의의 텍스트 (SPF, 도메인 인증 등)", "v=spf1 include:_spf.google.com ~all"],
      ["SOA", "권한 시작 (Start of Authority)", "ns1.google.com dns-admin.google.com ..."],
      ["PTR", "IP → 도메인 (역방향 조회)", "142.250.196.110 → google.com"],
    ],
  },
  recursiveVsIterative: {
    title: "재귀적 vs 반복적",
    headers: ["", "재귀적 (Recursive)", "반복적 (Iterative)"],
    rows: [
      ["주체", "클라이언트 → 로컬 DNS", "로컬 DNS → Root/TLD/Authoritative"],
      ["요청 횟수", "한 번", "여러 단계 (3~4번)"],
      ["응답 방식", "최종 답 또는 에러", "다음 서버 위치(Referral) 반환"],
      ["부담", "리졸버에 집중", "분산됨"],
      ["사용처", "엔드 유저 ↔ 리졸버", "리졸버 ↔ 권한 서버 트리"],
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      {
        label: "DNS",
        text: "도메인 이름 ↔ IP 주소 매핑. 인터넷의 전화번호부. 계층적 분산 시스템.",
      },
      {
        label: "계층 구조",
        text: "Root(.) → TLD(.com) → Authoritative(google.com) → Subdomain(www). 각 계층은 다음 단계 위치만 안다.",
      },
      {
        label: "재귀적 쿼리",
        text: "클라이언트는 한 번만 묻는다. '대신 찾아줘' — 답을 받을 때까지 기다림.",
      },
      {
        label: "반복적 쿼리",
        text: "로컬 DNS가 Root → TLD → 권한 서버 순으로 직접 물어간다. 각 서버는 '다음 곳은 여기'라고 알려줌(Referral).",
      },
      {
        label: "캐시 계층",
        text: "Browser → OS → hosts → Local DNS → 외부 서버. 대부분 캐시 단계에서 끝나 외부 조회는 드물다.",
      },
      {
        label: "레코드 타입",
        text: "A(IPv4), AAAA(IPv6), CNAME(별명), MX(메일), NS(네임서버), TXT(텍스트), PTR(역방향). 용도별로 분리.",
      },
      {
        label: "TTL",
        text: "캐시 유효 시간(초). 짧으면 변경 빠름·부하 증가, 길면 반대. CDN/장애조치는 짧게, 일반은 길게.",
      },
      {
        label: "퍼블릭 리졸버",
        text: "Google 8.8.8.8, Cloudflare 1.1.1.1. ISP 리졸버보다 빠르고 프라이버시 정책이 명확한 경우가 많다.",
      },
    ],
  },
};

const EN = {
  breadcrumb: {
    home: "cs-canvas",
    networks: "networks",
    current: "dns resolution",
  },
  hero: {
    title: "DNS Resolution",
    desc: "How does google.com become 142.250.196.110?\nDNS is the internet's phonebook — a hierarchical, distributed system that translates domain names into IP addresses.",
    tags: [
      "DNS",
      "Recursive vs Iterative",
      "Root/TLD/Authoritative",
      "Cache layers",
      "Record types",
      "TTL",
    ],
  },
  sections: [
    {
      number: "01",
      title: "What is DNS",
      desc: "Humans remember 'google.com', machines deal with '142.250.196.110'. DNS (Domain Name System) is the global, distributed database that translates between the two. Before 1983 a single hosts.txt file managed everything; as the internet grew, DNS evolved into a hierarchy.",
    },
    {
      number: "02",
      title: "DNS Hierarchy — Root · TLD · Authoritative",
      desc: "Domain names are read right to left. `www.google.com.` — the trailing dot is root, then .com (TLD), then google.com (authoritative). Each level only knows where to find the next, distributing responsibility.",
    },
    {
      number: "03",
      title: "Recursive vs Iterative Queries",
      desc: "The client asks the local DNS (Recursive Resolver) to 'find it for me' (recursive). The resolver then walks Root → TLD → authoritative server one step at a time (iterative). The client asks once; the resolver does all the work.",
    },
    {
      number: "04",
      title: "DNS Lookup Order — Cache Layers",
      desc: "Before a real DNS query fires, multiple caches are checked. Browser → OS → hosts → Local DNS cache → (miss) external lookup. Most requests end in cache.",
    },
    {
      number: "05",
      title: "DNS Record Types",
      desc: "DNS stores more than IPs. A, AAAA, CNAME, MX, NS, TXT — each carries a different kind of information.",
    },
    {
      number: "06",
      title: "TTL and Caching",
      desc: "Every DNS record has a TTL (Time To Live). Short TTL = changes propagate fast but load is higher. Long TTL = fast lookups but slow propagation. CDN and failover use short TTL; normal sites use long TTL.",
    },
  ],
  hierarchy: {
    title: "Domain Hierarchy",
    levels: [
      { label: "Root", domain: ".", desc: "13 root servers worldwide (a~m.root-servers.net)" },
      { label: "TLD", domain: ".com", desc: "Top-Level Domain — .com, .org, .net, .kr, etc." },
      { label: "Authoritative", domain: "google.com", desc: "Authoritative server run by the domain owner" },
      { label: "Subdomain", domain: "www.google.com", desc: "Hostname under the authoritative zone" },
    ],
  },
  queryFlow: {
    title: "Resolving google.com (cache miss)",
    steps: [
      { n: "1", from: "Client", to: "Local DNS", q: "IP of google.com?", type: "Recursive" },
      { n: "2", from: "Local DNS", to: "Root server", q: "Who owns .com?", type: "Iterative" },
      { n: "3", from: "Root", to: "Local DNS", q: "Try a.gtld-servers.net", type: "Referral" },
      { n: "4", from: "Local DNS", to: "TLD server", q: "Who owns google.com?", type: "Iterative" },
      { n: "5", from: "TLD", to: "Local DNS", q: "Try ns1.google.com", type: "Referral" },
      { n: "6", from: "Local DNS", to: "Authoritative", q: "IP of google.com?", type: "Iterative" },
      { n: "7", from: "Authoritative", to: "Local DNS", q: "142.250.196.110", type: "Answer" },
      { n: "8", from: "Local DNS", to: "Client", q: "142.250.196.110 (TTL=300s)", type: "Answer" },
    ],
  },
  cacheLayers: {
    title: "DNS Cache Layers (checked top to bottom)",
    layers: [
      { layer: "Browser Cache", desc: "Chrome: see chrome://net-internals/#dns. Usually cached for minutes." },
      { layer: "OS Cache", desc: "Operating system DNS cache. Windows: ipconfig /displaydns. macOS: dscacheutil." },
      { layer: "hosts file", desc: "Manual mapping. /etc/hosts (Unix) or C:\\Windows\\System32\\drivers\\etc\\hosts. Always wins." },
      { layer: "Local DNS (Resolver)", desc: "ISP DNS or public resolvers like 8.8.8.8, 1.1.1.1. Performs recursive lookup on your behalf." },
      { layer: "External DNS", desc: "Root → TLD → Authoritative. Only reached when every cache misses." },
    ],
  },
  records: {
    title: "Common DNS Record Types",
    headers: ["Type", "Purpose", "Example"],
    rows: [
      ["A", "Domain → IPv4 address", "google.com → 142.250.196.110"],
      ["AAAA", "Domain → IPv6 address", "google.com → 2404:6800:4004:80c::200e"],
      ["CNAME", "Domain → another domain (alias)", "www.example.com → example.com"],
      ["MX", "Mail server", "google.com → smtp.google.com (priority 10)"],
      ["NS", "Authoritative name server", "google.com → ns1.google.com"],
      ["TXT", "Arbitrary text (SPF, domain proof)", "v=spf1 include:_spf.google.com ~all"],
      ["SOA", "Start of Authority", "ns1.google.com dns-admin.google.com ..."],
      ["PTR", "IP → domain (reverse lookup)", "142.250.196.110 → google.com"],
    ],
  },
  recursiveVsIterative: {
    title: "Recursive vs Iterative",
    headers: ["", "Recursive", "Iterative"],
    rows: [
      ["Actor", "Client → Local DNS", "Local DNS → Root/TLD/Authoritative"],
      ["Number of calls", "One", "Several steps (3–4)"],
      ["Response form", "Final answer or error", "Referral to next server"],
      ["Burden", "Concentrated on resolver", "Distributed"],
      ["Where used", "End user ↔ resolver", "Resolver ↔ authoritative tree"],
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      {
        label: "DNS",
        text: "Domain name ↔ IP address mapping. The internet's phonebook. Hierarchical and distributed.",
      },
      {
        label: "Hierarchy",
        text: "Root(.) → TLD(.com) → Authoritative(google.com) → Subdomain(www). Each level only knows the next.",
      },
      {
        label: "Recursive query",
        text: "Client asks once: 'find it for me'. Waits for the final answer.",
      },
      {
        label: "Iterative query",
        text: "Local DNS walks Root → TLD → Authoritative itself. Each server replies with a Referral to the next.",
      },
      {
        label: "Cache layers",
        text: "Browser → OS → hosts → Local DNS → external. Most queries end at a cache, so external lookups are rare.",
      },
      {
        label: "Record types",
        text: "A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), NS (nameserver), TXT (text), PTR (reverse). Separated by purpose.",
      },
      {
        label: "TTL",
        text: "Cache lifetime in seconds. Short = fast changes, more load. Long = the opposite. CDN/failover use short; normal sites long.",
      },
      {
        label: "Public resolvers",
        text: "Google 8.8.8.8, Cloudflare 1.1.1.1. Often faster than ISP resolvers and with clearer privacy policies.",
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
          <span className="text-xs font-mono text-cyan-500/60">{number}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function DnsResolutionPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(34,211,238,0.05),transparent)]" />

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

        {/* 01 - What is DNS */}
        <Section
          number={t.sections[0].number}
          title={t.sections[0].title}
          description={t.sections[0].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-zinc-700/40 bg-zinc-900/30 p-4">
                <div className="text-[10px] font-mono text-zinc-500 mb-2">
                  {lang === "ko" ? "사람이 보는 것" : "What humans see"}
                </div>
                <div className="font-mono text-cyan-300 text-lg">
                  google.com
                </div>
                <div className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                  {lang === "ko"
                    ? "기억하기 쉽고, 의미가 있고, 브랜드가 됨"
                    : "Easy to remember, meaningful, brandable"}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-700/40 bg-zinc-900/30 p-4">
                <div className="text-[10px] font-mono text-zinc-500 mb-2">
                  {lang === "ko" ? "기계가 보는 것" : "What machines see"}
                </div>
                <div className="font-mono text-emerald-300 text-lg">
                  142.250.196.110
                </div>
                <div className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                  {lang === "ko"
                    ? "라우팅 가능한 IP 주소 — 패킷의 목적지"
                    : "Routable IP address — destination for packets"}
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-xs text-zinc-500 font-mono">
              DNS ={" "}
              <span className="text-cyan-400">
                {lang === "ko" ? "둘 사이의 번역" : "translation between the two"}
              </span>
            </div>
          </div>
        </Section>

        {/* 02 - Hierarchy */}
        <Section
          number={t.sections[1].number}
          title={t.sections[1].title}
          description={t.sections[1].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-4">
              {t.hierarchy.title}
            </h3>
            <div className="space-y-2">
              {t.hierarchy.levels.map((level, i) => (
                <div
                  key={level.label}
                  className="flex items-center gap-3"
                  style={{ paddingLeft: `${i * 16}px` }}
                >
                  <span className="text-zinc-600 font-mono text-xs">
                    {i === 0 ? "┌" : "└─"}
                  </span>
                  <div className="flex-1 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-wider mr-2">
                          {level.label}
                        </span>
                        <span className="font-mono text-sm text-white">
                          {level.domain}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      {level.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 03 - Recursive vs Iterative */}
        <Section
          number={t.sections[2].number}
          title={t.sections[2].title}
          description={t.sections[2].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
            {/* Query flow */}
            <div>
              <h3 className="text-xs font-mono text-zinc-400 mb-4">
                {t.queryFlow.title}
              </h3>
              <div className="space-y-1.5">
                {t.queryFlow.steps.map((step) => {
                  const isAnswer = step.type === "Answer";
                  const isReferral = step.type === "Referral";
                  const isRecursive = step.type === "Recursive" || step.type === "재귀적";
                  return (
                    <div
                      key={step.n}
                      className="grid grid-cols-[24px_90px_24px_110px_1fr_70px] items-center gap-2 text-[11px] font-mono"
                    >
                      <span className="text-zinc-600">{step.n}.</span>
                      <span className="text-zinc-400 truncate">{step.from}</span>
                      <span className="text-zinc-600 text-center">→</span>
                      <span className="text-zinc-400 truncate">{step.to}</span>
                      <span
                        className={
                          isAnswer
                            ? "text-emerald-300/80 truncate"
                            : "text-zinc-500 truncate"
                        }
                      >
                        {step.q}
                      </span>
                      <span
                        className={`text-[9px] uppercase tracking-wider text-center rounded px-1 py-0.5 border ${
                          isAnswer
                            ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                            : isReferral
                              ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                              : isRecursive
                                ? "text-violet-400 border-violet-500/30 bg-violet-500/10"
                                : "text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
                        }`}
                      >
                        {step.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comparison table */}
            <div>
              <h3 className="text-xs font-mono text-zinc-400 mb-3">
                {t.recursiveVsIterative.title}
              </h3>
              <table className="w-full text-[11px] font-mono">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {t.recursiveVsIterative.headers.map((h, i) => (
                      <th
                        key={i}
                        className={`text-left py-2 ${
                          i === 0
                            ? "text-zinc-600 w-32"
                            : i === 1
                              ? "text-violet-400"
                              : "text-cyan-400"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.recursiveVsIterative.rows.map((row, i) => (
                    <tr key={i} className="border-b border-zinc-800/50">
                      <td className="py-2 text-zinc-500">{row[0]}</td>
                      <td className="py-2 text-violet-300/70">{row[1]}</td>
                      <td className="py-2 text-cyan-300/70">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* 04 - Cache layers */}
        <Section
          number={t.sections[3].number}
          title={t.sections[3].title}
          description={t.sections[3].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-4">
              {t.cacheLayers.title}
            </h3>
            <div className="space-y-1">
              {t.cacheLayers.layers.map((c, i) => (
                <div key={c.layer}>
                  <div className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 px-3 py-2 flex items-start gap-3">
                    <span className="text-[10px] font-mono text-zinc-600 mt-0.5 min-w-[16px]">
                      {i + 1}.
                    </span>
                    <div className="flex-1">
                      <div className="text-xs font-mono text-cyan-300">
                        {c.layer}
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">
                        {c.desc}
                      </p>
                    </div>
                  </div>
                  {i < t.cacheLayers.layers.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <span className="text-zinc-700 text-xs">↓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 05 - Record types */}
        <Section
          number={t.sections[4].number}
          title={t.sections[4].title}
          description={t.sections[4].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">
              {t.records.title}
            </h3>
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.records.headers.map((h, i) => (
                    <th
                      key={i}
                      className={`text-left py-2 ${
                        i === 0
                          ? "text-cyan-400 w-16"
                          : i === 1
                            ? "text-zinc-400 w-56"
                            : "text-zinc-500"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.records.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-cyan-300/80 font-semibold">
                      {row[0]}
                    </td>
                    <td className="py-2 text-zinc-400">{row[1]}</td>
                    <td className="py-2 text-zinc-500 text-[10px] break-all">
                      {row[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 06 - TTL */}
        <Section
          number={t.sections[5].number}
          title={t.sections[5].title}
          description={t.sections[5].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-amber-400 font-semibold">
                    {lang === "ko" ? "짧은 TTL (60s)" : "Short TTL (60s)"}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400/60">
                    CDN, failover
                  </span>
                </div>
                <ul className="text-[11px] text-zinc-400 space-y-1 leading-relaxed">
                  <li>
                    +{" "}
                    {lang === "ko"
                      ? "장애 시 빠르게 다른 IP로 전환"
                      : "Fast cutover to another IP on failure"}
                  </li>
                  <li>
                    +{" "}
                    {lang === "ko"
                      ? "트래픽 라우팅 변경이 즉각 반영"
                      : "Traffic routing changes apply quickly"}
                  </li>
                  <li>
                    −{" "}
                    {lang === "ko"
                      ? "권한 서버에 부하 집중"
                      : "More load on authoritative servers"}
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    {lang === "ko" ? "긴 TTL (24h)" : "Long TTL (24h)"}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400/60">
                    {lang === "ko" ? "일반 웹사이트" : "Typical websites"}
                  </span>
                </div>
                <ul className="text-[11px] text-zinc-400 space-y-1 leading-relaxed">
                  <li>
                    +{" "}
                    {lang === "ko"
                      ? "캐시 적중률이 높아 조회가 빠름"
                      : "High cache hit rate, fast lookups"}
                  </li>
                  <li>
                    +{" "}
                    {lang === "ko"
                      ? "권한 서버 부하 적음"
                      : "Lower load on authoritative servers"}
                  </li>
                  <li>
                    −{" "}
                    {lang === "ko"
                      ? "IP 변경이 전 세계에 반영되기까지 오래 걸림"
                      : "IP changes take long to propagate globally"}
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
              <p className="text-[11px] text-cyan-300/80 leading-relaxed">
                {lang === "ko"
                  ? "💡 도메인 이전 전에는 TTL을 미리 낮춰두는 것이 정석. 이전 작업 며칠 전에 TTL을 24h → 60s로 줄여놓으면, 실제 변경 시 캐시가 빠르게 갱신됩니다."
                  : "💡 Lower the TTL before a planned migration. Reducing TTL from 24h to 60s a few days before the change lets caches refresh quickly when you flip the record."}
              </p>
            </div>
          </div>
        </Section>

        {/* summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold text-sm font-mono mb-5">
            {t.summary.title}
          </h3>
          <div className="space-y-3">
            {t.summary.items.map((item) => (
              <div key={item.label} className="flex gap-3 items-start">
                <span className="text-xs font-mono text-cyan-500/50 shrink-0 mt-0.5 min-w-[120px]">
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
