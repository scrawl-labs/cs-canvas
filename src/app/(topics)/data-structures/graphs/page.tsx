"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "data-structures", current: "graphs" },
  hero: {
    title: "Graphs",
    desc: "정점(V)과 간선(E)의 집합 — 관계의 자료구조.\n어떤 표현을 쓰느냐가 모든 알고리즘의 시간·공간을 결정합니다.",
    tags: ["정점/간선", "방향/무방향", "Adjacency List", "Adjacency Matrix", "가중치"],
  },
  sections: [
    {
      number: "01",
      title: "그래프 용어",
      desc: "정점(Vertex/Node), 간선(Edge), 방향(Directed/Undirected), 가중치(Weighted), 차수(Degree). 진입 차수(in-degree)와 진출 차수(out-degree)는 방향 그래프에서만.",
    },
    {
      number: "02",
      title: "방향 vs 무방향",
      desc: "Undirected: 친구 관계, 양방향 도로. (u,v) ⇔ (v,u). Directed: 트위터 팔로우, 일방통행. (u,v)는 v로의 방향만.",
    },
    {
      number: "03",
      title: "Adjacency List — 희소 그래프",
      desc: "각 정점마다 이웃 리스트. 공간 O(V+E). 한 정점의 이웃 순회 O(deg(v)). 간선 존재 확인은 O(deg(u)). 대부분의 그래프 문제의 기본 표현.",
    },
    {
      number: "04",
      title: "Adjacency Matrix — 밀집 그래프",
      desc: "V×V 2차원 배열. 공간 O(V²). 간선 (u,v) 존재 확인 O(1). 모든 이웃 순회는 O(V). 밀집(간선이 많은) 그래프나 Floyd-Warshall 같은 알고리즘에 적합.",
    },
    {
      number: "05",
      title: "Edge List — 단순 형태",
      desc: "(u, v, w) 튜플의 리스트. 공간 O(E). Kruskal MST나 Bellman-Ford처럼 간선을 모두 훑는 알고리즘에 자연스러움.",
    },
    {
      number: "06",
      title: "특수 그래프",
      desc: "Tree: 사이클 없는 연결 그래프. DAG: 방향 비순환. Bipartite: 두 집합으로 분리. Complete: 모든 정점 쌍이 연결. 각각 전용 알고리즘이 있음.",
    },
  ],
  terms: {
    title: "그래프 용어 한눈에",
    items: [
      { name: "정점 (Vertex)", desc: "노드. 그래프의 점. V = 정점 수." },
      { name: "간선 (Edge)", desc: "두 정점을 연결. E = 간선 수. 방향이 있을 수도 없을 수도." },
      { name: "차수 (Degree)", desc: "정점에 연결된 간선 수. 방향 그래프는 in-degree/out-degree로 구분." },
      { name: "경로 (Path)", desc: "정점들의 시퀀스, 연속된 두 정점은 간선으로 연결." },
      { name: "사이클 (Cycle)", desc: "시작 = 끝인 경로. 사이클 없는 그래프 → tree 또는 DAG." },
      { name: "연결 (Connected)", desc: "모든 정점 쌍 사이 경로 존재. 그렇지 않으면 'disconnected'." },
    ],
  },
  exampleGraph: {
    title: "예시 그래프 (방향, 가중치)",
    vertices: "V = {A, B, C, D, E}",
    edges: "E = {(A,B,4), (A,C,1), (B,C,2), (B,D,5), (C,D,8), (D,E,3)}",
  },
  adjList: {
    title: "Adjacency List",
    code: `A: [(B, 4), (C, 1)]
B: [(C, 2), (D, 5)]
C: [(D, 8)]
D: [(E, 3)]
E: []`,
    note: "공간 O(V + E). 위 예시: 5 + 6 = 11 항목.",
  },
  adjMatrix: {
    title: "Adjacency Matrix",
    code: `   A  B  C  D  E
A  0  4  1  0  0
B  0  0  2  5  0
C  0  0  0  8  0
D  0  0  0  0  3
E  0  0  0  0  0`,
    note: "공간 O(V²). 5×5 = 25 항목 (대부분 0). 무방향이면 대칭.",
  },
  edgeList: {
    title: "Edge List",
    code: `[(A, B, 4),
 (A, C, 1),
 (B, C, 2),
 (B, D, 5),
 (C, D, 8),
 (D, E, 3)]`,
    note: "공간 O(E). 6 항목. Kruskal, Bellman-Ford에 자연스러움.",
  },
  comparison: {
    title: "그래프 표현 비교",
    headers: ["기준", "Adjacency List", "Adjacency Matrix", "Edge List"],
    rows: [
      ["공간", "O(V + E)", "O(V²)", "O(E)"],
      ["간선 (u,v) 존재 확인", "O(deg(u))", "O(1)", "O(E)"],
      ["u의 모든 이웃", "O(deg(u))", "O(V)", "O(E)"],
      ["모든 간선 순회", "O(V + E)", "O(V²)", "O(E)"],
      ["간선 추가", "O(1)", "O(1)", "O(1)"],
      ["적합한 그래프", "희소", "밀집", "모든 간선 처리 시"],
      ["대표 알고리즘", "BFS, DFS, Dijkstra", "Floyd-Warshall", "Kruskal, Bellman-Ford"],
    ],
  },
  special: {
    title: "특수 그래프와 그 응용",
    items: [
      { name: "Tree", desc: "사이클 없는 연결 그래프. |E| = |V| - 1. 파일시스템, DOM, 표현식 트리." },
      { name: "DAG (Directed Acyclic)", desc: "방향 + 사이클 없음. 의존성, 스케줄링, 빌드 시스템 (Make, Bazel)." },
      { name: "Bipartite", desc: "정점을 두 집합으로 나눠 같은 집합 내 간선 없음. 작업 할당, 매칭." },
      { name: "Complete (Kₙ)", desc: "모든 정점 쌍이 연결. |E| = n(n-1)/2. 외판원 문제의 기본 그래프." },
      { name: "Sparse / Dense", desc: "Sparse: |E| ≈ |V|. Dense: |E| ≈ |V|². 표현 선택의 기준." },
      { name: "Weighted / Unweighted", desc: "간선에 가중치(비용, 거리) 부여 여부. 최단 경로 알고리즘 선택의 기준." },
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "그래프 = V + E", text: "정점과 간선의 집합. 방향성, 가중치, 사이클 유무가 변형 요소." },
      { label: "Adjacency List", text: "공간 O(V+E). 한 정점의 이웃 순회 빠름. 대부분의 문제의 기본 선택." },
      { label: "Adjacency Matrix", text: "공간 O(V²). 간선 존재 확인 O(1). 밀집 그래프나 행렬 알고리즘에 적합." },
      { label: "Edge List", text: "공간 O(E). Kruskal, Bellman-Ford처럼 간선 전부 순회 시 자연스러움." },
      { label: "Tree", text: "사이클 없는 연결 그래프. |E| = |V| - 1. 가장 단순한 그래프." },
      { label: "DAG", text: "방향 + 비순환. 위상 정렬 가능. 의존성 관리." },
      { label: "Bipartite", text: "두 집합 분리. Job-Worker 매칭, Network Flow의 기반." },
      { label: "표현 선택", text: "희소 → 리스트, 밀집 → 행렬. 알고리즘이 어떤 연산을 자주 쓰는지에 맞춰 선택." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "data-structures", current: "graphs" },
  hero: {
    title: "Graphs",
    desc: "Vertices (V) plus edges (E) — the data structure of relationships.\nThe representation you pick dictates time and space for every algorithm.",
    tags: ["Vertices/Edges", "Directed/Undirected", "Adjacency List", "Adjacency Matrix", "Weighted"],
  },
  sections: [
    {
      number: "01",
      title: "Graph Terminology",
      desc: "Vertex/Node, Edge, Directed/Undirected, Weighted, Degree. In-degree and out-degree exist only in directed graphs.",
    },
    {
      number: "02",
      title: "Directed vs Undirected",
      desc: "Undirected: friendships, two-way roads. (u,v) ⇔ (v,u). Directed: Twitter follows, one-way streets. (u,v) is one-way.",
    },
    {
      number: "03",
      title: "Adjacency List — Sparse Graphs",
      desc: "Per-vertex neighbor list. Space O(V+E). Iterate neighbors of v in O(deg(v)). Edge query in O(deg(u)). Default for most graph problems.",
    },
    {
      number: "04",
      title: "Adjacency Matrix — Dense Graphs",
      desc: "V×V 2D array. Space O(V²). Edge query O(1), but iterating neighbors is O(V). Suits dense graphs and matrix-based algorithms (Floyd-Warshall).",
    },
    {
      number: "05",
      title: "Edge List — Plain Form",
      desc: "List of (u, v, w) tuples. Space O(E). Natural for algorithms that scan all edges (Kruskal MST, Bellman-Ford).",
    },
    {
      number: "06",
      title: "Special Graphs",
      desc: "Tree: connected, no cycles. DAG: directed, acyclic. Bipartite: two-colorable. Complete: every pair connected. Each has dedicated algorithms.",
    },
  ],
  terms: {
    title: "Graph Glossary",
    items: [
      { name: "Vertex (Node)", desc: "A point. V = number of vertices." },
      { name: "Edge", desc: "Connects two vertices. E = number of edges. May be directed or undirected." },
      { name: "Degree", desc: "Edges incident to a vertex. Directed graphs distinguish in/out degree." },
      { name: "Path", desc: "A sequence of vertices, consecutive pairs connected by an edge." },
      { name: "Cycle", desc: "A path that starts and ends at the same vertex. No cycles → tree or DAG." },
      { name: "Connected", desc: "Path exists between every pair of vertices. Otherwise 'disconnected'." },
    ],
  },
  exampleGraph: {
    title: "Example (directed, weighted)",
    vertices: "V = {A, B, C, D, E}",
    edges: "E = {(A,B,4), (A,C,1), (B,C,2), (B,D,5), (C,D,8), (D,E,3)}",
  },
  adjList: {
    title: "Adjacency List",
    code: `A: [(B, 4), (C, 1)]
B: [(C, 2), (D, 5)]
C: [(D, 8)]
D: [(E, 3)]
E: []`,
    note: "Space O(V + E). Above: 5 + 6 = 11 entries.",
  },
  adjMatrix: {
    title: "Adjacency Matrix",
    code: `   A  B  C  D  E
A  0  4  1  0  0
B  0  0  2  5  0
C  0  0  0  8  0
D  0  0  0  0  3
E  0  0  0  0  0`,
    note: "Space O(V²). 5×5 = 25 entries (mostly zero). Symmetric if undirected.",
  },
  edgeList: {
    title: "Edge List",
    code: `[(A, B, 4),
 (A, C, 1),
 (B, C, 2),
 (B, D, 5),
 (C, D, 8),
 (D, E, 3)]`,
    note: "Space O(E). 6 entries. Natural for Kruskal, Bellman-Ford.",
  },
  comparison: {
    title: "Representation Comparison",
    headers: ["Criterion", "Adjacency List", "Adjacency Matrix", "Edge List"],
    rows: [
      ["Space", "O(V + E)", "O(V²)", "O(E)"],
      ["Edge (u,v) check", "O(deg(u))", "O(1)", "O(E)"],
      ["All neighbors of u", "O(deg(u))", "O(V)", "O(E)"],
      ["All edges scan", "O(V + E)", "O(V²)", "O(E)"],
      ["Add edge", "O(1)", "O(1)", "O(1)"],
      ["Fits", "Sparse", "Dense", "Edge-iterating algos"],
      ["Typical algorithms", "BFS, DFS, Dijkstra", "Floyd-Warshall", "Kruskal, Bellman-Ford"],
    ],
  },
  special: {
    title: "Special Graphs and Their Uses",
    items: [
      { name: "Tree", desc: "Connected, no cycles. |E| = |V| - 1. Filesystems, DOM, expression trees." },
      { name: "DAG (Directed Acyclic)", desc: "Directed + no cycles. Dependencies, scheduling, build systems (Make, Bazel)." },
      { name: "Bipartite", desc: "Two-colorable; no intra-set edges. Job assignment, matching." },
      { name: "Complete (Kₙ)", desc: "Every pair connected. |E| = n(n-1)/2. Backbone of TSP." },
      { name: "Sparse / Dense", desc: "Sparse: |E| ≈ |V|. Dense: |E| ≈ |V|². Drives representation choice." },
      { name: "Weighted / Unweighted", desc: "Edges carry cost or distance. Drives the choice of shortest-path algorithm." },
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Graph = V + E", text: "Vertices and edges. Direction, weight, presence of cycles are the variations." },
      { label: "Adjacency List", text: "Space O(V+E). Fast neighbor iteration. The default for most problems." },
      { label: "Adjacency Matrix", text: "Space O(V²). O(1) edge query. Suits dense graphs and matrix algorithms." },
      { label: "Edge List", text: "Space O(E). Natural for algorithms that scan all edges." },
      { label: "Tree", text: "Connected, no cycles. |E| = |V| - 1. The simplest graph." },
      { label: "DAG", text: "Directed + acyclic. Supports topological sort. Manages dependencies." },
      { label: "Bipartite", text: "Two-partition graph. Foundation of matching and network flow problems." },
      { label: "Picking a form", text: "Sparse → list, dense → matrix. Match what your algorithm queries most." },
    ],
  },
};

