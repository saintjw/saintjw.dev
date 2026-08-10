export type ScoreEntry = {
  value: number;
  date: string;
};

const MAX_ENTRIES = 5;

export function getTopScores(key: string): ScoreEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function submitScore(
  key: string,
  value: number,
  higherIsBetter: boolean
): ScoreEntry[] {
  const current = getTopScores(key);
  const entry: ScoreEntry = { value, date: new Date().toISOString().slice(0, 10) };
  const updated = [...current, entry]
    .sort((a, b) => (higherIsBetter ? b.value - a.value : a.value - b.value))
    .slice(0, MAX_ENTRIES);
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
}
