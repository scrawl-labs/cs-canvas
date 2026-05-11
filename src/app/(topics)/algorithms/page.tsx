import ComingSoonPage from "@/components/ComingSoonPage";

const subtopics = [
  {
    name: "Sorting Algorithms",
    description:
      "Bubble, merge, quick, heap sort — step-by-step visual comparison.",
  },
  {
    name: "Graph Traversal",
    description: "BFS and DFS on interactive graphs with live node coloring.",
  },
  {
    name: "Dynamic Programming",
    description:
      "Fibonacci, knapsack, LCS — see the memo table fill in real time.",
  },
  {
    name: "Divide & Conquer",
    description: "Recursion trees and subproblem breakdowns visualized.",
  },
  {
    name: "Greedy Algorithms",
    description:
      "Dijkstra, Prim, activity selection — local choices, global results.",
  },
  {
    name: "Backtracking",
    description: "N-Queens, Sudoku solver — watch the search tree prune.",
  },
  {
    name: "String Algorithms",
    description: "KMP, Rabin-Karp — pattern matching step by step.",
  },
  {
    name: "Shortest Path",
    description:
      "Bellman-Ford vs Dijkstra — negative edges and relaxation steps.",
  },
];

export default function AlgorithmsPage() {
  return (
    <ComingSoonPage
      title="Algorithms"
      icon="⚡"
      color="from-violet-500 to-purple-600"
      description="Sorting, graph traversal, dynamic programming — watch them run."
      subtopics={subtopics}
    />
  );
}
