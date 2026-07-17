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

const ambiguousShortFlagReuse: Rule = {
  id: "ambiguous-short-flag-reuse",
  description: "A short flag should mean the same thing everywhere it appears.",
  check(parsed: ParsedHelp): Finding[] {
    const meanings = new Map<string, Set<string>>();
    for (const flag of parsed.flags) {
      if (!flag.short || !flag.long) continue;
      const longForms = meanings.get(flag.short) ?? new Set<string>();
      longForms.add(flag.long);
      meanings.set(flag.short, longForms);
    }

    const findings: Finding[] = [];
    for (const [short, longForms] of meanings) {
      if (longForms.size < 2) continue;
      findings.push({
        ruleId: "ambiguous-short-flag-reuse",
        severity: "error",
        message: `"${short}" means different things in different places: ${[...longForms].join(" vs. ")}.`,
        citation:
          'CLI Guidelines §Consistency: "Only use a short option for the most common options... ' +
          'keep the meaning of a given flag consistent across a command tree"',
      });
    }
    return findings;
  },
};

const missingVersionFlag: Rule = {
  id: "missing-version-flag",
  description: "A CLI should offer a --version flag (with an optional -V short alias).",
  check(parsed: ParsedHelp): Finding[] {
    const hasVersion = parsed.flags.some((f) => f.long === "--version" || f.short === "-V");
    if (hasVersion) return [];

    return [
      {
        ruleId: "missing-version-flag",
        severity: "warning",
        message: "No --version flag found in the parsed output.",
        citation: 'CLI Guidelines §Help: "Display the current version, ideally SemVer-compliant, ' +
          'behind a -V, --version flag"',
      },
    ];
  },
};

export const rules: Rule[] = [
  missingHelpFlag,
  inconsistentFlagCasing,
  ambiguousShortFlagReuse,
  missingVersionFlag,
];

export function runRules(parsed: ParsedHelp): Finding[] {
  return rules.flatMap((rule) => rule.check(parsed));
}
