"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface CardDef {
  numKo: string;
  numEn: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  accent: string;
  borderColor: string;
}

const CARDS: CardDef[] = [
  {
    numKo: "왜 1단계로 안 될까?",
    numEn: "Why not 1 step?",
    titleKo: "클라이언트가 서버의 수신 능력을 확인할 수 없다",
    titleEn: "Client cannot confirm server can receive",
    descKo: "클라이언트가 SYN만 보내면 서버가 패킷을 받았는지 알 수 없습니다. 네트워크 상의 패킷 손실이나 라우팅 오류로 인해 연결이 실제로 맺어졌는지 보장할 방법이 없습니다.",
    descEn: "If the client only sends SYN, it has no way to confirm the server received it. Packet loss or routing errors mean the connection may not actually exist.",
    accent: "text-red-400",
    borderColor: "border-red-500/20",
  },
  {
    numKo: "왜 2단계로 안 될까?",
    numEn: "Why not 2 steps?",
    titleKo: "서버가 클라이언트의 수신 능력을 확인할 수 없다",
    titleEn: "Server cannot confirm client can receive",
    descKo: "서버가 SYN-ACK를 보내도 클라이언트가 받았는지 서버는 모릅니다. 서버만 연결을 맺었다고 판단해 리소스를 할당하게 되면, Half-Open 연결이 발생합니다.",
    descEn: "Even if the server sends SYN-ACK, it doesn't know if the client received it. The server may allocate resources for a connection that the client never confirmed — a Half-Open connection.",
    accent: "text-amber-400",
    borderColor: "border-amber-500/20",
  },
  {
    numKo: "왜 3단계가 최솟값인가?",
    numEn: "3 is the minimum",
    titleKo: "양방향 송수신 능력을 모두 확인하는 최소 교환 횟수",
    titleEn: "Minimum exchanges to verify bidirectional send and receive",
    descKo: "3번의 패킷 교환으로 클라이언트-서버 양쪽 모두 '상대방이 보낼 수 있고 받을 수 있다'를 확인합니다. 4단계 이상은 이론상 중복이며, 3단계가 이 목표를 달성하는 가장 경제적인 방법입니다.",
    descEn: "Three exchanges let both sides verify 'the other side can send and receive.' Four or more steps would be redundant in theory — three is the most economical way to achieve mutual confirmation.",
    accent: "text-emerald-400",
    borderColor: "border-emerald-500/20",
  },
];

const KO = {
  calloutTitle: "SYN Flood / Half-Open 공격",
  calloutDesc: "공격자가 대량의 SYN 패킷을 서버에 보내고 ACK를 보내지 않으면, 서버는 SYN_RECEIVED 상태로 대기하며 연결 테이블(backlog queue)을 소진합니다. 이를 SYN Flood 공격이라 하며, 정상적인 새 연결을 수락할 수 없게 만드는 DoS 공격의 일종입니다. 서버는 SYN Cookie 기법으로 이에 대응합니다.",
};

const EN = {
  calloutTitle: "SYN Flood / Half-Open Attack",
  calloutDesc: "If an attacker sends a large volume of SYN packets but never completes the ACK, the server holds those connections in SYN_RECEIVED state, exhausting the backlog queue. This is a SYN Flood attack — a form of DoS that prevents the server from accepting legitimate connections. Servers mitigate this with SYN Cookies.",
};

export default function TCPWhyThreeWay() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CARDS.map((card) => (
          <div
            key={card.numEn}
            className={`rounded-2xl border ${card.borderColor} border-white/[0.06] bg-white/[0.02] p-5 flex flex-col gap-3`}
          >
            <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${card.accent}`}>
              {lang === "ko" ? card.numKo : card.numEn}
            </span>
            <h3 className="text-sm font-semibold text-white leading-snug">
              {lang === "ko" ? card.titleKo : card.titleEn}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {lang === "ko" ? card.descKo : card.descEn}
            </p>
          </div>
        ))}
      </div>

      {/* SYN Flood callout */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5">
        <div className="flex items-start gap-3">
          <div className="w-1 self-stretch rounded-full bg-red-500/40 shrink-0" />
          <div>
            <p className="text-xs font-mono font-semibold text-red-400 mb-1.5">{t.calloutTitle}</p>
            <p className="text-xs text-zinc-400 leading-relaxed">{t.calloutDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
