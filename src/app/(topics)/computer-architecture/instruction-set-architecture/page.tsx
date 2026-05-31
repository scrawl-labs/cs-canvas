"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";
import CodeBlock from "@/components/CodeBlock";

const KO = {
  breadcrumb: { home: "cs-canvas", parent: "computer-architecture", current: "instruction set architecture" },
  hero: {
    title: "Instruction Set Architecture (ISA)",
    desc: "CPU와 소프트웨어 사이의 계약 — 어떤 명령어를, 어떤 형식으로, 어떤 레지스터로.\nx86, ARM, RISC-V — 같은 일도 다른 방식으로.",
    tags: ["RISC vs CISC", "x86", "ARM", "RISC-V", "Endianness", "Register"],
  },
  sections: [
    {
      number: "01",
      title: "ISA란 무엇인가",
      desc: "프로그래머가 보는 CPU의 인터페이스. 명령어 형식, 레지스터 종류, 메모리 모델, 데이터 타입을 정의. 같은 ISA면 다른 마이크로아키텍처라도 같은 코드 실행 가능.",
    },
    {
      number: "02",
      title: "RISC vs CISC",
      desc: "RISC (ARM, MIPS, RISC-V): 단순한 명령어, 고정 길이, 많은 레지스터. CISC (x86): 복잡한 명령어, 가변 길이, 적은 레지스터. 현대 x86은 내부적으로 RISC-like micro-op으로 변환.",
    },
    {
      number: "03",
      title: "주요 ISA — x86, ARM, RISC-V",
      desc: "x86 (Intel/AMD): 데스크톱·서버 지배, CISC 계열. ARM: 모바일·서버 부상, RISC. RISC-V: 오픈소스, 학계·임베디드에서 빠른 확산.",
    },
    {
      number: "04",
      title: "명령어 형식과 레지스터",
      desc: "Opcode + Operands. 예: ADD R1, R2, R3 (3-operand RISC). 레지스터 수: x86-64는 16개 GP, ARM64는 31개, RISC-V는 32개. 많을수록 컴파일러가 효율적.",
    },
    {
      number: "05",
      title: "Endianness — Big vs Little",
      desc: "Multi-byte 값을 메모리에 어떻게 저장? Little-endian: 낮은 byte를 낮은 주소에 (x86, ARM 기본). Big-endian: 높은 byte를 낮은 주소에 (네트워크 프로토콜). 통신 시 변환 필요.",
    },
    {
      number: "06",
      title: "확장 — SIMD, 가속기, 도메인 특화",
      desc: "기본 ISA 위에 추가 명령어: SSE/AVX (x86 SIMD), NEON/SVE (ARM SIMD), AES/SHA (암호화), Bfloat16 (AI). 도메인별 가속.",
    },
  ],
  riscVsCisc: {
    title: "RISC vs CISC 비교",
    headers: ["기준", "RISC (ARM, RISC-V)", "CISC (x86)"],
    rows: [
      ["명령어 수", "수십~수백", "수천 (x86은 1000+)"],
      ["명령어 길이", "고정 (32-bit)", "가변 (1-15 byte)"],
      ["복잡도", "단순, 한 사이클", "복잡, 여러 사이클"],
      ["메모리 접근", "Load/Store만", "거의 모든 명령이 메모리 OK"],
      ["레지스터 수", "많음 (32+)", "적음 (16)"],
      ["디코딩", "단순", "복잡 (micro-op 변환)"],
      ["코드 크기", "보통 더 큼", "보통 더 작음"],
      ["전력 효율", "좋음", "역사적으로 나쁨, 개선 중"],
    ],
    note: "현대 x86은 내부적으로 명령어를 micro-op으로 변환해 RISC처럼 실행. 경계가 모호해짐.",
  },
  isaComparison: {
    title: "주요 ISA 비교",
    headers: ["ISA", "타입", "주요 사용처", "라이선스", "비고"],
    rows: [
      ["x86 / x86-64", "CISC", "Desktop, server", "Intel/AMD 특허", "PC 표준, 호환성 강점"],
      ["ARM (AArch32/64)", "RISC", "모바일, IoT, server (AWS Graviton, Apple Silicon)", "라이선싱", "전력 효율, 라이선스 모델"],
      ["RISC-V", "RISC", "임베디드, 학계, 일부 서버", "오픈소스 (BSD)", "확장 자유, 빠르게 성장 중"],
      ["MIPS", "RISC", "네트워크 장비, 임베디드 (감소)", "특허 (만료)", "교육·역사적 중요"],
      ["POWER / PowerPC", "RISC", "IBM 서버, 게임 콘솔 (과거)", "IBM, 일부 개방", "고성능 서버"],
      ["SPARC", "RISC", "Sun/Oracle 서버", "특허", "엔터프라이즈, 쇠퇴"],
    ],
  },
  example: {
    title: "같은 작업을 다른 ISA로 — 두 수 더하기 (a + b → result)",
    items: [
      {
        name: "x86-64 (Intel syntax)",
        code: `mov eax, [a]       ; load a into eax
add eax, [b]       ; eax += b
mov [result], eax  ; store eax to result`,
      },
      {
        name: "ARM64 (AArch64)",
        code: `ldr w0, [x1]       ; load a (x1 holds &a)
ldr w2, [x3]       ; load b (x3 holds &b)
add w0, w0, w2     ; w0 = w0 + w2
str w0, [x4]       ; store to result`,
      },
      {
        name: "RISC-V",
        code: `lw  t0, 0(s0)      ; load a
lw  t1, 0(s1)      ; load b
add t2, t0, t1     ; t2 = t0 + t1
sw  t2, 0(s2)      ; store to result`,
      },
    ],
    note: "RISC 계열은 Load/Store가 분리되어 있고 명령어 길이가 일정 (32-bit). x86은 단일 명령으로 메모리 접근까지 가능하지만 길이는 가변.",
  },
  endianness: {
    title: "Endianness 시각화 — 32-bit 정수 0x12345678",
    diagram: `메모리 주소:    0x100  0x101  0x102  0x103
Little-endian:  0x78   0x56   0x34   0x12   ← x86, ARM 기본
Big-endian:     0x12   0x34   0x56   0x78   ← 네트워크 byte order`,
    note: "TCP/IP 헤더는 항상 big-endian. htons(), ntohl() 같은 변환 함수가 필요한 이유.",
  },
  registers: {
    title: "레지스터 분류",
    items: [
      { name: "General Purpose (GP)", desc: "범용. 정수, 주소, 임시 값. x86-64는 16개 (rax, rbx, ...), ARM64는 31개." },
      { name: "Floating Point (FP)", desc: "부동소수점 전용. SSE/AVX는 128/256/512-bit. ARM은 32개 V 레지스터." },
      { name: "Vector / SIMD", desc: "여러 데이터 동시 처리. AVX-512는 32×512-bit. NEON, SVE." },
      { name: "Special Purpose", desc: "PC (Program Counter), SP (Stack Pointer), FLAGS (조건 비트). CPU 내부 상태." },
      { name: "Control / System", desc: "권한 모드, 페이지 테이블 베이스, 인터럽트 마스크 등. OS만 접근 가능." },
    ],
  },
  abi: {
    title: "ABI — Application Binary Interface",
    desc: "함수 호출 규약, 레지스터 사용 규칙, 스택 레이아웃 등. ISA가 같아도 ABI 다르면 호환 불가.",
    items: [
      { name: "호출 규약 (Calling Convention)", desc: "인자 어디로 전달? 반환값 어디에? x86-64 System V: 첫 6개 정수 인자는 rdi, rsi, rdx, rcx, r8, r9." },
      { name: "Caller-saved vs Callee-saved", desc: "호출 전/후 누가 레지스터 보존 책임?" },
      { name: "Stack alignment", desc: "함수 진입 시 16-byte 정렬 등." },
      { name: "Linkage", desc: "Symbol naming, exception handling, dynamic linking 형식." },
    ],
  },
  summary: {
    title: "핵심 개념 정리",
    items: [
      { label: "ISA", text: "CPU와 SW 사이 계약. 명령어·레지스터·메모리 모델. 같은 ISA = 같은 코드 실행." },
      { label: "RISC", text: "단순 명령어, 고정 길이, 많은 레지스터. ARM, RISC-V, MIPS." },
      { label: "CISC", text: "복잡 명령어, 가변 길이. x86 — 현대는 내부에서 RISC-like micro-op으로 분해." },
      { label: "x86", text: "데스크톱·서버 지배. 호환성 강력. 전력 효율 개선 중." },
      { label: "ARM", text: "모바일 표준. 서버로 확장 중 (Graviton, Apple Silicon). 라이선스 모델." },
      { label: "RISC-V", text: "오픈소스 ISA. 확장 자유. 임베디드부터 서버까지 빠르게 성장." },
      { label: "Endianness", text: "Little (x86/ARM 기본) vs Big (네트워크). 통신 시 변환 필요." },
      { label: "ABI", text: "ISA 외 호출 규약·레지스터 사용. 같은 ISA여도 ABI 다르면 binary 호환 X." },
    ],
  },
};

