"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";
import CodeBlock from "@/components/CodeBlock";

const KO = {
  breadcrumb: {
    home: "cs-canvas",
    parent: "algorithms",
    current: "graph traversal",
  },
  hero: {
    title: "Graph Traversal",
    desc: "그래프는 관계의 표현 — 길찾기, 소셜 네트워크, 의존성 해소.\nBFS는 '레벨'로 퍼지고, DFS는 '깊이'로 파고듭니다. 같은 그래프, 다른 도구.",
    tags: ["BFS", "DFS", "Queue/Stack", "최단 경로", "위상 정렬", "Dijkstra"],
  },
  sections: [
    {
      number: "01",
      title: "그래프 표현 — 인접 리스트 vs 인접 행렬",
      desc: "N개 정점, M개 간선. 인접 행렬: O(N²) 공간, 간선 존재 확인 O(1). 인접 리스트: O(N+M) 공간, 한 정점의 이웃을 빠르게 순회. 희소 그래프엔 리스트, 밀집엔 행렬.",
    },
    {
      number: "02",
      title: "BFS — 큐로 레벨별 탐색",
      desc: "시작점에서 가까운 정점부터 한 겹씩 펼쳐 나감. Queue 사용, 방문 표시 필수. 가중치 없는 그래프의 최단 경로를 보장.",
    },
    {
      number: "03",
      title: "DFS — 스택(또는 재귀)으로 깊이 우선",
      desc: "한 경로를 끝까지 따라간 뒤 막히면 되돌아옴(백트래킹). Stack 사용 또는 재귀 호출. 위상 정렬, 사이클 탐지, 강결합 컴포넌트의 기반.",
    },
    {
      number: "04",
      title: "BFS vs DFS — 언제 무엇을 쓸까",
      desc: "최단 경로(가중치 없음) → BFS. 모든 경로 탐색·연결성·사이클 → DFS. 메모리: BFS는 큐가 폭이 넓어질수록 커지고, DFS는 깊이가 깊을수록 콜스택이 커짐.",
    },
    {
      number: "05",
      title: "위상 정렬 — DAG의 순서",
      desc: "방향 비순환 그래프(DAG)에서 의존성 순서를 도출. Kahn's algorithm(BFS 기반, 진입 차수 0인 노드부터) 또는 DFS 기반(finish time 역순).",
    },
    {
      number: "06",
      title: "Dijkstra — 가중치 있는 최단 경로",
      desc: "BFS의 일반화. 우선순위 큐(min-heap)로 현재까지 비용이 가장 적은 노드를 꺼내며 갱신(relax). 음수 가중치 불가. 시간 복잡도 O((N+M) log N).",
    },
  ],
  representation: {
    title: "그래프 표현 비교",
    headers: ["기준", "인접 리스트", "인접 행렬"],
    rows: [
      ["공간", "O(N + M)", "O(N²)"],
      ["간선 (u,v) 존재 확인", "O(deg(u))", "O(1)"],
      ["u의 모든 이웃 순회", "O(deg(u))", "O(N)"],
      ["적합한 경우", "희소 그래프", "밀집 그래프"],
      ["실전 사용", "대부분의 알고리즘 문제", "플로이드-워셜 등"],
    ],
  },
  bfsExample: {
    title: "BFS 예시 — 시작점 A",
    steps: [
      { step: "init", queue: "[A]", visited: "{A}", current: "-" },
      { step: "pop A", queue: "[B, C]", visited: "{A, B, C}", current: "A" },
      { step: "pop B", queue: "[C, D, E]", visited: "{A, B, C, D, E}", current: "B" },
      { step: "pop C", queue: "[D, E, F]", visited: "{A, B, C, D, E, F}", current: "C" },
      { step: "pop D", queue: "[E, F]", visited: "{A, B, C, D, E, F}", current: "D" },
      { step: "pop E", queue: "[F]", visited: "{A, B, C, D, E, F}", current: "E" },
      { step: "pop F", queue: "[]", visited: "{A, B, C, D, E, F}", current: "F" },
    ],
  },
  dfsExample: {
    title: "DFS 예시 — 시작점 A (재귀)",
    steps: [
      { step: "visit A", stack: "[A]", path: "A" },
      { step: "visit B (A의 첫 이웃)", stack: "[A, B]", path: "A → B" },
      { step: "visit D", stack: "[A, B, D]", path: "A → B → D" },
      { step: "D 막힘, 백트랙", stack: "[A, B]", path: "A → B → D ↩" },
      { step: "visit E", stack: "[A, B, E]", path: "A → B → D → E" },
      { step: "E 막힘, 백트랙 → A", stack: "[A]", path: "..." },
      { step: "visit C", stack: "[A, C]", path: "... → C" },
      { step: "visit F", stack: "[A, C, F]", path: "... → C → F" },
    ],
  },
  comparison: {
    title: "BFS vs DFS",
    headers: ["", "BFS", "DFS"],
    rows: [
      ["자료 구조", "Queue (FIFO)", "Stack (LIFO) / 재귀"],
      ["탐색 패턴", "넓게 (레벨별)", "깊게 (한 경로 끝까지)"],
      ["최단 경로 (무가중)", "✓ 보장", "✗ 보장 안 됨"],
      ["메모리", "O(W) — 폭", "O(D) — 깊이"],
      ["대표 용도", "최단거리, 6단계 분리, 미로", "위상 정렬, 사이클 탐지, 백트래킹"],
      ["시간 복잡도", "O(N + M)", "O(N + M)"],
    ],
  },
  topo: {
    title: "위상 정렬 (Kahn's Algorithm)",
    desc: "예: 수강 과목 순서 — '자료구조'를 들어야 '알고리즘'을 들을 수 있다.",
    steps: [
      { line: "1. 모든 정점의 진입 차수(in-degree)를 계산", note: "" },
      { line: "2. in-degree == 0인 정점을 모두 큐에 push", note: "선수 과목이 없는 과목" },
      { line: "3. 큐에서 pop, 결과에 append", note: "이번 학기에 들을 수 있는 과목" },
      { line: "4. pop한 정점의 이웃들의 in-degree를 1 감소", note: "선수 과목 하나 완료" },
      { line: "5. in-degree가 0이 된 이웃을 큐에 push", note: "다음 학기 후보" },
      { line: "6. 큐가 빌 때까지 반복", note: "" },
      { line: "→ 결과의 길이 != N 이면 사이클 존재", note: "위상 정렬 불가능" },
    ],
  },
  dijkstra: {
    title: "Dijkstra — 한 단계",
    steps: [
      { node: "A", dist: "0", action: "시작" },
      { node: "B", dist: "∞ → 4", action: "A→B (가중치 4)" },
      { node: "C", dist: "∞ → 1", action: "A→C (가중치 1)" },
      { node: "—", dist: "—", action: "PQ에서 가장 작은 C 추출" },
      { node: "B", dist: "4 → 3", action: "C→B (가중치 2)로 갱신" },
      { node: "D", dist: "∞ → 5", action: "C→D (가중치 4)" },
      { node: "...", dist: "...", action: "모든 노드 처리될 때까지" },
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "그래프 표현", text: "희소 → 인접 리스트 O(N+M). 밀집 → 인접 행렬 O(N²). 대부분 리스트가 정답." },
      { label: "BFS", text: "큐 기반, 레벨별 탐색. 가중치 없는 최단 경로 보장. 시간 O(N+M)." },
      { label: "DFS", text: "스택/재귀, 깊이 우선. 백트래킹·사이클·위상 정렬·SCC의 기반. 시간 O(N+M)." },
      { label: "visited 배열", text: "둘 다 필수. 큐/스택에 push할 때 표시해야 같은 노드를 여러 번 방문하지 않음." },
      { label: "Kahn 위상 정렬", text: "진입 차수 0인 노드부터 BFS. 결과 길이 != N → 사이클 존재." },
      { label: "Dijkstra", text: "BFS + 우선순위 큐. 음수 가중치 불가 (그땐 Bellman-Ford). 시간 O((N+M) log N)." },
      { label: "사이클 탐지", text: "무방향: DFS 중 부모 외의 방문된 이웃 발견. 방향: DFS 중 현재 재귀 경로에 있는 노드 발견 (회색 노드)." },
      { label: "연결 컴포넌트", text: "각 미방문 노드에서 BFS/DFS 시작. 호출 횟수가 컴포넌트 수." },
    ],
  },
};

