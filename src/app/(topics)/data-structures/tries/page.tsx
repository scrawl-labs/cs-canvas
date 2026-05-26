"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "data-structures", current: "tries" },
  hero: {
    title: "Tries",
    desc: "문자열을 한 글자씩 나뭇가지로 펼친 트리 — 접두사 검색에 최적화.\n자동완성, 사전, IP 라우팅 — 문자열을 다루는 곳이면 어디든.",
    tags: ["Prefix Tree", "Autocomplete", "사전", "DFS", "Patricia Trie"],
  },
  sections: [
    {
      number: "01",
      title: "Trie란 — 접두사 트리",
      desc: "각 노드는 한 글자. 루트에서 노드까지의 경로 = 문자열 접두사. 접두사를 공유하는 단어들이 같은 가지를 공유하므로 메모리 절약 + 접두사 검색이 자연스러움.",
    },
    {
      number: "02",
      title: "구조 — 노드와 자식",
      desc: "각 노드는 자식 맵(보통 알파벳 26개) + 'end of word' 표시. 자식 맵은 배열(상수 알파벳), 해시맵(임의 문자), 또는 자식 리스트(메모리 절약).",
    },
    {
      number: "03",
      title: "Insert · Search — O(L)",
      desc: "L = 단어 길이. 루트부터 한 글자씩 내려가며 노드를 만들거나(insert) 따라감(search). 단어 개수와 무관하게 O(L). 해시 테이블도 O(L)이지만 접두사 검색은 못 함.",
    },
    {
      number: "04",
      title: "Prefix Search — Trie의 진가",
      desc: "'app'으로 시작하는 모든 단어 찾기? 'app' 노드까지 따라간 뒤 그 서브트리 DFS. 자동완성, 검색 추천의 표준 자료구조.",
    },
    {
      number: "05",
      title: "메모리 — 양날의 검",
      desc: "장점: 접두사 공유로 절약. 단점: 각 노드가 자식 포인터 배열 → 알파벳 큰 경우 메모리 낭비. 해결: Compressed Trie (Patricia), Radix Trie, DAWG.",
    },
  ],
  structure: {
    title: "Trie 예시 — {app, apple, apply, apt, bat}",
    diagram: `(root)
├── a
│   ├── p
│   │   ├── p (★ word: 'app')
│   │   │   ├── l
│   │   │   │   ├── e (★ 'apple')
│   │   │   │   └── y (★ 'apply')
│   │   └── t (★ 'apt')
└── b
    └── a
        └── t (★ 'bat')

★ = end-of-word marker`,
    note: "'app', 'apple', 'apply'가 'app' 노드까지 공유. 5개 단어가 14개 노드만 사용 (단어 길이의 단순 합 25 대비 약 절반).",
  },
  code: {
    title: "Trie 구현",
    code: `class TrieNode:
    def __init__(self):
        self.children = {}    # char -> TrieNode
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):
        return self._walk(prefix) is not None

    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node`,
  },
  comparison: {
    title: "Trie vs 다른 자료구조",
    headers: ["연산", "Trie", "Hash Map", "정렬된 배열"],
    rows: [
      ["Insert", "O(L)", "O(L) 평균", "O(N + L)"],
      ["Search (정확)", "O(L)", "O(L) 평균", "O(L log N)"],
      ["접두사 검색", "O(P + K)", "O(N)", "O(L log N + K)"],
      ["자동완성", "✓ 자연스러움", "✗", "△"],
      ["메모리", "노드 오버헤드", "키 + 값", "최소"],
      ["순서 유지", "사전순", "X", "정렬됨"],
    ],
    note: "L = 단어 길이, N = 단어 수, P = 접두사 길이, K = 결과 개수",
  },
  applications: {
    title: "Trie의 실전 활용",
    items: [
      { name: "자동완성 / 검색 추천", desc: "검색창에 'app' 입력 → 'apple', 'apply', 'application' 즉시 제안." },
      { name: "맞춤법 검사", desc: "사전을 Trie로 저장. 단어가 없으면 한 글자 추가/삭제/변경으로 가까운 단어 탐색." },
      { name: "IP 라우팅 (Patricia Trie)", desc: "라우터의 IP 접두사 매칭. Longest Prefix Match를 O(L)에." },
      { name: "Word 게임 (Boggle)", desc: "보드의 글자 조합이 사전에 있는지 빠르게 확인. Trie + DFS." },
      { name: "T9 입력 (구식 폰)", desc: "숫자 키 시퀀스를 가능한 단어로 변환." },
      { name: "Aho-Corasick (다중 패턴 매칭)", desc: "Trie + 실패 링크. 여러 패턴을 한 번에 매칭." },
    ],
  },
  variants: {
    title: "Trie의 변형",
    headers: ["변형", "특징", "장점"],
    rows: [
      ["Standard Trie", "노드당 한 글자", "구현 단순"],
      ["Compressed Trie", "체인 노드 압축", "메모리 절약"],
      ["Patricia Trie (Radix)", "비트 단위 분기, 압축", "IP 라우팅에 사용"],
      ["DAWG", "공통 접미사도 공유", "사전 압축 (스크래블)"],
      ["Suffix Trie/Tree", "모든 접미사 저장", "부분 문자열 검색"],
      ["Ternary Search Tree", "노드당 3개 자식", "Trie + BST 하이브리드"],
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "Trie", text: "접두사 트리. 노드 = 한 글자, 경로 = 문자열. 접두사 공유로 메모리 절약." },
      { label: "Insert/Search", text: "O(L). 단어 개수와 무관. 해시처럼 빠르면서 접두사 검색도 가능." },
      { label: "접두사 검색", text: "Trie의 진짜 강점. 접두사까지 따라간 뒤 서브트리 DFS — 자동완성의 정석." },
      { label: "메모리 트레이드오프", text: "공유로 절약 vs 각 노드의 자식 포인터 비용. 알파벳이 크면 비효율." },
      { label: "Compressed Trie", text: "체인 노드를 합쳐 압축. 메모리 절약. Patricia Trie가 대표." },
      { label: "Patricia Trie", text: "비트 단위 분기 + 체인 압축. IP 라우팅의 Longest Prefix Match." },
      { label: "Suffix Tree", text: "텍스트의 모든 접미사 저장. 부분 문자열 검색 O(L). 구축 O(N)." },
      { label: "어디 쓰나", text: "자동완성, 사전, 라우팅, 다중 패턴 매칭, 단어 게임. 문자열 기반 응용 전반." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "data-structures", current: "tries" },
  hero: {
    title: "Tries",
    desc: "Strings unfolded one character at a time into a tree — optimized for prefix lookups.\nAutocomplete, dictionaries, IP routing — anywhere strings dominate.",
    tags: ["Prefix Tree", "Autocomplete", "Dictionary", "DFS", "Patricia Trie"],
  },
  sections: [
    {
      number: "01",
      title: "Trie — Prefix Tree",
      desc: "Each node is a character. The path from root to a node = a string prefix. Words sharing a prefix share a branch — memory savings and natural prefix lookup.",
    },
    {
      number: "02",
      title: "Structure — Nodes and Children",
      desc: "Each node has a child map (e.g., 26 letters) plus an 'end of word' flag. The child map can be an array (fixed alphabet), hash map (any chars), or list (memory-efficient).",
    },
    {
      number: "03",
      title: "Insert · Search — O(L)",
      desc: "L = word length. Walk character by character, creating (insert) or following (search) nodes. Independent of the total word count. Hash maps are O(L) too — but no prefix search.",
    },
    {
      number: "04",
      title: "Prefix Search — Trie's Real Strength",
      desc: "All words starting with 'app'? Walk to the 'app' node, then DFS the subtree. The standard data structure for autocomplete and suggestions.",
    },
    {
      number: "05",
      title: "Memory — A Double-Edged Sword",
      desc: "Pros: prefix sharing. Cons: each node carries a child-pointer array → wasteful for large alphabets. Fix: compressed/Patricia/Radix Tries, DAWG.",
    },
  ],
  structure: {
    title: "Trie — {app, apple, apply, apt, bat}",
    diagram: `(root)
├── a
│   ├── p
│   │   ├── p (★ word: 'app')
│   │   │   ├── l
│   │   │   │   ├── e (★ 'apple')
│   │   │   │   └── y (★ 'apply')
│   │   └── t (★ 'apt')
└── b
    └── a
        └── t (★ 'bat')

★ = end-of-word marker`,
    note: "'app', 'apple', 'apply' share up to 'app'. 5 words → 14 nodes (vs naive 25-character total — about half).",
  },
  code: {
    title: "Trie Implementation",
    code: `class TrieNode:
    def __init__(self):
        self.children = {}    # char -> TrieNode
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):
        return self._walk(prefix) is not None

    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node`,
  },
  comparison: {
    title: "Trie vs Other Structures",
    headers: ["Operation", "Trie", "Hash Map", "Sorted Array"],
    rows: [
      ["Insert", "O(L)", "O(L) avg", "O(N + L)"],
      ["Search (exact)", "O(L)", "O(L) avg", "O(L log N)"],
      ["Prefix search", "O(P + K)", "O(N)", "O(L log N + K)"],
      ["Autocomplete", "✓ natural", "✗", "△"],
      ["Memory", "Node overhead", "Keys + values", "Minimal"],
      ["Ordering", "Lexicographic", "None", "Sorted"],
    ],
    note: "L = word length, N = word count, P = prefix length, K = result count",
  },
  applications: {
    title: "Trie in Practice",
    items: [
      { name: "Autocomplete / suggestions", desc: "Type 'app' → instantly show 'apple', 'apply', 'application'." },
      { name: "Spell checker", desc: "Dictionary in a Trie. Missing? Try insertions/deletions/substitutions of nearby words." },
      { name: "IP routing (Patricia Trie)", desc: "Longest Prefix Match in O(L). Router workhorse." },
      { name: "Word games (Boggle)", desc: "Quickly check if a board path forms a dictionary word. Trie + DFS." },
      { name: "T9 input (old phones)", desc: "Map number-key sequences to possible words." },
      { name: "Aho-Corasick (multi-pattern matching)", desc: "Trie + failure links. Match many patterns at once." },
    ],
  },
  variants: {
    title: "Trie Variants",
    headers: ["Variant", "Feature", "Strength"],
    rows: [
      ["Standard Trie", "One char per node", "Simplest to implement"],
      ["Compressed Trie", "Chain compression", "Saves memory"],
      ["Patricia Trie (Radix)", "Bit-level branching, compressed", "Used in IP routing"],
      ["DAWG", "Shares common suffixes too", "Dictionary compression (Scrabble)"],
      ["Suffix Trie/Tree", "Stores every suffix", "Substring search"],
      ["Ternary Search Tree", "3 children per node", "Trie + BST hybrid"],
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Trie", text: "Prefix tree. Node = char, path = string. Prefix sharing saves memory." },
      { label: "Insert/Search", text: "O(L). Independent of word count. As fast as hashing but supports prefix queries." },
      { label: "Prefix search", text: "Trie's superpower. Walk to the prefix node, then DFS the subtree — autocomplete 101." },
      { label: "Memory tradeoff", text: "Sharing saves; per-node child-pointer arrays cost. Bad for huge alphabets." },
      { label: "Compressed Trie", text: "Collapse chains. Saves memory. Patricia is the canonical form." },
      { label: "Patricia Trie", text: "Bit-level branching + chain compression. Longest Prefix Match for IP routing." },
      { label: "Suffix Tree", text: "Stores every suffix. Substring search in O(L). Built in O(N)." },
      { label: "Where used", text: "Autocomplete, dictionaries, routing, multi-pattern match, word games. String-heavy domains." },
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

export default function TriesPage() {
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
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.structure.title}</h3>
            <pre className="text-[11px] font-mono text-emerald-300 whitespace-pre">{t.structure.diagram}</pre>
            <p className="text-[10px] text-zinc-500 italic mt-3">{t.structure.note}</p>
          </div>
        </Section>

        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <pre className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-zinc-900/30 p-3 rounded">{t.code.code}</pre>
          </div>
        </Section>

        <Section number="03" title={t.comparison.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.comparison.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-zinc-600 w-32" : i === 1 ? "text-emerald-400" : "text-zinc-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.comparison.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-zinc-500">{row[0]}</td>
                    <td className="py-2 text-emerald-300/80">{row[1]}</td>
                    <td className="py-2 text-zinc-400">{row[2]}</td>
                    <td className="py-2 text-zinc-400">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-zinc-600 italic mt-3">{t.comparison.note}</p>
          </div>
        </Section>

        <Section number="04" title={t.applications.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.applications.items.map((a) => (
                <div key={a.name} className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                  <div className="text-xs font-mono text-emerald-300 font-semibold mb-1">{a.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section number="05" title={t.variants.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.variants.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-emerald-400 w-44" : "text-zinc-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.variants.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-emerald-300/80 font-semibold">{row[0]}</td>
                    <td className="py-2 text-zinc-400">{row[1]}</td>
                    <td className="py-2 text-zinc-500 text-[10px]">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
