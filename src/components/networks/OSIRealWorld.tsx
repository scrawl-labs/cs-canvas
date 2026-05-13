"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { useLanguage } from "@/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NodeDef {
  id: string;
  label: string;
  sublabel: string;
  color: string;
  x: number;
  y: number;
}

interface Step {
  fromId: string;
  toId: string;
  activeLayers: number[];
  labelEn: string;
  labelKo: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NODES: NodeDef[] = [
  { id: "client",      label: "Client",      sublabel: "MacBook",        color: "#60a5fa", x: -4.5, y: 0   },
  { id: "home_router", label: "Home Router", sublabel: "192.168.1.1",    color: "#a78bfa", x: -2.5, y: 0.8 },
  { id: "isp",         label: "ISP Router",  sublabel: "AS7922",         color: "#f59e0b", x: -0.5, y: -0.5},
  { id: "backbone",    label: "Backbone",    sublabel: "Tier-1 AS3356",  color: "#f59e0b", x:  1.5, y: 0.6 },
  { id: "cdn_edge",    label: "CDN Edge",    sublabel: "Cloudflare PoP", color: "#34d399", x:  3.2, y: -0.3},
  { id: "server",      label: "Server",      sublabel: "example.com",    color: "#60a5fa", x:  4.8, y: 0   },
];

const EDGES: [string, string][] = [
  ["client", "home_router"],
  ["home_router", "isp"],
  ["isp", "backbone"],
  ["backbone", "cdn_edge"],
  ["cdn_edge", "server"],
];

const STEPS: Step[] = [
  {
    fromId: "client",
    toId: "home_router",
    activeLayers: [7, 6, 5, 4, 3, 2, 1],
    labelEn: "HTTP GET /index.html — All 7 layers wrap the data",
    labelKo: "HTTP GET /index.html — 7개 계층이 데이터를 감쌉니다",
  },
  {
    fromId: "home_router",
    toId: "isp",
    activeLayers: [3, 2, 1],
    labelEn: "IP routing decision — L3 reads dest IP, L2 new MAC header",
    labelKo: "IP 라우팅 결정 — L3가 목적지 IP 읽고, L2가 새 MAC 헤더 추가",
  },
  {
    fromId: "isp",
    toId: "backbone",
    activeLayers: [3, 2, 1],
    labelEn: "BGP route lookup — packet crosses AS boundary",
    labelKo: "BGP 경로 탐색 — 패킷이 AS 경계를 넘습니다",
  },
  {
    fromId: "backbone",
    toId: "cdn_edge",
    activeLayers: [3, 2, 1],
    labelEn: "Tier-1 backbone — optical fiber, L1 at 400Gbps",
    labelKo: "Tier-1 백본 — 광섬유, L1에서 400Gbps",
  },
  {
    fromId: "cdn_edge",
    toId: "server",
    activeLayers: [3, 2, 1],
    labelEn: "CDN terminates TLS — L6 decrypts, L7 cache check",
    labelKo: "CDN이 TLS 종료 — L6 복호화, L7 캐시 확인",
  },
  {
    fromId: "server",
    toId: "server",
    activeLayers: [7, 6, 5, 4, 3, 2, 1],
    labelEn: "Server receives — all layers unwrap, HTTP response prepared",
    labelKo: "서버 도착 — 전 계층 언래핑, HTTP 응답 준비",
  },
];

// ─── Layer colors ──────────────────────────────────────────────────────────────

const LAYER_META: Record<number, { label: string; color: string }> = {
  7: { label: "L7", color: "#60a5fa" },
  6: { label: "L6", color: "#7c3aed" },
  5: { label: "L5", color: "#a855f7" },
  4: { label: "L4", color: "#f43f5e" },
  3: { label: "L3", color: "#f97316" },
  2: { label: "L2", color: "#f59e0b" },
  1: { label: "L1", color: "#71717a" },
};

// ─── Easing ───────────────────────────────────────────────────────────────────

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ─── Node map helper ──────────────────────────────────────────────────────────

function getNode(id: string): NodeDef {
  return NODES.find((n) => n.id === id) ?? NODES[0];
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const LaptopIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="M0 21h24M6 17v4M18 17v4"/>
  </svg>
);

const RouterIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="14" width="20" height="6" rx="2"/>
    <circle cx="6" cy="17" r="1" fill="currentColor"/>
    <circle cx="10" cy="17" r="1" fill="currentColor"/>
    <path d="M12 14V8M8 10l4-4 4 4"/>
    <path d="M5 8a9 9 0 0 1 14 0M8 11a5 5 0 0 1 8 0"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const ServerIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2"/>
    <rect x="2" y="14" width="20" height="8" rx="2"/>
    <circle cx="6" cy="6" r="1" fill="currentColor"/>
    <circle cx="6" cy="18" r="1" fill="currentColor"/>
    <path d="M10 6h8M10 18h8"/>
  </svg>
);

