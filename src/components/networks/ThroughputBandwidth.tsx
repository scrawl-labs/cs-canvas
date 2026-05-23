"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StepDef {
  headlineKo: string;
  headlineEn: string;
  descKo: string;
  descEn: string;
  traffic: number; // 0-100 how full the pipe is
  throughput: number; // bps displayed
  bandwidth: number; // max capacity
}

const STEPS: StepDef[] = [
  {
    headlineKo: "대역폭 (Bandwidth) — 파이프의 최대 크기",
    headlineEn: "Bandwidth — Maximum Pipe Capacity",
    descKo:
      "대역폭은 네트워크 링크를 통해 흐를 수 있는 최대 비트 수입니다. 파이프의 지름이라고 생각하세요.",
    descEn:
      "Bandwidth is the maximum number of bits that can flow through a network link. Think of it as the pipe diameter.",
    traffic: 0,
    throughput: 0,
    bandwidth: 1000,
  },
  {
    headlineKo: "트래픽 — 흐르기 시작하는 데이터",
    headlineEn: "Traffic — Data Starts Flowing",
    descKo:
      "클라이언트가 서버에서 파일을 요청합니다. 데이터가 파이프를 통해 흐르기 시작합니다. 트래픽은 '흐르고 있는 데이터의 양'입니다.",
    descEn:
      "A client requests a file from the server. Data starts flowing through the pipe. Traffic is 'the amount of data currently flowing.'",
    traffic: 30,
    throughput: 300,
    bandwidth: 1000,
  },
  {
    headlineKo: "처리량 (Throughput) — 성공적으로 전달된 양",
    headlineEn: "Throughput — Successfully Delivered Amount",
    descKo:
      "처리량은 실제로 목적지에 성공적으로 도달한 데이터의 양입니다. 트래픽 중 손실 없이 전달된 부분이죠.",
    descEn:
      "Throughput is the data that actually arrived at the destination successfully. It's the portion of traffic delivered without loss.",
    traffic: 60,
    throughput: 580,
    bandwidth: 1000,
  },
  {
    headlineKo: "트래픽 폭증 — 파이프가 가득 찬다",
    headlineEn: "Traffic Spike — Pipe Fills Up",
    descKo:
      "대용량 다운로드가 시작됩니다. 많은 트래픽이 몰리면서 파이프가 포화 상태에 가까워집니다. 대역폭 한계에 도달하기 직전입니다.",
    descEn:
      "A large download begins. Heavy traffic fills the pipe near saturation. Approaching the bandwidth limit.",
    traffic: 85,
    throughput: 820,
    bandwidth: 1000,
  },
  {
    headlineKo: "포화 — 대역폭 초과 시도",
    headlineEn: "Saturation — Exceeding Bandwidth",
    descKo:
      "트래픽이 대역폭을 초과하면 패킷 손실이 발생합니다. 처리량은 대역폭 이상으로 올라갈 수 없습니다. 이것이 병목현상의 시작입니다.",
    descEn:
      "When traffic exceeds bandwidth, packet loss occurs. Throughput cannot exceed bandwidth. This is where bottlenecks begin.",
    traffic: 100,
    throughput: 950,
    bandwidth: 1000,
  },
];

const KO = {
  prev: "← 이전",
  next: "다음 →",
  traffic: "트래픽",
  throughput: "처리량",
  bandwidth: "대역폭",
  bps: "Mbps",
  server: "서버",
  client: "클라이언트",
  pipe: "네트워크 링크",
  packetLoss: "패킷 손실!",
  step: "단계",
};

const EN = {
  prev: "← prev",
  next: "next →",
  traffic: "Traffic",
  throughput: "Throughput",
  bandwidth: "Bandwidth",
  bps: "Mbps",
  server: "Server",
  client: "Client",
  pipe: "Network Link",
  packetLoss: "Packet Loss!",
  step: "Step",
};

function Particle({
  offset,
  speed,
  color,
}: {
  offset: number;
  speed: number;
  color: string;
}) {
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${color}`}
      style={{
        left: `${offset}%`,
        animation: `flowRight ${speed}s linear infinite`,
        animationDelay: `${offset * 0.02}s`,
      }}
    />
  );
}

export default function ThroughputBandwidth() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const particles = Array.from(
    { length: Math.ceil(current.traffic / 10) },
    (_, i) => ({
      offset: (i * 100) / Math.ceil(current.traffic / 10),
      speed: 2 + Math.random(),
      id: i,
    }),
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      {/* headline */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-2">
          {lang === "ko" ? current.headlineKo : current.headlineEn}
        </h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          {lang === "ko" ? current.descKo : current.descEn}
        </p>
      </div>

      {/* pipe visualization */}
      <div className="relative mb-6">
        {/* labels */}
        <div className="flex justify-between mb-2">
          <span className="text-xs font-mono text-zinc-500">{t.server}</span>
          <span className="text-xs font-mono text-zinc-500">{t.client}</span>
        </div>

        {/* the pipe */}
        <div className="relative h-12 rounded-full border border-white/20 bg-zinc-900 overflow-hidden">
          {/* bandwidth indicator (pipe outline) */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-zinc-700 opacity-50" />

          {/* traffic fill */}
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-blue-600/40 to-cyan-500/40"
            style={{ width: `${current.traffic}%` }}
          />

          {/* particles flowing */}
          {particles.map((p) => (
            <Particle
              key={p.id}
              offset={p.offset}
              speed={p.speed}
              color={current.traffic >= 100 ? "bg-red-400" : "bg-cyan-400"}
            />
          ))}

          {/* packet loss indicator */}
          {current.traffic >= 100 && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-red-400 font-mono animate-pulse">
              {t.packetLoss}
            </div>
          )}
        </div>

        {/* pipe label */}
        <div className="text-center mt-1">
          <span className="text-[10px] text-zinc-600 font-mono">{t.pipe}</span>
        </div>
      </div>

      {/* metrics bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
          <div className="text-[10px] text-zinc-600 font-mono mb-1">
            {t.bandwidth}
          </div>
          <div className="text-sm font-mono text-zinc-300">
            {current.bandwidth} {t.bps}
          </div>
        </div>
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-center">
          <div className="text-[10px] text-blue-400/70 font-mono mb-1">
            {t.traffic}
          </div>
          <div className="text-sm font-mono text-blue-300">
            {Math.round((current.traffic * current.bandwidth) / 100)} {t.bps}
          </div>
        </div>
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3 text-center">
          <div className="text-[10px] text-green-400/70 font-mono mb-1">
            {t.throughput}
          </div>
          <div className="text-sm font-mono text-green-300">
            {current.throughput} {t.bps}
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="text-xs font-mono text-zinc-500 hover:text-white disabled:opacity-30 transition-colors"
        >
          {t.prev}
        </button>

        <div className="flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step
                  ? "bg-blue-400 scale-125"
                  : "bg-zinc-700 hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
          disabled={step === STEPS.length - 1}
          className="text-xs font-mono text-zinc-500 hover:text-white disabled:opacity-30 transition-colors"
        >
          {t.next}
        </button>
      </div>

      {/* CSS animation */}
      <style jsx>{`
        @keyframes flowRight {
          0% {
            transform: translateX(-100%) translateY(-50%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(400%) translateY(-50%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
