"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ConnectionRow {
  proto: string;
  localAddr: string;
  foreignAddr: string;
  state: string;
  timestamp: number;
  isNew?: boolean;
}

const INITIAL_CONNECTIONS: ConnectionRow[] = [
  {
    proto: "TCP",
    localAddr: "0.0.0.0:3000",
    foreignAddr: "0.0.0.0:*",
    state: "LISTEN",
    timestamp: 0,
  },
  {
    proto: "TCP",
    localAddr: "127.0.0.1:3000",
    foreignAddr: "127.0.0.1:52431",
    state: "ESTABLISHED",
    timestamp: 0,
  },
  {
    proto: "TCP",
    localAddr: "192.168.1.10:443",
    foreignAddr: "142.250.196.46:443",
    state: "ESTABLISHED",
    timestamp: 0,
  },
  {
    proto: "TCP",
    localAddr: "192.168.1.10:52832",
    foreignAddr: "52.78.231.108:443",
    state: "TIME_WAIT",
    timestamp: 0,
  },
];

const KO = {
  title: "NETSTAT 라이브 데모",
  subtitle: "netstat -an 으로 현재 네트워크 연결 상태를 확인합니다",
  sendRequest: "🌐 요청 보내기 (fetch)",
  sending: "전송 중...",
  reset: "↺ 리셋",
  proto: "Proto",
  localAddr: "Local Address",
  foreignAddr: "Foreign Address",
  state: "State",
  terminal: "$ netstat -an | grep TCP",
  newConn: "← 새 연결!",
  columns: {
    proto: "프로토콜 (TCP/UDP)",
    local: "로컬 주소:포트 — 내 컴퓨터",
    foreign: "상대 주소:포트 — 접속 대상",
    state: "연결 상태 (LISTEN, ESTABLISHED, TIME_WAIT...)",
  },
  stateExplain: {
    LISTEN: "포트 열고 대기 중 (서버)",
    ESTABLISHED: "양쪽 연결 완료, 데이터 전송 중",
    TIME_WAIT: "연결 종료 후 잔여 패킷 대기",
    SYN_SENT: "연결 요청 보냄, 응답 대기",
    CLOSE_WAIT: "상대방이 종료 요청, 로컬 종료 대기",
  },
  flowTitle: "연결 흐름도",
  whatCanYouSee: "netstat로 무엇을 알 수 있나요?",
  insights: [
    "어떤 프로세스가 어떤 포트를 점유하고 있는지",
    "외부 서버와의 연결 상태 (정상 연결 vs 종료 대기)",
    "비정상적 연결 탐지 (모르는 외부 IP와의 ESTABLISHED)",
    "포트 충돌 디버깅 (이미 LISTEN 중인 포트)",
    "TIME_WAIT 누적 → 포트 고갈 문제 진단",
  ],
};

const EN = {
  title: "NETSTAT Live Demo",
  subtitle: "Use netstat -an to inspect current network connection states",
  sendRequest: "🌐 Send Request (fetch)",
  sending: "Sending...",
  reset: "↺ Reset",
  proto: "Proto",
  localAddr: "Local Address",
  foreignAddr: "Foreign Address",
  state: "State",
  terminal: "$ netstat -an | grep TCP",
  newConn: "← new!",
  columns: {
    proto: "Protocol (TCP/UDP)",
    local: "Local addr:port — your machine",
    foreign: "Foreign addr:port — remote target",
    state: "Connection state (LISTEN, ESTABLISHED, TIME_WAIT...)",
  },
  stateExplain: {
    LISTEN: "Port open, waiting (server)",
    ESTABLISHED: "Both sides connected, data flowing",
    TIME_WAIT: "Connection closed, waiting for stray packets",
    SYN_SENT: "Connection requested, awaiting response",
    CLOSE_WAIT: "Remote closed, local hasn't closed yet",
  },
  flowTitle: "Connection Flow",
  whatCanYouSee: "What can you learn from netstat?",
  insights: [
    "Which process is using which port",
    "Connection status with external servers (healthy vs waiting)",
    "Detect suspicious connections (unknown foreign IPs in ESTABLISHED)",
    "Debug port conflicts (port already in LISTEN)",
    "Diagnose TIME_WAIT accumulation → port exhaustion",
  ],
};

