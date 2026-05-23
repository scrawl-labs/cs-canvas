"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type ScaleType = "lan" | "man" | "wan";
type ViewMode = "traditional" | "cloud";

interface ScaleDef {
  id: ScaleType;
  nameKo: string;
  nameEn: string;
  rangeKo: string;
  rangeEn: string;
  descKo: string;
  descEn: string;
  exampleKo: string;
  exampleEn: string;
  awsKo: string;
  awsEn: string;
  color: string;
  radius: number; // visual radius %
}

const SCALES: ScaleDef[] = [
  {
    id: "lan",
    nameKo: "LAN (Local Area Network)",
    nameEn: "LAN (Local Area Network)",
    rangeKo: "범위: 건물 / 사무실",
    rangeEn: "Range: Building / Office",
    descKo:
      "같은 건물이나 캠퍼스 내의 장치들을 연결하는 네트워크. 이더넷/Wi-Fi로 구성. 높은 속도(1~10Gbps), 낮은 지연.",
    descEn:
      "Network connecting devices within a building or campus. Built with Ethernet/Wi-Fi. High speed (1-10Gbps), low latency.",
    exampleKo: "예: 사무실 내 PC들, 가정 공유기에 연결된 기기들",
    exampleEn: "Ex: Office PCs, devices on your home router",
    awsKo:
      "AWS 매핑: VPC 내 하나의 서브넷 (같은 AZ). EC2 인스턴스들이 프라이빗 IP로 직접 통신.",
    awsEn:
      "AWS Mapping: A single subnet within a VPC (same AZ). EC2 instances communicate directly via private IPs.",
    color: "blue",
    radius: 20,
  },
  {
    id: "man",
    nameKo: "MAN (Metropolitan Area Network)",
    nameEn: "MAN (Metropolitan Area Network)",
    rangeKo: "범위: 도시",
    rangeEn: "Range: City",
    descKo:
      "도시 규모의 네트워크. 여러 LAN을 연결. ISP 백본이나 대학 캠퍼스 간 연결에 사용.",
    descEn:
      "City-scale network connecting multiple LANs. Used for ISP backbones or inter-campus connections.",
    exampleKo:
      "예: 서울시 내 지사들을 연결하는 기업 네트워크, 대학교 캠퍼스 간 망",
    exampleEn:
      "Ex: Corporate network connecting offices across a city, inter-campus university network",
    awsKo:
      "AWS 매핑: 같은 리전 내 여러 AZ에 걸친 VPC. AZ 간 통신은 AWS 내부 백본을 통해 저지연 보장.",
    awsEn:
      "AWS Mapping: A VPC spanning multiple AZs in the same region. Inter-AZ traffic uses AWS internal backbone with low latency.",
    color: "green",
    radius: 45,
  },
  {
    id: "wan",
    nameKo: "WAN (Wide Area Network)",
    nameEn: "WAN (Wide Area Network)",
    rangeKo: "범위: 국가 / 세계",
    rangeEn: "Range: Country / World",
    descKo:
      "국가 또는 전 세계를 연결하는 네트워크. 인터넷이 가장 큰 WAN. 해저 케이블, 위성 등으로 연결.",
    descEn:
      "Network spanning countries or the entire world. The internet is the largest WAN. Connected via submarine cables, satellites.",
    exampleKo: "예: 인터넷, 다국적 기업의 글로벌 네트워크",
    exampleEn: "Ex: The internet, multinational corporate global networks",
    awsKo:
      "AWS 매핑: 리전 간 통신 → VPC Peering / Transit Gateway. 인터넷 → Internet Gateway + NAT Gateway로 외부 통신.",
    awsEn:
      "AWS Mapping: Inter-region → VPC Peering / Transit Gateway. Internet → Internet Gateway + NAT Gateway for external access.",
    color: "violet",
    radius: 75,
  },
];

const KO = {
  traditional: "전통 네트워크",
  cloud: "AWS 매핑",
  natExplain:
    "💡 LAN/WAN은 '범위(scope)'의 개념이고, NAT는 '주소 변환 기술'입니다. 사설 네트워크(LAN) 내부의 프라이빗 IP를 공인 IP로 변환하여 WAN(인터넷)과 통신할 수 있게 해줍니다.",
  natTitle: "NAT와의 관계",
  awsArchTitle: "AWS 아키텍처",
  awsNat:
    "NAT Gateway: 프라이빗 서브넷 → 인터넷 (아웃바운드만). 프라이빗 IP를 Elastic IP로 변환.",
  awsIgw: "Internet Gateway: VPC ↔ 인터넷 양방향 통신의 관문.",
};

