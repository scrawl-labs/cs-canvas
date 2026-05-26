"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "algorithms", current: "string algorithms" },
  hero: {
    title: "String Algorithms",
    desc: "텍스트 T(길이 n)에서 패턴 P(길이 m)를 찾는 문제.\n순진한 O(nm)에서 KMP·Rabin-Karp의 O(n+m)까지.",
    tags: ["KMP", "Rabin-Karp", "Z 알고리즘", "Boyer-Moore", "Suffix Array"],
  },
  sections: [
    {
      number: "01",
      title: "Naive 매칭 — O(nm)",
      desc: "T의 모든 위치에서 P와 차례로 비교. 매번 처음으로 돌아가 다시 시작 → 최악 O(nm). 'AAAA...A' vs 'AA...AB' 같은 경우에 특히 비효율.",
    },
    {
      number: "02",
      title: "KMP — 실패 함수로 되돌리기 없이",
      desc: "패턴의 접두사 = 접미사 정보를 미리 계산 (실패 함수 π). 불일치 시 텍스트 포인터는 그대로, 패턴 포인터만 적절히 이동. O(n+m).",
    },
    {
      number: "03",
      title: "Rabin-Karp — 해시 기반",
      desc: "패턴과 텍스트의 윈도우를 해시로 비교. Rolling Hash로 윈도우 이동을 O(1)에. 평균 O(n+m), 최악 O(nm) (해시 충돌). 여러 패턴 동시 검색에 강함.",
    },
    {
      number: "04",
      title: "Boyer-Moore — 오른쪽부터 비교, 큰 점프",
      desc: "패턴을 오른쪽부터 비교. 'Bad Character' + 'Good Suffix' 규칙으로 점프. 평균 sublinear (텍스트의 일부는 보지도 않음). grep의 기본 알고리즘.",
    },
    {
      number: "05",
      title: "Suffix Array & Suffix Tree",
      desc: "텍스트의 모든 접미사를 정렬한 배열. 패턴 매칭, 가장 긴 반복 부분 문자열, LCP 등 다양한 문제를 O(log n)대로. 구축 O(n log n) ~ O(n).",
    },
  ],
  naive: {
    title: "Naive 알고리즘",
    code: `function naive_search(T, P):
    n, m = len(T), len(P)
    for i in range(n - m + 1):
        j = 0
        while j < m and T[i+j] == P[j]:
            j += 1
        if j == m:
            return i  # 매칭 위치
    return -1`,
    cost: "최악 O(nm). 'AAA...AB' 패턴에서 매번 마지막 글자만 다름 → 매 위치마다 m번 비교.",
  },
  kmp: {
    title: "KMP — 실패 함수 (Failure Function)",
    desc: "π[i] = P[0..i]의 진(proper) 접두사이자 접미사인 가장 긴 부분 문자열의 길이.",
    example: {
      pattern: "P = 'ABABCABAB'",
      table: [
        ["index", "0", "1", "2", "3", "4", "5", "6", "7", "8"],
        ["char",  "A", "B", "A", "B", "C", "A", "B", "A", "B"],
        ["π",     "0", "0", "1", "2", "0", "1", "2", "3", "4"],
      ],
    },
    insight: "불일치 시 π[j-1]만큼 패턴 포인터를 뒤로. 텍스트 포인터는 절대 뒤로 안 감 → 총 비교 O(n+m).",
  },
  rabinkarp: {
    title: "Rabin-Karp — Rolling Hash",
    code: `# 해시: h(S) = (S[0]*b^(m-1) + S[1]*b^(m-2) + ... + S[m-1]) mod p
# Rolling: 윈도우 한 칸 이동 시 O(1)에 새 해시 계산
new_hash = (old_hash - T[i]*b^(m-1)) * b + T[i+m]
new_hash %= p

function rabin_karp(T, P):
    pattern_hash = hash(P)
    window_hash = hash(T[0..m-1])
    for i in range(n - m + 1):
        if window_hash == pattern_hash:
            if T[i..i+m-1] == P:        # 해시 충돌 확인
                return i
        if i < n - m:
            window_hash = roll(window_hash, T[i], T[i+m])
    return -1`,
    cost: "평균 O(n+m). 최악(모든 해시 충돌) O(nm). 여러 패턴 검색에 효율적.",
  },
  comparison: {
    title: "주요 알고리즘 비교",
    headers: ["알고리즘", "전처리", "검색", "장점"],
    rows: [
      ["Naive", "—", "O(nm)", "구현 쉬움, 짧은 패턴엔 충분"],
      ["KMP", "O(m)", "O(n)", "텍스트 포인터 뒤로 안 감, 스트림 처리 가능"],
      ["Rabin-Karp", "O(m)", "O(n+m) 평균", "다중 패턴 동시 검색"],
      ["Boyer-Moore", "O(m + σ)", "O(n/m) 평균", "긴 패턴에서 sublinear"],
      ["Z Algorithm", "O(n+m)", "O(n+m)", "구현 간단, 다양한 응용"],
    ],
    note: "σ = 알파벳 크기",
  },
  applications: {
    title: "실전 사용",
    items: [
      { name: "grep / ripgrep", desc: "Boyer-Moore 변형으로 대용량 텍스트 검색." },
      { name: "git diff", desc: "Myers diff 알고리즘 + 문자열 매칭으로 변경점 탐지." },
      { name: "DNA 분석", desc: "유전자 서열에서 패턴 검색. Suffix Tree·Array가 핵심." },
      { name: "스팸/악성 코드 탐지", desc: "Aho-Corasick으로 여러 패턴을 한 번에 매칭." },
      { name: "표절 검사", desc: "긴 공통 부분 문자열 탐색. Suffix Array 활용." },
      { name: "자동완성", desc: "Trie + 접두사 매칭." },
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "Naive", text: "단순. 짧은 패턴이나 가끔 쓰는 경우엔 OK. 최악 O(nm)." },
      { label: "KMP", text: "실패 함수로 패턴 포인터만 뒤로. 텍스트는 한 번만 훑음. O(n+m)." },
      { label: "Rabin-Karp", text: "Rolling Hash. 여러 패턴 검색에 강함. 충돌 시 직접 비교 필요." },
      { label: "Boyer-Moore", text: "오른쪽부터 비교 + 큰 점프. 평균 sublinear. grep의 기본." },
      { label: "Z Algorithm", text: "Z[i] = T[i..]의 T와 일치하는 가장 긴 접두사 길이. 구현 간단, 다양한 응용." },
      { label: "Suffix Array", text: "정렬된 접미사. 패턴 검색, LCP, 반복 탐지. 구축 O(n log n)." },
      { label: "Aho-Corasick", text: "Trie + KMP. 여러 패턴 동시 매칭. 보안·검색 엔진에서 사용." },
      { label: "어떤 걸 쓸까", text: "라이브러리 검색 → 그냥 std. 학습 → KMP. 대용량 텍스트 → Boyer-Moore. 다중 패턴 → Aho-Corasick." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "algorithms", current: "string algorithms" },
  hero: {
    title: "String Algorithms",
    desc: "Find pattern P (length m) in text T (length n).\nFrom naive O(nm) to KMP and Rabin-Karp O(n+m).",
    tags: ["KMP", "Rabin-Karp", "Z Algorithm", "Boyer-Moore", "Suffix Array"],
  },
  sections: [
    {
      number: "01",
      title: "Naive Matching — O(nm)",
      desc: "Compare P at every position in T. Restart from scratch on mismatch → worst case O(nm). Especially bad on inputs like 'AAA...AB' against 'AAA...A'.",
    },
    {
      number: "02",
      title: "KMP — No Backtracking on Text",
      desc: "Precompute prefix-equals-suffix info (failure function π). On mismatch, the text pointer never moves backward; only the pattern pointer shifts smartly. O(n+m).",
    },
    {
      number: "03",
      title: "Rabin-Karp — Hash-Based",
      desc: "Compare hashes of P and sliding windows of T. Rolling Hash lets you slide in O(1). Average O(n+m), worst O(nm) on collisions. Great for multi-pattern search.",
    },
    {
      number: "04",
      title: "Boyer-Moore — Right-to-Left, Big Jumps",
      desc: "Compare from the right. 'Bad Character' + 'Good Suffix' rules let you skip ahead. Sublinear on average (much of T isn't examined). The basis of grep.",
    },
    {
      number: "05",
      title: "Suffix Array & Suffix Tree",
      desc: "All suffixes of T, sorted. Pattern search, longest repeated substring, LCP, etc. in O(log n)-ish. Built in O(n log n) ~ O(n).",
    },
  ],
  naive: {
    title: "Naive Algorithm",
    code: `function naive_search(T, P):
    n, m = len(T), len(P)
    for i in range(n - m + 1):
        j = 0
        while j < m and T[i+j] == P[j]:
            j += 1
        if j == m:
            return i  # found
    return -1`,
    cost: "Worst O(nm). On 'AAA...AB' patterns each starting position compares m characters.",
  },
  kmp: {
    title: "KMP — Failure Function",
    desc: "π[i] = length of the longest proper prefix of P[0..i] that is also a suffix.",
    example: {
      pattern: "P = 'ABABCABAB'",
      table: [
        ["index", "0", "1", "2", "3", "4", "5", "6", "7", "8"],
        ["char",  "A", "B", "A", "B", "C", "A", "B", "A", "B"],
        ["π",     "0", "0", "1", "2", "0", "1", "2", "3", "4"],
      ],
    },
    insight: "On mismatch, jump the pattern pointer by π[j-1]. The text pointer never moves backward → total O(n+m).",
  },
  rabinkarp: {
    title: "Rabin-Karp — Rolling Hash",
    code: `# hash: h(S) = (S[0]*b^(m-1) + S[1]*b^(m-2) + ... + S[m-1]) mod p
# Rolling: shifting the window updates the hash in O(1)
new_hash = (old_hash - T[i]*b^(m-1)) * b + T[i+m]
new_hash %= p

function rabin_karp(T, P):
    pattern_hash = hash(P)
    window_hash = hash(T[0..m-1])
    for i in range(n - m + 1):
        if window_hash == pattern_hash:
            if T[i..i+m-1] == P:        # verify (collision check)
                return i
        if i < n - m:
            window_hash = roll(window_hash, T[i], T[i+m])
    return -1`,
    cost: "Average O(n+m). Worst (every hash collides) O(nm). Great for multi-pattern search.",
  },
  comparison: {
    title: "Algorithm Comparison",
    headers: ["Algorithm", "Preprocess", "Search", "Strength"],
    rows: [
      ["Naive", "—", "O(nm)", "Trivial; fine for short patterns"],
      ["KMP", "O(m)", "O(n)", "Text never rewinds; streamable"],
      ["Rabin-Karp", "O(m)", "O(n+m) avg", "Multiple patterns at once"],
      ["Boyer-Moore", "O(m + σ)", "O(n/m) avg", "Sublinear on long patterns"],
      ["Z Algorithm", "O(n+m)", "O(n+m)", "Easy to code; versatile"],
    ],
    note: "σ = alphabet size",
  },
  applications: {
    title: "Real Uses",
    items: [
      { name: "grep / ripgrep", desc: "Boyer-Moore variant on massive text." },
      { name: "git diff", desc: "Myers diff algorithm + string matching detects changes." },
      { name: "DNA analysis", desc: "Pattern search on genome sequences. Suffix Tree/Array central." },
      { name: "Spam / malware detection", desc: "Aho-Corasick matches many patterns at once." },
      { name: "Plagiarism check", desc: "Long common substring detection via suffix arrays." },
      { name: "Autocomplete", desc: "Trie + prefix match." },
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Naive", text: "Simple. Fine for short patterns or one-offs. Worst O(nm)." },
      { label: "KMP", text: "Failure function lets only the pattern pointer rewind. Text is scanned once. O(n+m)." },
      { label: "Rabin-Karp", text: "Rolling hash. Strong for multi-pattern search. Verify on hash equality." },
      { label: "Boyer-Moore", text: "Right-to-left comparison + skipping rules. Sublinear average. Powers grep." },
      { label: "Z Algorithm", text: "Z[i] = longest prefix of T matching T[i..]. Easy to code; many uses." },
      { label: "Suffix Array", text: "Sorted suffixes. Pattern search, LCP, repeats. Built in O(n log n)." },
      { label: "Aho-Corasick", text: "Trie + KMP. Multi-pattern matching. Used in security and search engines." },
      { label: "Which to pick", text: "Library search → just std. Learning → KMP. Big text → Boyer-Moore. Multi-pattern → Aho-Corasick." },
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

export default function StringAlgorithmsPage() {
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

        <Section number={t.sections[0].number} title={t.sections[0].title} description={t.sections[0].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.naive.title}</h3>
            <pre className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-zinc-900/30 p-3 rounded">{t.naive.code}</pre>
            <p className="text-[10px] text-red-400/80 italic mt-3">⚠ {t.naive.cost}</p>
          </div>
        </Section>

        <Section number={t.sections[1].number} title={t.sections[1].title} description={t.sections[1].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-2">{t.kmp.title}</h3>
            <p className="text-[11px] text-zinc-500 mb-3">{t.kmp.desc}</p>
            <div className="text-[11px] font-mono text-violet-300 mb-3">{t.kmp.example.pattern}</div>
            <table className="text-[11px] font-mono mb-3">
              <tbody>
                {t.kmp.example.table.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`border border-zinc-800 px-2.5 py-1 text-center ${
                          j === 0 ? "text-violet-400 bg-violet-500/5" : i === 2 ? "text-emerald-300" : "text-zinc-400"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-zinc-500 italic">{t.kmp.insight}</p>
          </div>
        </Section>

        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.rabinkarp.title}</h3>
            <pre className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-zinc-900/30 p-3 rounded">{t.rabinkarp.code}</pre>
            <p className="text-[10px] text-zinc-500 italic mt-3">{t.rabinkarp.cost}</p>
          </div>
        </Section>

        <Section number="04" title={t.comparison.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.comparison.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-violet-400 w-32" : "text-zinc-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.comparison.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-violet-300/80 font-semibold">{row[0]}</td>
                    <td className="py-2 text-zinc-400">{row[1]}</td>
                    <td className="py-2 text-zinc-400">{row[2]}</td>
                    <td className="py-2 text-zinc-500 text-[10px]">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-zinc-600 italic mt-3">{t.comparison.note}</p>
          </div>
        </Section>

        <Section number="05" title={t.applications.title} description="">
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
