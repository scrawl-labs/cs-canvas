"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "algorithms", current: "shortest path" },
  hero: {
    title: "Shortest Path",
    desc: "한 점에서 모든 점, 또는 모든 점 쌍 사이의 최단 거리.\n가중치 종류와 그래프 크기에 따라 BFS, Dijkstra, Bellman-Ford, Floyd-Warshall.",
    tags: ["BFS", "Dijkstra", "Bellman-Ford", "Floyd-Warshall", "Relaxation", "음수 가중치"],
  },
  sections: [
    {
      number: "01",
      title: "Relaxation — 모든 최단 경로의 기본",
      desc: "if dist[v] > dist[u] + weight(u,v): dist[v] = dist[u] + weight(u,v). 더 좋은 경로 찾으면 갱신. 모든 알고리즘이 이 한 줄을 어떻게/언제 적용하느냐의 차이.",
    },
    {
      number: "02",
      title: "BFS — 가중치 없는 그래프",
      desc: "모든 간선 가중치 = 1. 큐로 레벨별 탐색하면 자연스럽게 최단 거리. O(V+E). 가중치가 균등하면 굳이 Dijkstra 쓸 필요 없음.",
    },
    {
      number: "03",
      title: "Dijkstra — 양수 가중치, Single-Source",
      desc: "한 시작점에서 모든 점으로의 최단 거리. Min-Heap에서 가장 가까운 미확정 노드를 꺼내 relax 반복. O((V+E) log V). 음수 가중치 X.",
    },
    {
      number: "04",
      title: "Bellman-Ford — 음수 가중치 허용",
      desc: "모든 간선을 V-1번 relax. 음수 가중치 OK. V번째 relax에서도 갱신이 일어나면 음수 사이클 존재. O(V × E). Dijkstra보다 느리지만 더 일반적.",
    },
    {
      number: "05",
      title: "Floyd-Warshall — 모든 쌍 (All-Pairs)",
      desc: "모든 정점 쌍 (i,j)에 대한 최단 거리. dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])를 모든 k에 대해. O(V³). 작은 밀집 그래프에 적합.",
    },
    {
      number: "06",
      title: "어떤 걸 쓸까",
      desc: "가중치 1 → BFS. 양수 가중치 + 한 시작점 → Dijkstra. 음수 가중치 → Bellman-Ford. 모든 쌍 + 작은 V → Floyd-Warshall.",
    },
  ],
  bfsCode: {
    title: "BFS 최단 경로",
    code: `int[] bfsShortest(List<List<Integer>> graph, int src, int n) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    Queue<Integer> queue = new ArrayDeque<>();
    queue.offer(src);
    while (!queue.isEmpty()) {
        int u = queue.poll();
        for (int v : graph.get(u)) {
            if (dist[v] == Integer.MAX_VALUE) {
                dist[v] = dist[u] + 1;
                queue.offer(v);
            }
        }
    }
    return dist;
}`,
    note: "모든 간선이 같은 가중치이므로 큐에서 꺼낸 순서가 거리 순.",
  },
  dijkstraCode: {
    title: "Dijkstra — 우선순위 큐 구현",
    code: `int[] dijkstra(List<List<int[]>> graph, int src, int n) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, src});
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int d = cur[0], u = cur[1];
        if (d > dist[u]) continue;     // 이미 더 짧은 경로 발견됨
        for (int[] edge : graph.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{dist[v], v});
            }
        }
    }
    return dist;
}`,
    note: "Lazy 방식: 같은 노드가 PQ에 여러 번 들어가도 첫 번째만 유효. O((V+E) log V).",
  },
  bellmanFord: {
    title: "Bellman-Ford — V-1 패스 + 음수 사이클 검출",
    code: `int[] bellmanFord(int[][] edges, int n, int src) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    for (int i = 0; i < n - 1; i++) {        // V-1번 relax
        for (int[] e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    // 음수 사이클 검사: V번째에도 갱신되면 존재
    for (int[] e : edges) {
        int u = e[0], v = e[1], w = e[2];
        if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
            return null;                        // 음수 사이클
        }
    }
    return dist;
}`,
    note: "음수 가중치 OK. 음수 사이클이 있으면 최단 경로 정의 불가 → null 반환.",
  },
  floyd: {
    title: "Floyd-Warshall — DP",
    code: `int[][] floydWarshall(int n, int[][] edges) {
    int INF = Integer.MAX_VALUE / 2;          // 오버플로 방지
    int[][] dist = new int[n][n];
    for (int[] row : dist) Arrays.fill(row, INF);
    for (int i = 0; i < n; i++) dist[i][i] = 0;
    for (int[] e : edges) dist[e[0]][e[1]] = e[2];
    // k: 중간 정점을 0..k까지 허용
    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    return dist;
}`,
    note: "삼중 루프, O(V³). 메모리 O(V²). 노드 수가 작을 때 (수백 정도) 가장 깔끔.",
  },
  comparison: {
    title: "최단 경로 알고리즘 비교",
    headers: ["알고리즘", "범위", "가중치", "시간", "음수 사이클"],
    rows: [
      ["BFS", "Single-source", "균일 (1)", "O(V+E)", "—"],
      ["Dijkstra", "Single-source", "양수만", "O((V+E) log V)", "❌"],
      ["Bellman-Ford", "Single-source", "음수 허용", "O(V × E)", "✅ 검출"],
      ["Floyd-Warshall", "All-pairs", "음수 허용", "O(V³)", "검출 가능"],
      ["SPFA (개량 Bellman)", "Single-source", "음수 허용", "평균 O(V+E)", "✅"],
      ["Johnson", "All-pairs", "음수 허용", "O(V² log V + VE)", "❌"],
    ],
  },
  applications: {
    title: "실전 사용",
    items: [
      { name: "지도 길찾기", desc: "Dijkstra + A* heuristic. Google Maps, Kakao Map." },
      { name: "라우터 (OSPF)", desc: "Dijkstra로 네트워크 토폴로지에서 최단 경로 라우팅." },
      { name: "환율 차익거래", desc: "음수 가중치 (-log 환율)로 변환 → Bellman-Ford로 음수 사이클 = 차익." },
      { name: "게임 AI 경로", desc: "A* + Dijkstra. 장애물 회피, 최단 거리 이동." },
      { name: "프로젝트 일정 (CPM)", desc: "음수 가중치로 가장 긴 경로 = critical path." },
      { name: "통신 네트워크", desc: "비용·지연 가중치 기반 라우팅 결정." },
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "Relaxation", text: "더 좋은 경로 발견 시 거리 갱신. 모든 최단 경로 알고리즘의 기본 연산." },
      { label: "BFS", text: "가중치 균등 (1)일 때만. 큐로 레벨별 탐색. O(V+E)." },
      { label: "Dijkstra", text: "양수 가중치, 한 시작점. Min-Heap으로 가장 가까운 노드부터 처리. O((V+E) log V)." },
      { label: "Bellman-Ford", text: "음수 가중치 OK. V-1번 모든 간선 relax. V번째 갱신 = 음수 사이클." },
      { label: "Floyd-Warshall", text: "모든 쌍 최단 거리. dp[i][j] = via k. O(V³). 작은 그래프에 깔끔." },
      { label: "음수 가중치 처리", text: "Dijkstra X, Bellman-Ford O. 가중치를 -log로 변환하면 곱셈 문제도 가능." },
      { label: "SPFA", text: "Bellman-Ford 개량. 큐 사용, 평균은 빠르지만 최악 동일. 경쟁 프로그래밍에서 인기." },
      { label: "A*", text: "Dijkstra + heuristic (목표까지 추정 거리). 길찾기에 압도적으로 빠름." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "algorithms", current: "shortest path" },
  hero: {
    title: "Shortest Path",
    desc: "Shortest distance from one source to all, or all pairs.\nDepending on weights and graph size: BFS, Dijkstra, Bellman-Ford, Floyd-Warshall.",
    tags: ["BFS", "Dijkstra", "Bellman-Ford", "Floyd-Warshall", "Relaxation", "Negative weights"],
  },
  sections: [
    {
      number: "01",
      title: "Relaxation — The Core Operation",
      desc: "if dist[v] > dist[u] + weight(u,v): dist[v] = dist[u] + weight(u,v). Update when a shorter path is found. Every shortest-path algorithm is just a different schedule of relaxations.",
    },
    {
      number: "02",
      title: "BFS — Unweighted Graphs",
      desc: "All edge weights = 1. Queue-based level traversal naturally yields shortest paths. O(V+E). No need for Dijkstra here.",
    },
    {
      number: "03",
      title: "Dijkstra — Positive Weights, Single Source",
      desc: "Shortest path from one source. Min-heap pops the closest unfinished node and relaxes its edges. O((V+E) log V). No negative weights.",
    },
    {
      number: "04",
      title: "Bellman-Ford — Allows Negative Weights",
      desc: "Relax all edges V-1 times. Handles negatives. A V-th relaxation that updates means a negative cycle exists. O(V × E). Slower than Dijkstra but more general.",
    },
    {
      number: "05",
      title: "Floyd-Warshall — All Pairs",
      desc: "Shortest distance between every pair (i,j). dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]) for all k. O(V³). Good for small dense graphs.",
    },
    {
      number: "06",
      title: "Which to Pick",
      desc: "Weights = 1 → BFS. Positive + single source → Dijkstra. Negatives → Bellman-Ford. All pairs + small V → Floyd-Warshall.",
    },
  ],
  bfsCode: {
    title: "BFS Shortest Path",
    code: `int[] bfsShortest(List<List<Integer>> graph, int src, int n) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    Queue<Integer> queue = new ArrayDeque<>();
    queue.offer(src);
    while (!queue.isEmpty()) {
        int u = queue.poll();
        for (int v : graph.get(u)) {
            if (dist[v] == Integer.MAX_VALUE) {
                dist[v] = dist[u] + 1;
                queue.offer(v);
            }
        }
    }
    return dist;
}`,
    note: "All edges have equal weight, so pop order = distance order.",
  },
  dijkstraCode: {
    title: "Dijkstra — Priority Queue",
    code: `int[] dijkstra(List<List<int[]>> graph, int src, int n) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, src});
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int d = cur[0], u = cur[1];
        if (d > dist[u]) continue;     // already found a shorter path
        for (int[] edge : graph.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{dist[v], v});
            }
        }
    }
    return dist;
}`,
    note: "Lazy: same node may sit in the PQ multiple times; only the first pop matters. O((V+E) log V).",
  },
  bellmanFord: {
    title: "Bellman-Ford — V-1 Passes + Cycle Check",
    code: `int[] bellmanFord(int[][] edges, int n, int src) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    for (int i = 0; i < n - 1; i++) {        // V-1 relaxations
        for (int[] e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    // check for negative cycle: V-th pass would still update
    for (int[] e : edges) {
        int u = e[0], v = e[1], w = e[2];
        if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
            return null;                        // negative cycle
        }
    }
    return dist;
}`,
    note: "Negatives OK. With a negative cycle, shortest path is undefined → return null.",
  },
  floyd: {
    title: "Floyd-Warshall — DP",
    code: `int[][] floydWarshall(int n, int[][] edges) {
    int INF = Integer.MAX_VALUE / 2;          // avoid overflow
    int[][] dist = new int[n][n];
    for (int[] row : dist) Arrays.fill(row, INF);
    for (int i = 0; i < n; i++) dist[i][i] = 0;
    for (int[] e : edges) dist[e[0]][e[1]] = e[2];
    // k: intermediates allowed from 0..k
    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    return dist;
}`,
    note: "Triple loop, O(V³). Memory O(V²). Cleanest for small V (a few hundred).",
  },
  comparison: {
    title: "Shortest Path Algorithm Comparison",
    headers: ["Algorithm", "Scope", "Weights", "Time", "Negative cycle"],
    rows: [
      ["BFS", "Single-source", "Uniform (1)", "O(V+E)", "—"],
      ["Dijkstra", "Single-source", "Positive only", "O((V+E) log V)", "❌"],
      ["Bellman-Ford", "Single-source", "Negatives OK", "O(V × E)", "✅ detects"],
      ["Floyd-Warshall", "All-pairs", "Negatives OK", "O(V³)", "Detects"],
      ["SPFA (improved BF)", "Single-source", "Negatives OK", "Avg O(V+E)", "✅"],
      ["Johnson", "All-pairs", "Negatives OK", "O(V² log V + VE)", "❌"],
    ],
  },
  applications: {
    title: "Real Uses",
    items: [
      { name: "Map routing", desc: "Dijkstra + A* heuristic. Google Maps, Kakao Map." },
      { name: "Router (OSPF)", desc: "Dijkstra over network topology to find shortest routes." },
      { name: "Arbitrage", desc: "Convert exchange rates to -log → Bellman-Ford detects negative cycle = arbitrage." },
      { name: "Game AI pathing", desc: "A* + Dijkstra. Obstacle avoidance, shortest movement." },
      { name: "Project scheduling (CPM)", desc: "Negative weights to find longest path = critical path." },
      { name: "Telecom networks", desc: "Cost/latency-weighted routing decisions." },
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Relaxation", text: "Update distance when a better path is found. The atomic operation of every shortest path algorithm." },
      { label: "BFS", text: "Only for uniform weights (1). Queue-based level traversal. O(V+E)." },
      { label: "Dijkstra", text: "Positive weights, single source. Min-heap pops nearest first. O((V+E) log V)." },
      { label: "Bellman-Ford", text: "Negatives OK. Relax all edges V-1 times. V-th update = negative cycle." },
      { label: "Floyd-Warshall", text: "All-pairs shortest. dp[i][j] via k. O(V³). Clean for small graphs." },
      { label: "Negative weights", text: "No to Dijkstra, yes to Bellman-Ford. Converting weights to -log enables multiplicative problems too." },
      { label: "SPFA", text: "Bellman-Ford improved. Queue-based. Fast on average, same worst case. Popular in competitive programming." },
      { label: "A*", text: "Dijkstra + heuristic (estimated remaining distance). Dominates for spatial pathfinding." },
    ],
  },
};

