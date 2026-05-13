"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StepDef {
  clientState: string;
  serverState: string;
  packetDir: "none" | "left-to-right" | "right-to-left";
  packetLabel: string;
  packetColor: string;
  packetFields: { flags: string; seq?: number; ack?: number } | null;
  headlineKo: string;
  headlineEn: string;
  descKo: string;
  descEn: string;
}

const STEPS: StepDef[] = [
  {
    clientState: "ESTABLISHED",
    serverState: "ESTABLISHED",
    packetDir: "none",
    packetLabel: "",
    packetColor: "",
    packetFields: null,
    headlineKo: "연결 수립 상태 — 클라이언트가 종료를 시작",
    headlineEn: "ESTABLISHED — Client Initiates Close",
    descKo: "양쪽 모두 ESTABLISHED 상태입니다. 클라이언트가 더 이상 보낼 데이터가 없어 연결 종료를 시작합니다.",
    descEn: "Both sides are in ESTABLISHED state. The client has no more data to send and initiates the connection teardown.",
  },
  {
    clientState: "FIN_WAIT_1",
    serverState: "ESTABLISHED",
    packetDir: "left-to-right",
    packetLabel: "FIN",
    packetColor: "bg-blue-500/20 border-blue-500/60 text-blue-300",
    packetFields: { flags: "FIN", seq: 200 },
    headlineKo: "FIN — 클라이언트가 종료 요청",
    headlineEn: "FIN — Client Requests Close",
    descKo: "클라이언트가 FIN 패킷(seq=200)을 전송합니다. 클라이언트는 FIN_WAIT_1 상태로 전이되며 서버의 ACK를 기다립니다.",
    descEn: "The client sends a FIN packet (seq=200) and transitions to FIN_WAIT_1, waiting for the server's ACK.",
  },
  {
    clientState: "FIN_WAIT_2",
    serverState: "CLOSE_WAIT",
    packetDir: "right-to-left",
    packetLabel: "ACK",
    packetColor: "bg-green-500/20 border-green-500/60 text-green-300",
    packetFields: { flags: "ACK", ack: 201 },
    headlineKo: "ACK — 서버가 종료 요청 수신 확인",
    headlineEn: "ACK — Server Acknowledges FIN",
    descKo: "서버가 ACK(ack=201)를 보냅니다. 클라이언트는 FIN_WAIT_2로 전이됩니다. 서버는 CLOSE_WAIT 상태에서 남은 데이터를 계속 전송할 수 있습니다(Half-Close).",
    descEn: "The server sends ACK (ack=201). Client moves to FIN_WAIT_2. The server enters CLOSE_WAIT and may still send remaining data (Half-Close).",
  },
  {
    clientState: "TIME_WAIT",
    serverState: "LAST_ACK",
    packetDir: "right-to-left",
    packetLabel: "FIN",
    packetColor: "bg-amber-500/20 border-amber-500/60 text-amber-300",
    packetFields: { flags: "FIN", seq: 500 },
    headlineKo: "FIN — 서버가 종료 요청",
    headlineEn: "FIN — Server Requests Close",
    descKo: "서버가 남은 데이터 전송을 마치고 FIN 패킷(seq=500)을 보냅니다. 서버는 LAST_ACK로 전이되고 클라이언트는 TIME_WAIT 상태가 됩니다.",
    descEn: "After finishing data transmission, the server sends FIN (seq=500) and moves to LAST_ACK. The client transitions to TIME_WAIT.",
  },
  {
    clientState: "TIME_WAIT",
    serverState: "CLOSED",
    packetDir: "left-to-right",
    packetLabel: "ACK",
    packetColor: "bg-violet-500/20 border-violet-500/60 text-violet-300",
    packetFields: { flags: "ACK", ack: 501 },
    headlineKo: "ACK — 클라이언트가 최종 확인 응답",
    headlineEn: "ACK — Client Sends Final Acknowledgment",
    descKo: "클라이언트가 ACK(ack=501)를 보냅니다. 서버는 즉시 CLOSED 상태가 됩니다. 클라이언트는 2MSL 타이머 동안 TIME_WAIT를 유지합니다.",
    descEn: "The client sends ACK (ack=501). The server immediately closes. The client stays in TIME_WAIT for a 2MSL timer to handle any delayed packets.",
  },
  {
    clientState: "CLOSED",
    serverState: "CLOSED",
    packetDir: "none",
    packetLabel: "",
    packetColor: "",
    packetFields: null,
    headlineKo: "연결 완전 종료 — 2MSL 대기 후 CLOSED",
    headlineEn: "Fully Closed — After 2MSL Timer Expires",
    descKo: "2MSL 타이머가 만료되면 클라이언트도 CLOSED 상태가 됩니다. 연결이 완전히 종료되었습니다.",
    descEn: "Once the 2MSL timer expires, the client also moves to CLOSED. The connection is fully terminated.",
  },
];

