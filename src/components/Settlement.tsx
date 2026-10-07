"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toBlob } from "html-to-image";

type Kind = "income" | "expense";
type Day = 1 | 2;

type Member = { id: string; name: string };

type Entry = {
  id: string;
  kind: Kind;
  // 지출 항목만 일차 구분이 있음
  day?: Day;
  label: string;
  amount: number;
  note: string;
  // 기본 항목은 삭제할 수 없음
  fixed: boolean;
  // 지출: 1/n 대상에서 빠지는 사람들. 비어 있으면 참석자 전원이 대상.
  excludedIds: string[];
  // 수입: 선택한 사람만 대상.
  includedIds: string[];
  // 서브실수: 사람별 실수 횟수
  counts: Record<string, number>;
};

type SettlementData = {
  title: string;
  date: string;
  members: Member[];
  entries: Entry[];
  roundUnit: number;
  account: string;
  accountName: string;
};

const STORAGE_KEY = "volleyball-settlement";

const DAYS = [1, 2] as const;
const INCOME_LABELS = ["참가비", "회비지원", "서브실수", "개인찬조"];
const EXPENSE_LABELS = ["차량지원", "간식비", "식비", "회식비"];

// 서브실수는 금액을 직접 넣지 않고 사람별 횟수 × 벌금으로 계산한다
const SERVE_ID = "fixed:income:서브실수";
const SERVE_FINE = 10000;

function newEntry(fields: Pick<Entry, "id" | "kind" | "label" | "fixed" | "day">): Entry {
  return { amount: 0, note: "", excludedIds: [], includedIds: [], counts: {}, ...fields };
}

const DEFAULT_ENTRIES: Entry[] = [
  ...INCOME_LABELS.map((label) =>
    newEntry({ id: `fixed:income:${label}`, kind: "income", label, fixed: true })
  ),
  ...DAYS.flatMap((day) =>
    EXPENSE_LABELS.map((label) =>
      newEntry({ id: `fixed:expense:${day}:${label}`, kind: "expense", day, label, fixed: true })
    )
  ),
];

const EMPTY: SettlementData = {
  title: "",
  date: "",
  members: [],
  entries: DEFAULT_ENTRIES,
  roundUnit: 10,
  account: "",
  accountName: "",
};

// 저장된 데이터에 기본 항목이 빠져 있거나 예전 형식이어도 맞춰서 불러온다
function normalize(saved: Partial<SettlementData>): SettlementData {
  const savedEntries = (saved.entries ?? []).map((e) => {
    const entry: Entry = { ...newEntry(e), ...e };
    // 일차 구분이 없던 예전 지출 항목은 1일차로
    if (entry.kind === "expense" && !entry.day) {
      entry.day = 1;
      if (entry.fixed) entry.id = `fixed:expense:1:${entry.label}`;
    }
    return entry;
  });
  const byId = new Map(savedEntries.map((e) => [e.id, e]));
  return {
    ...EMPTY,
    ...saved,
    entries: [
      ...DEFAULT_ENTRIES.map((d) => byId.get(d.id) ?? d),
      ...savedEntries.filter((e) => !e.fixed),
    ],
  };
}

function won(n: number) {
  return `${Math.round(n).toLocaleString("ko-KR")}원`;
}

function parseAmount(text: string) {
  return Number(text.replace(/[^\d]/g, "")) || 0;
}

function roundTo(n: number, unit: number) {
  return Math.round(n / unit) * unit;
}

function targetsOf(entry: Entry, members: Member[]) {
  return entry.kind === "expense"
    ? members.filter((m) => !entry.excludedIds.includes(m.id))
    : members.filter((m) => entry.includedIds.includes(m.id));
}

function serveCountOf(entry: Entry, memberId: string) {
  return entry.counts[memberId] ?? 1;
}

function amountOf(entry: Entry) {
  if (entry.id !== SERVE_ID) return entry.amount;
  return entry.includedIds.reduce((sum, id) => sum + serveCountOf(entry, id), 0) * SERVE_FINE;
}

