export interface FlagDef {
  /** e.g. "-h" */
  short?: string;
  /** e.g. "--help" */
  long?: string;
  description: string;
  /** 1-indexed line number in the pasted text this flag was found on */
  line: number;
}

export interface ParsedHelp {
  raw: string;
  lines: string[];
  flags: FlagDef[];
}

export type Severity = "error" | "warning";

export interface Finding {
  ruleId: string;
  severity: Severity;
  message: string;
  /** short citation of the CLI Guidelines section this rule encodes */
  citation: string;
  /** 1-indexed line number the finding applies to, if any */
  line?: number;
}

export interface Rule {
  id: string;
  description: string;
  check(parsed: ParsedHelp): Finding[];
}