const KO = {
  client: "클라이언트",
  server: "서버",
  prev: "← 이전",
  next: "다음 →",
  autoPlay: "자동 재생",
  pause: "일시정지",
  step: "단계",
  closed: "연결이 완전히 종료되었습니다.",
  timeWaitTitle: "TIME_WAIT와 2MSL",
  timeWaitBody: [
    "2MSL(Maximum Segment Lifetime × 2)은 보통 60~120초입니다.",
    "목적: 마지막 ACK가 유실되어 서버가 FIN을 재전송하더라도 클라이언트가 응답할 수 있습니다.",
    "문제: 트래픽이 많은 서버에서 TIME_WAIT 소켓이 다량 누적되어 포트 고갈이 발생할 수 있습니다.",
    "대응: SO_REUSEADDR 소켓 옵션, 리눅스의 tcp_tw_reuse / tcp_tw_recycle 커널 파라미터로 완화합니다.",
  ],
};

const EN = {
  client: "Client",
  server: "Server",
  prev: "← prev",
  next: "next →",
  autoPlay: "Auto Play",
  pause: "Pause",
  step: "Step",
  closed: "Connection fully terminated.",
  timeWaitTitle: "TIME_WAIT & 2MSL",
  timeWaitBody: [
    "2MSL (Maximum Segment Lifetime × 2) is typically 60–120 seconds.",
    "Purpose: If the final ACK is lost and the server retransmits FIN, the client can still respond.",
    "Problem: High-traffic servers accumulate large numbers of TIME_WAIT sockets, potentially exhausting ephemeral ports.",
    "Mitigation: SO_REUSEADDR socket option, or Linux kernel params tcp_tw_reuse / tcp_tw_recycle.",
  ],
};

function StateBadge({ state, accent }: { state: string; accent: "blue" | "green" }) {
  const isClosed = state === "CLOSED";
  const isTimeWait = state === "TIME_WAIT";
  const base = accent === "blue"
    ? "border-blue-500/40 text-blue-400 bg-blue-500/10"
    : "border-green-500/40 text-green-400 bg-green-500/10";
  const closedStyle = "border-zinc-500/40 text-zinc-500 bg-zinc-500/10";
  const timeWaitStyle = "border-amber-500/40 text-amber-400 bg-amber-500/10";
  const cls = isClosed ? closedStyle : isTimeWait ? timeWaitStyle : base;
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${cls}`}>
      {state}
    </span>
  );
}

function PacketPill({ step }: { step: StepDef }) {
  if (step.packetDir === "none" || !step.packetFields) return null;
  const isLTR = step.packetDir === "left-to-right";

  return (
    <div className={`flex flex-col items-center gap-2 transition-all duration-700 ${isLTR ? "items-start ml-[10%]" : "items-end mr-[10%]"}`}>
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-semibold ${step.packetColor}`}>
        <span>{step.packetLabel}</span>
        {(step.packetFields.seq !== undefined || step.packetFields.ack !== undefined) && (
          <>
            <span className="text-white/30">|</span>
            <span className="opacity-70">
              {step.packetFields.seq !== undefined && `seq=${step.packetFields.seq}`}
              {step.packetFields.ack !== undefined && `, ack=${step.packetFields.ack}`}
            </span>
          </>
        )}
      </div>
      <div className={`flex gap-3 text-[10px] font-mono text-zinc-500 ${isLTR ? "" : "flex-row-reverse"}`}>
        <span>Flags: <span className="text-zinc-300">{step.packetFields.flags}</span></span>
        {step.packetFields.seq !== undefined && (
          <span>Seq: <span className="text-zinc-300">{step.packetFields.seq}</span></span>
        )}
        {step.packetFields.ack !== undefined && (
          <span>Ack: <span className="text-zinc-300">{step.packetFields.ack}</span></span>
        )}
      </div>
      <div className={`w-32 h-px ${isLTR ? "bg-gradient-to-r" : "bg-gradient-to-l"} from-transparent via-white/20 to-transparent`} />
    </div>
  );
}

