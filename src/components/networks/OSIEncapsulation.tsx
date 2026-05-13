"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderBlock {
  label: string;
  shortLabel: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
}

const HEADERS: HeaderBlock[] = [
  { label: "Application", shortLabel: "APP", colorClass: "text-blue-400", borderClass: "border-blue-400/40", bgClass: "bg-blue-400/20" },
  { label: "Presentation", shortLabel: "PRES", colorClass: "text-violet-400", borderClass: "border-violet-400/40", bgClass: "bg-violet-400/20" },
  { label: "Session", shortLabel: "SESS", colorClass: "text-purple-400", borderClass: "border-purple-400/40", bgClass: "bg-purple-400/20" },
  { label: "Transport", shortLabel: "TR", colorClass: "text-rose-400", borderClass: "border-rose-400/40", bgClass: "bg-rose-400/20" },
  { label: "Network", shortLabel: "NET", colorClass: "text-orange-400", borderClass: "border-orange-400/40", bgClass: "bg-orange-400/20" },
  { label: "Data Link", shortLabel: "DL", colorClass: "text-amber-400", borderClass: "border-amber-400/40", bgClass: "bg-amber-400/20" },
  { label: "Physical", shortLabel: "PH", colorClass: "text-zinc-400", borderClass: "border-zinc-400/40", bgClass: "bg-zinc-400/20" },
];

interface StepDef {
  headlineEn: string;
  headlineKo: string;
  descEn: string;
  descKo: string;
}

const ENCAP_STEPS: StepDef[] = [
  {
    headlineEn: "Layer 7 — Application creates data",
    headlineKo: "7계층 — 애플리케이션이 데이터 생성",
    descEn: "The browser constructs an HTTP GET request. This is the raw application payload — no headers from lower layers yet.",
    descKo: "브라우저가 HTTP GET 요청을 생성합니다. 아직 하위 계층 헤더가 없는 순수 애플리케이션 페이로드입니다.",
  },
  {
    headlineEn: "Layer 6 — Presentation encrypts",
    headlineKo: "6계층 — 표현 계층이 암호화",
    descEn: "TLS wraps the payload with an encrypted record header, indicating content type, TLS version, and payload length.",
    descKo: "TLS가 콘텐츠 타입, TLS 버전, 페이로드 길이를 포함한 암호화된 레코드 헤더로 페이로드를 감쌉니다.",
  },
  {
    headlineEn: "Layer 5 — Session manages state",
    headlineKo: "5계층 — 세션 계층이 상태 관리",
    descEn: "Session identifiers are attached. In modern stacks this is often handled implicitly by TLS or the application.",
    descKo: "세션 식별자가 첨부됩니다. 현대 스택에서는 TLS나 애플리케이션이 암묵적으로 처리하는 경우가 많습니다.",
  },
  {
    headlineEn: "Layer 4 — Transport adds TCP segment header",
    headlineKo: "4계층 — 전송 계층이 TCP 세그먼트 헤더 추가",
    descEn: "TCP prepends a 20-byte header: source/dest ports (443), sequence number, ACK number, and window size.",
    descKo: "TCP가 20바이트 헤더를 앞에 붙입니다: 출발지/목적지 포트(443), 시퀀스 번호, ACK 번호, 윈도우 크기.",
  },
  {
    headlineEn: "Layer 3 — Network adds IP packet header",
    headlineKo: "3계층 — 네트워크 계층이 IP 패킷 헤더 추가",
    descEn: "IP prepends a 20-byte header: source IP, destination IP, TTL=64, and protocol=TCP.",
    descKo: "IP가 20바이트 헤더를 앞에 붙입니다: 출발지 IP, 목적지 IP, TTL=64, 프로토콜=TCP.",
  },
  {
    headlineEn: "Layer 2 — Data Link wraps in Ethernet frame",
    headlineKo: "2계층 — 데이터 링크가 이더넷 프레임으로 감쌈",
    descEn: "Ethernet prepends source/dest MAC addresses and appends a 4-byte FCS (CRC) trailer for error detection.",
    descKo: "이더넷이 출발지/목적지 MAC 주소를 앞에 붙이고, 오류 감지를 위한 4바이트 FCS(CRC) 트레일러를 뒤에 추가합니다.",
  },
  {
    headlineEn: "Layer 1 — Physical transmits bits",
    headlineKo: "1계층 — 물리 계층이 비트 전송",
    descEn: "The entire frame is converted to electrical signals, light pulses, or radio waves and sent over the medium.",
    descKo: "전체 프레임이 전기 신호, 광 펄스, 또는 전파로 변환되어 매체를 통해 전송됩니다.",
  },
];

