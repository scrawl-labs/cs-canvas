"use client";

import ComingSoonPage from "@/components/ComingSoonPage";
import { useLanguage } from "@/contexts/LanguageContext";

const KO = {
  title: "컴퓨터 구조",
  description: "CPU 파이프라인, 캐시 계층, 메모리 피라미드 — 하드웨어 내부의 작동을 시각화합니다.",
  subtopics: [
    {
      name: "CPU Pipeline",
      description: "5단계 파이프라인부터 Out-of-Order까지 — Fetch, Decode, Execute, Hazard, Forwarding.",
      href: "/computer-architecture/cpu-pipeline",
    },
    {
      name: "캐시 계층",
      description: "L1/L2/L3 — Hit/Miss, Cache Line, Mapping, Write-Back, MESI 코히런스.",
      href: "/computer-architecture/cache-hierarchy",
    },
    {
      name: "메모리 계층",
      description: "Register → Cache → RAM → SSD → HDD — 1000배 격차를 사람의 시간으로.",
      href: "/computer-architecture/memory-hierarchy",
    },
    {
      name: "ISA (명령어 집합)",
      description: "x86, ARM, RISC-V — RISC vs CISC, Endianness, ABI.",
      href: "/computer-architecture/instruction-set-architecture",
    },
    {
      name: "Branch Prediction",
      description: "2-bit Counter부터 TAGE까지 — 99% 정확도의 비밀과 Spectre 취약점.",
      href: "/computer-architecture/branch-prediction",
    },
  ],
};

const EN = {
  title: "Computer Architecture",
  description: "CPU pipelines, cache hierarchies, memory pyramids — visualize how hardware actually works.",
  subtopics: [
    {
      name: "CPU Pipeline",
      description: "5-stage pipeline to Out-of-Order — Fetch, Decode, Execute, Hazards, Forwarding.",
      href: "/computer-architecture/cpu-pipeline",
    },
    {
      name: "Cache Hierarchy",
      description: "L1/L2/L3 — Hit/Miss, Cache Line, Mapping, Write-Back, MESI coherence.",
      href: "/computer-architecture/cache-hierarchy",
    },
    {
      name: "Memory Hierarchy",
      description: "Register → Cache → RAM → SSD → HDD — 1000× gaps translated to human time.",
      href: "/computer-architecture/memory-hierarchy",
    },
    {
      name: "Instruction Set Architecture",
      description: "x86, ARM, RISC-V — RISC vs CISC, endianness, ABI.",
      href: "/computer-architecture/instruction-set-architecture",
    },
    {
      name: "Branch Prediction",
      description: "From 2-bit counters to TAGE — the secret of 99% accuracy and Spectre's roots.",
      href: "/computer-architecture/branch-prediction",
    },
  ],
};

export default function ComputerArchitecturePage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <ComingSoonPage
      title={t.title}
      icon="🔧"
      color="from-slate-500 to-gray-600"
      description={t.description}
      subtopics={t.subtopics}
    />
  );
}
