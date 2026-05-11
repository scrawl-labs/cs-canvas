import ComingSoonPage from "@/components/ComingSoonPage";

const subtopics = [
  {
    name: "TCP Three-Way Handshake",
    description:
      "SYN, SYN-ACK, ACK — packet exchange animated between client and server.",
  },
  {
    name: "OSI Layers",
    description:
      "Layer-by-layer encapsulation — see headers wrap around payload.",
  },
  {
    name: "IP Routing",
    description:
      "Routing tables, longest prefix match — hop-by-hop packet journey.",
  },
  {
    name: "DNS Resolution",
    description:
      "Recursive vs iterative — resolver chain shown step by step.",
  },
];

export default function NetworksPage() {
  return (
    <ComingSoonPage
      title="Networks"
      icon="🌐"
      color="from-blue-500 to-cyan-600"
      description="TCP handshakes, OSI layers, routing — see packets travel."
      subtopics={subtopics}
    />
  );
}