const EN = {
  breadcrumb: { home: "cs-canvas", parent: "computer-architecture", current: "instruction set architecture" },
  hero: {
    title: "Instruction Set Architecture (ISA)",
    desc: "The contract between CPU and software — which instructions, what formats, which registers.\nx86, ARM, RISC-V — different ways to do the same job.",
    tags: ["RISC vs CISC", "x86", "ARM", "RISC-V", "Endianness", "Registers"],
  },
  sections: [
    {
      number: "01",
      title: "What is an ISA",
      desc: "The CPU interface seen by programmers. Defines instruction formats, registers, memory model, data types. Same ISA → same code runs across different microarchitectures.",
    },
    {
      number: "02",
      title: "RISC vs CISC",
      desc: "RISC (ARM, MIPS, RISC-V): simple, fixed-length instructions, many registers. CISC (x86): complex, variable-length, fewer registers. Modern x86 internally translates to RISC-like micro-ops.",
    },
    {
      number: "03",
      title: "Major ISAs — x86, ARM, RISC-V",
      desc: "x86 (Intel/AMD): dominates desktop/server, CISC. ARM: mobile and now servers (RISC). RISC-V: open source, growing fast in academia and embedded.",
    },
    {
      number: "04",
      title: "Instruction Format and Registers",
      desc: "Opcode + Operands. e.g., ADD R1, R2, R3 (3-operand RISC). Register counts: x86-64 has 16 GP, ARM64 has 31, RISC-V has 32. More → better compiler scheduling.",
    },
    {
      number: "05",
      title: "Endianness — Big vs Little",
      desc: "How are multi-byte values laid out in memory? Little-endian: low byte at low address (x86, ARM default). Big-endian: high byte at low address (network byte order). Conversion required for I/O.",
    },
    {
      number: "06",
      title: "Extensions — SIMD, Accelerators, Domain Specific",
      desc: "On top of the base ISA: SSE/AVX (x86 SIMD), NEON/SVE (ARM SIMD), AES/SHA (crypto), Bfloat16 (AI). Domain-specific accelerators.",
    },
  ],
  riscVsCisc: {
    title: "RISC vs CISC",
    headers: ["Criterion", "RISC (ARM, RISC-V)", "CISC (x86)"],
    rows: [
      ["Instruction count", "Tens to hundreds", "Thousands (x86 has 1000+)"],
      ["Instruction length", "Fixed (32-bit)", "Variable (1-15 bytes)"],
      ["Complexity", "Simple, single-cycle", "Complex, multi-cycle"],
      ["Memory access", "Load/Store only", "Almost any instruction can touch memory"],
      ["Registers", "Many (32+)", "Fewer (16)"],
      ["Decoding", "Simple", "Complex (micro-op translation)"],
      ["Code size", "Larger", "Smaller"],
      ["Power efficiency", "Good", "Historically poor; improving"],
    ],
    note: "Modern x86 decodes to micro-ops and runs them like RISC. The line is blurry now.",
  },
  isaComparison: {
    title: "Major ISA Comparison",
    headers: ["ISA", "Type", "Where used", "License", "Notes"],
    rows: [
      ["x86 / x86-64", "CISC", "Desktop, server", "Intel/AMD patents", "PC standard, strong compatibility"],
      ["ARM (AArch32/64)", "RISC", "Mobile, IoT, server (AWS Graviton, Apple Silicon)", "License", "Power efficient, licensing business model"],
      ["RISC-V", "RISC", "Embedded, academia, some servers", "Open source (BSD)", "Free to extend, growing fast"],
      ["MIPS", "RISC", "Networking, embedded (declining)", "Patents (expired)", "Education / historical"],
      ["POWER / PowerPC", "RISC", "IBM servers, game consoles (past)", "IBM, partially open", "High-end servers"],
      ["SPARC", "RISC", "Sun/Oracle servers", "Patent", "Enterprise, declining"],
    ],
  },
  example: {
    title: "Same Job, Different ISAs — a + b → result",
    items: [
      {
        name: "x86-64 (Intel syntax)",
        code: `mov eax, [a]       ; load a into eax
add eax, [b]       ; eax += b
mov [result], eax  ; store eax to result`,
      },
      {
        name: "ARM64 (AArch64)",
        code: `ldr w0, [x1]       ; load a (x1 holds &a)
ldr w2, [x3]       ; load b (x3 holds &b)
add w0, w0, w2     ; w0 = w0 + w2
str w0, [x4]       ; store to result`,
      },
      {
        name: "RISC-V",
        code: `lw  t0, 0(s0)      ; load a
lw  t1, 0(s1)      ; load b
add t2, t0, t1     ; t2 = t0 + t1
sw  t2, 0(s2)      ; store to result`,
      },
    ],
    note: "RISC ISAs separate Load/Store from arithmetic, with fixed 32-bit instruction length. x86 packs memory access into a single instruction but is variable-length.",
  },
  endianness: {
    title: "Endianness — 32-bit integer 0x12345678",
    diagram: `Memory address: 0x100  0x101  0x102  0x103
Little-endian:  0x78   0x56   0x34   0x12   ← x86, ARM default
Big-endian:     0x12   0x34   0x56   0x78   ← network byte order`,
    note: "TCP/IP headers are always big-endian. That's why htons() and ntohl() exist.",
  },
  registers: {
    title: "Register Categories",
    items: [
      { name: "General Purpose (GP)", desc: "Integer values, addresses, temporaries. x86-64 has 16 (rax, rbx, ...). ARM64 has 31." },
      { name: "Floating Point (FP)", desc: "Float-only registers. SSE/AVX 128/256/512-bit. ARM has 32 V registers." },
      { name: "Vector / SIMD", desc: "Parallel data lanes. AVX-512 has 32×512-bit. NEON, SVE." },
      { name: "Special Purpose", desc: "PC (program counter), SP (stack pointer), FLAGS. CPU's internal state." },
      { name: "Control / System", desc: "Privilege mode, page table base, interrupt mask, etc. OS-only access." },
    ],
  },
  abi: {
    title: "ABI — Application Binary Interface",
    desc: "Calling convention, register usage rules, stack layout. Same ISA but different ABI = no binary compatibility.",
    items: [
      { name: "Calling Convention", desc: "Where do arguments go? Where is the return value? x86-64 System V: first 6 integer args via rdi, rsi, rdx, rcx, r8, r9." },
      { name: "Caller-saved vs Callee-saved", desc: "Whose responsibility is it to preserve a register across a call?" },
      { name: "Stack alignment", desc: "16-byte aligned on function entry, etc." },
      { name: "Linkage", desc: "Symbol naming, exception handling, dynamic linking format." },
    ],
  },
  summary: {
    title: "Key Concepts",
    items: [
      { label: "ISA", text: "Contract between CPU and SW. Instructions, registers, memory model. Same ISA → same code." },
      { label: "RISC", text: "Simple, fixed-length, many registers. ARM, RISC-V, MIPS." },
      { label: "CISC", text: "Complex, variable-length. x86 — now decodes to RISC-like micro-ops internally." },
      { label: "x86", text: "Dominates desktop/server. Strong compatibility. Power efficiency improving." },
      { label: "ARM", text: "Mobile standard, expanding into servers (Graviton, Apple Silicon). Licensing model." },
      { label: "RISC-V", text: "Open-source ISA. Free to extend. Embedded → server in years." },
      { label: "Endianness", text: "Little (x86/ARM default) vs Big (network). Convert at boundaries." },
      { label: "ABI", text: "Beyond ISA — calling conventions and register usage. Same ISA + different ABI = no binary compat." },
    ],
  },
};

