"use client";

import Link from "next/link";
import ACIDOverview from "@/components/transactions/ACIDOverview";
import AnomalyTimeline from "@/components/transactions/AnomalyTimeline";
import IsolationLevels from "@/components/transactions/IsolationLevels";
import MVCCInternals from "@/components/transactions/MVCCInternals";
import LockTypes from "@/components/transactions/LockTypes";
import WALCrashRecovery from "@/components/transactions/WALCrashRecovery";
import IsolationDecisionGuide from "@/components/transactions/IsolationDecisionGuide";
import { useLanguage } from "@/contexts/LanguageContext";

const KO = {
  breadcrumb: {
    home: "cs-canvas",
    parent: "databases",
    current: "transactions & ACID",
  },
  hero: {
    title: "Transactions & ACID",
    description:
      '트랜잭션이 "왜" 필요한지부터 InnoDB가 내부에서 어떻게 구현하는지까지. MVCC · Lock · WAL 구조를 이해하면 격리 수준 선택이 납득됩니다.',
    tags: ["ACID", "이상 현상", "격리 수준", "MVCC", "Lock", "WAL"],
  },
  sections: [
    {
      number: "01",
      title: "ACID — 4가지 보장",
      description:
        "ACID는 암기용 두문자어가 아닙니다. 각 속성이 어떤 장애 시나리오를 막기 위해 존재하는지, InnoDB가 내부적으로 어떤 메커니즘으로 구현하는지를 매핑합니다.",
    },
    {
      number: "02",
      title: "동시성 이상 현상 — 왜 격리가 필요한가",
      description:
        "격리 없이 트랜잭션을 동시에 실행하면 세 종류의 이상 현상이 발생합니다. Dirty Read · Non-repeatable Read · Phantom Read의 차이는 '무엇이 달라지는가'에 있습니다.",
    },
    {
      number: "03",
      title: "격리 수준 4단계 — READ UNCOMMITTED → SERIALIZABLE",
      description:
        "격리 수준을 높일수록 더 많은 이상 현상을 막지만, 락 범위가 넓어지고 처리량이 줄어듭니다. MySQL InnoDB 기본값은 REPEATABLE READ, PostgreSQL 기본값은 READ COMMITTED입니다.",
    },
    {
      number: "04",
      title: "InnoDB MVCC 내부 구조",
      description:
        "모든 row에는 숨겨진 컬럼 DB_TRX_ID · DB_ROLL_PTR이 있습니다. 트랜잭션이 시작될 때 Read View를 생성하고, row의 trx_id와 비교해 '내가 볼 수 있는 버전'을 undo log chain에서 찾아냅니다.",
    },
    {
      number: "05",
      title: "Lock 종류 — Row · Gap · Next-Key",
      description:
        "InnoDB의 락은 인덱스 레코드 위에 걸립니다. Row Lock · Gap Lock · Next-Key Lock이 B+Tree 리프에서 어느 범위를 점유하는지, Deadlock이 어떻게 감지되고 해소되는지를 봅니다.",
    },
    {
      number: "06",
      title: "Undo Log · Redo Log · WAL",
      description:
        "Undo log는 '변경 전 값'을 저장해 롤백과 MVCC에 씁니다. Redo log는 '변경 후 값'을 WAL 방식으로 먼저 기록해 크래시 후 복구를 보장합니다. 두 로그의 역할은 정반대입니다.",
    },
    {
      number: "07",
      title: "격리 수준 선택 가이드",
      description:
        "실무에서 격리 수준을 선택할 때 고려해야 할 트레이드오프. 금전 거래 · 리포팅 조회 · 배치 처리 시나리오별 권장 레벨과 흔히 빠지는 함정을 정리합니다.",
    },
  ],
  summary: {
    title: "한 줄 요약",
    items: [
      {
        num: "01",
        text: "A=undo log로 롤백, C=제약 검증, I=MVCC+Lock, D=redo log(WAL). 각 속성마다 구현 메커니즘이 있다.",
      },
      {
        num: "02",
        text: "Dirty=미커밋 읽기, Non-repeatable=같은 row 값 변경, Phantom=집합 크기 변화. 격리가 없으면 셋 다 발생.",
      },
      {
        num: "03",
        text: "RU→RC→RR→SER 순으로 이상현상을 막는다. MySQL 기본값 RR, PostgreSQL 기본값 RC.",
      },
      {
        num: "04",
        text: "MVCC는 Read View(m_ids, up_limit_id, low_limit_id)와 undo chain으로 구현. RR=BEGIN 시 1회, RC=매 SELECT마다 Read View 생성.",
      },
      {
        num: "05",
        text: "Next-Key Lock = Row Lock + Gap Lock. 인덱스 없는 WHERE의 UPDATE는 사실상 테이블 전체 갭락.",
      },
      {
        num: "06",
        text: "WAL: redo log fsync → commit 응답 → dirty page 비동기 flush. 크래시 시 checkpoint 이후 LSN을 redo로 재생.",
      },
      {
        num: "07",
        text: "금전 거래=FOR UPDATE or SER, 리포팅=RC, 배치=RR + 긴 트랜잭션 주의(undo chain 비대화).",
      },
    ],
  },
};