type NodeIconType = "client" | "home_router" | "isp" | "backbone" | "cdn_edge" | "server";

function NodeIcon({ id }: { id: NodeIconType }) {
  if (id === "client") return <LaptopIcon />;
  if (id === "cdn_edge") return <GlobeIcon />;
  if (id === "server") return <ServerIcon />;
  return <RouterIcon />;
}

// ─── Three.js sub-components ──────────────────────────────────────────────────

interface NetworkNodeProps {
  node: NodeDef;
  isActive: boolean;
}

function NetworkNode({ node, isActive }: NetworkNodeProps) {
  return (
    <Html position={[node.x, node.y, 0]} center>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
        pointerEvents: "none", userSelect: "none",
      }}>
        <div style={{
          width: 52, height: 52,
          borderRadius: 12,
          border: `1.5px solid ${isActive ? node.color : "rgba(255,255,255,0.1)"}`,
          background: isActive ? `${node.color}22` : "rgba(9,9,11,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: isActive ? node.color : "rgba(255,255,255,0.35)",
          boxShadow: isActive ? `0 0 16px ${node.color}55` : "none",
          transition: "all 0.4s ease",
        }}>
          <NodeIcon id={node.id as NodeIconType} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.45)", fontSize: 11, fontFamily: "monospace", fontWeight: 600 }}>
            {node.label}
          </div>
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "monospace" }}>
            {node.sublabel}
          </div>
        </div>
      </div>
    </Html>
  );
}

interface PacketProps {
  step: number;
  progress: number;
}

function Packet({ step, progress }: PacketProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentStep = STEPS[step];
  const fromNode = getNode(currentStep.fromId);
  const toNode = getNode(currentStep.toId);

  const eased = easeInOut(progress);
  const x = fromNode.x + (toNode.x - fromNode.x) * eased;
  const y = fromNode.y + (toNode.y - fromNode.y) * eased;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.8 + Math.sin(clock.getElapsedTime() * 8) * 0.2;
  });

  // last step: arrived — no moving packet
  if (currentStep.fromId === currentStep.toId) return null;

  return (
    <mesh ref={meshRef} position={[x, y, 0.1]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.8}
        roughness={0.1}
        metalness={0.0}
      />
    </mesh>
  );
}

interface SceneProps {
  step: number;
  progress: number;
}

function Scene({ step, progress }: SceneProps) {
  const currentStep = STEPS[step];

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 5]} intensity={1.2} />

      {/* Edges */}
      {EDGES.map(([a, b]) => {
        const nodeA = getNode(a);
        const nodeB = getNode(b);
        return (
          <Line
            key={`${a}-${b}`}
            points={[
              new THREE.Vector3(nodeA.x, nodeA.y, 0),
              new THREE.Vector3(nodeB.x, nodeB.y, 0),
            ]}
            color="#27272a"
            lineWidth={1.5}
          />
        );
      })}

      {/* Nodes */}
      {NODES.map((node) => {
        const isActive =
          node.id === currentStep.fromId || node.id === currentStep.toId;
        return <NetworkNode key={node.id} node={node} isActive={isActive} />;
      })}

      {/* Packet */}
      <Packet step={step} progress={progress} />
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const KO_UI = {
  prev: "이전",
  next: "다음",
  autoplay: "자동 재생",
  pause: "일시 정지",
  node: "현재 노드",
  activeLayers: "활성 계층",
};

const EN_UI = {
  prev: "Prev",
  next: "Next",
  autoplay: "Auto-play",
  pause: "Pause",
  node: "Current Node",
  activeLayers: "Active Layers",
};