interface SectionProps { number: string; title: string; description: string; children: ReactNode; }
function Section({ number, title, description, children }: SectionProps) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-xs font-mono text-slate-400/60">{number}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function ISAPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;
  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(148,163,184,0.06),transparent)]" />
      <div className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.home}</Link>
          <span>/</span>
          <Link href="/computer-architecture" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.parent}</Link>
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
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.riscVsCisc.title}</h3>
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {t.riscVsCisc.headers.map((h, i) => (
                    <th key={i} className={`text-left py-2 ${i === 0 ? "text-zinc-600 w-32" : i === 1 ? "text-emerald-400" : "text-amber-400"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.riscVsCisc.rows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="py-2 text-zinc-500">{row[0]}</td>
                    <td className="py-2 text-emerald-300/80">{row[1]}</td>
                    <td className="py-2 text-amber-300/80">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-zinc-500 italic mt-3">{t.riscVsCisc.note}</p>
          </div>
        </Section>

        <Section number={t.sections[2].number} title={t.sections[2].title} description={t.sections[2].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.isaComparison.title}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] font-mono">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {t.isaComparison.headers.map((h, i) => (
                      <th key={i} className={`text-left py-2 pr-3 ${i === 0 ? "text-slate-400" : "text-zinc-500"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.isaComparison.rows.map((row, i) => (
                    <tr key={i} className="border-b border-zinc-800/50">
                      {row.map((cell, j) => (
                        <td key={j} className={`py-2 pr-3 ${j === 0 ? "text-slate-300/80 font-semibold" : "text-zinc-400 text-[10px]"}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        <Section number={t.sections[3].number} title={t.sections[3].title} description={t.sections[3].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.example.title}</h3>
            <div className="space-y-3 mb-3">
              {t.example.items.map((e) => (
                <div key={e.name} className="rounded-lg border border-slate-500/20 bg-slate-500/5 p-3">
                  <div className="text-xs font-mono text-slate-300 font-semibold mb-2">{e.name}</div>
                  <CodeBlock language="asm" code={e.code} showHeader={false} />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500 italic">{t.example.note}</p>
          </div>
        </Section>

        <Section number={t.sections[4].number} title={t.sections[4].title} description={t.sections[4].desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-xs font-mono text-zinc-400 mb-3">{t.endianness.title}</h3>
            <pre className="text-[11px] font-mono text-slate-300/80 whitespace-pre leading-relaxed bg-zinc-900/30 p-3 rounded">{t.endianness.diagram}</pre>
            <p className="text-[10px] text-zinc-500 italic mt-3">{t.endianness.note}</p>
          </div>
        </Section>

        <Section number="05" title={t.registers.title} description="">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="space-y-2">
              {t.registers.items.map((r) => (
                <div key={r.name} className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                  <div className="text-xs font-mono text-slate-300 font-semibold mb-1">{r.name}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section number="06" title={t.abi.title} description={t.abi.desc}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="space-y-2">
              {t.abi.items.map((a) => (
                <div key={a.name} className="rounded-lg border border-zinc-700/40 bg-zinc-900/30 p-3">
                  <div className="text-xs font-mono text-slate-300 font-semibold mb-1">{a.name}</div>
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
                <span className="text-xs font-mono text-slate-400/60 shrink-0 mt-0.5 min-w-[140px]">{item.label}</span>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