function StateTag({ state }: { state: string }) {
  const colors: Record<string, string> = {
    LISTEN: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    ESTABLISHED: "text-green-400 bg-green-500/10 border-green-500/30",
    TIME_WAIT: "text-zinc-400 bg-zinc-500/10 border-zinc-500/30",
    SYN_SENT: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    CLOSE_WAIT: "text-red-400 bg-red-500/10 border-red-500/30",
  };
  return (
    <span
      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${colors[state] || "text-zinc-400 border-zinc-600"}`}
    >
      {state}
    </span>
  );
}

export default function NetstatLive() {
  const { lang } = useLanguage();
  const t = lang === "ko" ? KO : EN;
  const [connections, setConnections] =
    useState<ConnectionRow[]>(INITIAL_CONNECTIONS);
  const [loading, setLoading] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);

  const sendRequest = useCallback(async () => {
    setLoading(true);
    const localPort = 50000 + Math.floor(Math.random() * 10000);
    const startTime = Date.now();

    // Add SYN_SENT state
    const synRow: ConnectionRow = {
      proto: "TCP",
      localAddr: `127.0.0.1:${localPort}`,
      foreignAddr: "127.0.0.1:3000",
      state: "SYN_SENT",
      timestamp: startTime,
      isNew: true,
    };
    setConnections((prev) => [...prev, synRow]);

    try {
      const res = await fetch("/api/echo");
      await res.json();

      // Update to ESTABLISHED
      setConnections((prev) =>
        prev.map((c) =>
          c.timestamp === startTime
            ? { ...c, state: "ESTABLISHED", isNew: true }
            : { ...c, isNew: false },
        ),
      );

      // After a moment, transition to TIME_WAIT
      setTimeout(() => {
        setConnections((prev) =>
          prev.map((c) =>
            c.timestamp === startTime
              ? { ...c, state: "TIME_WAIT", isNew: false }
              : c,
          ),
        );

        // Then remove after 2s (simulating OS cleanup)
        setTimeout(() => {
          setConnections((prev) =>
            prev.filter((c) => c.timestamp !== startTime),
          );
        }, 2000);
      }, 2000);
    } catch {
      setConnections((prev) =>
        prev.map((c) =>
          c.timestamp === startTime
            ? { ...c, state: "CLOSE_WAIT", isNew: true }
            : { ...c, isNew: false },
        ),
      );
    }

    setLoading(false);
    setFetchCount((c) => c + 1);
  }, []);

  const reset = () => {
    setConnections(INITIAL_CONNECTIONS);
    setFetchCount(0);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      {/* terminal header */}
      <div className="rounded-t-lg border border-zinc-700 bg-zinc-900 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-[10px] font-mono text-zinc-500 ml-2">
          {t.terminal}
        </span>
      </div>

      {/* connection table */}
      <div className="border border-t-0 border-zinc-700 bg-black/40 rounded-b-lg overflow-x-auto mb-5">
        <table className="w-full text-[11px] font-mono">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-3 py-2 text-zinc-600">{t.proto}</th>
              <th className="text-left px-3 py-2 text-zinc-600">
                {t.localAddr}
              </th>
              <th className="text-left px-3 py-2 text-zinc-600">
                {t.foreignAddr}
              </th>
              <th className="text-left px-3 py-2 text-zinc-600">{t.state}</th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {connections.map((conn, i) => (
              <tr
                key={`${conn.localAddr}-${conn.timestamp}-${i}`}
                className={`border-b border-zinc-800/50 transition-all duration-300 ${
                  conn.isNew ? "bg-green-500/5" : ""
                }`}
              >
                <td className="px-3 py-1.5 text-zinc-400">{conn.proto}</td>
                <td className="px-3 py-1.5 text-cyan-400/80">
                  {conn.localAddr}
                </td>
                <td className="px-3 py-1.5 text-zinc-300">
                  {conn.foreignAddr}
                </td>
                <td className="px-3 py-1.5">
                  <StateTag state={conn.state} />
                </td>
                <td className="px-2 py-1.5">
                  {conn.isNew && (
                    <span className="text-[9px] text-green-400 animate-pulse">
                      {t.newConn}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* controls */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={sendRequest}
          disabled={loading}
          className="text-xs font-mono px-4 py-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
        >
          {loading ? t.sending : t.sendRequest}
        </button>
        <button
          onClick={reset}
          className="text-xs font-mono px-3 py-2 rounded-lg border border-zinc-600 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          {t.reset}
        </button>
        {fetchCount > 0 && (
          <span className="text-[10px] font-mono text-zinc-600 self-center">
            {fetchCount} request(s) sent
          </span>
        )}
      </div>

      {/* column explanations */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {Object.entries(t.columns).map(([key, desc]) => (
          <div
            key={key}
            className="rounded-lg border border-white/5 bg-white/[0.02] p-2"
          >
            <div className="text-[9px] font-mono text-zinc-600 mb-0.5">
              {key.toUpperCase()}
            </div>
            <div className="text-[10px] text-zinc-400">{desc}</div>
          </div>
        ))}
      </div>

      {/* state explanations */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 mb-5">
        <h5 className="text-xs font-semibold text-zinc-300 mb-3">
          {t.flowTitle}
        </h5>
        <div className="flex flex-wrap gap-2">
          {Object.entries(t.stateExplain).map(([state, explain]) => (
            <div key={state} className="flex items-center gap-2">
              <StateTag state={state} />
              <span className="text-[10px] text-zinc-500">{explain}</span>
            </div>
          ))}
        </div>
      </div>

      {/* insights */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
        <h5 className="text-xs font-semibold text-zinc-300 mb-3">
          {t.whatCanYouSee}
        </h5>
        <ul className="space-y-1.5">
          {t.insights.map((insight, i) => (
            <li
              key={i}
              className="text-[11px] text-zinc-400 flex items-start gap-2"
            >
              <span className="text-zinc-600 shrink-0">•</span>
              {insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