const DECAP_STEPS: StepDef[] = [
  {
    headlineEn: "Layer 1 — Physical receives bits",
    headlineKo: "1계층 — 물리 계층이 비트 수신",
    descEn: "NIC converts signals back to bits and passes the raw frame up to the Data Link layer.",
    descKo: "NIC가 신호를 다시 비트로 변환하고 원시 프레임을 데이터 링크 계층으로 전달합니다.",
  },
  {
    headlineEn: "Layer 2 — Data Link strips Ethernet frame",
    headlineKo: "2계층 — 데이터 링크가 이더넷 프레임 제거",
    descEn: "MAC addresses are checked, FCS is verified for errors, then the Ethernet header and trailer are stripped.",
    descKo: "MAC 주소를 확인하고 FCS로 오류를 검증한 뒤 이더넷 헤더와 트레일러를 제거합니다.",
  },
  {
    headlineEn: "Layer 3 — Network strips IP header",
    headlineKo: "3계층 — 네트워크 계층이 IP 헤더 제거",
    descEn: "Destination IP is verified as matching this host. TTL is decremented, then the IP header is removed.",
    descKo: "목적지 IP가 이 호스트와 일치하는지 확인하고, TTL을 감소시킨 뒤 IP 헤더를 제거합니다.",
  },
  {
    headlineEn: "Layer 4 — Transport strips TCP segment header",
    headlineKo: "4계층 — 전송 계층이 TCP 세그먼트 헤더 제거",
    descEn: "TCP reassembles segments in order, verifies sequence numbers, and delivers data to the correct port/socket.",
    descKo: "TCP가 세그먼트를 순서대로 재조립하고, 시퀀스 번호를 검증한 뒤 올바른 포트/소켓으로 데이터를 전달합니다.",
  },
  {
    headlineEn: "Layer 5 — Session restores state",
    headlineKo: "5계층 — 세션 계층이 상태 복원",
    descEn: "Session context is restored. The session layer ensures the data belongs to an active, authenticated session.",
    descKo: "세션 컨텍스트가 복원됩니다. 세션 계층은 데이터가 활성화된 인증된 세션에 속하는지 확인합니다.",
  },
  {
    headlineEn: "Layer 6 — Presentation decrypts",
    headlineKo: "6계층 — 표현 계층이 복호화",
    descEn: "TLS decrypts the payload, verifies the MAC, and decompresses if needed. Plain data is now visible.",
    descKo: "TLS가 페이로드를 복호화하고 MAC을 검증한 뒤 필요한 경우 압축을 해제합니다. 이제 평문 데이터를 볼 수 있습니다.",
  },
  {
    headlineEn: "Layer 7 — Application reads data",
    headlineKo: "7계층 — 애플리케이션이 데이터 읽기",
    descEn: "The HTTP request arrives at the application. The server parses the headers and body and processes the request.",
    descKo: "HTTP 요청이 애플리케이션에 도착합니다. 서버가 헤더와 본문을 파싱하고 요청을 처리합니다.",
  },
];

const KO = {
  tabEncap: "캡슐화 (송신 측)",
  tabDecap: "역캡슐화 (수신 측)",
  prev: "← 이전",
  next: "다음 →",
  autoPlay: "자동 재생",
  pause: "일시정지",
  step: "단계",
  data: "DATA",
};

