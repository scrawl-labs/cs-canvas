"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LayerDef {
  num: number;
  nameEn: string;
  nameKo: string;
  pdu: string;
  protocols: string[];
  colorClass: string;
  borderClass: string;
  bgClass: string;
  roleEn: string;
  roleKo: string;
  headerEn: string;
  headerKo: string;
}

const LAYERS: LayerDef[] = [
  {
    num: 7,
    nameEn: "Application",
    nameKo: "응용",
    pdu: "Data",
    protocols: ["HTTP", "DNS", "SMTP", "FTP"],
    colorClass: "text-blue-400",
    borderClass: "border-blue-400/30",
    bgClass: "bg-blue-400/[0.06]",
    roleEn: "Provides network services directly to end-user applications. Handles high-level protocols, data representation, and user authentication.",
    roleKo: "최종 사용자 애플리케이션에 네트워크 서비스를 직접 제공합니다. 고수준 프로토콜, 데이터 표현, 사용자 인증을 담당합니다.",
    headerEn: "No header added — this is the raw application payload (e.g., HTTP request body).",
    headerKo: "헤더 추가 없음 — 애플리케이션 페이로드 자체입니다 (예: HTTP 요청 본문).",
  },
  {
    num: 6,
    nameEn: "Presentation",
    nameKo: "표현",
    pdu: "Data",
    protocols: ["TLS/SSL", "JPEG", "gzip", "ASCII"],
    colorClass: "text-violet-400",
    borderClass: "border-violet-400/30",
    bgClass: "bg-violet-400/[0.06]",
    roleEn: "Translates data between application and network formats. Handles encryption, compression, and encoding so both sides speak the same language.",
    roleKo: "애플리케이션과 네트워크 형식 간 데이터를 변환합니다. 암호화, 압축, 인코딩을 처리해 양쪽이 동일한 형식으로 통신할 수 있게 합니다.",
    headerEn: "TLS wraps the payload with an encrypted record header including content type and version.",
    headerKo: "TLS는 콘텐츠 타입과 버전을 포함한 암호화된 레코드 헤더로 페이로드를 감쌉니다.",
  },
  {
    num: 5,
    nameEn: "Session",
    nameKo: "세션",
    pdu: "Data",
    protocols: ["NetBIOS", "RPC", "PPTP"],
    colorClass: "text-purple-400",
    borderClass: "border-purple-400/30",
    bgClass: "bg-purple-400/[0.06]",
    roleEn: "Manages and controls connections (sessions) between applications. Handles session establishment, maintenance, and termination.",
    roleKo: "애플리케이션 간의 세션을 관리하고 제어합니다. 세션 수립, 유지, 종료를 담당합니다.",
    headerEn: "Session tokens or identifiers may be embedded. In practice, often merged with the presentation or transport layer.",
    headerKo: "세션 토큰 또는 식별자가 포함될 수 있습니다. 실제로는 표현 계층이나 전송 계층과 통합되는 경우가 많습니다.",
  },
  {
    num: 4,
    nameEn: "Transport",
    nameKo: "전송",
    pdu: "Segment",
    protocols: ["TCP", "UDP"],
    colorClass: "text-rose-400",
    borderClass: "border-rose-400/30",
    bgClass: "bg-rose-400/[0.06]",
    roleEn: "Provides end-to-end communication between applications. TCP ensures reliable, ordered delivery; UDP offers low-latency connectionless transfer.",
    roleKo: "애플리케이션 간 종단 간 통신을 제공합니다. TCP는 신뢰성 있고 순서가 보장된 전달을, UDP는 저지연 비연결 전달을 제공합니다.",
    headerEn: "TCP header: source port, destination port, sequence number, ACK number, flags, window size (20 bytes minimum).",
    headerKo: "TCP 헤더: 출발지 포트, 목적지 포트, 시퀀스 번호, ACK 번호, 플래그, 윈도우 크기 (최소 20바이트).",
  },
  {
    num: 3,
    nameEn: "Network",
    nameKo: "네트워크",
    pdu: "Packet",
    protocols: ["IP", "ICMP", "OSPF", "BGP"],
    colorClass: "text-orange-400",
    borderClass: "border-orange-400/30",
    bgClass: "bg-orange-400/[0.06]",
    roleEn: "Routes packets across multiple networks. Determines the best path using IP addresses and routing tables.",
    roleKo: "여러 네트워크를 넘어 패킷을 라우팅합니다. IP 주소와 라우팅 테이블을 사용해 최적 경로를 결정합니다.",
    headerEn: "IP header: version, TTL, protocol, source IP, destination IP (20 bytes for IPv4).",
    headerKo: "IP 헤더: 버전, TTL, 프로토콜, 출발지 IP, 목적지 IP (IPv4 기준 20바이트).",
  },
  {
    num: 2,
    nameEn: "Data Link",
    nameKo: "데이터 링크",
    pdu: "Frame",
    protocols: ["Ethernet", "ARP", "MAC", "Wi-Fi 802.11"],
    colorClass: "text-amber-400",
    borderClass: "border-amber-400/30",
    bgClass: "bg-amber-400/[0.06]",
    roleEn: "Transfers frames between directly connected nodes. Handles MAC addressing, error detection (CRC), and flow control on the local link.",
    roleKo: "직접 연결된 노드 간에 프레임을 전송합니다. MAC 주소 지정, 오류 감지(CRC), 로컬 링크의 흐름 제어를 담당합니다.",
    headerEn: "Ethernet frame: preamble, destination MAC, source MAC, EtherType, payload, FCS trailer (4-byte CRC appended at the end).",
    headerKo: "이더넷 프레임: 프리앰블, 목적지 MAC, 출발지 MAC, EtherType, 페이로드, FCS 트레일러 (끝에 4바이트 CRC 추가).",
  },
  {
    num: 1,
    nameEn: "Physical",
    nameKo: "물리",
    pdu: "Bits",
    protocols: ["Cable", "Wi-Fi", "NIC", "Fiber"],
    colorClass: "text-zinc-400",
    borderClass: "border-zinc-400/30",
    bgClass: "bg-zinc-400/[0.06]",
    roleEn: "Transmits raw bit streams over the physical medium. Defines voltage levels, timing, and physical connectors.",
    roleKo: "물리적 매체를 통해 원시 비트 스트림을 전송합니다. 전압 레벨, 타이밍, 물리적 커넥터를 정의합니다.",
    headerEn: "No header — data is converted to electrical signals, light pulses, or radio waves.",
    headerKo: "헤더 없음 — 데이터가 전기 신호, 광 펄스, 또는 전파로 변환됩니다.",
  },
];