function calculate(data: SettlementData) {
  const totals: Record<Kind, number> = { income: 0, expense: 0 };
  const dayTotals: Record<Day, number> = { 1: 0, 2: 0 };
  const shares = new Map<string, { label: string; amount: number }[]>(
    data.members.map((m) => [m.id, []])
  );

  for (const entry of data.entries) {
    const amount = amountOf(entry);
    if (amount === 0) continue;
    totals[entry.kind] += amount;
    if (entry.kind === "income") continue;

    const day = entry.day ?? 1;
    dayTotals[day] += amount;
    const targets = targetsOf(entry, data.members);
    for (const m of targets) {
      shares.get(m.id)!.push({
        label: `${day}일차 ${entry.label}`,
        amount: amount / targets.length,
      });
    }
  }

  // 수입은 참석자 전원에게 똑같이 나눠 각자의 지출 분담액에서 뺀다
  const incomeShare = data.members.length > 0 ? totals.income / data.members.length : 0;

  const rows = data.members.map((m) => {
    const items = shares.get(m.id)!;
    const expense = items.reduce((sum, item) => sum + item.amount, 0);
    return {
      ...m,
      items,
      expense,
      amount: roundTo(expense - incomeShare, data.roundUnit),
    };
  });
  return { totals, dayTotals, incomeShare, rows, net: totals.expense - totals.income };
}

function accountText(data: SettlementData) {
  if (!data.account) return "";
  return data.accountName ? `${data.account} (${data.accountName})` : data.account;
}

function describe(amount: number) {
  if (amount > 0) return `${won(amount)} 입금`;
  if (amount < 0) return `${won(-amount)} 환급`;
  return "정산 없음";
}

const inputClass =
  "rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none";
const cardClass = "min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-6";
const buttonClass =
  "rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40";
const stepperClass =
  "flex h-7 w-7 items-center justify-center rounded-full border border-border text-sm text-foreground hover:border-accent disabled:opacity-40";

type EntryActions = {
  onUpdate: (id: string, patch: Partial<Entry>) => void;
  onRemove: (id: string) => void;
  onToggleTarget: (entryId: string, memberId: string) => void;
};

