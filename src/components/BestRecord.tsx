"use client";

import { useSyncExternalStore } from "react";
import { getTopScores } from "@/lib/leaderboard";
import type { Game } from "@/lib/games";

const fmt = (value: number, unit: Game["unit"]) => {
  if (unit === "초") {
    const m = Math.floor(value / 60);
    const s = String(value % 60).padStart(2, "0");
    return m > 0 ? `${m}분 ${s}초` : `${value}초`;
  }
  if (unit === "ms") return `${value}ms`;
  return `${value}${unit ?? ""}`;
};

// 다른 탭에서 기록이 바뀌면 다시 읽는다.
const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};

function readBest(records: NonNullable<Game["records"]>, unit: Game["unit"]) {
  for (const r of records) {
    const top = getTopScores(r.key)[0];
    if (top) return `${r.label ? `${r.label} ` : ""}${fmt(top.value, unit)}`;
  }
  return "";
}

/**
 * 게임 카드의 "내 최고 기록". 순위표는 브라우저마다 따로 저장되므로
 * 서버에서는 비워 두고, 화면에 붙은 뒤에 읽어 온다.
 */
export default function BestRecord({
  records,
  unit,
}: {
  records: NonNullable<Game["records"]>;
  unit: Game["unit"];
}) {
  // 서버에서는 undefined(아직 모름), 브라우저에서는 기록 글자 또는 ""(기록 없음).
  const best = useSyncExternalStore(
    subscribe,
    () => readBest(records, unit),
    () => undefined,
  );

  // 읽기 전에는 자리만 잡아 둬서 카드 높이가 흔들리지 않게 한다.
  if (best === undefined) return <span className="h-5" aria-hidden />;

  return (
    <span className="text-xs text-foreground/75">
      {best ? (
        <>
          내 최고 기록{" "}
          <span className="tabular font-bold text-foreground">{best}</span>
        </>
      ) : (
        "아직 기록이 없어요"
      )}
    </span>
  );
}
