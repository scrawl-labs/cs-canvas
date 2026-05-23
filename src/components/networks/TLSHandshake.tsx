"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Step {
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  phase: "tcp" | "hello" | "cert" | "key-exchange" | "symmetric" | "done";
  direction: "right" | "left" | "none" | "both";
  label: string;
}

const STEPS: Step[] = [
  {
    titleKo: "TCP 연결 수립",
    titleEn: "TCP Connection",
    descKo: "먼저 일반적인 TCP 3-way Handshake로 연결을 맺습니다. TLS는 이 위에서 동작합니다.",
    descEn: "First, a regular TCP 3-way handshake establishes the connection. TLS operates on top of this.",
    phase: "tcp",
    direction: "both",
    label: "TCP 3-Way Handshake",
  },
  {
    titleKo: "Client Hello",
    titleEn: "Client Hello",
    descKo: "클라이언트가 지원하는 TLS 버전, 암호 스위트(cipher suite) 목록, 클라이언트 랜덤값을 서버에 보냅니다.",
    descEn: "Client sends supported TLS versions, list of cipher suites, and a client random value to the server.",
    phase: "hello",
    direction: "right",
    label: "Client Hello",
  },
  {
    titleKo: "Server Hello + 인증서 전송",
    titleEn: "Server Hello + Certificate",
    descKo: "서버가 선택한 암호 스위트, 서버 랜덤값, 그리고 CA(인증기관)가 서명한 인증서(공개키 포함)를 보냅니다. 클라이언트는 CA의 공개키로 인증서를 검증합니다.",
    descEn: "Server responds with chosen cipher suite, server random, and its CA-signed certificate (containing public key). Client verifies using CA's public key.",
    phase: "cert",
    direction: "left",
    label: "Certificate + Public Key",
  },
  {
    titleKo: "Pre-Master Secret 전송 (비대칭 암호화)",
    titleEn: "Pre-Master Secret (Asymmetric Encryption)",
    descKo: "클라이언트가 Pre-Master Secret을 생성하고, 서버의 공개키로 암호화하여 전송합니다. 서버만 자신의 개인키로 이를 복호화할 수 있습니다. 이것이 비대칭키의 핵심 — 공개키로 잠그고, 개인키로만 열 수 있습니다.",
    descEn: "Client generates a Pre-Master Secret, encrypts it with the server's public key, and sends it. Only the server can decrypt it with its private key. This is asymmetric encryption — lock with public key, unlock only with private key.",
    phase: "key-exchange",
    direction: "right",
    label: "Pre-Master Secret (encrypted)",
  },
  {
    titleKo: "세션키 생성 (대칭키 전환)",
    titleEn: "Session Key Derived (Switch to Symmetric)",
    descKo: "양쪽 모두 Client Random + Server Random + Pre-Master Secret으로 동일한 세션키(대칭키)를 생성합니다. 이후 모든 통신은 이 대칭키로 암호화됩니다. 대칭키는 빠르고, 비대칭키는 안전한 키 전달용입니다.",
    descEn: "Both sides derive the same session key (symmetric) from Client Random + Server Random + Pre-Master Secret. All further communication uses this symmetric key. Symmetric is fast; asymmetric was only for secure key delivery.",
    phase: "symmetric",
    direction: "both",
    label: "Session Key Generated",
  },
  {
    titleKo: "암호화된 통신 시작",
    titleEn: "Encrypted Communication Begins",
    descKo: "\"Change Cipher Spec\" 메시지를 교환하고, 이제부터 모든 HTTP 요청/응답이 대칭키로 암호화됩니다. 이것이 HTTPS의 S(Secure)입니다.",
    descEn: "\"Change Cipher Spec\" messages are exchanged. From now on, all HTTP requests/responses are encrypted with the symmetric key. This is the S in HTTPS.",
    phase: "done",
    direction: "both",
    label: "Encrypted HTTP (HTTPS)",
  },
];

export default function TLSHandshake() {
  const [step, setStep] = useState(0);
  const { lang } = useLanguage();
  const current = STEPS[step];
  const t = lang === "ko" ? current.titleKo : current.titleEn;
  const d = lang === "ko" ? current.descKo : current.descEn;

  const phaseColors: Record<string, string> = {
    tcp: "border-zinc-500/40 bg-zinc-500/10",
    hello: "border-blue-500/40 bg-blue-500/10",
    cert: "border-amber-500/40 bg-amber-500/10",
    "key-exchange": "border-violet-500/40 bg-violet-500/10",
    symmetric: "border-emerald-500/40 bg-emerald-500/10",
    done: "border-emerald-500/40 bg-emerald-500/10",
  };

  const arrowColor: Record<string, string> = {
    tcp: "text-zinc-400",
    hello: "text-blue-400",
    cert: "text-amber-400",
    "key-exchange": "text-violet-400",
    symmetric: "text-emerald-400",
    done: "text-emerald-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-5">
      {/* Diagram */}
      <div className="relative flex items-center justify-between px-4 py-8">
        {/* Client */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-16 h-16 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-center">
            <span className="text-xl">🖥️</span>
          </div>
          <span className="text-[10px] font-mono text-blue-300">Client</span>
          {current.phase === "key-exchange" && (
            <span className="text-[9px] text-violet-400 font-mono mt-1">🔑 Public Key</span>
          )}
          {(current.phase === "symmetric" || current.phase === "done") && (
            <span className="text-[9px] text-emerald-400 font-mono mt-1">🔐 Session Key</span>
          )}
        </div>

        {/* Arrow / Message */}
        <div className="absolute inset-x-20 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
          {current.direction !== "none" && (
            <>
              <div className={`text-[10px] font-mono px-2 py-1 rounded border ${phaseColors[current.phase]}`}>
                {current.label}
              </div>
              <div className={`text-lg ${arrowColor[current.phase]}`}>
                {current.direction === "right" && "→→→→→→→→→→→→→→"}
                {current.direction === "left" && "←←←←←←←←←←←←←←"}
                {current.direction === "both" && "⇄⇄⇄⇄⇄⇄⇄⇄⇄⇄⇄⇄⇄⇄"}
              </div>
            </>
          )}
        </div>

        {/* Server */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-16 h-16 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center">
            <span className="text-xl">🌐</span>
          </div>
          <span className="text-[10px] font-mono text-amber-300">Server</span>
          {current.phase === "cert" && (
            <span className="text-[9px] text-amber-400 font-mono mt-1">📜 Certificate</span>
          )}
          {(current.phase === "symmetric" || current.phase === "done") && (
            <span className="text-[9px] text-emerald-400 font-mono mt-1">🔐 Session Key</span>
          )}
        </div>
      </div>

      {/* Key type indicator */}
      <div className="flex justify-center gap-4 text-[10px] font-mono">
        <span className={`px-2 py-0.5 rounded border ${step >= 3 && step < 5 ? "border-violet-500/50 bg-violet-500/10 text-violet-300" : "border-zinc-700 text-zinc-600"}`}>
          Asymmetric (RSA)
        </span>
        <span className="text-zinc-700">→</span>
        <span className={`px-2 py-0.5 rounded border ${step >= 4 ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-zinc-700 text-zinc-600"}`}>
          Symmetric (AES)
        </span>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-4">
        <h4 className="text-sm font-semibold text-white mb-2">{t}</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">{d}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                i === step ? "bg-emerald-400 scale-125" : "bg-zinc-700 hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-3 py-1 text-xs font-mono rounded border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            ← Prev
          </button>
          <button
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={step === STEPS.length - 1}
            className="px-3 py-1 text-xs font-mono rounded border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