const KO = {
  pdu: "PDU",
  protocols: "프로토콜",
  role: "역할",
  header: "이 계층에서 추가되는 것",
};

const EN = {
  pdu: "PDU",
  protocols: "Protocols",
  role: "Role",
  header: "What gets added at this layer",
};

export default function OSILayerStack() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;
  const [expandedNum, setExpandedNum] = useState<number | null>(null);

  function toggle(num: number) {
    setExpandedNum((prev) => (prev === num ? null : num));
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <div className="divide-y divide-white/[0.05]">
        {LAYERS.map((layer) => {
          const isOpen = expandedNum === layer.num;
          return (
            <div key={layer.num}>
              <button
                onClick={() => toggle(layer.num)}
                className={`w-full text-left px-5 py-4 flex items-center gap-4 transition-colors hover:bg-white/[0.03] ${isOpen ? layer.bgClass : ""}`}
              >
                {/* layer number */}
                <span className="text-xs font-mono text-zinc-600 w-4 shrink-0">{layer.num}</span>

                {/* color bar */}
                <div className={`w-1 h-8 rounded-full shrink-0 ${layer.colorClass.replace("text-", "bg-").replace("-400", "-400/60")}`} />

                {/* name */}
                <span className={`text-sm font-bold w-28 shrink-0 ${layer.colorClass}`}>
                  {lang === "ko" ? layer.nameKo : layer.nameEn}
                </span>

                {/* PDU */}
                <span className="text-xs font-mono text-zinc-500 w-16 shrink-0">{layer.pdu}</span>

                {/* protocols */}
                <span className="text-xs text-zinc-600 hidden sm:block flex-1 truncate">
                  {layer.protocols.join(", ")}
                </span>

                {/* chevron */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className={`shrink-0 text-zinc-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                >
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isOpen && (
                <div className={`px-5 pb-5 pt-2 border-t ${layer.borderClass} ${layer.bgClass}`}>
                  <div className="ml-5 pl-4 border-l border-white/10 space-y-4">
                    {/* role */}
                    <div>
                      <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{t.role}</p>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        {lang === "ko" ? layer.roleKo : layer.roleEn}
                      </p>
                    </div>

                    {/* protocols */}
                    <div>
                      <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">{t.protocols}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {layer.protocols.map((p) => (
                          <span
                            key={p}
                            className={`text-xs font-mono px-2 py-0.5 rounded border ${layer.borderClass} ${layer.colorClass} ${layer.bgClass}`}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* header info */}
                    <div>
                      <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{t.header}</p>
                      <p className="text-zinc-400 text-xs leading-relaxed">
                        {lang === "ko" ? layer.headerKo : layer.headerEn}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
