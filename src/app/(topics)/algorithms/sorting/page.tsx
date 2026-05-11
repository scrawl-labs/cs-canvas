import ComingSoonPage from "@/components/ComingSoonPage";

const subtopics = [
  {
    name: "Bubble Sort",
    description: "O(n²) comparison sort — adjacent swaps visualized.",
  },
  {
    name: "Merge Sort",
    description: "Divide and conquer — watch the array split and merge.",
  },
  {
    name: "Quick Sort",
    description: "Pivot selection and partition steps with color-coded passes.",
  },
  {
    name: "Heap Sort",
    description: "Build a max-heap then extract — heap tree animated.",
  },
  {
    name: "Insertion Sort",
    description: "Build sorted subarray left to right — best for small n.",
  },
  {
    name: "Radix Sort",
    description: "Non-comparison sort — digit-by-digit bucket passes.",
  },
];

export default function SortingPage() {
  return (
    <ComingSoonPage
      title="Sorting Algorithms"
      icon="↕️"
      color="from-violet-500 to-purple-600"
      description="Compare sorting algorithms side by side — complexity, swaps, and every step."
      subtopics={subtopics}
    />
  );
}
