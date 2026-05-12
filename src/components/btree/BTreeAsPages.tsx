interface PointItem {
  title: string;
  body: string;
  colorClass: string;
  titleClass: string;
}

const POINTS: PointItem[] = [
  {
    title: "노드 = 페이지",
    body: "B+Tree의 각 노드(루트·브랜치·리프)가 실제 디스크의 16KB 블록 하나에 매핑됩니다. 1개 레코드를 읽어도 페이지 전체(16KB)를 로드합니다.",
    colorClass: "border-violet-500/25 bg-violet-500/[0.06]",
    titleClass: "text-violet-300",
  },
  {
    title: "루트·브랜치 → 메모리 상주",
    body: "자주 접근하는 Root/Branch 페이지는 Buffer Pool에 고정 캐싱됩니다. 탐색 시 디스크 I/O 없이 메모리에서 처리됩니다.",
    colorClass: "border-emerald-500/25 bg-emerald-500/[0.06]",
    titleClass: "text-emerald-300",
  },
  {
    title: "리프 → Disk, LRU 대상",
    body: "Leaf 페이지는 Buffer Pool에 캐싱되지만 LRU에 따라 eviction됩니다. Secondary Index leaf에서 Clustered Index leaf로 이동 시 Random I/O가 발생합니다.",
    colorClass: "border-rose-500/25 bg-rose-500/[0.06]",
    titleClass: "text-rose-300",
  },
];

interface NodeDef {
  label: string;
  sub: string;
  footerLabel: string;
  x: number;
  y: number;
  isLeaf: boolean;
}

const NODES: NodeDef[] = [
  {
    label: "Root Page",
    sub: "separator 라우팅",
    footerLabel: "16 KB · Buffer Pool 상주",
    x: 150,
    y: 20,
    isLeaf: false,
  },
  {
    label: "Branch Page",
    sub: "separator 라우팅",
    footerLabel: "16 KB · Buffer Pool 상주",
    x: 70,
    y: 120,
    isLeaf: false,
  },
  {
    label: "Leaf Page",
    sub: "[index col | PK]",
    footerLabel: "16 KB · Disk (LRU eviction)",
    x: 230,
    y: 195,
    isLeaf: true,
  },
];

const NODE_W = 100;
const NODE_H = 44;

function PageNode({ node }: { node: NodeDef }) {
  const fill = node.isLeaf ? "rgba(244,63,94,0.08)" : "rgba(139,92,246,0.12)";
  const stroke = node.isLeaf ? "rgba(244,63,94,0.4)" : "rgba(139,92,246,0.5)";
  const cx = node.x + NODE_W / 2;

  return (
    <g>
      <rect
        x={node.x}
        y={node.y}
        width={NODE_W}
        height={NODE_H}
        rx={6}
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
      />
      <text
        x={cx}
        y={node.y + 16}
        textAnchor="middle"
        fill="white"
        fontSize={11}
        fontFamily="monospace"
      >
        {node.label}
      </text>
      <text
        x={cx}
        y={node.y + 30}
        textAnchor="middle"
        fill="rgba(161,161,170,0.7)"
        fontSize={9}
        fontFamily="monospace"
      >
        {node.sub}
      </text>
      <text
        x={cx}
        y={node.y + NODE_H + 13}
        textAnchor="middle"
        fill="rgba(82,82,91,1)"
        fontSize={9}
        fontFamily="monospace"
      >
        {node.footerLabel}
      </text>
    </g>
  );
}

export default function BTreeAsPages() {
  const root = NODES[0];
  const branch = NODES[1];
  const leaf = NODES[2];

  const rootBottomX = root.x + NODE_W / 2;
  const rootBottomY = root.y + NODE_H;

  const branchTopX = branch.x + NODE_W / 2;
  const branchTopY = branch.y;

  const leafTopX = leaf.x + NODE_W / 2;
  const leafTopY = leaf.y;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
        B+Tree의 각 노드는 디스크의{" "}
        <span className="text-zinc-300">16KB 페이지</span> 하나에 대응합니다.
        루트와 브랜치는 Buffer Pool에 상주하고, 리프는 LRU에 따라 eviction
        대상이 됩니다.
      </p>

      <div className="flex gap-6 items-start">
        <svg
          viewBox="0 0 400 280"
          className="w-[340px] shrink-0"
          aria-hidden="true"
        >
          {/* Buffer Pool zone */}
          <rect
            x={0}
            y={0}
            width={400}
            height={155}
            fill="rgba(139,92,246,0.04)"
          />
          {/* Disk zone */}
          <rect
            x={0}
            y={155}
            width={400}
            height={125}
            fill="rgba(0,0,0,0.2)"
          />
          {/* zone divider */}
          <line
            x1={0}
            y1={155}
            x2={400}
            y2={155}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          {/* zone labels */}
          <text
            x={8}
            y={14}
            fill="rgba(139,92,246,0.5)"
            fontSize={9}
            fontFamily="monospace"
          >
            Buffer Pool (memory)
          </text>
          <text
            x={8}
            y={170}
            fill="rgba(255,255,255,0.18)"
            fontSize={9}
            fontFamily="monospace"
          >
            Disk
          </text>

          {/* edge: Root -> Branch (solid) */}
          <line
            x1={rootBottomX}
            y1={rootBottomY}
            x2={branchTopX}
            y2={branchTopY}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1}
          />

          {/* edge: Root -> Leaf direction (dashed, rose) */}
          <line
            x1={rootBottomX}
            y1={rootBottomY}
            x2={leafTopX}
            y2={leafTopY}
            stroke="rgba(244,63,94,0.3)"
            strokeWidth={1}
            strokeDasharray="4 3"
          />

          {NODES.map((node) => (
            <PageNode key={node.label} node={node} />
          ))}
        </svg>

        <div className="flex-1 space-y-3 min-w-0">
          <p className="text-xs font-mono text-zinc-600 mb-2">핵심 포인트</p>
          {POINTS.map((pt) => (
            <div
              key={pt.title}
              className={`rounded-xl border p-3 ${pt.colorClass}`}
            >
              <p className={`text-xs font-mono font-semibold mb-1 ${pt.titleClass}`}>
                {pt.title}
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">{pt.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
