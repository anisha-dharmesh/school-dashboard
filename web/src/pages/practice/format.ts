import type { PracticeResult } from "../../practice/types";

export function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export function scoreOf(results: PracticeResult[]): { correct: number; total: number; percent: number } {
  const correct = results.filter((r) => r.ok).length;
  const total = results.length;
  return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
}
