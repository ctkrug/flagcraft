import type { Finding, ParsedHelp, Rule } from "./types";

const missingHelpFlag: Rule = {
  id: "missing-help-flag",
  description: "Every CLI should offer both -h and --help.",
  check(parsed: ParsedHelp): Finding[] {
    const hasShort = parsed.flags.some((f) => f.short === "-h");
    const hasLong = parsed.flags.some((f) => f.long === "--help");
    if (hasShort && hasLong) return [];

    return [
      {
        ruleId: "missing-help-flag",
        severity: "error",
        message: hasLong
          ? "No -h short alias found for --help."
          : "No --help flag found in the parsed output.",
        citation: "CLI Guidelines §Help: \"Provide -h and --help\"",
      },
    ];
  },
};

const inconsistentFlagCasing: Rule = {
  id: "inconsistent-flag-casing",
  description: "Long flags should be lowercase, hyphen-separated words.",
  check(parsed: ParsedHelp): Finding[] {
    const findings: Finding[] = [];
    for (const flag of parsed.flags) {
      if (!flag.long) continue;
      const name = flag.long.slice(2);
      const isWellFormed = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name);
      if (isWellFormed) continue;

      findings.push({
        ruleId: "inconsistent-flag-casing",
        severity: "warning",
        message: `Flag "${flag.long}" doesn't use lowercase, hyphen-separated words.`,
        citation: 'CLI Guidelines §Naming: "Use lowercase, hyphen-separated words for flag names"',
        line: flag.line,
      });
    }
    return findings;
  },
};

export const rules: Rule[] = [missingHelpFlag, inconsistentFlagCasing];

export function runRules(parsed: ParsedHelp): Finding[] {
  return rules.flatMap((rule) => rule.check(parsed));
}
