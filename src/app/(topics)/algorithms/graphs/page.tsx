import ComingSoonPage from "@/components/ComingSoonPage";

const subtopics = [
  {
    name: "Breadth-First Search",
    description: "Level-by-level traversal — queue state shown at each step.",
  },
  {
    name: "Depth-First Search",
    description: "Stack-based traversal with backtracking highlighted.",
  },
  {
    name: "Dijkstra's Algorithm",
    description: "Shortest path with priority queue — edge relaxation live.",
  },
  {
    name: "Topological Sort",
    description: "DAG ordering — DFS finish times and Kahn's algorithm.",
  },
];

export default function GraphsPage() {
  return (
    <ComingSoonPage
      title="Graph Traversal"
      icon="🔗"
      color="from-violet-500 to-purple-600"
      description="BFS, DFS, and shortest path algorithms on interactive node graphs."
      subtopics={subtopics}
    />
  );
}