const EN = {
  breadcrumb: {
    home: "cs-canvas",
    parent: "algorithms",
    current: "graph traversal",
  },
  hero: {
    title: "Graph Traversal",
    desc: "Graphs model relationships — routes, social networks, dependencies.\nBFS spreads by levels, DFS dives deep. Same graph, different tool.",
    tags: ["BFS", "DFS", "Queue/Stack", "Shortest path", "Topological sort", "Dijkstra"],
  },
  sections: [
    {
      number: "01",
      title: "Graph Representation — Adjacency List vs Matrix",
      desc: "N vertices, M edges. Adjacency matrix: O(N²) space, edge check O(1). Adjacency list: O(N+M) space, fast neighbor iteration. Sparse → list, dense → matrix.",
    },
    {
      number: "02",
      title: "BFS — Level-Order with a Queue",
      desc: "Expand vertices by distance from the source. Uses a Queue, requires a visited set. Guarantees shortest path on unweighted graphs.",
    },
    {
      number: "03",
      title: "DFS — Depth-First with a Stack (or recursion)",
      desc: "Follow one path to the end, then backtrack. Uses a Stack or recursion. Foundation of topological sort, cycle detection, strongly connected components.",
    },
    {
      number: "04",
      title: "BFS vs DFS — When to Use What",
      desc: "Unweighted shortest path → BFS. Path enumeration, connectivity, cycles → DFS. Memory: BFS scales with width, DFS scales with depth.",
    },
    {
      number: "05",
      title: "Topological Sort — Ordering a DAG",
      desc: "Derive a dependency order on a Directed Acyclic Graph. Kahn's algorithm (BFS from in-degree 0 nodes) or DFS-based (reverse finish order).",
    },
    {
      number: "06",
      title: "Dijkstra — Weighted Shortest Path",
      desc: "Generalization of BFS. Priority queue (min-heap) pops the cheapest unfinished node and relaxes its edges. No negative weights. O((N+M) log N).",
    },
  ],
  representation: {
    title: "Graph Representation Comparison",
    headers: ["Criterion", "Adjacency List", "Adjacency Matrix"],
    rows: [
      ["Space", "O(N + M)", "O(N²)"],
      ["Edge (u,v) check", "O(deg(u))", "O(1)"],
      ["Iterate all neighbors of u", "O(deg(u))", "O(N)"],
      ["Fits", "Sparse graphs", "Dense graphs"],
      ["In practice", "Most algorithm problems", "Floyd-Warshall, etc."],
    ],
  },
  bfsExample: {
    title: "BFS Example — start at A",
    steps: [
      { step: "init", queue: "[A]", visited: "{A}", current: "-" },
      { step: "pop A", queue: "[B, C]", visited: "{A, B, C}", current: "A" },
      { step: "pop B", queue: "[C, D, E]", visited: "{A, B, C, D, E}", current: "B" },
      { step: "pop C", queue: "[D, E, F]", visited: "{A, B, C, D, E, F}", current: "C" },
      { step: "pop D", queue: "[E, F]", visited: "{A, B, C, D, E, F}", current: "D" },
      { step: "pop E", queue: "[F]", visited: "{A, B, C, D, E, F}", current: "E" },
      { step: "pop F", queue: "[]", visited: "{A, B, C, D, E, F}", current: "F" },
    ],
  },
  dfsExample: {
    title: "DFS Example — start at A (recursive)",
    steps: [
      { step: "visit A", stack: "[A]", path: "A" },
      { step: "visit B (first neighbor of A)", stack: "[A, B]", path: "A → B" },
      { step: "visit D", stack: "[A, B, D]", path: "A → B → D" },
      { step: "D dead end, backtrack", stack: "[A, B]", path: "A → B → D ↩" },
      { step: "visit E", stack: "[A, B, E]", path: "A → B → D → E" },
      { step: "E done, backtrack to A", stack: "[A]", path: "..." },
      { step: "visit C", stack: "[A, C]", path: "... → C" },
      { step: "visit F", stack: "[A, C, F]", path: "... → C → F" },
    ],
  },
  comparison: {
    title: "BFS vs DFS",
    headers: ["", "BFS", "DFS"],
    rows: [
      ["Data structure", "Queue (FIFO)", "Stack (LIFO) / recursion"],
      ["Pattern", "Wide (level by level)", "Deep (single path to end)"],
      ["Shortest path (unweighted)", "✓ Guaranteed", "✗ Not guaranteed"],
      ["Memory", "O(W) — width", "O(D) — depth"],
      ["Typical use", "Shortest dist, 6 degrees, mazes", "Topo sort, cycle detection, backtracking"],
      ["Time", "O(N + M)", "O(N + M)"],
    ],
  },
  topo: {
    title: "Topological Sort (Kahn's Algorithm)",
    desc: "Example: course prerequisites — must take Data Structures before Algorithms.",
    steps: [
      { line: "1. Compute in-degree of every vertex", note: "" },
      { line: "2. Push all in-degree == 0 vertices to queue", note: "Courses with no prereq" },
      { line: "3. Pop from queue, append to result", note: "Take this course this term" },
      { line: "4. Decrement in-degree of its neighbors", note: "One prereq cleared" },
      { line: "5. Push neighbors that hit 0 to queue", note: "Next term candidates" },
      { line: "6. Repeat until queue is empty", note: "" },
      { line: "→ If result.length != N, there is a cycle", note: "No valid order exists" },
    ],
  },
  dijkstra: {
    title: "Dijkstra — One Step at a Time",
    steps: [
      { node: "A", dist: "0", action: "Start" },
      { node: "B", dist: "∞ → 4", action: "A→B (weight 4)" },
      { node: "C", dist: "∞ → 1", action: "A→C (weight 1)" },
      { node: "—", dist: "—", action: "Pop smallest from PQ → C" },
      { node: "B", dist: "4 → 3", action: "Relax via C→B (weight 2)" },
      { node: "D", dist: "∞ → 5", action: "C→D (weight 4)" },
      { node: "...", dist: "...", action: "Continue until all processed" },
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Graph representation", text: "Sparse → adjacency list O(N+M). Dense → adjacency matrix O(N²). List is the usual answer." },
      { label: "BFS", text: "Queue-based, level order. Shortest path on unweighted graphs. Time O(N+M)." },
      { label: "DFS", text: "Stack/recursion, depth first. Foundation of backtracking, cycles, topo sort, SCC. O(N+M)." },
      { label: "Visited set", text: "Required for both. Mark when pushing (not when popping) to avoid duplicate enqueues." },
      { label: "Kahn topo sort", text: "BFS from in-degree-0 nodes. If output length != N, the graph has a cycle." },
      { label: "Dijkstra", text: "BFS + priority queue. No negative weights (use Bellman-Ford instead). O((N+M) log N)." },
      { label: "Cycle detection", text: "Undirected: DFS finds a visited neighbor that isn't the parent. Directed: a node currently on the recursion stack (gray)." },
      { label: "Connected components", text: "Start BFS/DFS from each unvisited node. Number of starts = number of components." },
    ],
  },
};

