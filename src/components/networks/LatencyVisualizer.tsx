"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StepDef {
  headlineKo: string;
  headlineEn: string;
  descKo: string;
  descEn: string;
  propagation: number;
  transmission: number;
  queuing: number;
  processing: number;
}

const STEPS: StepDef[] = [
  {
    headlineKo: "레이턴시란? — 왕복 시간 (RTT)",
    headlineEn: "What is Latency? — Round Trip Time (RTT)",
    descKo:
      "레이턴시는 메시지가 한 장치에서 다른 장치로 갔다가 돌아오는 데 걸리는 총 시간입니다. 여러 지연 요소의 합으로 구성됩니다.",
    descEn:
      "Latency is the total time for a message to travel from one device to another and back. It's the sum of several delay components.",
    propagation: 20,
    transmission: 5,
    queuing: 3,
    processing: 2,
  },
  {
    headlineKo: "전파 지연 (Propagation Delay)",
    headlineEn: "Propagation Delay",
    descKo:
      "신호가 물리적 매체를 통해 이동하는 시간. 거리가 멀수록 길어집니다. 빛의 속도에 의해 제한됩니다.",
    descEn:
      "Time for a signal to travel through the physical medium. Increases with distance. Limited by the speed of light.",
    propagation: 60,
    transmission: 5,
    queuing: 3,
    processing: 2,
  },
  {
    headlineKo: "전송 지연 (Transmission Delay)",
    headlineEn: "Transmission Delay",
    descKo:
      "패킷의 모든 비트를 링크에 올리는 데 걸리는 시간. 패킷 크기가 클수록, 대역폭이 낮을수록 길어집니다.",
    descEn:
      "Time to push all bits of a packet onto the link. Larger packets and lower bandwidth increase this delay.",
    propagation: 20,
    transmission: 40,
    queuing: 3,
    processing: 2,
  },
  {
    headlineKo: "큐잉 지연 (Queuing Delay)",
    headlineEn: "Queuing Delay",
    descKo:
      "라우터 버퍼에서 대기하는 시간. 트래픽이 많을수록 큐가 길어지고 지연이 증가합니다. 가장 예측하기 어려운 지연입니다.",
    descEn:
      "Time spent waiting in router buffers. More traffic means longer queues. The most unpredictable component.",
    propagation: 20,
    transmission: 5,
    queuing: 50,
    processing: 2,
  },
  {
    headlineKo: "처리 지연 (Processing Delay)",
    headlineEn: "Processing Delay",
    descKo:
      "라우터가 패킷 헤더를 검사하고 다음 홉을 결정하는 시간. 보통 매우 짧지만 복잡한 ACL/방화벽 규칙이 있으면 증가합니다.",
    descEn:
      "Time for a router to inspect packet headers and decide the next hop. Usually very short but increases with complex ACL/firewall rules.",
    propagation: 20,
    transmission: 5,
    queuing: 3,
    processing: 30,
  },
];

const KO = {
  prev: "← 이전",
  next: "다음 →",
  deviceA: "송신자",
  deviceB: "수신자",
  rtt: "RTT",
  ms: "ms",
  propagation: "전파",
  transmission: "전송",
  queuing: "큐잉",
  processing: "처리",
  total: "총 지연",
};

const EN = {
  prev: "← prev",
  next: "next →",
  deviceA: "Sender",
  deviceB: "Receiver",
  rtt: "RTT",
  ms: "ms",
  propagation: "Propagation",
  transmission: "Transmission",
  queuing: "Queuing",
  processing: "Processing",
  total: "Total Delay",
};

function DelayBar({
  label,
  value,
  maxValue,
  color,
  highlighted,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  highlighted: boolean;
}) {
  const width = (value / maxValue) * 100;
  return (
    <div
      className={`transition-all duration-300 ${highlighted ? "scale-[1.02]" : "opacity-60"}`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-mono text-zinc-500">{label}</span>
        <span
          className={`text-[10px] font-mono ${highlighted ? color : "text-zinc-600"}`}
        >
          {value}ms
        </span>
      </div>
      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${highlighted ? "" : "opacity-40"}`}
          style={{
            width: `${width}%`,
            background: highlighted
              ? `linear-gradient(90deg, ${color.replace("text-", "").includes("blue") ? "#3b82f6" : color.includes("green") ? "#22c55e" : color.includes("amber") ? "#f59e0b" : "#8b5cf6"}, transparent)`
              : "#374151",
          }}
        />
      </div>
    </div>
  );
}

export default function LatencyVisualizer() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;
  const [step, setStep] = useState(0);
  const [packetPos, setPacketPos] = useState(0);
  const animRef = useRef<NodeJS.Timeout | null>(null);

  const current = STEPS[step];
  const totalDelay =
    current.propagation +
    current.transmission +
    current.queuing +
    current.processing;

  useEffect(() => {
    setPacketPos(0);
    const interval = setInterval(() => {
      setPacketPos((prev) => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 50);
    animRef.current = interval;
    return () => clearInterval(interval);
  }, [step]);

  const delays = [
    {
      label: t.propagation,
      value: current.propagation,
      color: "text-blue-400",
      highlightStep: 1,
    },
    {
      label: t.transmission,
      value: current.transmission,
      color: "text-green-400",
      highlightStep: 2,
    },
    {
      label: t.queuing,
      value: current.queuing,
      color: "text-amber-400",
      highlightStep: 3,
    },
    {
      label: t.processing,
      value: current.processing,
      color: "text-violet-400",
      highlightStep: 4,
    },
  ];

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

      {/* device-to-device animation */}
      <div className="mb-6 py-4">
        {/* RTT badge */}
        <div className="flex justify-end mb-3">
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5">
            <span className="text-[10px] font-mono text-zinc-600">
              {t.rtt}{" "}
            </span>
            <span className="text-sm font-mono text-cyan-400">
              {totalDelay * 2}
              {t.ms}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* sender */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-lg border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-lg">
              💻
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              {t.deviceA}
            </span>
          </div>

          {/* the line */}
          <div className="flex-1 mx-4 relative h-6">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-zinc-700 -translate-y-1/2" />
            {/* router midpoint */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded border border-zinc-600 bg-zinc-800 flex items-center justify-center text-[10px]">
              🔀
            </div>
            {/* packet */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-sm bg-cyan-400 shadow-lg shadow-cyan-400/30 transition-all duration-100"
              style={{ left: `${packetPos}%` }}
            />
          </div>

          {/* receiver */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-lg border border-green-500/30 bg-green-500/10 flex items-center justify-center text-lg">
              🖥
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              {t.deviceB}
            </span>
          </div>
        </div>
      </div>

      {/* delay breakdown bars */}
      <div className="space-y-3 mb-4">
        {delays.map((d, i) => (
          <DelayBar
            key={d.label}
            label={d.label}
            value={d.value}
            maxValue={70}
            color={d.color}
            highlighted={step === 0 || step === d.highlightStep}
          />
        ))}
      </div>

      {/* total */}
      <div className="flex justify-between items-center rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 mb-6">
        <span className="text-xs font-mono text-zinc-400">{t.total}</span>
        <span className="text-sm font-mono text-cyan-300">
          {totalDelay}
          {t.ms} (one-way) → {totalDelay * 2}
          {t.ms} ({t.rtt})
        </span>
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
                  ? "bg-cyan-400 scale-125"
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
    </div>
  );
}
