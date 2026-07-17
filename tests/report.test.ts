import { describe, expect, it } from "vitest";
import { classifyReport } from "../src/lib/report";
import { parseHelpText } from "../src/lib/parser";

describe("classifyReport", () => {
  it("is idle for an empty string", () => {
    expect(classifyReport("", parseHelpText(""))).toBe("idle");
  });

  it("is idle for whitespace-only input", () => {
    expect(classifyReport("   \n\t  ", parseHelpText("   \n\t  "))).toBe("idle");
  });

  it("is no-flags for prose with no recognizable flag lines", () => {
    const text = "This is just a paragraph of prose, not CLI help output at all.";
    expect(classifyReport(text, parseHelpText(text))).toBe("no-flags");
  });

  it("is no-flags for malformed/non-CLI text like JSON", () => {
    const text = '{"not": "a cli", "just": "json"}';
    expect(classifyReport(text, parseHelpText(text))).toBe("no-flags");
  });

  it("is ready once at least one flag is parsed", () => {
    const text = "  -h, --help    Show this help message";
    expect(classifyReport(text, parseHelpText(text))).toBe("ready");
  });
});
