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

const EXIT_SECTION_HEADING = /exit codes?:?/i;
const EXIT_CODE_LINE = /^\s*(\d+)\s{2,}\S/;

const exitCodeConvention: Rule = {
  id: "exit-code-convention",
  description:
    "Documented exit codes should distinguish a general failure from a usage error.",
  check(parsed: ParsedHelp): Finding[] {
    const headingIndex = parsed.lines.findIndex((line) => EXIT_SECTION_HEADING.test(line));
    if (headingIndex === -1) return [];

    const codes = new Set<string>();
    for (const line of parsed.lines.slice(headingIndex + 1)) {
      if (line.trim() === "") break;
      const match = EXIT_CODE_LINE.exec(line);
      if (!match) break;
      codes.add(match[1]);
    }

    const nonZeroCodes = [...codes].filter((code) => code !== "0");
    if (nonZeroCodes.length >= 2) return [];

    return [
      {
        ruleId: "exit-code-convention",
        severity: "warning",
        message:
          "Documented exit codes don't distinguish a general failure from a usage error.",
        citation:
          'CLI Guidelines §Errors: "Use 1 for a general failure, 2 for a misuse/usage error, ' +
          'and document the distinction"',
      },
    ];
  },
};

export const rules: Rule[] = [
  missingHelpFlag,
  inconsistentFlagCasing,
  ambiguousShortFlagReuse,
  missingVersionFlag,
  exitCodeConvention,
];

export function runRules(parsed: ParsedHelp): Finding[] {
  return rules.flatMap((rule) => rule.check(parsed));
}