interface SectionProps { number: string; title: string; description: string; children: ReactNode; }
function Section({ number, title, description, children }: SectionProps) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-xs font-mono text-emerald-500/60">{number}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function GraphsDataStructurePage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;
  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(52,211,153,0.05),transparent)]" />
      <div className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.home}</Link>
          <span>/</span>
          <Link href="/data-structures" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.parent}</Link>
          <span>/</span>
          <span className="text-zinc-400">{t.breadcrumb.current}</span>
        </div>
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-white font-mono mb-4">{t.hero.title}</h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-2xl mb-6 whitespace-pre-line">{t.hero.desc}</p>
          <div className="flex items-center gap-0 text-xs font-mono flex-wrap">
            {t.hero.tags.map((label, i, arr) => (
              <span key={label} className="flex items-center">
                <span className="text-zinc-500 px-2 py-1 rounded border border-white/[0.06] bg-white/[0.02]">{label}</span>
                {i < arr.length - 1 && <span className="text-zinc-700 mx-1.5">→</span>}
              </span>
            ))}
          </div>
        </div>

        <Section number={t.sections[0].number} title={t.sections[0].title} description={t.sections[0].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.terms.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {t.terms.items.map((it) => (
                <div key={it.name} className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                  <div className="text-xs font-mono text-emerald-300 font-semibold mb-1">{it.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{it.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-2">{t.exampleGraph.title}</h3>
            <div className="text-[11px] font-mono text-zinc-400 mb-1">{t.exampleGraph.vertices}</div>
            <div className="text-[11px] font-mono text-zinc-400 mb-4">{t.exampleGraph.edges}</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div className="text-[10px] font-mono text-emerald-400 mb-2">{t.adjList.title}</div>
                <pre className="text-[10px] font-mono text-zinc-400 bg-zinc-900/30 p-2 rounded">{t.adjList.code}</pre>
                <p className="text-[10px] text-zinc-500 italic mt-2">{t.adjList.note}</p>
              </div>
              <div>
                <div className="text-[10px] font-mono text-emerald-400 mb-2">{t.adjMatrix.title}</div>
                <pre className="text-[10px] font-mono text-zinc-400 bg-zinc-900/30 p-2 rounded">{t.adjMatrix.code}</pre>
                <p className="text-[10px] text-zinc-500 italic mt-2">{t.adjMatrix.note}</p>
              </div>
              <div>
                <div className="text-[10px] font-mono text-emerald-400 mb-2">{t.edgeList.title}</div>
                <pre className="text-[10px] font-mono text-zinc-400 bg-zinc-900/30 p-2 rounded">{t.edgeList.code}</pre>
                <p className="text-[10px] text-zinc-500 italic mt-2">{t.edgeList.note}</p>
              </div>
            </div>
          </div>
        </Section>

        <Section number="03" title={t.comparison.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.comparison.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-zinc-600 w-44" : "text-emerald-400"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.comparison.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-zinc-500">{row[0]}</td>
                    <td className="py-2 text-zinc-400">{row[1]}</td>
                    <td className="py-2 text-zinc-400">{row[2]}</td>
                    <td className="py-2 text-zinc-400">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section number={t.sections[5].number} title={t.sections[5].title} description={t.sections[5].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.special.items.map((s) => (
                <div key={s.name} className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                  <div className="text-xs font-mono text-emerald-300 font-semibold mb-1">{s.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold text-sm font-mono mb-5">{t.summary.title}</h3>
          <div className="space-y-3">
            {t.summary.items.map((item) => (
              <div key={item.label} className="flex gap-3 items-start">
                <span className="text-xs font-mono text-emerald-500/50 shrink-0 mt-0.5 min-w-[140px]">{item.label}</span>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
