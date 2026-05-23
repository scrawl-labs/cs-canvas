"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type LayerKey =
  | "physical"
  | "datalink"
  | "network"
  | "transport"
  | "application";

interface DeviceDef {
  id: string;
  layer: LayerKey;
  nameKo: string;
  nameEn: string;
  analogyKo: string;
  analogyEn: string;
  descKo: string;
  descEn: string;
  detailsKo: string[];
  detailsEn: string[];
  color: string;
  bgColor: string;
}

const DEVICES: DeviceDef[] = [
  {
    id: "l7",
    layer: "application",
    nameKo: "L7 스위치 (로드밸런서)",
    nameEn: "L7 Switch (Load Balancer)",
    analogyKo:
      '호텔 컨시어지 — 손님의 요청 내용을 읽고 "스파 원하시면 3층, 레스토랑은 2층" 이렇게 내용 기반으로 안내하는 직원',
    analogyEn:
      'Hotel concierge — reads your request and directs you: "Spa? 3rd floor. Restaurant? 2nd floor." Routes based on content.',
    descKo:
      "애플리케이션 계층(L7)을 이해하는 스위치. URL, HTTP 헤더, 쿠키 등 '내용'을 보고 어떤 서버로 보낼지 결정합니다.",
    descEn:
      "A switch that understands the Application layer (L7). Reads URLs, HTTP headers, cookies — the actual content — to decide which server handles the request.",
    detailsKo: [
      "URL 기반 분산: /api는 API서버, /images는 이미지서버로",
      "쿠키 기반 세션 유지: 같은 사용자는 같은 서버로",
      "바이러스/악성 트래픽 필터링 가능",
      "헬스체크: 서버 죽으면 자동으로 제외",
      "AWS에서는 ALB (Application Load Balancer)",
    ],
    detailsEn: [
      "URL-based routing: /api → API server, /images → image server",
      "Cookie-based session stickiness: same user → same server",
      "Can filter viruses and malicious traffic",
      "Health checks: auto-removes dead servers",
      "AWS equivalent: ALB (Application Load Balancer)",
    ],
    color: "text-violet-400",
    bgColor: "bg-violet-500/10 border-violet-500/30",
  },
  {
    id: "l4",
    layer: "transport",
    nameKo: "L4 스위치",
    nameEn: "L4 Switch",
    analogyKo:
      '고속도로 톨게이트 — 차량 번호(IP)와 차선 번호(포트)만 보고 "이 차선으로 가세요" 하고 분배. 차 안에 뭐가 실렸는지는 안 봄',
    analogyEn:
      'Highway toll gate — only checks license plate (IP) and lane number (port). "Go to lane 3." Doesn\'t look inside the car.',
    descKo:
      "전송 계층(L4)까지만 이해. IP 주소와 포트 번호만으로 트래픽을 분산합니다. 내용(URL, 쿠키)은 볼 수 없습니다.",
    descEn:
      "Understands up to Transport layer (L4). Distributes traffic using only IP and port numbers. Cannot read content (URLs, cookies).",
    detailsKo: [
      "IP + 포트 기반 분산만 가능",
      "L7보다 빠름 (내용 해석 안 하니까)",
      "스트리밍 서비스에는 부적합 (메시지 내용 구분 불가)",
      "헬스체크: TCP 3-way handshake 성공 여부로 판단",
      "AWS에서는 NLB (Network Load Balancer)",
    ],
    detailsEn: [
      "Can only distribute by IP + port",
      "Faster than L7 (doesn't parse content)",
      "Not ideal for streaming (can't distinguish message content)",
      "Health check: judges by TCP 3-way handshake success",
      "AWS equivalent: NLB (Network Load Balancer)",
    ],
    color: "text-green-400",
    bgColor: "bg-green-500/10 border-green-500/30",
  },
  {
    id: "router",
    layer: "network",
    nameKo: "라우터 (L3 스위치)",
    nameEn: "Router (L3 Switch)",
    analogyKo:
      '우체국 — 편지의 우편번호(IP 주소)를 보고 "서울행은 이쪽, 부산행은 저쪽" 최적 경로로 분류. 다른 동네(네트워크)로 보내는 역할',
    analogyEn:
      'Post office — reads the zip code (IP address) and sorts: "Seoul mail goes left, Busan mail goes right." Sends to different neighborhoods (networks).',
    descKo:
      "인터넷/네트워크 계층(L3)을 처리. 서로 다른 네트워크 사이에서 패킷의 최적 경로를 찾아 전달(포워딩)합니다.",
    descEn:
      "Handles the Network layer (L3). Finds the optimal path between different networks and forwards packets accordingly.",
    detailsKo: [
      "라우팅 테이블 참조: 목적지까지 최소 경로 계산",
      "다른 네트워크 간 통신의 핵심 장비",
      "패킷 소모 최소화 + 경로 최적화",
      "L2 스위치 기능 + 라우팅 기능 = L3 스위치",
      "집에 있는 공유기도 사실 작은 라우터!",
    ],
    detailsEn: [
      "Consults routing table: calculates shortest path to destination",
      "Essential device for communication between different networks",
      "Minimizes packet waste + optimizes routes",
      "L2 switch features + routing = L3 switch",
      "Your home Wi-Fi router is actually a small router!",
    ],
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/30",
  },
  {
    id: "l2switch",
    layer: "datalink",
    nameKo: "L2 스위치",
    nameEn: "L2 Switch",
    analogyKo:
      "아파트 우편함 — 호수(MAC 주소)를 보고 정확한 집으로 배달. 우편번호(IP)는 모르고, 같은 아파트(LAN) 안에서만 배달 가능",
    analogyEn:
      "Apartment mailbox — reads apartment number (MAC address) and delivers to the exact unit. Doesn't know zip codes (IP). Only works within the same building (LAN).",
    descKo:
      "데이터 링크 계층(L2)을 처리. MAC 주소 테이블로 장치를 관리하며, 같은 네트워크 안에서 프레임을 정확한 포트로 전달합니다.",
    descEn:
      "Handles the Data Link layer (L2). Manages devices via MAC address table and delivers frames to the correct port within the same network.",
    detailsKo: [
      "MAC 주소 테이블로 어떤 포트에 어떤 장치가 있는지 기록",
      "IP 주소는 모름 → 다른 네트워크로 라우팅 불가",
      "MAC 주소가 테이블에 없으면? 모든 포트에 전달(플러딩)",
      "같은 LAN 내에서만 동작",
      "브리지: 두 LAN 세그먼트를 연결하는 다리 역할 (L2 스위치의 조상)",
    ],
    detailsEn: [
      "MAC address table records which device is on which port",
      "Doesn't know IP → cannot route to other networks",
      "MAC not in table? Floods to all ports (broadcasting)",
      "Only works within the same LAN",
      "Bridge: connects two LAN segments (ancestor of L2 switch)",
    ],
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/30",
  },
  {
    id: "nic",
    layer: "physical",
    nameKo: "NIC & AP",
    nameEn: "NIC & AP",
    analogyKo:
      "전화기 & 기지국 — NIC는 컴퓨터에 달린 전화기(통신 가능하게 해주는 부품). AP는 동네 기지국(무선 신호를 퍼뜨려서 연결해주는 장치)",
    analogyEn:
      "Phone & Cell Tower — NIC is the phone in your computer (the part that enables communication). AP is the local cell tower (broadcasts wireless signal so devices can connect).",
    descKo:
      "물리 계층(L1)을 처리. NIC(랜카드)는 컴퓨터가 네트워크에 참여할 수 있게 해주며, 고유한 MAC 주소(주민번호 같은 것)를 가집니다. AP는 무선 신호를 퍼뜨립니다.",
    descEn:
      "Handles the Physical layer (L1). NIC (LAN card) lets a computer join a network with a unique MAC address (like a national ID). AP broadcasts wireless signals.",
    detailsKo: [
      "NIC = 네트워크 인터페이스 카드 (랜카드)",
      "각 NIC에는 세상에 하나뿐인 MAC 주소가 있음 (주민번호처럼)",
      "AP = Access Point (무선 공유기의 핵심 기능)",
      "AP는 유선 LAN을 무선으로 확장하는 다리",
      "패킷을 전기/광/무선 신호로 변환하는 최종 단계",
    ],
    detailsEn: [
      "NIC = Network Interface Card (LAN card)",
      "Each NIC has a globally unique MAC address (like a national ID number)",
      "AP = Access Point (core function of a wireless router)",
      "AP bridges wired LAN to wireless devices",
      "Final step: converts packets to electrical/optical/wireless signals",
    ],
    color: "text-rose-400",
    bgColor: "bg-rose-500/10 border-rose-500/30",
  },
];

