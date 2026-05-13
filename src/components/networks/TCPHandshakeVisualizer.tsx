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
    clientState: "CLOSED",
    serverState: "LISTEN",
    packetDir: "none",
    packetLabel: "",
    packetColor: "",
    packetFields: null,
    headlineKo: "초기 상태",
    headlineEn: "Initial State",
    descKo: "클라이언트와 서버 모두 대기 중입니다. 서버는 연결 요청을 기다리는 LISTEN 상태입니다.",
    descEn: "Both sides are idle. The server is in LISTEN state, waiting for an incoming connection.",
  },
  {
    clientState: "SYN_SENT",
    serverState: "LISTEN",
    packetDir: "left-to-right",
    packetLabel: "SYN",
    packetColor: "bg-blue-500/20 border-blue-500/60 text-blue-300",
    packetFields: { flags: "SYN", seq: 100 },
    headlineKo: "SYN — 클라이언트가 연결 요청",
    headlineEn: "SYN — Client Initiates Connection",
    descKo: "클라이언트가 임의의 시퀀스 번호(seq=100)를 선택해 SYN 패킷을 전송합니다. 클라이언트 상태는 SYN_SENT로 전이됩니다.",
    descEn: "The client picks a random sequence number (seq=100) and sends a SYN packet. Client transitions to SYN_SENT.",
  },
  {
    clientState: "SYN_SENT",
    serverState: "SYN_RECEIVED",
    packetDir: "right-to-left",
    packetLabel: "SYN-ACK",
    packetColor: "bg-green-500/20 border-green-500/60 text-green-300",
    packetFields: { flags: "SYN+ACK", seq: 300, ack: 101 },
    headlineKo: "SYN-ACK — 서버가 응답",
    headlineEn: "SYN-ACK — Server Responds",
    descKo: "서버는 클라이언트의 SYN을 확인(ack=101)하고 자신의 시퀀스 번호(seq=300)를 실어 SYN-ACK를 보냅니다. 서버 상태는 SYN_RECEIVED로 전이됩니다.",
    descEn: "The server acknowledges the client's SYN (ack=101) and includes its own sequence number (seq=300). Server transitions to SYN_RECEIVED.",
  },
  {
    clientState: "ESTABLISHED",
    serverState: "ESTABLISHED",
    packetDir: "left-to-right",
    packetLabel: "ACK",
    packetColor: "bg-violet-500/20 border-violet-500/60 text-violet-300",
    packetFields: { flags: "ACK", seq: 101, ack: 301 },
    headlineKo: "ACK — 클라이언트가 확인 응답",
    headlineEn: "ACK — Client Confirms",
    descKo: "클라이언트가 서버의 SYN-ACK를 확인(ack=301)합니다. 양쪽 모두 ESTABLISHED 상태로 전이되어 데이터 송수신이 가능해집니다.",
    descEn: "The client acknowledges the server's SYN-ACK (ack=301). Both sides transition to ESTABLISHED and data transfer can begin.",
  },
];

const KO = {
  client: "클라이언트",
  server: "서버",
  prev: "← 이전",
  next: "다음 →",
  autoPlay: "자동 재생",
  pause: "일시정지",
  flags: "Flags",
  seq: "Seq",
  ack: "Ack",
  established: "연결이 성립되었습니다. 데이터를 주고받을 수 있습니다.",
  step: "단계",
};

const EN = {
  client: "Client",
  server: "Server",
  prev: "← prev",
  next: "next →",
  autoPlay: "Auto Play",
  pause: "Pause",
  flags: "Flags",
  seq: "Seq",
  ack: "Ack",
  established: "Connection established. Data transfer can now begin.",
  step: "Step",
};

function StateBadge({ state, accent }: { state: string; accent: "blue" | "green" }) {
  const isEstablished = state === "ESTABLISHED";
  const base = accent === "blue"
    ? "border-blue-500/40 text-blue-400 bg-blue-500/10"
    : "border-green-500/40 text-green-400 bg-green-500/10";
  const established = "border-emerald-500/40 text-emerald-400 bg-emerald-500/10";
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${isEstablished ? established : base}`}>
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
        <span className="text-white/30">|</span>
        <span className="opacity-70">
          {step.packetFields.seq !== undefined && `seq=${step.packetFields.seq}`}
          {step.packetFields.ack !== undefined && `, ack=${step.packetFields.ack}`}
        </span>
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

export default function TCPHandshakeVisualizer() {
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
      }, 1500);
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      {/* main visualization */}
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

        {/* established banner */}
        {isLastStep && (
          <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] px-4 py-3 text-center">
            <p className="text-xs text-emerald-400 font-mono">{t.established}</p>
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
  );
}
