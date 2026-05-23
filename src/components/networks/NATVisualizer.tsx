"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StepDef {
  headlineKo: string;
  headlineEn: string;
  descKo: string;
  descEn: string;
  devices: { label: string; ip: string; highlight: boolean }[];
  natMapping: { privateIp: string; publicIp: string; port: string } | null;
  direction: "outbound" | "inbound" | "none";
}

const STEPS: StepDef[] = [
  {
    headlineKo: "NAT란? — 사설 IP ↔ 공인 IP 변환",
    headlineEn: "What is NAT? — Private IP ↔ Public IP Translation",
    descKo:
      "NAT(Network Address Translation)은 패킷이 라우터를 통해 전송될 때 IP 주소 정보를 수정하여 다른 주소로 매핑하는 방법입니다. 공인 IP 하나로 여러 사설 IP 장치가 인터넷을 사용할 수 있게 합니다.",
    descEn:
      "NAT (Network Address Translation) modifies IP address information in packets as they pass through a router, mapping one address to another. It lets multiple private IP devices share a single public IP for internet access.",
    devices: [
      { label: "PC 1", ip: "192.168.0.2", highlight: false },
      { label: "PC 2", ip: "192.168.0.3", highlight: false },
      { label: "PC 3", ip: "192.168.0.4", highlight: false },
    ],
    natMapping: null,
    direction: "none",
  },
  {
    headlineKo: "아웃바운드 — 사설 → 공인 변환",
    headlineEn: "Outbound — Private → Public Translation",
    descKo:
      "PC 1(192.168.0.2)이 인터넷에 요청을 보냅니다. NAT 라우터가 출발지 IP를 사설 IP에서 공인 IP(203.0.113.1)로 변환하고, 포트 번호로 어떤 내부 장치인지 기록합니다.",
    descEn:
      "PC 1 (192.168.0.2) sends a request to the internet. The NAT router translates the source IP from private to public (203.0.113.1) and records which internal device via port number.",
    devices: [
      { label: "PC 1", ip: "192.168.0.2", highlight: true },
      { label: "PC 2", ip: "192.168.0.3", highlight: false },
      { label: "PC 3", ip: "192.168.0.4", highlight: false },
    ],
    natMapping: {
      privateIp: "192.168.0.2:5001",
      publicIp: "203.0.113.1",
      port: ":40001",
    },
    direction: "outbound",
  },
  {
    headlineKo: "인바운드 — 응답이 돌아올 때",
    headlineEn: "Inbound — When the Response Returns",
    descKo:
      "외부 서버가 203.0.113.1:40001로 응답합니다. NAT 라우터가 테이블을 확인하여 포트 40001 → 192.168.0.2:5001 매핑을 찾고, 목적지 IP를 사설 IP로 되돌려 PC 1에 전달합니다.",
    descEn:
      "The external server responds to 203.0.113.1:40001. The NAT router checks its table, finds port 40001 → 192.168.0.2:5001, and translates the destination back to the private IP for PC 1.",
    devices: [
      { label: "PC 1", ip: "192.168.0.2", highlight: true },
      { label: "PC 2", ip: "192.168.0.3", highlight: false },
      { label: "PC 3", ip: "192.168.0.4", highlight: false },
    ],
    natMapping: {
      privateIp: "192.168.0.2:5001",
      publicIp: "203.0.113.1",
      port: ":40001",
    },
    direction: "inbound",
  },
  {
    headlineKo: "여러 장치가 동시에 — 포트로 구분",
    headlineEn: "Multiple Devices Simultaneously — Distinguished by Port",
    descKo:
      "세 대의 PC가 모두 인터넷을 사용하지만, 외부에서 보면 IP는 하나(203.0.113.1)입니다. NAT 라우터가 포트 번호로 각 장치를 구분합니다. 이것이 바로 집에서 공유기 하나로 여러 기기가 인터넷을 쓸 수 있는 이유입니다.",
    descEn:
      "All three PCs use the internet, but externally they appear as one IP (203.0.113.1). The NAT router distinguishes each device by port number. This is why multiple devices at home can share one internet connection.",
    devices: [
      { label: "PC 1", ip: "192.168.0.2", highlight: true },
      { label: "PC 2", ip: "192.168.0.3", highlight: true },
      { label: "PC 3", ip: "192.168.0.4", highlight: true },
    ],
    natMapping: null,
    direction: "outbound",
  },
  {
    headlineKo: "NAT의 장단점",
    headlineEn: "NAT Pros & Cons",
    descKo:
      "장점: 보안 — 내부 IP가 외부에 노출되지 않아 직접 접근 차단. 공인 IP 절약. 단점: 여러 명이 하나의 공인 IP를 공유하면 속도 저하 가능. P2P 통신이 어려워짐 (포트포워딩 필요).",
    descEn:
      "Pros: Security — internal IPs are hidden from outside, blocking direct access. Saves public IPs. Cons: Multiple users sharing one public IP can slow connections. P2P becomes harder (port forwarding needed).",
    devices: [
      { label: "PC 1", ip: "192.168.0.2", highlight: false },
      { label: "PC 2", ip: "192.168.0.3", highlight: false },
      { label: "PC 3", ip: "192.168.0.4", highlight: false },
    ],
    natMapping: null,
    direction: "none",
  },
];

const NAT_TABLE = [
  { internal: "192.168.0.2:5001", external: "203.0.113.1:40001" },
  { internal: "192.168.0.3:5002", external: "203.0.113.1:40002" },
  { internal: "192.168.0.4:5003", external: "203.0.113.1:40003" },
];

