import type { ScoreEntry } from "@/lib/leaderboard";

export default function Leaderboard({
  entries,
  unit,
}: {
  entries: ScoreEntry[];
  unit?: string;
}) {
  if (entries.length === 0) return null;

  return (
    <div className="w-full max-w-xs rounded-2xl border border-border bg-card p-4">
      <p className="mb-2 text-sm font-semibold text-foreground">TOP 5</p>
      <ol className="flex flex-col gap-1.5 text-sm">
        {entries.map((entry, i) => (
          <li key={i} className="flex items-center justify-between text-muted">
            <span className="w-5 font-medium text-foreground">{i + 1}</span>
            <span className="font-medium text-foreground">
              {entry.value}
              {unit}
            </span>
            <span className="text-xs">{entry.date}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
