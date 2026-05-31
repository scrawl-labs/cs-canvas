"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";
import CodeBlock from "@/components/CodeBlock";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "data-structures", current: "linked lists" },
  hero: {
    title: "Linked Lists",
    desc: "각 노드가 다음 노드를 가리키는 포인터 체인.\n배열은 메모리 연속·인덱스 빠름, 연결 리스트는 삽입/삭제 빠름·포인터 한 번에 한 칸씩.",
    tags: ["Singly", "Doubly", "Circular", "vs Array", "Two Pointers"],
  },
  sections: [
    {
      number: "01",
      title: "왜 연결 리스트인가 — 배열과의 비교",
      desc: "배열은 인덱스 접근이 O(1)이지만 중간 삽입/삭제는 O(n) (이동 비용). 연결 리스트는 인덱스 접근이 O(n)이지만, 노드 포인터만 있으면 삽입/삭제는 O(1).",
    },
    {
      number: "02",
      title: "Singly Linked List — 한 방향",
      desc: "각 노드는 value와 next 포인터를 가짐. 마지막 노드의 next는 NULL. 머리(head)에서 시작해서 한 방향으로만 순회. 메모리는 적게 쓰지만, 직전 노드로 갈 수 없음.",
    },
    {
      number: "03",
      title: "Doubly Linked List — 양방향",
      desc: "각 노드는 prev와 next 두 포인터. 양방향 순회 가능, 임의 노드 삭제가 O(1). 메모리는 더 쓰지만 활용성이 높음. LRU Cache, 브라우저 history 등에 사용.",
    },
    {
      number: "04",
      title: "Circular Linked List — 끝이 시작과 연결",
      desc: "마지막 노드의 next가 head를 가리킴. 순환 데이터 표현 (라운드 로빈 스케줄러, 음악 플레이어의 '반복'). Singly·Doubly 둘 다 가능.",
    },
    {
      number: "05",
      title: "기본 연산 — Insert, Delete, Search",
      desc: "Head 삽입/삭제는 항상 O(1). 중간 삽입/삭제는 노드 포인터를 알면 O(1), 인덱스만 알면 O(n). 검색은 처음부터 순회하므로 항상 O(n).",
    },
    {
      number: "06",
      title: "Two Pointer 기법 — 사이클 탐지, 중앙 찾기",
      desc: "느린 포인터(1칸씩)와 빠른 포인터(2칸씩)를 함께 움직임. 사이클이 있으면 두 포인터가 만남(Floyd's algorithm). 빠른 포인터가 끝에 도달할 때 느린 포인터는 중앙.",
    },
  ],
  compare: {
    title: "배열 vs 연결 리스트",
    headers: ["연산", "배열", "연결 리스트"],
    rows: [
      ["인덱스 접근 a[i]", "O(1)", "O(n)"],
      ["맨 앞 삽입", "O(n)", "O(1)"],
      ["맨 뒤 삽입 (tail 있을 때)", "O(1) 평균", "O(1)"],
      ["중간 삽입 (포인터 있음)", "O(n)", "O(1)"],
      ["검색", "O(n)", "O(n)"],
      ["메모리 효율", "좋음 (연속)", "포인터 오버헤드"],
      ["캐시 지역성", "좋음", "나쁨"],
    ],
  },
  singly: {
    title: "Singly Linked List 구조",
    diagram: `head → [3 | •] → [5 | •] → [7 | •] → [9 | /]
         A         B         C         D`,
    insertHead: "Insert at head: new.next = head; head = new — O(1)",
    insertMiddle: "Insert after B: new.next = B.next; B.next = new — O(1)",
    deleteMiddle: "Delete C: B.next = C.next — O(1) (B 포인터 있을 때)",
  },
  doubly: {
    title: "Doubly Linked List 구조",
    diagram: `null ← [• | 3 | •] ⇄ [• | 5 | •] ⇄ [• | 7 | •] → null
             A             B             C`,
    deleteAny: `임의 노드 X 삭제:
  X.prev.next = X.next
  X.next.prev = X.prev
→ X 포인터만 있으면 O(1)`,
  },
  twoPointer: {
    title: "Two Pointer — 사이클 탐지 (Floyd)",
    code: `boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;         // 1칸
        fast = fast.next.next;    // 2칸
        if (slow == fast) {
            return true;          // 만남 → 사이클
        }
    }
    return false;
}`,
    insight: "사이클이 있으면 fast가 slow를 한 바퀴 돌아 따라잡음. 사이클이 없으면 fast가 먼저 null 도달.",
  },
  middleFinding: {
    title: "Two Pointer — 중앙 노드 찾기",
    code: `ListNode findMiddle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;  // fast가 끝에 갔을 때 slow는 중앙
}`,
    insight: "한 번의 순회로 중앙 찾기 — 길이를 세는 두 번 순회보다 우아함.",
  },
  uses: {
    title: "실전 사용처",
    items: [
      { name: "LRU Cache", desc: "Doubly Linked List + Hash Map. O(1)에 가장 오래된 항목 삭제, 최근 항목 머리로 이동." },
      { name: "Undo/Redo", desc: "양방향 순회로 이전/다음 상태 이동." },
      { name: "OS 프로세스 스케줄러", desc: "Circular linked list로 라운드 로빈." },
      { name: "Adjacency List (그래프)", desc: "각 정점의 이웃을 연결 리스트로 저장 — 동적 추가/삭제 쉬움." },
      { name: "Polynomial 표현", desc: "차수와 계수를 노드에, 항을 연결. 항이 많지만 sparse할 때 유리." },
    ],
  },
  pitfalls: {
    title: "흔한 함정",
    items: [
      "Dangling pointer: 노드 삭제 후 포인터를 NULL로 안 해두면 use-after-free.",
      "Lost head: head 노드를 가리키는 임시 변수를 잃으면 전체 리스트 누락.",
      "Off-by-one in two pointer: while 조건에서 fast or fast.next 둘 다 체크 필수.",
      "Doubly에서 prev/next 갱신 누락: 양쪽 모두 업데이트 안 하면 손상.",
      "메모리 누수 (C/C++): 노드 free 안 하면 누적. GC 언어는 자동.",
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "vs 배열", text: "배열은 인덱스 O(1)·삽입 O(n). 연결 리스트는 인덱스 O(n)·포인터 있는 곳 삽입 O(1)." },
      { label: "Singly", text: "next 포인터만. 메모리 절약, 한 방향 순회. 직전 노드 접근 불가." },
      { label: "Doubly", text: "prev + next. 양방향. 임의 노드 삭제 O(1). LRU Cache 핵심." },
      { label: "Circular", text: "꼬리 → 머리. 라운드 로빈, 무한 루프 표현." },
      { label: "Head/Tail", text: "둘 다 포인터로 들고 있으면 양 끝 O(1) 삽입. tail 없으면 끝 삽입이 O(n)." },
      { label: "Two Pointer", text: "slow + fast. 사이클 탐지(Floyd), 중앙 찾기, k번째 뒤 노드." },
      { label: "캐시 지역성", text: "배열보다 매우 나쁨 — 노드가 메모리에 흩어짐. 현대 CPU에선 같은 O 복잡도라도 배열이 더 빠를 수 있음." },
      { label: "언제 쓸까", text: "끊임없는 삽입/삭제가 많고 임의 접근이 적을 때. 그 외엔 보통 배열/Vector가 정답." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "data-structures", current: "linked lists" },
  hero: {
    title: "Linked Lists",
    desc: "A chain of nodes, each pointing to the next.\nArrays: contiguous memory, fast index. Linked lists: fast insert/delete, but you walk pointer by pointer.",
    tags: ["Singly", "Doubly", "Circular", "vs Array", "Two Pointers"],
  },
  sections: [
    {
      number: "01",
      title: "Why a Linked List — vs Array",
      desc: "Arrays give O(1) index access but O(n) mid-insert/delete (shifting). Linked lists are O(n) to index but O(1) to insert/delete if you have the pointer.",
    },
    {
      number: "02",
      title: "Singly Linked List — One Way",
      desc: "Each node has a value and a next pointer. Last node's next is NULL. Walk from head one direction only. Compact, but no backward access.",
    },
    {
      number: "03",
      title: "Doubly Linked List — Both Ways",
      desc: "Each node has prev and next. Two-way traversal, arbitrary-node delete in O(1). Costs more memory but very flexible. Used in LRU caches, browser history, etc.",
    },
    {
      number: "04",
      title: "Circular Linked List — Tail Loops Back",
      desc: "Last node's next points to head. Represents cyclic data (round-robin scheduler, music repeat). Works with both singly and doubly forms.",
    },
    {
      number: "05",
      title: "Operations — Insert, Delete, Search",
      desc: "Head insert/delete is always O(1). Mid-insert/delete is O(1) with a pointer, O(n) with only an index. Search is always O(n) — walk from head.",
    },
    {
      number: "06",
      title: "Two-Pointer Trick — Cycle, Middle",
      desc: "Slow pointer (1 step) and fast pointer (2 steps). If there's a cycle, they meet (Floyd's algorithm). When fast hits the end, slow is at the middle.",
    },
  ],
  compare: {
    title: "Array vs Linked List",
    headers: ["Operation", "Array", "Linked List"],
    rows: [
      ["Index access a[i]", "O(1)", "O(n)"],
      ["Insert at front", "O(n)", "O(1)"],
      ["Insert at end (with tail)", "O(1) avg", "O(1)"],
      ["Mid-insert with pointer", "O(n)", "O(1)"],
      ["Search", "O(n)", "O(n)"],
      ["Memory efficiency", "Great (contiguous)", "Pointer overhead"],
      ["Cache locality", "Good", "Bad"],
    ],
  },
  singly: {
    title: "Singly Linked List Layout",
    diagram: `head → [3 | •] → [5 | •] → [7 | •] → [9 | /]
         A         B         C         D`,
    insertHead: "Insert at head: new.next = head; head = new — O(1)",
    insertMiddle: "Insert after B: new.next = B.next; B.next = new — O(1)",
    deleteMiddle: "Delete C: B.next = C.next — O(1) (when you have B's pointer)",
  },
  doubly: {
    title: "Doubly Linked List Layout",
    diagram: `null ← [• | 3 | •] ⇄ [• | 5 | •] ⇄ [• | 7 | •] → null
             A             B             C`,
    deleteAny: `Delete arbitrary X:
  X.prev.next = X.next
  X.next.prev = X.prev
→ O(1) given only X's pointer`,
  },
  twoPointer: {
    title: "Two Pointer — Cycle Detection (Floyd)",
    code: `boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;         // 1 step
        fast = fast.next.next;    // 2 steps
        if (slow == fast) {
            return true;          // met → cycle
        }
    }
    return false;
}`,
    insight: "If a cycle exists, fast laps slow. No cycle → fast hits null first.",
  },
  middleFinding: {
    title: "Two Pointer — Find the Middle",
    code: `ListNode findMiddle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;  // when fast is at end, slow is at middle
}`,
    insight: "One-pass middle find — more elegant than counting first.",
  },
  uses: {
    title: "Real Uses",
    items: [
      { name: "LRU Cache", desc: "Doubly Linked List + Hash Map. O(1) to evict oldest, O(1) to bump recently used to head." },
      { name: "Undo/Redo", desc: "Two-way traversal lets you step backward and forward." },
      { name: "OS Process Scheduler", desc: "Circular list for round-robin scheduling." },
      { name: "Adjacency List (graph)", desc: "Each vertex stores neighbors as a linked list — easy dynamic add/remove." },
      { name: "Polynomials", desc: "Nodes hold (degree, coeff). Good when sparse with many terms." },
    ],
  },
  pitfalls: {
    title: "Common Pitfalls",
    items: [
      "Dangling pointer: forgetting to NULL after free → use-after-free.",
      "Lost head: losing the temp variable holding head loses the whole list.",
      "Two-pointer off-by-one: check both fast and fast.next in the while condition.",
      "Doubly: forgetting to update both prev and next on insert/delete corrupts the list.",
      "Memory leak (C/C++): forgetting to free nodes — accumulates. GC languages handle it.",
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "vs Array", text: "Arrays: O(1) index, O(n) insert. Linked lists: O(n) index, O(1) insert if you have the pointer." },
      { label: "Singly", text: "Just next. Memory efficient, one-way only. No previous access." },
      { label: "Doubly", text: "prev + next. Two-way. O(1) delete of arbitrary node. Core of LRU cache." },
      { label: "Circular", text: "Tail loops to head. Round-robin, cyclic structures." },
      { label: "Head/Tail", text: "Keep both — O(1) insert at either end. Without tail, end-insert is O(n)." },
      { label: "Two Pointer", text: "slow + fast. Cycle detection (Floyd), middle node, k-th from end." },
      { label: "Cache locality", text: "Much worse than arrays — nodes scattered in memory. Modern CPUs often favor arrays even at the same big-O." },
      { label: "When to use", text: "Heavy insert/delete with rare random access. Otherwise, arrays/vectors win." },
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
          <span className="text-xs font-mono text-emerald-500/60">{number}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function LinkedListsPage() {
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

        {/* 01 - vs array */}
        <Section number={t.sections[0].number} title={t.sections[0].title} description={t.sections[0].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.compare.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-zinc-600 w-56" : i === 1 ? "text-amber-400" : "text-emerald-400"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.compare.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-zinc-500">{row[0]}</td>
                    <td className="py-2 text-amber-300/80">{row[1]}</td>
                    <td className="py-2 text-emerald-300/80">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 02 - singly */}
        <Section number={t.sections[1].number} title={t.sections[1].title} description={t.sections[1].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.singly.title}</h3>
            <pre className="text-[11px] font-mono text-emerald-300 mb-4">{t.singly.diagram}</pre>
            <div className="space-y-2 text-[11px] font-mono">
              <div className="text-zinc-400">{t.singly.insertHead}</div>
              <div className="text-zinc-400">{t.singly.insertMiddle}</div>
              <div className="text-zinc-400">{t.singly.deleteMiddle}</div>
            </div>
          </div>
        </Section>

        {/* 03 - doubly */}
        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.doubly.title}</h3>
            <pre className="text-[11px] font-mono text-emerald-300 mb-4">{t.doubly.diagram}</pre>
            <pre className="text-[11px] font-mono text-zinc-400 whitespace-pre-wrap">{t.doubly.deleteAny}</pre>
          </div>
        </Section>

        {/* 04+05 - two pointer */}
        <Section number={t.sections[5].number} title={t.sections[5].title} description={t.sections[5].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
            <div>
              <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.twoPointer.title}</h3>
              <CodeBlock language="java" code={t.twoPointer.code} />
              <p className="text-[10px] text-zinc-500 italic mt-2">{t.twoPointer.insight}</p>
            </div>
            <div className="border-t border-zinc-800 pt-4">
              <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.middleFinding.title}</h3>
              <CodeBlock language="java" code={t.middleFinding.code} />
              <p className="text-[10px] text-zinc-500 italic mt-2">{t.middleFinding.insight}</p>
            </div>
          </div>
        </Section>

        {/* uses */}
        <Section number="05" title={t.uses.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="space-y-2">
              {t.uses.items.map((u) => (
                <div key={u.name} className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                  <div className="text-xs font-mono text-emerald-300 font-semibold mb-1">{u.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{u.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* pitfalls */}
        <Section number="06" title={t.pitfalls.title} description="">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6">
            <ul className="space-y-2">
              {t.pitfalls.items.map((p, i) => (
                <li key={i} className="text-[11px] text-zinc-400 leading-relaxed flex gap-2">
                  <span className="text-red-400">⚠</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* summary */}
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