const EN = {
  breadcrumb: {
    home: "cs-canvas",
    parent: "databases",
    current: "transactions & ACID",
  },
  hero: {
    title: "Transactions & ACID",
    description:
      'From why transactions are needed to how InnoDB implements them internally. Understanding MVCC · Lock · WAL makes isolation level choices intuitive.',
    tags: ["ACID", "Anomalies", "Isolation Levels", "MVCC", "Lock", "WAL"],
  },
  sections: [
    {
      number: "01",
      title: "ACID — 4 Guarantees",
      description:
        "ACID is not just a memorization acronym. We map each property to the failure scenario it prevents, and the internal mechanism InnoDB uses to implement it.",
    },
    {
      number: "02",
      title: "Concurrency Anomalies — Why Isolation Matters",
      description:
        "Running transactions concurrently without isolation produces three types of anomalies. The difference between Dirty Read · Non-repeatable Read · Phantom Read lies in 'what changes'.",
    },
    {
      number: "03",
      title: "4 Isolation Levels — READ UNCOMMITTED → SERIALIZABLE",
      description:
        "Higher isolation prevents more anomalies but widens lock scope and reduces throughput. MySQL InnoDB defaults to REPEATABLE READ, PostgreSQL defaults to READ COMMITTED.",
    },
    {
      number: "04",
      title: "InnoDB MVCC Internals",
      description:
        "Every row has hidden columns DB_TRX_ID · DB_ROLL_PTR. When a transaction starts, it creates a Read View and walks the undo log chain comparing trx_id to find the visible version.",
    },
    {
      number: "05",
      title: "Lock Types — Row · Gap · Next-Key",
      description:
        "InnoDB locks are placed on index records. We examine which range of the B+Tree leaf Row Lock · Gap Lock · Next-Key Lock occupies, and how Deadlocks are detected and resolved.",
    },
    {
      number: "06",
      title: "Undo Log · Redo Log · WAL",
      description:
        "Undo log stores the before-image for rollback and MVCC. Redo log records the after-image via WAL to guarantee crash recovery. The two logs serve opposite roles.",
    },
    {
      number: "07",
      title: "Isolation Level Decision Guide",
      description:
        "Trade-offs to consider when choosing an isolation level in production. Recommended levels and common pitfalls for financial transactions · reporting queries · batch processing.",
    },
  ],
  summary: {
    title: "One-liner Summary",
    items: [
      {
        num: "01",
        text: "A=rollback via undo log, C=constraint validation, I=MVCC+Lock, D=redo log(WAL). Each property has a dedicated implementation mechanism.",
      },
      {
        num: "02",
        text: "Dirty=reading uncommitted data, Non-repeatable=same row value changed, Phantom=result set size changed. Without isolation, all three can occur.",
      },
      {
        num: "03",
        text: "RU→RC→RR→SER prevents anomalies in order. MySQL default RR, PostgreSQL default RC.",
      },
      {
        num: "04",
        text: "MVCC implemented via Read View(m_ids, up_limit_id, low_limit_id) and undo chain. RR=1 Read View per BEGIN, RC=new Read View per SELECT.",
      },
      {
        num: "05",
        text: "Next-Key Lock = Row Lock + Gap Lock. UPDATE on non-indexed WHERE is effectively a full table gap lock.",
      },
      {
        num: "06",
        text: "WAL: redo log fsync → commit response → dirty page async flush. On crash, redo replays LSNs after the checkpoint.",
      },
      {
        num: "07",
        text: "Financial=FOR UPDATE or SER, Reporting=RC, Batch=RR + watch out for long transactions (undo chain bloat).",
      },
    ],
  },
};

interface SectionProps {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

function Section({ number, title, description, children }: SectionProps) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-xs font-mono text-rose-500/60">{number}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function TransactionsPage() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;

  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(244,63,94,0.05),transparent)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.home}</Link>
          <span>/</span>
          <Link href="/databases" className="hover:text-zinc-400 transition-colors">{t.breadcrumb.parent}</Link>
          <span>/</span>
          <span className="text-zinc-400">{t.breadcrumb.current}</span>
        </div>

        {/* hero */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-white font-mono mb-4">{t.hero.title}</h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-2xl mb-6">
            {t.hero.description}
          </p>
          <div className="flex items-center gap-0 text-xs font-mono flex-wrap">
            {t.hero.tags.map((label, i, arr) => (
              <span key={label} className="flex items-center">
                <span className="text-zinc-500 px-2 py-1 rounded border border-white/[0.06] bg-white/[0.02]">{label}</span>
                {i < arr.length - 1 && <span className="text-zinc-700 mx-1.5">→</span>}
              </span>
            ))}
          </div>
        </div>

        {t.sections.map((sec, idx) => {
          const components = [
            <ACIDOverview key="acid" />,
            <AnomalyTimeline key="anomaly" />,
            <IsolationLevels key="isolation" />,
            <MVCCInternals key="mvcc" />,
            <LockTypes key="lock" />,
            <WALCrashRecovery key="wal" />,
            <IsolationDecisionGuide key="guide" />,
          ];
          return (
            <Section key={sec.number} number={sec.number} title={sec.title} description={sec.description}>
              {components[idx]}
            </Section>
          );
        })}

        {/* summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold text-sm font-mono mb-5">{t.summary.title}</h3>
          <div className="space-y-3">
            {t.summary.items.map((item) => (
              <div key={item.num} className="flex gap-3 items-start">
                <span className="text-xs font-mono text-rose-500/50 shrink-0 mt-0.5">{item.num}</span>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