function EntryList({
  entries,
  members,
  addPlaceholder,
  onAdd,
  onUpdate,
  onRemove,
  onToggleTarget,
}: {
  entries: Entry[];
  members: Member[];
  addPlaceholder: string;
  onAdd: (label: string) => void;
} & EntryActions) {
  const [newLabel, setNewLabel] = useState("");
  const [openEntryId, setOpenEntryId] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!newLabel.trim()) return;
    onAdd(newLabel.trim());
    setNewLabel("");
  }

  return (
    <>
      <ul className="flex flex-col divide-y divide-border">
        {entries.map((entry) => {
          const isServe = entry.id === SERVE_ID;
          const targets = targetsOf(entry, members);
          const open = openEntryId === entry.id;
          const targetLabel =
            entry.kind === "expense" && targets.length === members.length
              ? "대상 전원"
              : targets.length === 0
                ? "대상 선택"
                : `대상 ${targets.length}명`;
          return (
            <li key={entry.id} className="flex flex-col gap-2 py-3">
              <div className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {entry.label}
                </span>
                {isServe ? (
                  <span className="w-28 px-3 text-right text-sm font-semibold tabular-nums text-foreground">
                    {amountOf(entry).toLocaleString("ko-KR")}
                  </span>
                ) : (
                  <input
                    value={entry.amount ? entry.amount.toLocaleString("ko-KR") : ""}
                    onChange={(e) => onUpdate(entry.id, { amount: parseAmount(e.target.value) })}
                    inputMode="numeric"
                    placeholder="0"
                    aria-label={`${entry.label} 금액`}
                    className={`${inputClass} w-28 text-right tabular-nums`}
                  />
                )}
                <span className="text-sm text-muted">원</span>
                <button
                  onClick={() => onRemove(entry.id)}
                  aria-label={`${entry.label} 삭제`}
                  className={`w-4 text-muted hover:text-foreground ${entry.fixed ? "invisible" : ""}`}
                >
                  ×
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={entry.note}
                  onChange={(e) => onUpdate(entry.id, { note: e.target.value })}
                  placeholder="비고"
                  aria-label={`${entry.label} 비고`}
                  className={`${inputClass} min-w-0 flex-1 py-1.5 text-xs`}
                />
                {members.length > 0 && (
                  <button
                    onClick={() => setOpenEntryId(open ? null : entry.id)}
                    className="shrink-0 text-xs text-muted hover:text-foreground"
                  >
                    {targetLabel} {open ? "▲" : "▼"}
                  </button>
                )}
              </div>
              {open && (
                <div className="flex flex-wrap gap-2">
                  {members.map((m) => {
                    const included = targets.includes(m);
                    return (
                      <button
                        key={m.id}
                        onClick={() => onToggleTarget(entry.id, m.id)}
                        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                          included
                            ? "border-accent bg-accent-soft text-foreground"
                            : entry.kind === "expense"
                              ? "border-border text-muted line-through"
                              : "border-border text-muted"
                        }`}
                      >
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              )}
              {isServe && targets.length > 0 && (
                <ul className="flex flex-col gap-1.5 rounded-xl bg-background p-3">
                  {targets.map((m) => {
                    const count = serveCountOf(entry, m.id);
                    const setCount = (n: number) =>
                      onUpdate(entry.id, { counts: { ...entry.counts, [m.id]: n } });
                    return (
                      <li key={m.id} className="flex items-center gap-2 text-sm">
                        <span className="min-w-0 flex-1 truncate text-foreground">{m.name}</span>
                        <button
                          onClick={() => setCount(count - 1)}
                          disabled={count <= 1}
                          aria-label={`${m.name} 서브실수 줄이기`}
                          className={stepperClass}
                        >
                          −
                        </button>
                        <span className="w-8 text-center tabular-nums text-foreground">
                          {count}회
                        </span>
                        <button
                          onClick={() => setCount(count + 1)}
                          aria-label={`${m.name} 서브실수 늘리기`}
                          className={stepperClass}
                        >
                          +
                        </button>
                        <span className="w-20 text-right tabular-nums text-muted">
                          {won(count * SERVE_FINE)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder={addPlaceholder}
          className={`${inputClass} min-w-0 flex-1`}
        />
        <button type="submit" className={buttonClass}>
          추가
        </button>
      </form>
    </>
  );
}

function BreakdownList({ entries, members }: { entries: Entry[]; members: Member[] }) {
  if (entries.length === 0) return <p className="mt-2 text-xs text-foreground/70">내역 없음</p>;
  return (
    <ul className="mt-2 flex flex-col gap-1">
      {entries.map((entry) => {
        const details: string[] = [];
        if (entry.id === SERVE_ID) {
          const names = targetsOf(entry, members).map(
            (m) => `${m.name} ${serveCountOf(entry, m.id)}회`
          );
          if (names.length > 0) details.push(names.join(", "));
        }
        if (entry.note) details.push(entry.note);
        return (
          <li key={entry.id} className="flex items-baseline justify-between gap-3 text-xs">
            <span className="min-w-0 text-foreground">
              {entry.label}
              {details.length > 0 && (
                <span className="text-foreground/70"> · {details.join(" · ")}</span>
              )}
            </span>
            <span className="shrink-0 tabular-nums text-foreground">{won(amountOf(entry))}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default function Settlement() {
  const [data, setData] = useState<SettlementData>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [memberInput, setMemberInput] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const resultRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setData(normalize(JSON.parse(saved)));
    } catch {
      // 저장된 값이 깨졌으면 빈 상태로 시작
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, loaded]);

  // 오프라인에서도 열리도록 서비스 워커 등록 (개발 서버에서는 캐시가 방해돼서 제외)
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/settlement-sw.js", { scope: "/settlement" });
    }
  }, []);

  const result = useMemo(() => calculate(data), [data]);

  function addMembers(e: React.FormEvent) {
    e.preventDefault();
    // "김민지, 이서연 박지우"처럼 한 번에 여러 명 입력 가능
    const existing = new Set(data.members.map((m) => m.name));
    const added: Member[] = [];
    for (const name of memberInput.split(/[,\s]+/).filter(Boolean)) {
      if (existing.has(name)) continue;
      existing.add(name);
      added.push({ id: crypto.randomUUID(), name });
    }
    if (added.length > 0) setData({ ...data, members: [...data.members, ...added] });
    setMemberInput("");
  }

  function removeMember(id: string) {
    setData({
      ...data,
      members: data.members.filter((m) => m.id !== id),
      entries: data.entries.map((e) => ({
        ...e,
        excludedIds: e.excludedIds.filter((x) => x !== id),
        includedIds: e.includedIds.filter((x) => x !== id),
      })),
    });
  }

  function addEntry(kind: Kind, label: string, day?: Day) {
    const entry = newEntry({ id: crypto.randomUUID(), kind, day, label, fixed: false });
    setData({ ...data, entries: [...data.entries, entry] });
  }

  function updateEntry(id: string, patch: Partial<Entry>) {
    setData({
      ...data,
      entries: data.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  }

  function removeEntry(id: string) {
    setData({ ...data, entries: data.entries.filter((e) => e.id !== id) });
  }

  function toggleTarget(entryId: string, memberId: string) {
    const toggle = (ids: string[]) =>
      ids.includes(memberId) ? ids.filter((x) => x !== memberId) : [...ids, memberId];
    setData({
      ...data,
      entries: data.entries.map((e) => {
        if (e.id !== entryId) return e;
        return e.kind === "expense"
          ? { ...e, excludedIds: toggle(e.excludedIds) }
          : { ...e, includedIds: toggle(e.includedIds) };
      }),
    });
  }

  function reset() {
    if (!confirm("입력한 내용을 모두 지울까요?")) return;
    setData(EMPTY);
  }

  function downloadImage(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  // 정산 결과 카드를 이미지로 만들어, 휴대폰에서는 공유 시트로 보내고
  // PC에서는 클립보드에 복사한다. 둘 다 안 되면 파일로 저장한다.
  async function shareImage() {
    const node = resultRef.current;
    if (!node) return;
    setShareStatus("이미지 만드는 중…");
    let message = "";
    try {
      const blob = await toBlob(node, {
        pixelRatio: 2,
        backgroundColor: getComputedStyle(node).backgroundColor,
        filter: (n) => !(n instanceof HTMLElement && "noCapture" in n.dataset),
      });
      if (!blob) throw new Error("capture failed");
      const filename = `${data.title || "대회"} 정산.png`;
      const file = new File([blob], filename, { type: "image/png" });
      // 폴드·태블릿은 브라우저가 PC인 척하는 경우가 있어서 기기 이름 대신 터치 화면인지로 구분한다
      const isTouch = window.matchMedia("(pointer: coarse)").matches;

      try {
        if (isTouch && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file] });
        } else {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          message = "복사됐어요! 카톡에 붙여넣기 하세요";
        }
      } catch (err) {
        // 공유 시트를 그냥 닫은 경우는 아무것도 하지 않는다
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          downloadImage(blob, filename);
          message = "이미지 파일로 저장했어요";
        }
      }
    } catch {
      message = "이미지를 만들지 못했어요";
    }
    setShareStatus(message);
    if (message) setTimeout(() => setShareStatus(""), 3000);
  }

  // 정산 결과에는 금액이 들어간 항목만 보여준다
  const usedEntries = data.entries.filter((e) => amountOf(e) > 0);
  const usedExpenseDays = DAYS.filter((day) => result.dayTotals[day] > 0);

  const entryActions: EntryActions = {
    onUpdate: updateEntry,
    onRemove: removeEntry,
    onToggleTarget: toggleTarget,
  };

  return (
    <div className="flex flex-col gap-6">
      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-foreground">대회 정보</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="대회명 (예: 10월 구청장배)"
            className={`${inputClass} flex-1`}
          />
          <input
            type="date"
            value={data.date}
            onChange={(e) => setData({ ...data, date: e.target.value })}
            className={inputClass}
          />
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-foreground">
          참석 명단 <span className="text-sm font-normal text-muted">{data.members.length}명</span>
        </h2>
        <form onSubmit={addMembers} className="mt-4 flex gap-2">
          <input
            value={memberInput}
            onChange={(e) => setMemberInput(e.target.value)}
            placeholder="이름 (쉼표나 띄어쓰기로 여러 명)"
            className={`${inputClass} min-w-0 flex-1`}
          />
          <button type="submit" className={buttonClass}>
            추가
          </button>
        </form>
        {data.members.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {data.members.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-1.5 rounded-full bg-accent-soft py-1 pl-3 pr-2 text-sm text-foreground"
              >
                {m.name}
                <button
                  onClick={() => removeMember(m.id)}
                  aria-label={`${m.name} 삭제`}
                  className="text-muted hover:text-foreground"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid items-start gap-6 md:grid-cols-2">
        <section className={cardClass}>
          <div className="mb-1 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">수입</h2>
            <span className="rounded-full bg-mint px-3 py-1 text-sm font-semibold tabular-nums text-foreground">
              {won(result.totals.income)}
            </span>
          </div>
          <EntryList
            entries={data.entries.filter((e) => e.kind === "income")}
            members={data.members}
            addPlaceholder="수입 항목 추가"
            onAdd={(label) => addEntry("income", label)}
            {...entryActions}
          />
        </section>

        <section className={cardClass}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">지출</h2>
            <span className="rounded-full bg-pink px-3 py-1 text-sm font-semibold tabular-nums text-foreground">
              {won(result.totals.expense)}
            </span>
          </div>
          {DAYS.map((day) => (
            <div key={day} className="mt-5">
              <div className="flex items-center justify-between rounded-xl bg-background px-3 py-2">
                <h3 className="text-sm font-semibold text-foreground">{day}일차</h3>
                <span className="text-sm tabular-nums text-muted">
                  {won(result.dayTotals[day])}
                </span>
              </div>
              <EntryList
                entries={data.entries.filter((e) => e.kind === "expense" && e.day === day)}
                members={data.members}
                addPlaceholder={`${day}일차 지출 항목 추가`}
                onAdd={(label) => addEntry("expense", label, day)}
                {...entryActions}
              />
            </div>
          ))}
        </section>
      </div>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-foreground">입금계좌</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={data.account}
            onChange={(e) => setData({ ...data, account: e.target.value })}
            placeholder="입금계좌 (예: OO은행 123-456-789012)"
            className={`${inputClass} flex-1`}
          />
          <input
            value={data.accountName}
            onChange={(e) => setData({ ...data, accountName: e.target.value })}
            placeholder="계좌명 (예금주)"
            className={`${inputClass} sm:w-48`}
          />
        </div>
      </section>

      <section ref={resultRef} className={cardClass}>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <h2 className="text-lg font-semibold text-foreground">
            정산 결과
            {(data.title || data.date) && (
              <span className="ml-2 text-sm font-normal text-muted">
                {[data.title, data.date].filter(Boolean).join(" · ")}
              </span>
            )}
          </h2>
          {data.account && (
            <p className="text-right text-sm font-bold text-blue-500">
              입금계좌 {accountText(data)}
            </p>
          )}
        </div>
        <div data-no-capture className="mt-2 flex justify-end">
          <label className="flex items-center gap-2 text-xs text-muted">
            반올림
            <select
              value={data.roundUnit}
              onChange={(e) => setData({ ...data, roundUnit: Number(e.target.value) })}
              className={`${inputClass} py-1`}
            >
              <option value={1}>1원</option>
              <option value={10}>10원</option>
              <option value={100}>100원</option>
            </select>
          </label>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-mint p-4">
            <div className="flex items-baseline justify-between gap-3 border-b border-foreground/10 pb-2">
              <h3 className="text-sm font-semibold text-foreground">수입</h3>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {won(result.totals.income)}
              </span>
            </div>
            <BreakdownList
              entries={usedEntries.filter((e) => e.kind === "income")}
              members={data.members}
            />
          </div>
          <div className="rounded-xl bg-pink p-4">
            <div className="flex items-baseline justify-between gap-3 border-b border-foreground/10 pb-2">
              <h3 className="text-sm font-semibold text-foreground">지출</h3>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {won(result.totals.expense)}
              </span>
            </div>
            {usedExpenseDays.length === 0 ? (
              <BreakdownList entries={[]} members={data.members} />
            ) : (
              usedExpenseDays.map((day) => (
                <div key={day} className="mt-3 first:mt-0">
                  <p className="mt-2 flex justify-between text-xs font-medium text-foreground/70">
                    <span>{day}일차</span>
                    <span className="tabular-nums">{won(result.dayTotals[day])}</span>
                  </p>
                  <BreakdownList
                    entries={usedEntries.filter((e) => e.kind === "expense" && e.day === day)}
                    members={data.members}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-3 rounded-xl bg-sky p-4">
          <span className="text-sm font-semibold text-foreground">정산 필요 금액</span>
          <span className="text-base font-bold tabular-nums text-foreground">{won(result.net)}</span>
        </div>

        {data.members.length === 0 ? (
          <p className="mt-4 text-sm text-muted">참석자를 추가하면 개인별 금액이 계산돼요.</p>
        ) : (
          <ul className="mt-4 flex flex-col divide-y divide-border">
            {result.rows.map((row) => (
              <li key={row.id} className="py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{row.name}</span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {describe(row.amount)}
                  </span>
                </div>
                {row.items.length > 0 && (
                  <p className="mt-1 text-xs text-muted">
                    {row.items.map((item) => `${item.label} ${won(item.amount)}`).join(" · ")}
                  </p>
                )}
                <p className="mt-1 text-xs tabular-nums text-muted">
                  지출 분담 {won(row.expense)} − 수입 차감 {won(result.incomeShare)}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div data-no-capture className="mt-6 flex gap-2">
          <button
            onClick={shareImage}
            disabled={data.members.length === 0 || shareStatus !== ""}
            className={`${buttonClass} flex-1`}
          >
            {shareStatus || "정산 결과 이미지로 공유 (카톡용)"}
          </button>
          <button
            onClick={reset}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
          >
            초기화
          </button>
        </div>
      </section>
    </div>
  );
}
