"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StepDef {
  headlineKo: string;
  headlineEn: string;
  descKo: string;
  descEn: string;
  phase: "idle" | "broadcast" | "reply" | "done";
  tableEntries: { ip: string; mac: string; status: "unknown" | "found" }[];
}

const STEPS: StepDef[] = [
  {
    headlineKo: "ARP란? — IP → MAC 주소 변환",
    headlineEn: "What is ARP? — IP → MAC Address Resolution",
    descKo:
      "ARP(Address Resolution Protocol)는 IP 주소로부터 MAC 주소를 구하는 프로토콜입니다. IP 주소는 '가상 주소', MAC 주소는 '실제 물리 주소' — ARP는 이 둘을 연결하는 다리입니다.",
    descEn:
      "ARP (Address Resolution Protocol) resolves IP addresses to MAC addresses. IP is the 'logical address', MAC is the 'physical address' — ARP bridges the two.",
    phase: "idle",
    tableEntries: [
      { ip: "192.168.1.1", mac: "AA:BB:CC:DD:EE:01", status: "found" },
      { ip: "192.168.1.20", mac: "??:??:??:??:??:??", status: "unknown" },
    ],
  },
  {
    headlineKo: '1단계: 브로드캐스트 — "이 IP 가진 사람 누구?"',
    headlineEn: 'Step 1: Broadcast — "Who has this IP?"',
    descKo:
      '장치 A가 192.168.1.20의 MAC 주소를 모릅니다. ARP Request를 브로드캐스트(모든 장치에게)로 보냅니다. "192.168.1.20의 MAC 주소를 알려주세요!"',
    descEn:
      'Device A doesn\'t know the MAC for 192.168.1.20. It broadcasts an ARP Request to everyone: "Who has 192.168.1.20? Tell me your MAC!"',
    phase: "broadcast",
    tableEntries: [
      { ip: "192.168.1.1", mac: "AA:BB:CC:DD:EE:01", status: "found" },
      { ip: "192.168.1.20", mac: "??:??:??:??:??:??", status: "unknown" },
    ],
  },
  {
    headlineKo: '2단계: 유니캐스트 응답 — "내가 그 IP야!"',
    headlineEn: 'Step 2: Unicast Reply — "That\'s me!"',
    descKo:
      '해당 IP를 가진 장치 B가 유니캐스트(1:1)로 자신의 MAC 주소를 알려줍니다. "192.168.1.20은 나야! MAC 주소는 FF:EE:DD:CC:BB:20이야."',
    descEn:
      'Device B with that IP replies via unicast (1:1): "192.168.1.20 is me! My MAC is FF:EE:DD:CC:BB:20."',
    phase: "reply",
    tableEntries: [
      { ip: "192.168.1.1", mac: "AA:BB:CC:DD:EE:01", status: "found" },
      { ip: "192.168.1.20", mac: "FF:EE:DD:CC:BB:20", status: "found" },
    ],
  },
  {
    headlineKo: "3단계: ARP 테이블 업데이트 — 통신 준비 완료",
    headlineEn: "Step 3: ARP Table Updated — Ready to Communicate",
    descKo:
      "장치 A는 ARP 테이블에 IP-MAC 매핑을 저장합니다. 이제 MAC 주소를 알았으니 실제 프레임을 만들어 통신할 수 있습니다. RARP는 반대로 MAC → IP 변환입니다.",
    descEn:
      "Device A stores the IP-MAC mapping in its ARP table. Now it knows the MAC and can build frames for communication. RARP does the reverse: MAC → IP.",
    phase: "done",
    tableEntries: [
      { ip: "192.168.1.1", mac: "AA:BB:CC:DD:EE:01", status: "found" },
      { ip: "192.168.1.20", mac: "FF:EE:DD:CC:BB:20", status: "found" },
    ],
  },
];

const KO = {
  prev: "← 이전",
  next: "다음 →",
  deviceA: "장치 A",
  deviceB: "장치 B",
  others: "다른 장치들",
  arpTable: "ARP 테이블",
  ip: "IP 주소",
  mac: "MAC 주소",
  broadcast: "브로드캐스트",
  unicast: "유니캐스트",
  rarp: "RARP: MAC → IP (역변환)",
};