export default function OSIRealWorld() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO_UI : EN_UI;

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const progressRef = useRef(0);
  const stepRef = useRef(0);
  const autoplayRef = useRef(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep refs in sync so the animation loop can read them without stale closure
  useEffect(() => {
    stepRef.current = step;
  }, [step]);
  useEffect(() => {
    autoplayRef.current = autoplay;
  }, [autoplay]);

  // Drive animation with requestAnimationFrame outside of Canvas
  // (Canvas manages its own loop; we drive progress from outside via state)
  // Instead we let a separate rAF loop drive progress state.
  useEffect(() => {
    if (!mounted) return;
    let lastTime: number | null = null;
    let rafId: number;

    const DURATION = 1.5; // seconds per hop

    function tick(ts: number) {
      if (!autoplayRef.current) {
        lastTime = null;
        rafId = requestAnimationFrame(tick);
        return;
      }
      if (lastTime === null) lastTime = ts;
      const delta = (ts - lastTime) / 1000;
      lastTime = ts;

      progressRef.current = Math.min(progressRef.current + delta / DURATION, 1);
      setProgress(progressRef.current);

      if (progressRef.current >= 1) {
        progressRef.current = 0;
        const nextStep = (stepRef.current + 1) % STEPS.length;
        stepRef.current = nextStep;
        setStep(nextStep);
        setProgress(0);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [mounted]);

  function goTo(target: number) {
    const clamped = Math.max(0, Math.min(STEPS.length - 1, target));
    progressRef.current = 0;
    stepRef.current = clamped;
    setStep(clamped);
    setProgress(0);
  }

  const currentStep = STEPS[step];
  const fromNode = getNode(currentStep.fromId);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      {/* Three.js canvas */}
      <div style={{ width: "100%", height: 380, background: "#09090b" }}>
        {mounted && (
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 8], fov: 55 }}
            gl={{ antialias: true }}
          >
            <Scene step={step} progress={progress} />
          </Canvas>
        )}
      </div>

      {/* Info panel */}
      <div className="p-5 border-t border-white/[0.05] space-y-4">
        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setAutoplay(false); goTo(i); }}
              className="transition-all"
              style={{
                width: i === step ? 20 : 8,
                height: 8,
                borderRadius: 4,
                background: i === step ? "#60a5fa" : "#27272a",
                border: "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        {/* Current node + active layers */}
        <div className="flex flex-wrap gap-3 items-start">
          <div>
            <p className="text-[10px] font-mono text-zinc-600 mb-1">{t.node}</p>
            <p className="text-sm font-bold text-white font-mono">{fromNode.label}</p>
            <p className="text-[10px] font-mono text-zinc-500">{fromNode.sublabel}</p>
          </div>

          <div className="ml-auto">
            <p className="text-[10px] font-mono text-zinc-600 mb-1">{t.activeLayers}</p>
            <div className="flex gap-1 flex-wrap">
              {[7, 6, 5, 4, 3, 2, 1].map((layer) => {
                const meta = LAYER_META[layer];
                const isActive = currentStep.activeLayers.includes(layer);
                return (
                  <span
                    key={layer}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{
                      background: isActive ? `${meta.color}22` : "#18181b",
                      color: isActive ? meta.color : "#3f3f46",
                      border: `1px solid ${isActive ? meta.color + "44" : "#27272a"}`,
                      transition: "all 0.3s",
                    }}
                  >
                    {meta.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 leading-relaxed">
          {lang === "ko" ? currentStep.labelKo : currentStep.labelEn}
        </p>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setAutoplay(false); goTo(step - 1); }}
            disabled={step === 0}
            className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← {t.prev}
          </button>
          <button
            onClick={() => { setAutoplay(false); goTo(step + 1); }}
            disabled={step === STEPS.length - 1}
            className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {t.next} →
          </button>
          <button
            onClick={() => setAutoplay((v) => !v)}
            className="ml-auto px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
            style={{
              borderColor: autoplay ? "#60a5fa44" : "#27272a",
              color: autoplay ? "#60a5fa" : "#71717a",
              background: autoplay ? "#60a5fa11" : "transparent",
            }}
          >
            {autoplay ? `⏸ ${t.pause}` : `▶ ${t.autoplay}`}
          </button>
        </div>
      </div>
    </div>
  );
}
