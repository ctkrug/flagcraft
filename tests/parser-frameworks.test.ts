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

describe("clap-style help text", () => {
  const fixture = `A tool for demonstrating clap output

Usage: mycli [OPTIONS] <FILE>

Arguments:
  <FILE>  input file to process

Options:
  -o, --output <FILE>  Write results to FILE
  -v, --verbose        Enable verbose logging
  -h, --help           Print help
  -V, --version        Print version
`;

  it("parses flags with <VALUE> placeholders correctly", () => {
    const parsed = parseHelpText(fixture);
    expect(parsed.flags).toHaveLength(4);
    expect(parsed.flags[0]).toMatchObject({
      short: "-o",
      long: "--output",
      description: "Write results to FILE",
    });
    expect(parsed.flags[2]).toMatchObject({ short: "-h", long: "--help" });
    expect(parsed.flags[3]).toMatchObject({ short: "-V", long: "--version" });
  });
});

describe("cobra-style help text", () => {
  const fixture = `Manage cluster resources.

Usage:
  mycli get [flags]

Flags:
  -o, --output string   Output format
  -w, --watch           Watch for changes

Global Flags:
      --kubeconfig string   Path to the kubeconfig file
  -v, --v Level             Number for the log level verbosity
`;

  it("parses flags from both the Flags: and Global Flags: sections", () => {
    const parsed = parseHelpText(fixture);
    expect(parsed.flags).toHaveLength(4);
    expect(parsed.flags[0]).toMatchObject({
      short: "-o",
      long: "--output",
      description: "Output format",
    });
    expect(parsed.flags[1]).toMatchObject({ short: "-w", long: "--watch" });
    expect(parsed.flags[2]).toMatchObject({
      long: "--kubeconfig",
      description: "Path to the kubeconfig file",
    });
    expect(parsed.flags[2].short).toBeUndefined();
    expect(parsed.flags[3]).toMatchObject({ short: "-v", long: "--v" });
  });
});
