"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface StateNode {
  label: string;
  color: string;
  bgColor: string;
}

interface Transition {
  label: string;
  color: string;
}

interface Lane {
  titleKo: string;
  titleEn: string;
  accent: string;
  states: StateNode[];
  transitions: Transition[];
}

const CLIENT_LANE: Lane = {
  titleKo: "클라이언트",
  titleEn: "Client",
  accent: "text-blue-400",
  states: [
    { label: "CLOSED", color: "text-zinc-400", bgColor: "border-zinc-600/40 bg-zinc-800/40" },
    { label: "SYN_SENT", color: "text-blue-300", bgColor: "border-blue-500/40 bg-blue-500/10" },
    { label: "ESTABLISHED", color: "text-emerald-300", bgColor: "border-emerald-500/40 bg-emerald-500/10" },
  ],
  transitions: [
    { label: "send SYN", color: "text-blue-400/70" },
    { label: "recv SYN-ACK\nsend ACK", color: "text-blue-400/70" },
  ],
};

const SERVER_LANE: Lane = {
  titleKo: "서버",
  titleEn: "Server",
  accent: "text-green-400",
  states: [
    { label: "CLOSED", color: "text-zinc-400", bgColor: "border-zinc-600/40 bg-zinc-800/40" },
    { label: "LISTEN", color: "text-green-300", bgColor: "border-green-500/40 bg-green-500/10" },
    { label: "SYN_RECEIVED", color: "text-yellow-300", bgColor: "border-yellow-500/40 bg-yellow-500/10" },
    { label: "ESTABLISHED", color: "text-emerald-300", bgColor: "border-emerald-500/40 bg-emerald-500/10" },
  ],
  transitions: [
    { label: "passive open", color: "text-green-400/70" },
    { label: "recv SYN\nsend SYN-ACK", color: "text-green-400/70" },
    { label: "recv ACK", color: "text-green-400/70" },
  ],
};

function StateLane({ lane, lang }: { lane: Lane; lang: string }) {
  return (
    <div className="flex-1 rounded-xl border border-white/[0.06] bg-black/20 p-4">
      <div className={`text-xs font-mono font-semibold mb-4 ${lane.accent}`}>
        {lang === "ko" ? lane.titleKo : lane.titleEn}
      </div>
      <div className="flex flex-col gap-0">
        {lane.states.map((state, i) => (
          <div key={state.label} className="flex flex-col items-center">
            <div className={`w-full rounded-lg border px-3 py-2 text-center ${state.bgColor}`}>
              <span className={`text-xs font-mono font-semibold ${state.color}`}>{state.label}</span>
            </div>
            {i < lane.transitions.length && (
              <div className="flex flex-col items-center my-1.5">
                <div className="w-px h-3 bg-white/10" />
                <span className={`text-[10px] font-mono text-center whitespace-pre-line leading-tight ${lane.transitions[i].color}`}>
                  {lane.transitions[i].label}
                </span>
                <div className="w-px h-2 bg-white/10" />
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M4 6L0 0h8L4 6z" fill="rgba(255,255,255,0.15)" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const KO = {
  caption: "연결 수립 단계의 TCP 상태 전이 (RFC 793 기준, 간략화)",
  note: "* 실제 TCP 상태 기계는 TIME_WAIT, FIN_WAIT 등 연결 종료 상태를 포함하지만, 여기서는 Three-Way Handshake 구간만 표시합니다.",
};

const EN = {
  caption: "TCP state transitions during connection setup (RFC 793, simplified)",
  note: "* The full TCP state machine includes TIME_WAIT, FIN_WAIT, and other teardown states. Only the Three-Way Handshake segment is shown here.",
};

export default function TCPStateTransitions() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <p className="text-xs font-mono text-zinc-500 mb-4">{t.caption}</p>
      <div className="flex gap-4">
        <StateLane lane={CLIENT_LANE} lang={lang} />
        <StateLane lane={SERVER_LANE} lang={lang} />
      </div>
      <p className="text-[10px] text-zinc-600 mt-4 leading-relaxed">{t.note}</p>
    </div>
  );
}
