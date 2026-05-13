"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface RealWorldRow {
  num: number;
  nameEn: string;
  nameKo: string;
  colorClass: string;
  barClass: string;
  actionEn: string;
  actionKo: string;
  detailEn: string;
  detailKo: string;
}

const ROWS: RealWorldRow[] = [
  {
    num: 7,
    nameEn: "Application",
    nameKo: "응용",
    colorClass: "text-blue-400",
    barClass: "bg-blue-400",
    actionEn: "Browser sends HTTP GET request",
    actionKo: "브라우저가 HTTP GET 요청 전송",
    detailEn: "GET / HTTP/1.1  Host: example.com  Accept: text/html",
    detailKo: "GET / HTTP/1.1  Host: example.com  Accept: text/html",
  },
  {
    num: 6,
    nameEn: "Presentation",
    nameKo: "표현",
    colorClass: "text-violet-400",
    barClass: "bg-violet-400",
    actionEn: "TLS encrypts the payload",
    actionKo: "TLS가 페이로드를 암호화",
    detailEn: "TLS 1.3 handshake complete — payload is AES-256-GCM encrypted",
    detailKo: "TLS 1.3 핸드셰이크 완료 — 페이로드는 AES-256-GCM으로 암호화됨",
  },
  {
    num: 5,
    nameEn: "Session",
    nameKo: "세션",
    colorClass: "text-purple-400",
    barClass: "bg-purple-400",
    actionEn: "TCP session maintained",
    actionKo: "TCP 세션 유지",
    detailEn: "Session established via 3-way handshake — connection kept alive for HTTP/1.1 keep-alive",
    detailKo: "3-way 핸드셰이크로 세션 수립 — HTTP/1.1 keep-alive로 연결 유지",
  },
  {
    num: 4,
    nameEn: "Transport",
    nameKo: "전송",
    colorClass: "text-rose-400",
    barClass: "bg-rose-400",
    actionEn: "TCP segment with destination port 443",
    actionKo: "목적지 포트 443으로 TCP 세그먼트 생성",
    detailEn: "Src port: 54321  Dst port: 443  Seq: 1001  Flags: PSH, ACK",
    detailKo: "출발지 포트: 54321  목적지 포트: 443  Seq: 1001  Flags: PSH, ACK",
  },
  {
    num: 3,
    nameEn: "Network",
    nameKo: "네트워크",
    colorClass: "text-orange-400",
    barClass: "bg-orange-400",
    actionEn: "IP packet routed to destination IP",
    actionKo: "목적지 IP로 IP 패킷 라우팅",
    detailEn: "Src IP: 192.168.1.10  Dst IP: 93.184.216.34  TTL: 64  Protocol: TCP",
    detailKo: "출발지 IP: 192.168.1.10  목적지 IP: 93.184.216.34  TTL: 64  프로토콜: TCP",
  },
  {
    num: 2,
    nameEn: "Data Link",
    nameKo: "데이터 링크",
    colorClass: "text-amber-400",
    barClass: "bg-amber-400",
    actionEn: "Ethernet frame sent to next-hop MAC",
    actionKo: "다음 홉 MAC으로 이더넷 프레임 전송",
    detailEn: "Src MAC: aa:bb:cc:11:22:33  Dst MAC: (default gateway)  EtherType: 0x0800",
    detailKo: "출발지 MAC: aa:bb:cc:11:22:33  목적지 MAC: (기본 게이트웨이)  EtherType: 0x0800",
  },
  {
    num: 1,
    nameEn: "Physical",
    nameKo: "물리",
    colorClass: "text-zinc-400",
    barClass: "bg-zinc-400",
    actionEn: "Electrical/optical signals sent over wire/fiber",
    actionKo: "전선/광섬유를 통해 전기/광 신호 전송",
    detailEn: "Frame serialized as 1s and 0s — transmitted as voltage levels on Cat6 or light pulses on fiber",
    detailKo: "프레임이 1과 0으로 직렬화 — Cat6 케이블의 전압 레벨 또는 광섬유의 광 펄스로 전송",
  },
];

const KO = {
  subtitle: "https://example.com 을 방문할 때 각 계층에서 일어나는 일",
};

const EN = {
  subtitle: "What happens at each layer when you visit https://example.com",
};

export default function OSIRealWorld() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.05]">
        <p className="text-xs font-mono text-zinc-500">{t.subtitle}</p>
      </div>
      <div className="divide-y divide-white/[0.05]">
        {ROWS.map((row) => (
          <div key={row.num} className="flex gap-0">
            {/* color bar */}
            <div className={`w-1 shrink-0 ${row.barClass} opacity-60`} />

            <div className="flex-1 px-5 py-4">
              <div className="flex items-start gap-3">
                {/* layer number */}
                <span className="text-xs font-mono text-zinc-600 shrink-0 mt-0.5 w-4">{row.num}</span>

                <div className="flex-1 min-w-0">
                  {/* layer name + action */}
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1.5">
                    <span className={`text-xs font-bold font-mono ${row.colorClass}`}>
                      {lang === "ko" ? row.nameKo : row.nameEn}
                    </span>
                    <span className="text-sm text-white">
                      {lang === "ko" ? row.actionKo : row.actionEn}
                    </span>
                  </div>

                  {/* detail */}
                  <p className="text-[11px] font-mono text-zinc-600 leading-relaxed">
                    {lang === "ko" ? row.detailKo : row.detailEn}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
