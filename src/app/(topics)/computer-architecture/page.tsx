import ComingSoonPage from "@/components/ComingSoonPage";

const subtopics = [
  {
    name: "CPU Pipeline",
    description:
      "Fetch, decode, execute, writeback — hazards and stalls highlighted.",
  },
  {
    name: "Cache Hierarchy",
    description:
      "L1/L2/L3 — hit/miss propagation in 3D, powered by Three.js.",
  },
  {
    name: "Memory Hierarchy",
    description:
      "Registers → RAM → disk — latency gap visualized to scale.",
  },
];

export default function ComputerArchitecturePage() {
  return (
    <ComingSoonPage
      title="Computer Architecture"
      icon="🔧"
      color="from-slate-500 to-gray-600"
      description="CPU pipelines, cache hierarchies in 3D — powered by Three.js."
      subtopics={subtopics}
    />
  );
}
