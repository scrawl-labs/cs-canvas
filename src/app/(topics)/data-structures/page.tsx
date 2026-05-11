import ComingSoonPage from "@/components/ComingSoonPage";

const subtopics = [
  {
    name: "Binary Search Trees",
    description:
      "Insert, delete, search — watch the tree rebalance on every op.",
  },
  {
    name: "Heaps",
    description: "Min/max heap — heapify and extract-min animated.",
  },
  {
    name: "Linked Lists",
    description: "Singly and doubly linked — pointer arrows update live.",
  },
  {
    name: "Hash Tables",
    description: "Collision resolution — chaining and open addressing shown.",
  },
  {
    name: "Tries",
    description: "Prefix trees — autocomplete and search highlighted.",
  },
  {
    name: "Graphs",
    description:
      "Adjacency list vs matrix — memory layout and traversal side by side.",
  },
];

export default function DataStructuresPage() {
  return (
    <ComingSoonPage
      title="Data Structures"
      icon="🌲"
      color="from-emerald-500 to-teal-600"
      description="Trees, heaps, linked lists — interact with every operation."
      subtopics={subtopics}
    />
  );
}
