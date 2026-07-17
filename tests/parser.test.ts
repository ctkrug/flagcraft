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
});
