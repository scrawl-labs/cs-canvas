"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface JourneyStep {
  id: number;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  layer: string;
  color: string;
  icon: string;
}

const JOURNEY: JourneyStep[] = [
  {
    id: 1,
    titleKo: "URL 입력 & 파싱",
    titleEn: "URL Input & Parsing",
    descKo:
      "브라우저는 입력값을 분석합니다. 'google.com'은 검색어인가 URL인가? `.com`이 있으므로 URL로 판단하고, 스킴이 없으면 `https://`를 자동으로 붙입니다.",
    descEn:
      "The browser analyzes the input. Is 'google.com' a search query or URL? Since `.com` is present, it's treated as URL. If no scheme, `https://` is prepended automatically.",
    layer: "Application",
    color: "border-blue-500/30 bg-blue-500/5",
    icon: "🔗",
  },
  {
    id: 2,
    titleKo: "HSTS 확인",
    titleEn: "HSTS Check",
    descKo:
      "브라우저의 HSTS(HTTP Strict Transport Security) 목록을 확인합니다. google.com은 HSTS preload 목록에 있으므로 반드시 HTTPS를 사용합니다. HTTP로는 절대 연결하지 않습니다.",
    descEn:
      "Browser checks its HSTS (HTTP Strict Transport Security) list. google.com is in the HSTS preload list, so HTTPS is mandatory. HTTP connection is never attempted.",
    layer: "Application",
    color: "border-blue-500/30 bg-blue-500/5",
    icon: "🔒",
  },
  {
    id: 3,
    titleKo: "DNS 조회",
    titleEn: "DNS Resolution",
    descKo:
      "브라우저 캐시 → OS 캐시 → hosts 파일 → 로컬 DNS 서버 → 루트 → .com TLD → google.com 권한 서버 순서로 IP를 찾습니다. 결과: 142.250.196.110 (예시)",
    descEn:
      "Browser cache → OS cache → hosts file → Local DNS → Root → .com TLD → google.com authoritative server. Result: 142.250.196.110 (example)",
    layer: "Application (DNS)",
    color: "border-cyan-500/30 bg-cyan-500/5",
    icon: "📖",
  },
  {
    id: 4,
    titleKo: "TCP 연결 (3-Way Handshake)",
    titleEn: "TCP Connection (3-Way Handshake)",
    descKo:
      "SYN → SYN-ACK → ACK. 브라우저(클라이언트)와 Google 서버가 TCP 연결을 수립합니다. HTTPS이므로 포트 443으로 연결합니다.",
    descEn:
      "SYN → SYN-ACK → ACK. Browser (client) and Google server establish a TCP connection. Since HTTPS, port 443 is used.",
    layer: "Transport (L4)",
    color: "border-green-500/30 bg-green-500/5",
    icon: "🤝",
  },
  {
    id: 5,
    titleKo: "TLS Handshake",
    titleEn: "TLS Handshake",
    descKo:
      "Client Hello → Server Hello + 인증서 → Pre-Master Secret(공개키로 암호화) → 세션키(대칭키) 생성. 비대칭키로 안전하게 키를 전달하고, 이후 빠른 대칭키로 전환합니다.",
    descEn:
      "Client Hello → Server Hello + Certificate → Pre-Master Secret (encrypted with public key) → Session key (symmetric) derived. Asymmetric key securely delivers the key, then switches to fast symmetric encryption.",
    layer: "Session/Presentation",
    color: "border-violet-500/30 bg-violet-500/5",
    icon: "🔐",
  },
  {
    id: 6,
    titleKo: "HTTP GET 요청",
    titleEn: "HTTP GET Request",
    descKo:
      "TLS 터널 안에서 HTTP GET / HTTP/2 요청을 보냅니다. Host: google.com, User-Agent, Accept-Language 등의 헤더가 포함됩니다.",
    descEn:
      "Inside the TLS tunnel, an HTTP GET / HTTP/2 request is sent. Headers include Host: google.com, User-Agent, Accept-Language, etc.",
    layer: "Application (L7)",
    color: "border-blue-500/30 bg-blue-500/5",
    icon: "📤",
  },
  {
    id: 7,
    titleKo: "IP 라우팅 & NAT",
    titleEn: "IP Routing & NAT",
    descKo:
      "패킷에 출발지/목적지 IP가 붙고, 라우터들이 홉-바이-홉으로 전달합니다. 가정에서는 NAT가 사설 IP를 공인 IP로 변환합니다. 이더넷 프레임(L2)으로 감싸져 물리 링크를 통해 전달됩니다.",
    descEn:
      "Packet gets source/destination IPs. Routers forward hop-by-hop. At home, NAT translates private IP to public. Wrapped in Ethernet frame (L2) for physical link transmission.",
    layer: "Network/Data Link (L3/L2)",
    color: "border-orange-500/30 bg-orange-500/5",
    icon: "🌍",
  },
  {
    id: 8,
    titleKo: "Google 서버 처리",
    titleEn: "Google Server Processing",
    descKo:
      "로드밸런서가 요청을 적절한 서버에 분배합니다. 서버는 사용자의 위치, 언어, 로그인 상태를 확인하고 검색 페이지 HTML을 생성합니다.",
    descEn:
      "Load balancer distributes the request to an appropriate server. Server checks user's location, language, login state, and generates the search page HTML.",
    layer: "Server-side",
    color: "border-amber-500/30 bg-amber-500/5",
    icon: "⚙️",
  },
  {
    id: 9,
    titleKo: "HTTP 응답 수신",
    titleEn: "HTTP Response Received",
    descKo:
      "HTTP 200 OK + HTML 문서가 돌아옵니다. Content-Encoding: br (Brotli 압축), Content-Type: text/html, 그리고 각종 보안 헤더(CSP, X-Frame-Options 등)가 포함됩니다.",
    descEn:
      "HTTP 200 OK + HTML document returns. Content-Encoding: br (Brotli), Content-Type: text/html, plus security headers (CSP, X-Frame-Options, etc.).",
    layer: "Application (L7)",
    color: "border-blue-500/30 bg-blue-500/5",
    icon: "📥",
  },
  {
    id: 10,
    titleKo: "브라우저 렌더링",
    titleEn: "Browser Rendering",
    descKo:
      "HTML 파싱 → DOM 트리 구성 → CSS 파싱 → CSSOM → Render Tree → Layout → Paint → Composite. 추가 리소스(JS, CSS, 이미지)는 병렬로 요청됩니다. 최종적으로 화면에 Google 검색 페이지가 표시됩니다.",
    descEn:
      "HTML parsing → DOM tree → CSS parsing → CSSOM → Render Tree → Layout → Paint → Composite. Additional resources (JS, CSS, images) are fetched in parallel. Finally, the Google search page is displayed.",
    layer: "Browser Engine",
    color: "border-pink-500/30 bg-pink-500/5",
    icon: "🖼️",
  },
];