export default function TCPFourWayHandshake() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((s) => {
          if (s >= STEPS.length - 1) {
            setIsPlaying(false);
            return s;
          }
          return s + 1;
        });
      }, 1800);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  function handlePlay() {
    if (isLastStep) setCurrentStep(0);
    setIsPlaying((p) => !p);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="p-6">
          {/* client + server columns */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-start mb-6">
            {/* CLIENT */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/[0.04] p-4 flex flex-col items-center gap-3">
              <span className="text-xs font-mono text-blue-400/60 uppercase tracking-widest">{t.client}</span>
              <div className="w-10 h-10 rounded-lg border border-blue-500/30 bg-blue-500/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="4" width="16" height="10" rx="2" stroke="rgb(96 165 250)" strokeWidth="1.5" />
                  <path d="M6 14v2M14 14v2M4 16h12" stroke="rgb(96 165 250)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <StateBadge state={step.clientState} accent="blue" />
            </div>

            {/* center: packet animation */}
            <div className="flex flex-col items-center justify-center min-w-0 w-48 pt-8">
              <div className="w-full min-h-[80px] flex flex-col items-center justify-center">
                <PacketPill step={step} />
              </div>
              {/* direction arrow line */}
              <div className="w-full flex items-center gap-1 mt-2">
                <div className="flex-1 h-px bg-white/10" />
                {step.packetDir === "left-to-right" && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M0 4h6M4 1l3 3-3 3" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
                {step.packetDir === "right-to-left" && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M8 4H2M4 1L1 4l3 3" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
                <div className="flex-1 h-px bg-white/10" />
              </div>
            </div>

            {/* SERVER */}
            <div className="rounded-xl border border-green-500/30 bg-green-500/[0.04] p-4 flex flex-col items-center gap-3">
              <span className="text-xs font-mono text-green-400/60 uppercase tracking-widest">{t.server}</span>
              <div className="w-10 h-10 rounded-lg border border-green-500/30 bg-green-500/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="3" width="14" height="8" rx="2" stroke="rgb(74 222 128)" strokeWidth="1.5" />
                  <rect x="3" y="13" width="14" height="4" rx="1.5" stroke="rgb(74 222 128)" strokeWidth="1.5" />
                  <circle cx="15" cy="15" r="1" fill="rgb(74 222 128)" />
                </svg>
              </div>
              <StateBadge state={step.serverState} accent="green" />
            </div>
          </div>

          {/* closed banner */}
          {isLastStep && (
            <div className="mb-5 rounded-xl border border-zinc-500/30 bg-zinc-500/[0.06] px-4 py-3 text-center">
              <p className="text-xs text-zinc-400 font-mono">{t.closed}</p>
            </div>
          )}

          {/* step info */}
          <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-zinc-600">{t.step} {currentStep + 1}/{STEPS.length}</span>
              <span className="text-white text-sm font-semibold">
                {lang === "ko" ? step.headlineKo : step.headlineEn}
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              {lang === "ko" ? step.descKo : step.descEn}
            </p>
          </div>

          {/* controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
                  className={`h-1 rounded-full transition-all ${i === currentStep ? "w-6 bg-blue-500" : "w-1.5 bg-white/20"}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlay}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-zinc-300 hover:text-white font-mono transition-all"
              >
                {isPlaying ? t.pause : t.autoPlay}
              </button>
              <button
                onClick={() => { setCurrentStep((s) => Math.max(0, s - 1)); setIsPlaying(false); }}
                disabled={currentStep === 0}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed font-mono transition-all"
              >
                {t.prev}
              </button>
              <button
                onClick={() => { setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1)); setIsPlaying(false); }}
                disabled={isLastStep}
                className="px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-xs text-blue-400 hover:bg-blue-500/20 disabled:opacity-30 disabled:cursor-not-allowed font-mono transition-all"
              >
                {t.next}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TIME_WAIT callout */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono px-2 py-0.5 rounded border border-amber-500/40 text-amber-400 bg-amber-500/10">
            TIME_WAIT
          </span>
          <h4 className="text-sm font-semibold text-white">{t.timeWaitTitle}</h4>
        </div>
        <ul className="space-y-2">
          {t.timeWaitBody.map((line, i) => (
            <li key={i} className="flex gap-2 text-xs text-zinc-400 leading-relaxed">
              <span className="text-amber-500/50 shrink-0 mt-0.5 font-mono">·</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
