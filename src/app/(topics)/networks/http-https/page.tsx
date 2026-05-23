"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import TLSHandshake from "@/components/networks/TLSHandshake";
import GoogleComJourney from "@/components/networks/GoogleComJourney";
import { ReactNode } from "react";

const KO = {
  breadcrumb: {
    home: "cs-canvas",
    networks: "networks",
    current: "http & https",
  },
  hero: {
    title: "HTTP & HTTPS",
    desc: "웹 브라우저에서 주소를 치면 무슨 일이 일어날까요?\nHTTP는 평문, HTTPS는 암호화 — TLS가 비대칭키로 안전하게 대칭키를 전달하는 과정을 따라갑니다.",
    tags: [
      "HTTP",
      "HTTPS",
      "TLS/SSL",
      "인증서",
      "비대칭키→대칭키",
      "google.com",
    ],
  },
  sections: [
    {
      number: "01",
      title: "HTTP vs HTTPS",
      desc: "HTTP(HyperText Transfer Protocol)는 웹에서 데이터를 주고받는 프로토콜입니다. HTTPS는 여기에 TLS(Transport Layer Security)를 씌워 통신 내용을 암호화합니다. HTTP는 평문 — 중간에서 누구나 읽을 수 있습니다.",
    },
    {
      number: "02",
      title: "TLS Handshake — 비대칭키에서 대칭키로",
      desc: "HTTPS 연결 시 TLS Handshake가 일어납니다. 서버는 CA가 서명한 인증서(공개키 포함)를 보내고, 클라이언트는 이를 검증한 뒤 공개키로 Pre-Master Secret을 암호화하여 전달합니다. 양쪽이 동일한 세션키(대칭키)를 유도하면, 이후 통신은 빠른 대칭 암호로 진행됩니다.",
    },
    {
      number: "03",
      title: "google.com을 치면 무슨 일이 일어나는가",
      desc: "URL 파싱 → HSTS 확인 → DNS 조회 → TCP 연결 → TLS Handshake → HTTP 요청 → 서버 처리 → 응답 수신 → 렌더링. 10단계의 여정을 하나씩 따라가봅니다.",
    },
  ],
  httpCompare: {
    title: "HTTP vs HTTPS 비교",
    headers: ["", "HTTP", "HTTPS"],
    rows: [
      ["포트", "80", "443"],
      ["암호화", "없음 (평문)", "TLS로 암호화"],
      ["인증서", "불필요", "CA 서명 인증서 필요"],
      ["속도", "약간 빠름", "핸드셰이크 오버헤드 (무시할 수준)"],
      ["보안", "도청/변조 가능", "기밀성 + 무결성 + 인증"],
      ["SEO", "불이익", "Google 권장, 랭킹 가산점"],
    ],
    warning:
      "HTTP는 패킷을 캡처하면 비밀번호, 쿠키, 모든 내용이 그대로 노출됩니다. 공공 Wi-Fi에서 HTTP 사이트를 이용하면 옆자리 사람이 볼 수 있습니다.",
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      {
        label: "HTTP",
        text: "평문 통신. 80번 포트. 빠르지만 보안 없음. 현재 대부분의 사이트에서 사용하지 않음.",
      },
      {
        label: "HTTPS",
        text: "HTTP + TLS. 443번 포트. 암호화 + 인증 + 무결성. 현대 웹의 기본.",
      },
      {
        label: "TLS Handshake",
        text: "Client Hello → 인증서 → Pre-Master Secret(비대칭) → 세션키(대칭). 비대칭은 키 전달용, 대칭은 실제 통신용.",
      },
      {
        label: "인증서 (Certificate)",
        text: "CA(인증기관)가 서명. 서버의 신원을 보증. 공개키를 포함. 브라우저에 내장된 CA 목록으로 검증.",
      },
      {
        label: "비대칭키",
        text: "공개키로 잠그고 개인키로만 열 수 있음. 느리지만 안전한 키 전달에 사용.",
      },
      {
        label: "대칭키",
        text: "같은 키로 암호화/복호화. 빠르지만 키를 안전하게 전달하는 게 문제 → TLS가 해결.",
      },
    ],
  },
};