const LAYERS: {
  id: LayerKey;
  labelKo: string;
  labelEn: string;
  color: string;
}[] = [
  {
    id: "application",
    labelKo: "응용 (L7)",
    labelEn: "Application (L7)",
    color: "text-violet-400",
  },
  {
    id: "transport",
    labelKo: "전송 (L4)",
    labelEn: "Transport (L4)",
    color: "text-green-400",
  },
  {
    id: "network",
    labelKo: "네트워크 (L3)",
    labelEn: "Network (L3)",
    color: "text-blue-400",
  },
  {
    id: "datalink",
    labelKo: "데이터링크 (L2)",
    labelEn: "Data Link (L2)",
    color: "text-amber-400",
  },
  {
    id: "physical",
    labelKo: "물리 (L1)",
    labelEn: "Physical (L1)",
    color: "text-rose-400",
  },
];

const KO = {
  clickHint: "장비를 클릭해서 자세히 보기",
  analogy: "일상 비유",
  details: "핵심 포인트",
  comparison: "L4 vs L7 비교",
  compItems: [
    {
      aspect: "보는 것",
      l4: "IP + 포트 번호",
      l7: "URL, 헤더, 쿠키, 메시지 내용",
    },
    { aspect: "속도", l4: "빠름 (단순)", l7: "느림 (내용 해석)" },
    { aspect: "스트리밍", l4: "부적합", l7: "가능" },
    { aspect: "필터링", l4: "불가", l7: "바이러스/악성 차단" },
    { aspect: "AWS", l4: "NLB", l7: "ALB" },
    {
      aspect: "비유",
      l4: "번호판만 보는 톨게이트",
      l7: "요청 내용 읽는 컨시어지",
    },
  ],
};

