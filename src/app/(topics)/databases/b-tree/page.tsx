import Link from "next/link";
import BTreeVisualizer from "@/components/btree/BTreeVisualizer";
import BTreeAsPages from "@/components/btree/BTreeAsPages";
import IndexLookupFlow from "@/components/btree/IndexLookupFlow";
import InnoDBInternals from "@/components/btree/InnoDBInternals";
import IndexSARGable from "@/components/btree/IndexSARGable";
import IndexESR from "@/components/btree/IndexESR";

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

export default function BTreePage() {
  return (
    <div className="relative min-h-screen bg-grid-pattern">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(244,63,94,0.05),transparent)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-10">
          <Link href="/" className="hover:text-zinc-400 transition-colors">cs-canvas</Link>
          <span>/</span>
          <Link href="/databases" className="hover:text-zinc-400 transition-colors">databases</Link>
          <span>/</span>
          <span className="text-zinc-400">b-tree index</span>
        </div>

        {/* hero */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-white font-mono mb-4">B-Tree Index</h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-2xl mb-6">
            &quot;검색이 빠르다&quot;는 결과가 아니라 이유를 봅니다.
            B-Tree 구조를 이해하면 인덱스 설계 규칙들이 납득됩니다.
          </p>
          <div className="flex items-center gap-0 text-xs font-mono flex-wrap">
            {["B-Tree 구조", "조회 흐름 & I/O", "SARGable", "ESR 규칙", "Covering Index"].map((label, i, arr) => (
              <span key={label} className="flex items-center">
                <span className="text-zinc-500 px-2 py-1 rounded border border-white/[0.06] bg-white/[0.02]">{label}</span>
                {i < arr.length - 1 && <span className="text-zinc-700 mx-1.5">→</span>}
              </span>
            ))}
          </div>
        </div>

        {/* 01 */}
        <Section
          number="01"
          title="B+Tree 구조 — 삽입과 분열"
          description="차수 3 B+Tree에 값을 삽입합니다. 리프 분열 시 separator를 COPY하므로 실제 데이터는 항상 리프에 남습니다. Internal node의 키는 라우팅용 구분자입니다."
        >
          <BTreeVisualizer />
        </Section>

        {/* 02 */}
        <Section
          number="02"
          title="DB에서의 B+Tree — 노드 = 페이지"
          description="자료구조로서의 B+Tree를 DB가 실제로 구현할 때, 각 노드는 16KB 크기의 페이지(Page)에 매핑됩니다. 루트·브랜치 페이지는 Buffer Pool에 상주하고, 리프 페이지는 디스크에서 읽어 LRU 캐싱됩니다."
        >
          <BTreeAsPages />
        </Section>

        {/* 03 */}
        <Section
          number="03"
          title="InnoDB 내부 구조 — Page · Record · Index"
          description="InnoDB는 16KB 페이지 단위로 디스크를 읽습니다. Secondary Index leaf record는 (인덱스 컬럼 + PK)만 저장하는 직렬화된 byte 배열입니다. 필드명 없이 인덱스 스키마를 기준으로 파싱합니다."
        >
          <InnoDBInternals />
        </Section>

        {/* 04 */}
        <Section
          number="04"
          title="인덱스를 쓰면 내부에서 무슨 일이?"
          description="인덱스 B+Tree와 실제 데이터를 저장하는 Data B+Tree(클러스터드 인덱스)는 별개의 트리입니다. 인덱스 탐색 후 실제 row를 읽으러 가는 과정에서 Random I/O가 발생합니다. Root/Branch는 Buffer Pool에 항상 상주하지만, Leaf는 eviction 대상입니다."
        >
          <IndexLookupFlow />
        </Section>

        {/* 05 */}
        <Section
          number="05"
          title="인덱스가 타는/안 타는 이유 (SARGable)"
          description="B+Tree 탐색은 '시작점'이 확정되어야 합니다. 컬럼에 함수, 앞 와일드카드, 타입 불일치가 있으면 시작점을 알 수 없어 Full Scan으로 빠집니다."
        >
          <IndexSARGable />
        </Section>

        {/* 06 */}
        <Section
          number="06"
          title="복합 인덱스 설계 — ESR 규칙"
          description="인덱스 B+Tree는 왼쪽 컬럼 기준으로 정렬됩니다. Equality(등치)로 먼저 서브트리를 좁히고, Sort로 정렬을 확보하고, Range는 마지막에 둬야 그 뒤 컬럼의 정렬이 유지됩니다."
        >
          <IndexESR />
        </Section>

        {/* 07 */}
        <Section
          number="07"
          title="Covering Index — Table Lookup 제거"
          description="SELECT/WHERE에 필요한 컬럼이 Secondary Index Leaf에 모두 있으면, Clustered Index 접근 자체를 건너뜁니다. Random I/O가 완전히 사라집니다."
        >
          <IndexLookupFlow initialMode="covering" showToggle={true} />
        </Section>

        {/* summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold text-sm font-mono mb-5">한 줄 요약</h3>
          <div className="space-y-3">
            {[
              { num: "01", text: "B+Tree는 왼쪽부터 정렬된 트리. 리프 분열 시 separator COPY — 실제 데이터는 항상 리프에만." },
              { num: "02", text: "DB에서 각 B+Tree 노드 = 16KB 페이지. Root/Branch는 Buffer Pool 상주, Leaf는 Disk에서 LRU 캐싱." },
              { num: "03", text: "InnoDB leaf record는 직렬화된 byte 배열. Secondary는 (인덱스 컬럼 + PK)만, Clustered는 모든 컬럼." },
              { num: "04", text: "Secondary Index leaf(PK 획득)와 Clustered Index leaf(실제 row)는 물리적으로 다른 페이지 → Random I/O. 대량 조회일수록 이 비용이 N배로 누적됨." },
              { num: "05", text: "함수, 앞 와일드카드, 타입 불일치 → B+Tree 시작점 불가 → Full Scan." },
              { num: "06", text: "복합 인덱스는 Equality → Sort → Range 순서. Range 이후 컬럼은 정렬 보장 안 됨." },
              { num: "07", text: "SELECT 컬럼이 Secondary Index에 전부 있으면 Clustered Index 접근 생략 → Using index." },
            ].map((item) => (
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
