import type { ParsedHelp } from "./types";

export type ReportState = "idle" | "no-flags" | "ready";

export function classifyReport(text: string, parsed: ParsedHelp): ReportState {
  if (text.trim() === "") return "idle";
  if (parsed.flags.length === 0) return "no-flags";
  return "ready";
}

export const EMPTY_STATE_MESSAGES: Record<Exclude<ReportState, "ready">, string> = {
  idle: "No help text yet — paste some to grade it.",
  "no-flags": "Couldn't find any flags in that text — paste real --help output.",
};
