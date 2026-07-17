import type { FlagDef, ParsedHelp } from "./types";

// Matches lines like:
//   -h, --help            Show this help message
//   --version                Print the version number
//   -v, --verbose <level>    Set verbosity
// Two or more spaces (or a tab) between the flag column and its description
// is the one layout convention argparse, clap, cobra, and commander all share.
const FLAG_LINE =
  /^\s*(-{1,2}[A-Za-z][\w-]*)(?:,\s*(-{1,2}[A-Za-z][\w-]*))?(?:[\s=]+[<[]?[A-Z][\w-]*[>\]]?)?(?:\s{2,}|\t+)(\S.*)$/;

function assignFlag(token: string, flag: Partial<FlagDef>): void {
  if (token.startsWith("--")) {
    flag.long = token;
  } else {
    flag.short = token;
  }
}

export function parseHelpText(raw: string): ParsedHelp {
  const lines = raw.split(/\r?\n/);
  const flags: FlagDef[] = [];

  lines.forEach((lineText, index) => {
    const match = FLAG_LINE.exec(lineText);
    if (!match) return;

    const [, first, second, description] = match;
    const flag: Partial<FlagDef> = { description: description.trim(), line: index + 1 };
    assignFlag(first, flag);
    if (second) assignFlag(second, flag);

    flags.push(flag as FlagDef);
  });

  return { raw, lines, flags };
}
