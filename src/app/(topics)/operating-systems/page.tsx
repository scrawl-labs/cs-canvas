import ComingSoonPage from "@/components/ComingSoonPage";

const subtopics = [
  {
    name: "Process Scheduling",
    description:
      "FCFS, SJF, Round Robin — Gantt chart rendered in real time.",
  },
  {
    name: "Memory Management",
    description:
      "Paging, segmentation, page tables — virtual to physical translation.",
  },
  {
    name: "Deadlock",
    description:
      "Resource allocation graphs — detect cycles and banker's algorithm.",
  },
  {
    name: "Synchronization",
    description: "Mutex, semaphores, monitors — race conditions visualized.",
  },
  {
    name: "Virtual Memory",
    description: "Page faults, TLB hits/misses — working set animated.",
  },
];

export default function OperatingSystemsPage() {
  return (
    <ComingSoonPage
      title="Operating Systems"
      icon="⚙️"
      color="from-orange-500 to-amber-600"
      description="Process scheduling, memory management, deadlocks visualized."
      subtopics={subtopics}
    />
  );
}
