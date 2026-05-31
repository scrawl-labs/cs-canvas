"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";
import CodeBlock from "@/components/CodeBlock";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "operating-systems", current: "synchronization" },
  hero: {
    title: "Synchronization",
    desc: "여러 스레드가 같은 데이터를 만지면 예측 불가능한 결과 — Race Condition.\nMutex, Semaphore, Condition Variable — 임계 구역을 안전하게 통과시키는 도구들.",
    tags: ["Race Condition", "Critical Section", "Mutex", "Semaphore", "Monitor", "원자성"],
  },
  sections: [
    {
      number: "01",
      title: "Race Condition과 임계 구역",
      desc: "여러 스레드가 같은 자원을 동시에 수정하면 실행 순서에 따라 결과가 달라짐. counter++가 read-modify-write 3단계라서 두 스레드가 끼어들면 결과 손실. 임계 구역(Critical Section)을 보호해야 함.",
    },
    {
      number: "02",
      title: "임계 구역의 3가지 요구사항",
      desc: "1) Mutual Exclusion: 한 번에 하나만. 2) Progress: 비어 있으면 누군가는 들어감. 3) Bounded Waiting: 무한 대기 없음. 셋 다 만족해야 옳은 동기화.",
    },
    {
      number: "03",
      title: "Mutex — 가장 단순한 도구",
      desc: "Mutual Exclusion 락. lock()으로 잠그고 unlock()으로 해제. 한 번에 한 스레드만 들어감. 다른 스레드는 대기. POSIX의 pthread_mutex_t, Java의 synchronized, C++의 std::mutex.",
    },
    {
      number: "04",
      title: "Semaphore — 카운터가 있는 락",
      desc: "정수 카운터를 가진 동기화. wait() (P): 카운터 -1, 0이면 대기. signal() (V): 카운터 +1. Binary Semaphore = Mutex. Counting Semaphore: 자원이 N개 있는 경우.",
    },
    {
      number: "05",
      title: "Condition Variable & Monitor",
      desc: "Condition Variable: 조건이 만족될 때까지 대기 (wait), 조건 변화 시 깨움 (signal/broadcast). Monitor: Mutex + Condition Variable의 패키지. Java의 synchronized + wait/notify.",
    },
    {
      number: "06",
      title: "Producer-Consumer — 동기화의 정석 문제",
      desc: "Producer가 버퍼에 데이터 넣고, Consumer가 꺼냄. 버퍼 비어있으면 Consumer 대기, 가득 차면 Producer 대기. Mutex(상호 배제) + 2개 Semaphore(empty/full)로 해결.",
    },
  ],
  raceCondition: {
    title: "Race Condition 예시 — counter++",
    desc: "counter = 5 시작. 두 스레드가 동시에 counter++. 예상: 7. 실제: ?",
    timeline: [
      { time: "t1", t1: "load counter (=5)", t2: "" },
      { time: "t2", t1: "", t2: "load counter (=5)" },
      { time: "t3", t1: "add 1 → 6", t2: "" },
      { time: "t4", t1: "", t2: "add 1 → 6" },
      { time: "t5", t1: "store 6", t2: "" },
      { time: "t6", t1: "", t2: "store 6" },
    ],
    result: "결과: 6 (예상은 7). 한 번의 증가가 사라짐 — Lost Update.",
  },
  requirements: {
    title: "올바른 동기화의 3가지 조건",
    items: [
      { name: "Mutual Exclusion", desc: "동시에 두 스레드가 임계 구역에 들어가지 않음. 핵심 안전성 보장." },
      { name: "Progress", desc: "임계 구역이 비어 있으면, 들어가려는 스레드 중 누군가는 결국 들어가야 함. Deadlock 방지." },
      { name: "Bounded Waiting", desc: "임계 구역에 들어가기 위해 무한 대기 없음. 어떤 스레드도 영원히 starvation X." },
    ],
  },
  mutex: {
    title: "Mutex 사용 패턴",
    code: `mutex m;

# Thread A & B 모두
m.lock();           # 잠금 (필요 시 대기)
critical_section();  # 한 스레드만 실행 보장
m.unlock();         # 해제 (대기 중인 스레드 깨움)

# C++ RAII로 안전하게:
{
    std::lock_guard<std::mutex> lock(m);
    critical_section();
}  # scope 벗어나면 자동 unlock`,
    note: "락을 잡은 채로 예외 발생 → 영원히 락 안 풀림 (deadlock). RAII나 try-finally로 해결.",
  },
  semaphore: {
    title: "Semaphore — Binary vs Counting",
    items: [
      {
        name: "Binary Semaphore",
        desc: "값이 0 또는 1. Mutex와 동일한 효과지만 의미는 다름 — 신호(signal) 역할도 가능.",
      },
      {
        name: "Counting Semaphore",
        desc: "N개의 자원을 표현. 예: 데이터베이스 커넥션 풀 크기. wait()로 자원 1개 획득, signal()로 반납.",
      },
    ],
    code: `sem.wait():
    counter -= 1
    if counter < 0:
        block_thread()      # 대기

sem.signal():
    counter += 1
    if counter <= 0:
        wake_one_thread()   # 깨움`,
  },
  monitor: {
    title: "Monitor — Mutex + Condition Variable",
    desc: "Mutex로 임계 구역 보호 + Condition Variable로 조건 대기/통지. Java의 synchronized 메서드 + wait/notify가 대표.",
    code: `# Java 스타일
synchronized (obj) {
    while (!condition) {
        obj.wait();           # 락 풀고 대기
    }
    # condition true일 때 진행
    // ... 작업 ...
    obj.notifyAll();          # 다른 스레드 깨움
}

# 왜 while? Spurious wakeup (이유 없이 깨어남) 방지`,
  },
  producer: {
    title: "Producer-Consumer 의사 코드",
    code: `mutex m;
semaphore empty = N;   # 빈 슬롯 수
semaphore full = 0;    # 채워진 슬롯 수
buffer = circular_array(N);

# Producer
loop:
    item = produce();
    empty.wait();        # 빈 슬롯 대기
    m.lock();
    buffer.put(item);
    m.unlock();
    full.signal();       # 채워진 슬롯 알림

# Consumer
loop:
    full.wait();         # 채워진 슬롯 대기
    m.lock();
    item = buffer.get();
    m.unlock();
    empty.signal();      # 빈 슬롯 알림
    consume(item);`,
    note: "empty/full로 버퍼 상태 조율, m으로 버퍼 자체 접근 보호. 락 순서 유의 (wait → lock → unlock → signal).",
  },
  pitfalls: {
    title: "동기화 함정",
    items: [
      { name: "Deadlock", desc: "두 스레드가 서로의 락을 기다림. 락 순서 정해두면 방지." },
      { name: "Race Condition", desc: "락 잊거나 잘못된 범위 → 동시 수정 발생." },
      { name: "Lost Wakeup", desc: "notify 후 wait → 영원히 대기. while + condition check로 방지." },
      { name: "Priority Inversion", desc: "낮은 우선순위가 락 잡은 채로 높은 우선순위가 대기. Priority Inheritance로 해결." },
      { name: "Lock Contention", desc: "많은 스레드가 같은 락 경쟁 → 성능 저하. Lock-free, RWLock, fine-grained locking 고려." },
      { name: "False Sharing", desc: "다른 변수지만 같은 캐시라인 → 캐시 invalidation 폭증. padding으로 해결." },
    ],
  },
  alternatives: {
    title: "락 외의 동기화 도구",
    items: [
      { name: "RWLock (ReadWriteLock)", desc: "읽기는 동시 다수 OK, 쓰기는 단독. 읽기 위주 워크로드에 효율적." },
      { name: "Atomic 연산", desc: "CPU 명령으로 보장. CAS (Compare-And-Swap), fetch_add 등. 락보다 빠름." },
      { name: "Lock-free 자료구조", desc: "락 없이 동시 접근 안전. CAS 기반. 구현 어렵고 디버깅 까다로움." },
      { name: "RCU (Read-Copy-Update)", desc: "읽기는 락 없이, 쓰기는 복사 후 교체. Linux 커널에서 사용." },
      { name: "Channel (Go)", desc: "공유 메모리 대신 통신. 'Don't communicate by sharing memory; share memory by communicating.'" },
      { name: "Actor 모델", desc: "각 actor는 자기 상태만 소유, 메시지로 통신. Erlang, Akka." },
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "Race Condition", text: "동시 수정으로 결과 달라짐. counter++도 안전하지 않음." },
      { label: "임계 구역", text: "공유 자원을 다루는 코드. Mutual Exclusion + Progress + Bounded Waiting." },
      { label: "Mutex", text: "한 번에 하나. lock/unlock. RAII로 안전하게." },
      { label: "Semaphore", text: "카운터. Binary = Mutex 같음, Counting = 자원 N개." },
      { label: "Condition Variable", text: "조건 만족까지 대기. while + check로 spurious wakeup 방지." },
      { label: "Monitor", text: "Mutex + Condition Variable 패키지. Java synchronized + wait/notify." },
      { label: "Producer-Consumer", text: "Mutex + 2 Semaphore. 동기화 학습의 정석 문제." },
      { label: "Lock-free", text: "CAS 기반. 락 없이 안전. 빠르지만 구현 까다로움. Atomic 연산이 기반." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "operating-systems", current: "synchronization" },
  hero: {
    title: "Synchronization",
    desc: "Multiple threads touching the same data give unpredictable results — race conditions.\nMutex, Semaphore, Condition Variable — tools that safely shepherd threads through critical sections.",
    tags: ["Race condition", "Critical section", "Mutex", "Semaphore", "Monitor", "Atomicity"],
  },
  sections: [
    {
      number: "01",
      title: "Race Conditions & Critical Sections",
      desc: "When multiple threads modify shared state concurrently, the outcome depends on scheduling. counter++ is really read-modify-write — two threads interleaving lose an update. Protect the critical section.",
    },
    {
      number: "02",
      title: "3 Requirements of a Correct Solution",
      desc: "1) Mutual Exclusion: at most one inside. 2) Progress: if empty, someone gets in. 3) Bounded Waiting: no infinite wait. All three needed for a correct synchronization primitive.",
    },
    {
      number: "03",
      title: "Mutex — The Simplest Tool",
      desc: "Mutual Exclusion lock. lock() to acquire, unlock() to release. Only one thread inside; others wait. POSIX pthread_mutex_t, Java synchronized, C++ std::mutex.",
    },
    {
      number: "04",
      title: "Semaphore — A Lock With a Counter",
      desc: "Integer counter. wait() (P): counter--, block if 0. signal() (V): counter++. Binary Semaphore = Mutex. Counting Semaphore: N instances of a resource.",
    },
    {
      number: "05",
      title: "Condition Variable & Monitor",
      desc: "Condition Variable: wait until a condition holds; signal/broadcast on change. Monitor: Mutex + Condition Variable bundled. Java's synchronized + wait/notify is exactly this.",
    },
    {
      number: "06",
      title: "Producer-Consumer — The Canonical Problem",
      desc: "Producer puts items in a buffer; Consumer takes them. Block consumer on empty, producer on full. Solved by a Mutex (for the buffer) + two Semaphores (empty/full).",
    },
  ],
  raceCondition: {
    title: "Race Condition — counter++",
    desc: "counter starts at 5. Two threads each do counter++. Expected: 7. Actual: ?",
    timeline: [
      { time: "t1", t1: "load counter (=5)", t2: "" },
      { time: "t2", t1: "", t2: "load counter (=5)" },
      { time: "t3", t1: "add 1 → 6", t2: "" },
      { time: "t4", t1: "", t2: "add 1 → 6" },
      { time: "t5", t1: "store 6", t2: "" },
      { time: "t6", t1: "", t2: "store 6" },
    ],
    result: "Result: 6 (expected 7). One increment lost — Lost Update.",
  },
  requirements: {
    title: "3 Requirements for Correct Synchronization",
    items: [
      { name: "Mutual Exclusion", desc: "No two threads inside the critical section at once. The core safety property." },
      { name: "Progress", desc: "If the section is empty, some waiting thread must eventually enter. Prevents deadlock." },
      { name: "Bounded Waiting", desc: "No thread waits forever to enter. Prevents starvation." },
    ],
  },
  mutex: {
    title: "Mutex Usage Pattern",
    code: `mutex m;

# Both Thread A & B
m.lock();           # acquire (wait if needed)
critical_section();  # only one thread here
m.unlock();         # release (wake a waiter)

# Safely via C++ RAII:
{
    std::lock_guard<std::mutex> lock(m);
    critical_section();
}  # scope exit → unlock automatically`,
    note: "Exception with the lock held → lock never released (deadlock). Use RAII / try-finally.",
  },
  semaphore: {
    title: "Semaphore — Binary vs Counting",
    items: [
      {
        name: "Binary Semaphore",
        desc: "Value 0 or 1. Same effect as a Mutex, but semantically also a signal.",
      },
      {
        name: "Counting Semaphore",
        desc: "Represents N resources. E.g., database connection pool size. wait() acquires one, signal() returns one.",
      },
    ],
    code: `sem.wait():
    counter -= 1
    if counter < 0:
        block_thread()      # wait

sem.signal():
    counter += 1
    if counter <= 0:
        wake_one_thread()`,
  },
  monitor: {
    title: "Monitor — Mutex + Condition Variable",
    desc: "Mutex protects a critical section; Condition Variable waits for/signals a condition. Java synchronized methods + wait/notify embody this.",
    code: `# Java style
synchronized (obj) {
    while (!condition) {
        obj.wait();           # release lock and wait
    }
    # condition is true now
    // ... work ...
    obj.notifyAll();          # wake other threads
}

# Why while? Spurious wakeups (waking for no reason) require rechecking.`,
  },
  producer: {
    title: "Producer-Consumer Pseudocode",
    code: `mutex m;
semaphore empty = N;   # empty slots
semaphore full = 0;    # full slots
buffer = circular_array(N);

# Producer
loop:
    item = produce();
    empty.wait();        # need an empty slot
    m.lock();
    buffer.put(item);
    m.unlock();
    full.signal();       # one more item available

# Consumer
loop:
    full.wait();         # need an item
    m.lock();
    item = buffer.get();
    m.unlock();
    empty.signal();      # one more slot free
    consume(item);`,
    note: "empty/full coordinate buffer state; m protects buffer access. Order matters: wait → lock → unlock → signal.",
  },
  pitfalls: {
    title: "Synchronization Pitfalls",
    items: [
      { name: "Deadlock", desc: "Two threads wait for each other's locks. Fix with a global lock order." },
      { name: "Race Condition", desc: "Forgot a lock or held the wrong scope → concurrent modification." },
      { name: "Lost Wakeup", desc: "notify before wait → wait forever. Use while + condition check." },
      { name: "Priority Inversion", desc: "Low-priority holds lock, high-priority blocked. Fix with priority inheritance." },
      { name: "Lock Contention", desc: "Many threads on the same lock → slow. Use lock-free, RWLock, or fine-grained locking." },
      { name: "False Sharing", desc: "Different variables on the same cache line → cache invalidation storm. Pad to fix." },
    ],
  },
  alternatives: {
    title: "Alternatives to Locks",
    items: [
      { name: "RWLock (Read-Write Lock)", desc: "Many readers OR one writer. Efficient for read-heavy workloads." },
      { name: "Atomic operations", desc: "Hardware-backed. CAS (Compare-And-Swap), fetch_add, etc. Faster than locks." },
      { name: "Lock-free data structures", desc: "Concurrent access without locks. CAS-based. Hard to implement, harder to debug." },
      { name: "RCU (Read-Copy-Update)", desc: "Readers don't lock; writers copy and swap. Used in the Linux kernel." },
      { name: "Channels (Go)", desc: "Communicate instead of share. 'Don't communicate by sharing memory; share memory by communicating.'" },
      { name: "Actor model", desc: "Each actor owns its state; threads communicate via messages. Erlang, Akka." },
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "Race Condition", text: "Concurrent modification gives different results. counter++ is unsafe." },
      { label: "Critical section", text: "Code touching shared state. Needs Mutual Exclusion + Progress + Bounded Waiting." },
      { label: "Mutex", text: "One at a time. lock/unlock. Use RAII to stay safe." },
      { label: "Semaphore", text: "Counter. Binary = like a Mutex; Counting = N resources." },
      { label: "Condition Variable", text: "Wait until a predicate holds. Use while + check to dodge spurious wakeups." },
      { label: "Monitor", text: "Mutex + Condition Variable bundled. Java synchronized + wait/notify." },
      { label: "Producer-Consumer", text: "Mutex + 2 Semaphores. The canonical synchronization exercise." },
      { label: "Lock-free", text: "CAS-based. Safe without locks. Fast but tricky. Atomic ops are the foundation." },
    ],
  },
};

