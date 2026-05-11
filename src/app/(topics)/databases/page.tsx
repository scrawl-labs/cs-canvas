import ComingSoonPage from "@/components/ComingSoonPage";

const subtopics = [
  {
    name: "B-Tree Index",
    description:
      "Insert and split operations — node structure updated visually.",
  },
  {
    name: "Transactions & ACID",
    description:
      "Commit, rollback, isolation levels — concurrent txn timelines.",
  },
  {
    name: "Join Algorithms",
    description:
      "Nested loop, hash join, merge join — cost model side by side.",
  },
  {
    name: "Query Execution Plan",
    description: "Parse tree to execution plan — operator pipeline shown.",
  },
  {
    name: "Normalization",
    description: "1NF → 3NF decomposition — dependency arrows live.",
  },
];

export default function DatabasesPage() {
  return (
    <ComingSoonPage
      title="Databases"
      icon="🗄️"
      color="from-rose-500 to-pink-600"
      description="B-Trees, transactions, joins — understand what happens inside."
      subtopics={subtopics}
    />
  );
}
