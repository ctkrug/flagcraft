import { describe, expect, it } from "vitest";
import { parseHelpText } from "../src/lib/parser";

describe("parseHelpText", () => {
  it("extracts a flag with both short and long forms", () => {
    const parsed = parseHelpText("  -h, --help            Show this help message");
    expect(parsed.flags).toHaveLength(1);
    expect(parsed.flags[0]).toMatchObject({
      short: "-h",
      long: "--help",
      description: "Show this help message",
    });
  });

  it("extracts a long-only flag", () => {
    const parsed = parseHelpText("  --version                Print the version number");
    expect(parsed.flags).toHaveLength(1);
    expect(parsed.flags[0]).toMatchObject({
      long: "--version",
      description: "Print the version number",
    });
  });

  it("ignores non-flag lines", () => {
    const parsed = parseHelpText("Usage: mycli [OPTIONS] COMMAND\n\nOptions:");
    expect(parsed.flags).toHaveLength(0);
  });

  it("records the 1-indexed line number of each flag", () => {
    const parsed = parseHelpText("Usage: mycli\n\n  -h, --help    Show help");
    expect(parsed.flags[0].line).toBe(3);
  });

  it("handles CRLF line endings", () => {
    const parsed = parseHelpText("Usage: mycli\r\n\r\n  -h, --help    Show help\r\n");
    expect(parsed.flags).toHaveLength(1);
    expect(parsed.flags[0].line).toBe(3);
  });

  it("keeps emoji and unicode in a description intact", () => {
    const parsed = parseHelpText("  -h, --help    \u{1F680} Show help éè");
    expect(parsed.flags[0].description).toBe("\u{1F680} Show help éè");
  });

  it("stays fast on a long non-matching line (no catastrophic backtracking)", () => {
    const hostileLine = "-" + "a".repeat(100_000);
    const start = performance.now();
    const parsed = parseHelpText(hostileLine);
    expect(performance.now() - start).toBeLessThan(200);
    expect(parsed.flags).toHaveLength(0);
  });

  it("parses a large realistic paste without pathological slowdown", () => {
    const big = "  -h, --help    Show help\n".repeat(5000);
    const start = performance.now();
    const parsed = parseHelpText(big);
    expect(performance.now() - start).toBeLessThan(500);
    expect(parsed.flags).toHaveLength(5000);
  });

  it("returns no flags for empty input", () => {
    const parsed = parseHelpText("");
    expect(parsed.flags).toHaveLength(0);
    expect(parsed.lines).toEqual([""]);
  });

  it("returns no flags for whitespace-only input", () => {
    const parsed = parseHelpText("   \n\t\n   ");
    expect(parsed.flags).toHaveLength(0);
  });
});
