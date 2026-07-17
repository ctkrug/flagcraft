import { describe, expect, it } from "vitest";
import { parseHelpText } from "../src/lib/parser";
import { runRules } from "../src/lib/rules";

describe("missing-help-flag", () => {
  it("flags a CLI with no --help at all", () => {
    const parsed = parseHelpText("  --version    Print version");
    const findings = runRules(parsed).filter((f) => f.ruleId === "missing-help-flag");
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe("error");
  });

  it("passes when both -h and --help are present", () => {
    const parsed = parseHelpText("  -h, --help    Show help");
    const findings = runRules(parsed).filter((f) => f.ruleId === "missing-help-flag");
    expect(findings).toHaveLength(0);
  });
});

describe("inconsistent-flag-casing", () => {
  it("flags a camelCase long flag", () => {
    const parsed = parseHelpText("  --dryRun    Skip side effects");
    const findings = runRules(parsed).filter((f) => f.ruleId === "inconsistent-flag-casing");
    expect(findings).toHaveLength(1);
    expect(findings[0].line).toBe(1);
  });

  it("passes a well-formed hyphenated flag", () => {
    const parsed = parseHelpText("  --dry-run    Skip side effects");
    const findings = runRules(parsed).filter((f) => f.ruleId === "inconsistent-flag-casing");
    expect(findings).toHaveLength(0);
  });
});
