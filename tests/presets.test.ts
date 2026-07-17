import { describe, expect, it } from "vitest";
import { presets } from "../src/lib/presets";
import { parseHelpText } from "../src/lib/parser";
import { runRules } from "../src/lib/rules";

describe("presets", () => {
  it("bundles at least 3 famous-CLI presets", () => {
    expect(presets.length).toBeGreaterThanOrEqual(3);
  });

  it.each(presets)("$id produces a non-empty findings list", (preset) => {
    const parsed = parseHelpText(preset.helpText);
    expect(parsed.flags.length).toBeGreaterThan(0);
    const findings = runRules(parsed);
    expect(findings.length).toBeGreaterThan(0);
  });
});