const EN = {
  tabEncap: "Encapsulation (Sender)",
  tabDecap: "Decapsulation (Receiver)",
  prev: "← prev",
  next: "next →",
  autoPlay: "Auto Play",
  pause: "Pause",
  step: "Step",
  data: "DATA",
};

export default function OSIEncapsulation() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;
  const [mode, setMode] = useState<"encap" | "decap">("encap");
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = mode === "encap" ? ENCAP_STEPS : DECAP_STEPS;
  const isLast = step === steps.length - 1;

  // visible headers in encapsulation: layers 0..step (top-down = App first, Physical last)
  // in decapsulation: we start fully wrapped and remove from Physical up
  // encap: show headers[0..step] prepended left of DATA
  // decap: show headers[0..(6-step-1)] meaning as step increases, fewer headers remain
  const encapVisible = mode === "encap"
    ? HEADERS.slice(0, step + 1)
    : HEADERS.slice(0, Math.max(0, HEADERS.length - step - 1));

  const activeIndex = mode === "encap" ? step : HEADERS.length - step - 1;

  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [mode]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setStep((s) => {
          if (s >= steps.length - 1) {
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
  }, [isPlaying, steps.length]);

  function handlePlay() {
    if (isLast) setStep(0);
    setIsPlaying((p) => !p);
  }

  const currentStep = steps[step];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      {/* tabs */}
      <div className="flex border-b border-white/10">
        {(["encap", "decap"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 px-4 py-3 text-xs font-mono transition-colors ${
              mode === m
                ? "text-white border-b-2 border-blue-500 bg-white/[0.03]"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {m === "encap" ? t.tabEncap : t.tabDecap}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* packet diagram */}
        <div className="mb-6 rounded-xl border border-white/[0.06] bg-black/20 p-4 min-h-[80px] flex items-center justify-center overflow-x-auto">
          <div className="flex items-stretch gap-0 flex-nowrap">
            {encapVisible.map((h, i) => {
              const isActive = HEADERS.indexOf(h) === activeIndex;
              return (
                <div
                  key={h.shortLabel}
                  className={`flex items-center justify-center px-2 py-3 border-y border-l text-[10px] font-mono font-bold transition-all duration-300 ${h.borderClass} ${h.colorClass} ${
                    isActive ? h.bgClass + " ring-1 ring-inset " + h.borderClass : "bg-white/[0.03]"
                  } ${i === 0 ? "rounded-l-md border-l" : ""}`}
                  style={{ minWidth: "36px" }}
                >
                  {h.shortLabel}
                </div>
              );
            })}
            {/* DATA block */}
            <div className={`flex items-center justify-center px-4 py-3 border font-mono text-xs font-bold text-zinc-300 border-white/20 bg-white/[0.05] ${encapVisible.length === 0 ? "rounded-md" : "rounded-r-md border-l-0"}`}>
              {t.data}
            </div>
          </div>
        </div>

        {/* step info */}
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-zinc-600">{t.step} {step + 1}/{steps.length}</span>
            <span className="text-white text-sm font-semibold">
              {lang === "ko" ? currentStep.headlineKo : currentStep.headlineEn}
            </span>
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed">
            {lang === "ko" ? currentStep.descKo : currentStep.descEn}
          </p>
        </div>

        {/* controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => { setStep(i); setIsPlaying(false); }}
                className={`h-1 rounded-full transition-all ${i === step ? "w-6 bg-blue-500" : "w-1.5 bg-white/20"}`}
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
              onClick={() => { setStep((s) => Math.max(0, s - 1)); setIsPlaying(false); }}
              disabled={step === 0}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed font-mono transition-all"
            >
              {t.prev}
            </button>
            <button
              onClick={() => { setStep((s) => Math.min(steps.length - 1, s + 1)); setIsPlaying(false); }}
              disabled={isLast}
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