interface SectionProps {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}

function Section({ number, title, description, children }: SectionProps) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-xs font-mono text-violet-500/60">{number}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function GraphsPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(139,92,246,0.06),transparent)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">
            {t.breadcrumb.home}
          </Link>
          <span>/</span>
          <Link href="/algorithms" className="hover:text-zinc-400 transition-colors">
            {t.breadcrumb.parent}
          </Link>
          <span>/</span>
          <span className="text-zinc-400">{t.breadcrumb.current}</span>
        </div>

        {/* hero */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-white font-mono mb-4">
            {t.hero.title}
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-2xl mb-6 whitespace-pre-line">
            {t.hero.desc}
          </p>
          <div className="flex items-center gap-0 text-xs font-mono flex-wrap">
            {t.hero.tags.map((label, i, arr) => (
              <span key={label} className="flex items-center">
                <span className="text-zinc-500 px-2 py-1 rounded border border-white/[0.06] bg-white/[0.02]">
                  {label}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-zinc-700 mx-1.5">→</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* 01 - representation */}
        <Section
          number={t.sections[0].number}
          title={t.sections[0].title}
          description={t.sections[0].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">
              {t.representation.title}
            </h3>
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.representation.headers.map((h, i) => (
                    <th
                      key={i}
                      className={`text-left py-2 ${i === 0 ? "text-zinc-600 w-44" : "text-violet-400"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.representation.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-zinc-500">{row[0]}</td>
                    <td className="py-2 text-zinc-400">{row[1]}</td>
                    <td className="py-2 text-zinc-400">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-zinc-700/40 bg-zinc-900/30 p-3">
                <div className="text-[10px] font-mono text-zinc-500 mb-2">Adjacency List</div>
                <pre className="text-[10px] font-mono text-zinc-400">{`A: [B, C]
B: [A, D, E]
C: [A, F]
D: [B]
E: [B]
F: [C]`}</pre>
              </div>
              <div className="rounded-xl border border-zinc-700/40 bg-zinc-900/30 p-3">
                <div className="text-[10px] font-mono text-zinc-500 mb-2">Adjacency Matrix</div>
                <pre className="text-[10px] font-mono text-zinc-400">{`   A B C D E F
 A 0 1 1 0 0 0
 B 1 0 0 1 1 0
 C 1 0 0 0 0 1
 D 0 1 0 0 0 0
 E 0 1 0 0 0 0
 F 0 0 1 0 0 0`}</pre>
              </div>
            </div>
          </div>
        </Section>

        {/* 02 - BFS */}
        <Section
          number={t.sections[1].number}
          title={t.sections[1].title}
          description={t.sections[1].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">
              {t.bfsExample.title}
            </h3>
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-600 w-32">step</th>
                  <th className="text-left py-2 text-violet-400 w-32">queue</th>
                  <th className="text-left py-2 text-emerald-400">visited</th>
                  <th className="text-left py-2 text-amber-400 w-20">current</th>
                </tr>
              </thead>
              <tbody>
                {t.bfsExample.steps.map((s, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-1.5 text-zinc-500">{s.step}</td>
                    <td className="py-1.5 text-violet-300/80">{s.queue}</td>
                    <td className="py-1.5 text-emerald-300/80">{s.visited}</td>
                    <td className="py-1.5 text-amber-300/80">{s.current}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <CodeBlock language="java" code={`void bfs(Node start) {
    Queue<Node> queue = new ArrayDeque<>();
    Set<Node> visited = new HashSet<>();
    queue.offer(start);
    visited.add(start);
    while (!queue.isEmpty()) {
        Node node = queue.poll();
        for (Node neighbor : node.neighbors) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.offer(neighbor);
            }
        }
    }
}`} />
            </div>
          </div>
        </Section>

        {/* 03 - DFS */}
        <Section
          number={t.sections[2].number}
          title={t.sections[2].title}
          description={t.sections[2].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">
              {t.dfsExample.title}
            </h3>
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-600 w-56">step</th>
                  <th className="text-left py-2 text-violet-400 w-32">stack</th>
                  <th className="text-left py-2 text-emerald-400">path</th>
                </tr>
              </thead>
              <tbody>
                {t.dfsExample.steps.map((s, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-1.5 text-zinc-500">{s.step}</td>
                    <td className="py-1.5 text-violet-300/80">{s.stack}</td>
                    <td className="py-1.5 text-emerald-300/80">{s.path}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <CodeBlock language="java" code={`void dfs(Node node, Set<Node> visited) {
    visited.add(node);
    for (Node neighbor : node.neighbors) {
        if (!visited.contains(neighbor)) {
            dfs(neighbor, visited);
        }
    }
    // finish time: post-order moment
}`} />
            </div>
          </div>
        </Section>

        {/* 04 - comparison */}
        <Section
          number={t.sections[3].number}
          title={t.sections[3].title}
          description={t.sections[3].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.comparison.headers.map((h, i) => (
                    <th
                      key={i}
                      className={`text-left py-2 ${
                        i === 0 ? "text-zinc-600 w-44" : i === 1 ? "text-violet-400" : "text-emerald-400"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.comparison.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-zinc-500">{row[0]}</td>
                    <td className="py-2 text-violet-300/80">{row[1]}</td>
                    <td className="py-2 text-emerald-300/80">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 05 - topological sort */}
        <Section
          number={t.sections[4].number}
          title={t.sections[4].title}
          description={t.sections[4].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">
              {t.topo.title}
            </h3>
            <p className="text-[11px] text-zinc-500 mb-4">{t.topo.desc}</p>
            <div className="space-y-1">
              {t.topo.steps.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-[11px] font-mono"
                >
                  <span className="text-violet-300/80 flex-1">{s.line}</span>
                  {s.note && (
                    <span className="text-zinc-500 text-[10px] italic">
                      {s.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 06 - Dijkstra */}
        <Section
          number={t.sections[5].number}
          title={t.sections[5].title}
          description={t.sections[5].desc}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">
              {t.dijkstra.title}
            </h3>
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-violet-400 w-20">node</th>
                  <th className="text-left py-2 text-emerald-400 w-32">dist</th>
                  <th className="text-left py-2 text-zinc-500">action</th>
                </tr>
              </thead>
              <tbody>
                {t.dijkstra.steps.map((s, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-1.5 text-violet-300/80">{s.node}</td>
                    <td className="py-1.5 text-emerald-300/80">{s.dist}</td>
                    <td className="py-1.5 text-zinc-400">{s.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-[11px] text-amber-300/80 leading-relaxed">
                {lang === "ko"
                  ? "⚠ 음수 가중치 간선이 있으면 잘못된 결과 — Bellman-Ford 사용. 음수 사이클이 있으면 최단 경로 정의 불가."
                  : "⚠ Wrong with negative-weight edges — use Bellman-Ford instead. Negative cycle = shortest path undefined."}
              </p>
            </div>
          </div>
        </Section>

        {/* summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold text-sm font-mono mb-5">
            {t.summary.title}
          </h3>
          <div className="space-y-3">
            {t.summary.items.map((item) => (
              <div key={item.label} className="flex gap-3 items-start">
                <span className="text-xs font-mono text-violet-500/50 shrink-0 mt-0.5 min-w-[140px]">
                  {item.label}
                </span>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
