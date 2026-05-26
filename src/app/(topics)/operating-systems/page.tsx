"use client";

import ComingSoonPage from "@/components/ComingSoonPage";
import { useLanguage } from "@/contexts/LanguageContext";

const KO = {
  title: "운영체제",
  description: "프로세스 스케줄링, 메모리 관리, 데드락 — OS 내부의 작동을 시각화합니다.",
  subtopics: [
    {
      name: "프로세스 스케줄링",
      description: "FCFS, SJF, Round Robin, MLFQ — Gantt 차트로 비교.",
      href: "/operating-systems/process-scheduling",
    },
    {
      name: "메모리 관리",
      description: "가상 메모리, 페이징, TLB, Page Fault — 주소 변환의 전 과정.",
      href: "/operating-systems/memory-management",
    },
    {
      name: "데드락",
      description: "Coffman 4조건, RAG, Banker's Algorithm — 발생과 회복.",
      href: "/operating-systems/deadlock",
    },
    {
      name: "동기화",
      description: "Race condition, Mutex, Semaphore, Monitor — Producer-Consumer까지.",
      href: "/operating-systems/synchronization",
    },
    {
      name: "가상 메모리",
      description: "Demand Paging, Working Set, Thrashing, Swap — 디스크가 RAM의 연장.",
      href: "/operating-systems/virtual-memory",
    },
  ],
};

const EN = {
  title: "Operating Systems",
  description: "Process scheduling, memory management, deadlocks — visualize the OS inside.",
  subtopics: [
    {
      name: "Process Scheduling",
      description: "FCFS, SJF, Round Robin, MLFQ — compared on Gantt charts.",
      href: "/operating-systems/process-scheduling",
    },
    {
      name: "Memory Management",
      description: "Virtual memory, paging, TLB, page faults — the full address translation flow.",
      href: "/operating-systems/memory-management",
    },
    {
      name: "Deadlock",
      description: "Coffman 4 conditions, RAG, Banker's Algorithm — formation and recovery.",
      href: "/operating-systems/deadlock",
    },
    {
      name: "Synchronization",
      description: "Race conditions, Mutex, Semaphore, Monitor — through Producer-Consumer.",
      href: "/operating-systems/synchronization",
    },
    {
      name: "Virtual Memory",
      description: "Demand Paging, Working Set, Thrashing, Swap — disk as RAM extension.",
      href: "/operating-systems/virtual-memory",
    },
  ],
};

export default function OperatingSystemsPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <ComingSoonPage
      title={t.title}
      icon="⚙️"
      color="from-orange-500 to-amber-600"
      description={t.description}
      subtopics={t.subtopics}
    />
  );
}