const EN = {
  traditional: "Traditional",
  cloud: "AWS Mapping",
  natExplain:
    "💡 LAN/WAN are 'scope' concepts, while NAT is an 'address translation technique'. It translates private IPs inside a LAN to public IPs for communication over WAN (internet).",
  natTitle: "Relationship with NAT",
  awsArchTitle: "AWS Architecture",
  awsNat:
    "NAT Gateway: Private subnet → Internet (outbound only). Translates private IP to Elastic IP.",
  awsIgw:
    "Internet Gateway: Bidirectional gateway between VPC and the internet.",
};

export default function NetworkScale() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;
  const [selected, setSelected] = useState<ScaleType>("lan");
  const [viewMode, setViewMode] = useState<ViewMode>("traditional");

  const scale = SCALES.find((s) => s.id === selected)!;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      {/* view mode toggle */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setViewMode("traditional")}
          className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
            viewMode === "traditional"
              ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
              : "border-white/10 text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {t.traditional}
        </button>
        <button
          onClick={() => setViewMode("cloud")}
          className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
            viewMode === "cloud"
              ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
              : "border-white/10 text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {t.cloud}
        </button>
      </div>

      {/* scale selector */}
      <div className="flex gap-2 mb-6">
        {SCALES.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
              selected === s.id
                ? `border-${s.color}-500/40 bg-${s.color}-500/10 text-${s.color}-300`
                : "border-white/10 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {s.id.toUpperCase()}
          </button>
        ))}
      </div>

      {/* concentric circles visualization */}
      <div className="relative w-full h-48 mb-6 flex items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-zinc-900/30">
        {SCALES.map((s) => {
          const size = s.id === "lan" ? 60 : s.id === "man" ? 120 : 180;
          return (
            <div
              key={s.id}
              className={`absolute rounded-full border transition-all duration-500 ${
                selected === s.id ? "opacity-100" : "opacity-30"
              } ${
                s.id === "lan"
                  ? "border-blue-500/50"
                  : s.id === "man"
                    ? "border-green-500/50"
                    : "border-violet-500/50"
              }`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                background:
                  selected === s.id
                    ? `radial-gradient(circle, ${
                        s.id === "lan"
                          ? "rgba(59,130,246,0.1)"
                          : s.id === "man"
                            ? "rgba(34,197,94,0.1)"
                            : "rgba(139,92,246,0.1)"
                      }, transparent)`
                    : "transparent",
              }}
            />
          );
        })}
        {/* center dot */}
        <div className="absolute w-2 h-2 rounded-full bg-white" />
        {/* labels */}
        <span
          className="absolute text-[9px] font-mono text-blue-400/70"
          style={{
            top: "50%",
            left: "calc(50% + 38px)",
            transform: "translateY(-50%)",
          }}
        >
          LAN
        </span>
        <span
          className="absolute text-[9px] font-mono text-green-400/70"
          style={{
            top: "50%",
            left: "calc(50% + 68px)",
            transform: "translateY(-50%)",
          }}
        >
          MAN
        </span>
        <span
          className="absolute text-[9px] font-mono text-violet-400/70"
          style={{
            top: "50%",
            left: "calc(50% + 98px)",
            transform: "translateY(-50%)",
          }}
        >
          WAN
        </span>
      </div>

      {/* info panel */}
      <div className="space-y-3 mb-5">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h5 className="text-sm font-semibold text-white mb-1">
            {lang === "ko" ? scale.nameKo : scale.nameEn}
          </h5>
          <p className="text-[11px] text-zinc-500 font-mono mb-2">
            {lang === "ko" ? scale.rangeKo : scale.rangeEn}
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed mb-2">
            {lang === "ko" ? scale.descKo : scale.descEn}
          </p>
          <p className="text-[11px] text-zinc-500 italic">
            {lang === "ko" ? scale.exampleKo : scale.exampleEn}
          </p>
        </div>

        {viewMode === "cloud" && (
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
            <h5 className="text-xs font-semibold text-violet-300 mb-2">
              {t.awsArchTitle}
            </h5>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              {lang === "ko" ? scale.awsKo : scale.awsEn}
            </p>
            <div className="space-y-1.5">
              <p className="text-[11px] text-zinc-500">{t.awsNat}</p>
              <p className="text-[11px] text-zinc-500">{t.awsIgw}</p>
            </div>
          </div>
        )}
      </div>

      {/* NAT explanation */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <h5 className="text-xs font-semibold text-amber-300 mb-2">
          {t.natTitle}
        </h5>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          {t.natExplain}
        </p>
      </div>
    </div>
  );
}
