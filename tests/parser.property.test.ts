import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { parseHelpText } from "../src/lib/parser";

describe("parseHelpText — properties", () => {
  it("never throws and always returns a lines array matching the split input, for any string", () => {
    fc.assert(
      fc.property(fc.string(), (raw) => {
        const parsed = parseHelpText(raw);
        expect(parsed.lines).toEqual(raw.split(/\r?\n/));
        expect(parsed.raw).toBe(raw);
      }),
    );
  });

  it("every parsed flag's line number falls within the document's line range", () => {
    fc.assert(
      fc.property(fc.string(), (raw) => {
        const parsed = parseHelpText(raw);
        for (const flag of parsed.flags) {
          expect(flag.line).toBeGreaterThanOrEqual(1);
          expect(flag.line).toBeLessThanOrEqual(parsed.lines.length);
        }
      }),
    );
  });

  it("recognizes any well-formed short+long flag line regardless of description content", () => {
    const shortLetter = fc.stringMatching(/^[A-Za-z]$/);
    const longName = fc.stringMatching(/^[A-Za-z][A-Za-z0-9-]{0,12}$/);
    // any non-empty, non-whitespace-leading description text on one line
    const description = fc.string({ minLength: 1 }).filter((s) => /\S/.test(s) && !/[\r\n]/.test(s));

    fc.assert(
      fc.property(shortLetter, longName, description, (letter, long, desc) => {
        const line = `  -${letter}, --${long}    ${desc.trimStart()}`;
        const parsed = parseHelpText(line);
        expect(parsed.flags).toHaveLength(1);
        expect(parsed.flags[0].short).toBe(`-${letter}`);
        expect(parsed.flags[0].long).toBe(`--${long}`);
      }),
    );
  });
});
