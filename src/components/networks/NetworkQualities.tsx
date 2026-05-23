"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Quality {
  id: string;
  icon: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  metricKo: string;
  metricEn: string;
  color: string;
  bgColor: string;
}

const QUALITIES: Quality[] = [
  {
    id: "throughput",
    icon: "⚡",
    titleKo: "높은 처리량",
    titleEn: "High Throughput",
    descKo:
      "단위 시간당 성공적으로 전달되는 데이터의 양. 대용량 트래픽을 처리할 수 있어야 합니다.",
    descEn:
      "Amount of data successfully delivered per unit time. Must handle large volumes of traffic.",
    metricKo: "측정: bps (bits per second)",
    metricEn: "Metric: bps (bits per second)",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/30",
  },
  {
    id: "latency",
    icon: "⏱",
    titleKo: "낮은 지연 시간",
    titleEn: "Low Latency",
    descKo:
      "메시지가 두 장치 사이를 왕복하는 데 걸리는 시간. 짧을수록 실시간 응답이 가능합니다.",
    descEn:
      "Round-trip time for a message between two devices. Lower means more responsive communication.",
    metricKo: "측정: ms (milliseconds)",
    metricEn: "Metric: ms (milliseconds)",
    color: "text-green-400",
    bgColor: "bg-green-500/10 border-green-500/30",
  },
  {
    id: "fault",
    icon: "🛡",
    titleKo: "높은 내결함성",
    titleEn: "Fault Tolerance",
    descKo:
      "장애가 발생해도 서비스가 중단되지 않는 능력. 이중화 경로와 failover 메커니즘이 핵심입니다.",
    descEn:
      "Ability to continue operating despite failures. Redundant paths and failover mechanisms are key.",
    metricKo: "측정: uptime %, MTBF",
    metricEn: "Metric: uptime %, MTBF",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/30",
  },
  {
    id: "security",
    icon: "🔒",
    titleKo: "강한 보안",
    titleEn: "Strong Security",
    descKo:
      "도청, 변조, 무단 접근으로부터 데이터를 보호. 암호화, 인증, 방화벽이 기본 방어선입니다.",
    descEn:
      "Protect data from eavesdropping, tampering, and unauthorized access. Encryption, authentication, firewalls.",
    metricKo: "방어: TLS, 방화벽, ACL",
    metricEn: "Defense: TLS, Firewall, ACL",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10 border-violet-500/30",
  },
];

const KO = {
  heading: "좋은 네트워크의 4가지 조건",
  clickHint: "카드를 클릭해서 자세히 보기",
};

const EN = {
  heading: "4 Qualities of a Good Network",
  clickHint: "Click a card for details",
};

export default function NetworkQualities() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;
  const [selected, setSelected] = useState<string | null>(null);

  const selectedQ = QUALITIES.find((q) => q.id === selected);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <p className="text-xs text-zinc-600 font-mono mb-4">{t.clickHint}</p>

      {/* 4 cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {QUALITIES.map((q) => (
          <button
            key={q.id}
            onClick={() => setSelected(selected === q.id ? null : q.id)}
            className={`relative rounded-xl border p-4 text-left transition-all duration-200 ${
              selected === q.id
                ? `${q.bgColor} scale-[1.02]`
                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
            }`}
          >
            <div className="text-2xl mb-2">{q.icon}</div>
            <div
              className={`text-xs font-semibold ${selected === q.id ? q.color : "text-zinc-300"}`}
            >
              {lang === "ko" ? q.titleKo : q.titleEn}
            </div>
          </button>
        ))}
      </div>

      {/* detail panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          selectedQ ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {selectedQ && (
          <div className={`rounded-xl border ${selectedQ.bgColor} p-4`}>
            <p className="text-sm text-zinc-300 leading-relaxed mb-2">
              {lang === "ko" ? selectedQ.descKo : selectedQ.descEn}
            </p>
            <p className={`text-xs font-mono ${selectedQ.color}`}>
              {lang === "ko" ? selectedQ.metricKo : selectedQ.metricEn}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