const EN = {
  breadcrumb: {
    home: "cs-canvas",
    networks: "networks",
    current: "http & https",
  },
  hero: {
    title: "HTTP & HTTPS",
    desc: "What happens when you type a URL in the browser?\nHTTP is plaintext, HTTPS is encrypted — follow how TLS uses asymmetric keys to securely deliver symmetric keys.",
    tags: [
      "HTTP",
      "HTTPS",
      "TLS/SSL",
      "Certificate",
      "Asymmetric→Symmetric",
      "google.com",
    ],
  },
  sections: [
    {
      number: "01",
      title: "HTTP vs HTTPS",
      desc: "HTTP (HyperText Transfer Protocol) is the protocol for exchanging data on the web. HTTPS adds TLS (Transport Layer Security) to encrypt all communication. HTTP is plaintext — anyone in between can read it.",
    },
    {
      number: "02",
      title: "TLS Handshake — From Asymmetric to Symmetric",
      desc: "When connecting via HTTPS, a TLS Handshake occurs. The server sends a CA-signed certificate (containing its public key). The client verifies it, then encrypts a Pre-Master Secret with the public key. Both sides derive the same session key (symmetric), and all further communication uses fast symmetric encryption.",
    },
    {
      number: "03",
      title: "What Happens When You Type google.com",
      desc: "URL parsing → HSTS check → DNS resolution → TCP connection → TLS Handshake → HTTP request → Server processing → Response → Rendering. Follow all 10 steps of the journey.",
    },
  ],
  httpCompare: {
    title: "HTTP vs HTTPS Comparison",
    headers: ["", "HTTP", "HTTPS"],
    rows: [
      ["Port", "80", "443"],
      ["Encryption", "None (plaintext)", "Encrypted via TLS"],
      ["Certificate", "Not required", "CA-signed certificate required"],
      ["Speed", "Slightly faster", "Handshake overhead (negligible)"],
      [
        "Security",
        "Eavesdropping/tampering possible",
        "Confidentiality + Integrity + Authentication",
      ],
      ["SEO", "Penalized", "Google-recommended, ranking boost"],
    ],
    warning:
      "With HTTP, capturing packets exposes passwords, cookies, everything in plain text. Using HTTP on public Wi-Fi means the person next to you could read your traffic.",
  },
  summary: {
    title: "Key Concepts",
    items: [
      {
        label: "HTTP",
        text: "Plaintext communication. Port 80. Fast but no security. Rarely used by modern sites.",
      },
      {
        label: "HTTPS",
        text: "HTTP + TLS. Port 443. Encryption + authentication + integrity. The modern web standard.",
      },
      {
        label: "TLS Handshake",
        text: "Client Hello → Certificate → Pre-Master Secret (asymmetric) → Session key (symmetric). Asymmetric for key delivery, symmetric for actual communication.",
      },
      {
        label: "Certificate",
        text: "Signed by CA (Certificate Authority). Vouches for server identity. Contains public key. Verified using browser's built-in CA list.",
      },
      {
        label: "Asymmetric Key",
        text: "Lock with public key, only private key can unlock. Slow but used for secure key delivery.",
      },
      {
        label: "Symmetric Key",
        text: "Same key encrypts/decrypts. Fast but key delivery is the challenge → TLS solves this.",
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

export default function HttpHttpsPage() {
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

        {/* 01 - HTTP vs HTTPS */}
        <Section
          number={t.sections[0].number}
          title={t.sections[0].title}
          description={t.sections[0].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
            {/* Comparison table */}
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.httpCompare.headers.map((h, i) => (
                    <th
                      key={i}
                      className={`text-left py-2 ${i === 0 ? "text-zinc-600 w-24" : i === 1 ? "text-red-400" : "text-emerald-400"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.httpCompare.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-zinc-500">{row[0]}</td>
                    <td className="py-2 text-red-300/70">{row[1]}</td>
                    <td className="py-2 text-emerald-300/70">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Warning */}
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <p className="text-[11px] text-red-300/80">
                {t.httpCompare.warning}
              </p>
            </div>

            {/* Visual: HTTP vs HTTPS packets */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {/* HTTP */}
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center space-y-2">
                <div className="text-xs font-mono text-red-400 font-semibold">
                  HTTP
                </div>
                <div className="rounded bg-zinc-900/50 border border-zinc-700 p-2 font-mono text-[10px] text-zinc-300">
                  <div className="text-red-400/60 text-[9px] mb-1">
                    Packet captured:
                  </div>
                  <div>POST /login</div>
                  <div>user=admin</div>
                  <div>pass=1234</div>
                </div>
                <div className="text-[9px] text-red-400/60">
                  {lang === "ko" ? "누구나 읽을 수 있음" : "Anyone can read"}
                </div>
              </div>

              {/* HTTPS */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center space-y-2">
                <div className="text-xs font-mono text-emerald-400 font-semibold">
                  HTTPS
                </div>
                <div className="rounded bg-zinc-900/50 border border-zinc-700 p-2 font-mono text-[10px] text-zinc-300">
                  <div className="text-emerald-400/60 text-[9px] mb-1">
                    Packet captured:
                  </div>
                  <div>17 03 03 00 1C</div>
                  <div>A4 F2 8B 91 E7</div>
                  <div>3C 0D 72 FF A1</div>
                </div>
                <div className="text-[9px] text-emerald-400/60">
                  {lang === "ko"
                    ? "암호화 — 의미 없는 바이트"
                    : "Encrypted — meaningless bytes"}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 02 - TLS Handshake */}
        <Section
          number={t.sections[1].number}
          title={t.sections[1].title}
          description={t.sections[1].desc}
        >
          <TLSHandshake />
        </Section>

        {/* 03 - google.com Journey */}
        <Section
          number={t.sections[2].number}
          title={t.sections[2].title}
          description={t.sections[2].desc}
        >
          <GoogleComJourney />
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