interface SectionProps { number: string; title: string; description: string; children: ReactNode; }
function Section({ number, title, description, children }: SectionProps) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-xs font-mono text-orange-500/60">{number}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function SynchronizationPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;
  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(251,146,60,0.06),transparent)]" />
      <div className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.home}</Link>
          <span>/</span>
          <Link href="/operating-systems" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.parent}</Link>
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
            <h3 className="text-xs font-mono text-zinc-400 mb-2">{t.raceCondition.title}</h3>
            <p className="text-[11px] text-zinc-500 mb-3">{t.raceCondition.desc}</p>
            <table className="w-full text-[11px] font-mono mb-3">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-600 w-16">time</th>
                  <th className="text-left py-2 text-orange-400">Thread 1</th>
                  <th className="text-left py-2 text-amber-400">Thread 2</th>
                </tr>
              </thead>
              <tbody>
                {t.raceCondition.timeline.map((r, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-1.5 text-zinc-500">{r.time}</td>
                    <td className="py-1.5 text-orange-300/80">{r.t1}</td>
                    <td className="py-1.5 text-amber-300/80">{r.t2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] font-mono text-red-400/80">⚠ {t.raceCondition.result}</p>
          </div>
        </Section>

        <Section number={t.sections[1].number} title={t.sections[1].title} description={t.sections[1].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {t.requirements.items.map((r) => (
                <div key={r.name} className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                  <div className="text-xs font-mono text-orange-300 font-semibold mb-1">{r.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.mutex.title}</h3>
            <CodeBlock language="java" code={t.mutex.code} />
            <p className="text-[10px] text-zinc-500 italic mt-3">⚠ {t.mutex.note}</p>
          </div>
        </Section>

        <Section number={t.sections[3].number} title={t.sections[3].title} description={t.sections[3].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.semaphore.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {t.semaphore.items.map((s) => (
                <div key={s.name} className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                  <div className="text-xs font-mono text-orange-300 font-semibold mb-1">{s.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            <CodeBlock language="java" code={t.semaphore.code} />
          </div>
        </Section>

        <Section number={t.sections[4].number} title={t.sections[4].title} description={t.sections[4].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-2">{t.monitor.title}</h3>
            <p className="text-[11px] text-zinc-500 mb-3">{t.monitor.desc}</p>
            <CodeBlock language="java" code={t.monitor.code} />
          </div>
        </Section>

        <Section number={t.sections[5].number} title={t.sections[5].title} description={t.sections[5].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.producer.title}</h3>
            <CodeBlock language="java" code={t.producer.code} />
            <p className="text-[10px] text-zinc-500 italic mt-3">{t.producer.note}</p>
          </div>
        </Section>

        <Section number="07" title={t.pitfalls.title} description="">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.pitfalls.items.map((p) => (
                <div key={p.name} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                  <div className="text-xs font-mono text-amber-300 font-semibold mb-1">⚠ {p.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section number="08" title={t.alternatives.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.alternatives.items.map((a) => (
                <div key={a.name} className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                  <div className="text-xs font-mono text-orange-300 font-semibold mb-1">{a.name}</div>
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
                <span className="text-xs font-mono text-orange-500/50 shrink-0 mt-0.5 min-w-[140px]">{item.label}</span>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
