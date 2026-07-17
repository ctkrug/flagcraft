import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { runRules } from "../src/lib/rules";
import type { FlagDef, ParsedHelp } from "../src/lib/types";

function toParsed(flags: FlagDef[]): ParsedHelp {
  return { raw: "", lines: [], flags };
}

const flagArb: fc.Arbitrary<FlagDef> = fc.record({
  short: fc.option(fc.constantFrom("-a", "-b", "-c", "-f", "-h", "-v"), { nil: undefined }),
  long: fc.option(
    fc.constantFrom("--alpha", "--bravo", "--charlie", "--force", "--help", "--verbose"),
    { nil: undefined },
  ),
  description: fc.string(),
  line: fc.nat(),
});

describe("runRules — properties", () => {
  it("never throws on arbitrary flag lists, however malformed", () => {
    fc.assert(
      fc.property(fc.array(flagArb, { maxLength: 30 }), (flags) => {
        expect(() => runRules(toParsed(flags))).not.toThrow();
      }),
    );
  });

  it("ambiguous-short-flag-reuse fires exactly when some short flag maps to >1 distinct long flag", () => {
    fc.assert(
      fc.property(fc.array(flagArb, { maxLength: 30 }), (flags) => {
        const meanings = new Map<string, Set<string>>();
        for (const f of flags) {
          if (!f.short || !f.long) continue;
          const set = meanings.get(f.short) ?? new Set<string>();
          set.add(f.long);
          meanings.set(f.short, set);
        }
        const expectAmbiguous = [...meanings.values()].some((s) => s.size >= 2);

        const findings = runRules(toParsed(flags)).filter(
          (f) => f.ruleId === "ambiguous-short-flag-reuse",
        );
        expect(findings.length > 0).toBe(expectAmbiguous);
      }),
    );
  });

  it("inconsistent-flag-casing only ever flags flags whose long name fails the lowercase-hyphen pattern", () => {
    const WELL_FORMED = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
    fc.assert(
      fc.property(fc.array(flagArb, { maxLength: 30 }), (flags) => {
        const findings = runRules(toParsed(flags)).filter(
          (f) => f.ruleId === "inconsistent-flag-casing",
        );
        for (const finding of findings) {
          const flaggedName = finding.message.match(/"(--[^"]+)"/)?.[1];
          expect(flaggedName).toBeDefined();
          expect(WELL_FORMED.test(flaggedName!.slice(2))).toBe(false);
        }
      }),
    );
  });
});
