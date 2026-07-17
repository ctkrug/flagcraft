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

describe("ambiguous-short-flag-reuse", () => {
  it("flags a short flag that means different things in different sections", () => {
    const parsed = parseHelpText(
      "git branch options:\n  -f, --force    Reset branch to start point\n\n" +
        "git checkout options:\n  -f, --conflict    Force checkout, discarding changes",
    );
    const findings = runRules(parsed).filter((f) => f.ruleId === "ambiguous-short-flag-reuse");
    expect(findings).toHaveLength(1);
    expect(findings[0].message).toContain("--force");
    expect(findings[0].message).toContain("--conflict");
  });

  it("passes when a short flag means the same thing everywhere", () => {
    const parsed = parseHelpText(
      "  -f, --force    Force the action\n\n  -f, --force    Force this one too",
    );
    const findings = runRules(parsed).filter((f) => f.ruleId === "ambiguous-short-flag-reuse");
    expect(findings).toHaveLength(0);
  });

  it("passes when a short flag only appears once", () => {
    const parsed = parseHelpText("  -f, --force    Force the action");
    const findings = runRules(parsed).filter((f) => f.ruleId === "ambiguous-short-flag-reuse");
    expect(findings).toHaveLength(0);
  });
});

describe("missing-version-flag", () => {
  it("flags a CLI with no --version or -V anywhere", () => {
    const parsed = parseHelpText("  -h, --help    Show help");
    const findings = runRules(parsed).filter((f) => f.ruleId === "missing-version-flag");
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe("warning");
  });

  it("passes when --version is present", () => {
    const parsed = parseHelpText("  --version    Print the version number");
    const findings = runRules(parsed).filter((f) => f.ruleId === "missing-version-flag");
    expect(findings).toHaveLength(0);
  });

  it("passes when only the -V short alias is present", () => {
    const parsed = parseHelpText("  -V, --ver    Print the version number");
    const findings = runRules(parsed).filter((f) => f.ruleId === "missing-version-flag");
    expect(findings).toHaveLength(0);
  });
});