const KO = {
  prev: "← 이전",
  next: "다음 →",
  router: "NAT 라우터",
  publicIp: "공인 IP: 203.0.113.1",
  internet: "인터넷",
  natTable: "NAT 변환 테이블",
  internal: "내부 (사설)",
  external: "외부 (공인)",
  privateNet: "사설 네트워크 (192.168.0.x)",
  pros: "장점",
  cons: "단점",
  prosList: [
    "내부 IP 은닉 → 보안 강화",
    "공인 IP 절약 (하나로 여러 대)",
    "외부에서 직접 접근 차단",
  ],
  consList: [
    "여러 명 공유 시 속도 저하 가능",
    "P2P 통신 어려움 (포트포워딩 필요)",
    "일부 프로토콜 호환 문제",
  ],
};

const EN = {
  prev: "← prev",
  next: "next →",
  router: "NAT Router",
  publicIp: "Public IP: 203.0.113.1",
  internet: "Internet",
  natTable: "NAT Translation Table",
  internal: "Internal (Private)",
  external: "External (Public)",
  privateNet: "Private Network (192.168.0.x)",
  pros: "Pros",
  cons: "Cons",
  prosList: [
    "Hides internal IPs → better security",
    "Saves public IPs (many devices, one IP)",
    "Blocks direct external access",
  ],
  consList: [
    "Shared IP can slow connections",
    "P2P communication difficult (port forwarding needed)",
    "Some protocol compatibility issues",
  ],
};

export default function NATVisualizer() {
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

      {/* NAT diagram */}
      <div className="rounded-xl border border-white/5 bg-zinc-900/50 p-5 mb-5">
        <div className="flex items-center gap-4">
          {/* Private network side */}
          <div className="flex-1">
            <div className="text-[9px] font-mono text-zinc-600 mb-2 text-center">
              {t.privateNet}
            </div>
            <div className="space-y-2">
              {current.devices.map((d) => (
                <div
                  key={d.label}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                    d.highlight
                      ? "border-blue-500/40 bg-blue-500/10"
                      : "border-zinc-700 bg-zinc-800/50"
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono ${d.highlight ? "text-blue-300" : "text-zinc-500"}`}
                  >
                    {d.label}
                  </span>
                  <span
                    className={`text-[9px] font-mono ${d.highlight ? "text-blue-400" : "text-zinc-600"}`}
                  >
                    {d.ip}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* NAT Router */}
          <div className="flex flex-col items-center gap-1">
            {/* Arrow indicators */}
            {current.direction === "outbound" && (
              <div className="text-[9px] text-emerald-400 font-mono animate-pulse">
                →
              </div>
            )}
            {current.direction === "inbound" && (
              <div className="text-[9px] text-amber-400 font-mono animate-pulse">
                ←
              </div>
            )}
            <div className="w-16 h-16 rounded-xl border-2 border-emerald-500/40 bg-emerald-500/10 flex flex-col items-center justify-center">
              <span className="text-[9px] font-mono text-emerald-300">
                {t.router}
              </span>
              <span className="text-[7px] font-mono text-emerald-400/60 mt-0.5">
                NAT
              </span>
            </div>
            <span className="text-[8px] font-mono text-zinc-600">
              {t.publicIp}
            </span>
          </div>

          {/* Internet side */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-violet-500/30 bg-violet-500/5 flex items-center justify-center">
              <div className="text-center">
                <span className="text-[10px] font-mono text-violet-300">
                  {t.internet}
                </span>
                <div className="text-[8px] text-zinc-600 mt-0.5">0.0.0.0/0</div>
              </div>
            </div>
          </div>
        </div>

        {/* NAT mapping highlight */}
        {current.natMapping && (
          <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 flex items-center justify-center gap-3">
            <span className="text-[10px] font-mono text-blue-300">
              {current.natMapping.privateIp}
            </span>
            <span className="text-[10px] text-zinc-500">→</span>
            <span className="text-[10px] font-mono text-emerald-300">
              {current.natMapping.publicIp}
              {current.natMapping.port}
            </span>
          </div>
        )}
      </div>

      {/* NAT Table (shown on steps 3+) */}
      {step >= 3 && (
        <div className="rounded-lg border border-white/5 bg-zinc-900/30 p-4 mb-5">
          <h5 className="text-[10px] font-mono text-zinc-500 mb-2">
            {t.natTable}
          </h5>
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-1 text-zinc-600">{t.internal}</th>
                <th className="text-left py-1 text-zinc-600">{t.external}</th>
              </tr>
            </thead>
            <tbody>
              {NAT_TABLE.map((row) => (
                <tr key={row.internal} className="border-b border-zinc-800/50">
                  <td className="py-1.5 text-blue-400">{row.internal}</td>
                  <td className="py-1.5 text-emerald-400">{row.external}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pros/Cons (shown on last step) */}
      {step === 4 && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
            <h5 className="text-[10px] font-mono text-green-400 mb-2">
              {t.pros}
            </h5>
            <ul className="space-y-1">
              {t.prosList.map((item, i) => (
                <li
                  key={i}
                  className="text-[10px] text-zinc-400 flex items-start gap-1.5"
                >
                  <span className="text-green-500 shrink-0">+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
            <h5 className="text-[10px] font-mono text-red-400 mb-2">
              {t.cons}
            </h5>
            <ul className="space-y-1">
              {t.consList.map((item, i) => (
                <li
                  key={i}
                  className="text-[10px] text-zinc-400 flex items-start gap-1.5"
                >
                  <span className="text-red-500 shrink-0">-</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
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