const EN = {
  prev: "← prev",
  next: "next →",
  deviceA: "Device A",
  deviceB: "Device B",
  others: "Other Devices",
  arpTable: "ARP Table",
  ip: "IP Address",
  mac: "MAC Address",
  broadcast: "Broadcast",
  unicast: "Unicast",
  rarp: "RARP: MAC → IP (reverse)",
};

export default function ARPVisualizer() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;
  const [step, setStep] = useState(0);

  const current = STEPS[step];

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

      {/* network visualization */}
      <div className="relative rounded-xl border border-white/5 bg-zinc-900/50 p-6 mb-5">
        <div className="flex items-center justify-between">
          {/* Device A */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-lg border border-blue-500/40 bg-blue-500/10 flex items-center justify-center text-xs font-mono text-blue-300">
              A
            </div>
            <span className="text-[9px] font-mono text-zinc-500">
              {t.deviceA}
            </span>
            <span className="text-[8px] font-mono text-zinc-600">
              192.168.1.10
            </span>
          </div>

          {/* Arrow / message area */}
          <div className="flex-1 mx-4 relative">
            {/* Other devices in the middle */}
            <div className="flex justify-center gap-2 mb-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded border flex items-center justify-center text-[8px] font-mono transition-all duration-300 ${
                    current.phase === "broadcast"
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                      : "border-zinc-700 bg-zinc-800 text-zinc-600"
                  }`}
                >
                  {i}
                </div>
              ))}
            </div>
            <div className="text-center text-[8px] text-zinc-600 font-mono mb-2">
              {t.others}
            </div>

            {/* Broadcast arrow */}
            {current.phase === "broadcast" && (
              <div className="absolute top-1/2 left-0 right-0 flex items-center justify-center">
                <div className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[9px] font-mono text-amber-300 animate-pulse">
                  {t.broadcast}: &quot;Who has 192.168.1.20?&quot;
                </div>
              </div>
            )}

            {/* Unicast reply arrow */}
            {current.phase === "reply" && (
              <div className="absolute bottom-0 left-1/2 right-0 flex items-center justify-end">
                <div className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/30 text-[9px] font-mono text-green-300 animate-pulse">
                  {t.unicast}: MAC = FF:EE:DD:CC:BB:20
                </div>
              </div>
            )}
          </div>

          {/* Device B */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-12 h-12 rounded-lg border flex items-center justify-center text-xs font-mono transition-all duration-300 ${
                current.phase === "reply" || current.phase === "done"
                  ? "border-green-500/40 bg-green-500/10 text-green-300"
                  : "border-zinc-600 bg-zinc-800 text-zinc-400"
              }`}
            >
              B
            </div>
            <span className="text-[9px] font-mono text-zinc-500">
              {t.deviceB}
            </span>
            <span className="text-[8px] font-mono text-zinc-600">
              192.168.1.20
            </span>
          </div>
        </div>
      </div>

      {/* ARP Table */}
      <div className="rounded-lg border border-white/5 bg-zinc-900/30 p-4 mb-5">
        <h5 className="text-[10px] font-mono text-zinc-500 mb-2">
          {t.arpTable} (Device A)
        </h5>
        <table className="w-full text-[10px] font-mono">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-1 text-zinc-600">{t.ip}</th>
              <th className="text-left py-1 text-zinc-600">{t.mac}</th>
            </tr>
          </thead>
          <tbody>
            {current.tableEntries.map((entry) => (
              <tr key={entry.ip} className="border-b border-zinc-800/50">
                <td className="py-1.5 text-zinc-400">{entry.ip}</td>
                <td
                  className={`py-1.5 ${
                    entry.status === "found" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {entry.mac}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RARP note */}
      {step === 3 && (
        <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3 mb-5">
          <p className="text-[11px] text-violet-300 font-mono">{t.rarp}</p>
        </div>
      )}

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
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                i === step
                  ? "bg-emerald-400 scale-125"
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