interface SectionProps { number: string; title: string; description: string; children: ReactNode; }
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

export default function ShortestPathPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;
  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(139,92,246,0.06),transparent)]" />
      <div className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.home}</Link>
          <span>/</span>
          <Link href="/algorithms" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.parent}</Link>
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

        <Section number={t.sections[1].number} title={t.sections[1].title} description={t.sections[1].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.bfsCode.title}</h3>
            <pre className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-zinc-900/30 p-3 rounded">{t.bfsCode.code}</pre>
            <p className="text-[10px] text-zinc-500 italic mt-3">{t.bfsCode.note}</p>
          </div>
        </Section>

        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.dijkstraCode.title}</h3>
            <pre className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-zinc-900/30 p-3 rounded">{t.dijkstraCode.code}</pre>
            <p className="text-[10px] text-zinc-500 italic mt-3">{t.dijkstraCode.note}</p>
          </div>
        </Section>

        <Section number={t.sections[3].number} title={t.sections[3].title} description={t.sections[3].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.bellmanFord.title}</h3>
            <pre className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-zinc-900/30 p-3 rounded">{t.bellmanFord.code}</pre>
            <p className="text-[10px] text-zinc-500 italic mt-3">{t.bellmanFord.note}</p>
          </div>
        </Section>

        <Section number={t.sections[4].number} title={t.sections[4].title} description={t.sections[4].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.floyd.title}</h3>
            <pre className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-zinc-900/30 p-3 rounded">{t.floyd.code}</pre>
            <p className="text-[10px] text-zinc-500 italic mt-3">{t.floyd.note}</p>
          </div>
        </Section>

        <Section number={t.sections[5].number} title={t.sections[5].title} description={t.sections[5].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.comparison.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-violet-400 w-44" : "text-zinc-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.comparison.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-violet-300/80 font-semibold">{row[0]}</td>
                    <td className="py-2 text-zinc-400">{row[1]}</td>
                    <td className="py-2 text-zinc-400">{row[2]}</td>
                    <td className="py-2 text-zinc-400">{row[3]}</td>
                    <td className="py-2 text-zinc-400">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section number="07" title={t.applications.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.applications.items.map((a) => (
                <div key={a.name} className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                  <div className="text-xs font-mono text-violet-300 font-semibold mb-1">{a.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{a.desc}</p>
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
                <span className="text-xs font-mono text-violet-500/50 shrink-0 mt-0.5 min-w-[140px]">{item.label}</span>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