export default function GoogleComJourney() {
  const [activeStep, setActiveStep] = useState(0);
  const { lang } = useLanguage();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
      {/* URL bar mockup */}
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2">
        <span className="text-emerald-400 text-xs">🔒</span>
        <span className="text-sm font-mono text-white">https://google.com</span>
        <span className="text-[10px] text-zinc-600 ml-auto font-mono">
          Enter ↵
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800" />

        <div className="space-y-1">
          {JOURNEY.map((s, i) => {
            const isActive = i === activeStep;
            const isPast = i < activeStep;
            const title = lang === "ko" ? s.titleKo : s.titleEn;
            const desc = lang === "ko" ? s.descKo : s.descEn;

            return (
              <div key={s.id}>
                <button
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left pl-10 pr-3 py-2 rounded-lg relative transition-all cursor-pointer ${
                    isActive ? s.color + " border" : "hover:bg-white/[0.02]"
                  }`}
                >
                  {/* Dot on timeline */}
                  <div
                    className={`absolute left-[11px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 transition-all ${
                      isActive
                        ? "border-emerald-400 bg-emerald-400 scale-125"
                        : isPast
                          ? "border-emerald-600 bg-emerald-600/50"
                          : "border-zinc-700 bg-zinc-900"
                    }`}
                  />

                  <div className="flex items-center gap-2">
                    <span className="text-sm">{s.icon}</span>
                    <span
                      className={`text-xs font-medium ${isActive ? "text-white" : isPast ? "text-zinc-400" : "text-zinc-500"}`}
                    >
                      {title}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-600 ml-auto">
                      {s.layer}
                    </span>
                  </div>
                </button>

                {/* Expanded detail */}
                {isActive && (
                  <div className="ml-10 mr-3 mt-1 mb-2 p-3 rounded-lg border border-white/5 bg-zinc-900/50">
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[10px] font-mono text-zinc-600">
          {activeStep + 1} / {JOURNEY.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            disabled={activeStep === 0}
            className="px-3 py-1 text-xs font-mono rounded border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            ← Prev
          </button>
          <button
            onClick={() =>
              setActiveStep((s) => Math.min(JOURNEY.length - 1, s + 1))
            }
            disabled={activeStep === JOURNEY.length - 1}
            className="px-3 py-1 text-xs font-mono rounded border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