const EN = {
  clickHint: "Click a device for details",
  analogy: "Everyday Analogy",
  details: "Key Points",
  comparison: "L4 vs L7 Comparison",
  compItems: [
    {
      aspect: "Inspects",
      l4: "IP + Port only",
      l7: "URL, headers, cookies, message content",
    },
    { aspect: "Speed", l4: "Fast (simple)", l7: "Slower (parses content)" },
    { aspect: "Streaming", l4: "Not ideal", l7: "Supported" },
    { aspect: "Filtering", l4: "Cannot", l7: "Virus/malicious blocking" },
    { aspect: "AWS", l4: "NLB", l7: "ALB" },
    {
      aspect: "Analogy",
      l4: "Toll gate checking plates",
      l7: "Concierge reading requests",
    },
  ],
};

export default function NetworkDevicesViz() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;
  const [selected, setSelected] = useState<string>("l7");

  const device = DEVICES.find((d) => d.id === selected)!;

  return (
    <div className="space-y-6">
      {/* Layer stack with devices */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <p className="text-xs text-zinc-600 font-mono mb-5">{t.clickHint}</p>

        {/* Vertical layer stack */}
        <div className="space-y-2 mb-6">
          {LAYERS.map((layer) => {
            const layerDevices = DEVICES.filter((d) => d.layer === layer.id);
            return (
              <div
                key={layer.id}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3"
              >
                {/* layer label */}
                <div className="w-28 shrink-0">
                  <span className={`text-[11px] font-mono ${layer.color}`}>
                    {lang === "ko" ? layer.labelKo : layer.labelEn}
                  </span>
                </div>

                {/* devices in this layer */}
                <div className="flex gap-2 flex-wrap">
                  {layerDevices.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelected(d.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-left cursor-pointer ${
                        selected === d.id
                          ? `${d.bgColor} scale-[1.02]`
                          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <span
                        className={`text-xs font-medium ${selected === d.id ? d.color : "text-zinc-300"}`}
                      >
                        {lang === "ko" ? d.nameKo : d.nameEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        <div
          className={`rounded-xl border ${device.bgColor} p-5 transition-all duration-300`}
        >
          {/* analogy - the star of the show */}
          <div className="mb-4">
            <h4 className={`text-xs font-mono ${device.color} mb-2`}>
              {t.analogy}
            </h4>
            <p className="text-sm text-zinc-200 leading-relaxed">
              {lang === "ko" ? device.analogyKo : device.analogyEn}
            </p>
          </div>

          {/* description */}
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            {lang === "ko" ? device.descKo : device.descEn}
          </p>

          {/* detail bullets */}
          <div>
            <h4 className={`text-xs font-mono ${device.color} mb-2`}>
              {t.details}
            </h4>
            <ul className="space-y-1.5">
              {(lang === "ko" ? device.detailsKo : device.detailsEn).map(
                (item, i) => (
                  <li
                    key={i}
                    className="text-[11px] text-zinc-400 flex items-start gap-2"
                  >
                    <span className="text-zinc-600 shrink-0 mt-0.5">•</span>
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* L4 vs L7 comparison table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h4 className="text-sm font-semibold text-white mb-4">
          {t.comparison}
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-3 py-2 text-zinc-600 font-mono"></th>
                <th className="text-left px-3 py-2 text-green-400 font-mono">
                  L4
                </th>
                <th className="text-left px-3 py-2 text-violet-400 font-mono">
                  L7
                </th>
              </tr>
            </thead>
            <tbody>
              {t.compItems.map((row) => (
                <tr key={row.aspect} className="border-b border-zinc-800/50">
                  <td className="px-3 py-2 text-zinc-500 font-medium">
                    {row.aspect}
                  </td>
                  <td className="px-3 py-2 text-zinc-300">{row.l4}</td>
                  <td className="px-3 py-2 text-zinc-300">{row.l7}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
