import { describe, expect, it } from "vitest";
import { parseHelpText } from "../src/lib/parser";

describe("argparse-style help text", () => {
  const fixture = `usage: mycli [-h] [--version] [-o OUTPUT] file

positional arguments:
  file                  input file to process

options:
  -h, --help            show this help message and exit
  --version             show program's version number and exit
  -o, --output OUTPUT   write results to OUTPUT
`;

  it("parses every documented flag with correct short/long/description", () => {
    const parsed = parseHelpText(fixture);
    expect(parsed.flags).toHaveLength(3);
    expect(parsed.flags[0]).toMatchObject({
      short: "-h",
      long: "--help",
      description: "show this help message and exit",
    });
    expect(parsed.flags[1]).toMatchObject({
      long: "--version",
      description: "show program's version number and exit",
    });
    expect(parsed.flags[2]).toMatchObject({
      short: "-o",
      long: "--output",
      description: "write results to OUTPUT",
    });
  });
});
