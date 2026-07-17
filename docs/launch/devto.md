---
title: "I built a linter for CLI --help output, and it roasts git"
published: false
tags: cli, typescript, webdev, opensource
---

There is a linter for almost every surface of a program. ESLint for your JavaScript, gofmt for
your Go, hadolint for your Dockerfile. But the surface a user actually touches first, the
`--help` text your command-line tool prints, has none. The [Command Line Interface
Guidelines](https://clig.dev) describe what good help output looks like, but they are prose, and
nobody re-reads a style guide before writing a usage string.

So I built [Flagcraft](https://apps.charliekrug.com/flagcraft/). You paste your CLI's `--help`
output and it grades the flags against the guidelines, citing the specific rule each finding
breaks. It runs entirely in the browser. Here are the two decisions that shaped it.

## Grade the text, not the source

The obvious design is to integrate with argument parsers: read the argparse `ArgumentParser`,
the clap `Command`, the cobra `*cobra.Command`, and inspect their flags directly. That path is a
trap. It means an SDK per language, source access, and a build step, and it still misses
hand-rolled parsers.

The insight is that every one of those frameworks already agrees on an output format. Run any of
them with `--help` and you get column-aligned text: a flag or a pair of flags, an optional value
placeholder, two or more spaces, then a description. That shared convention is the integration
point. Flagcraft parses the text a user would see in a terminal, which makes it framework-blind
by construction. The hard problem moves from "integrate with N libraries" to "parse free-form
text without crashing," and the second problem has a much smaller surface.

The whole parser is one regex:

```ts
const FLAG_LINE =
  /^\s*(-{1,2}[A-Za-z][\w-]*)(?:,\s*(-{1,2}[A-Za-z][\w-]*))?(?:[\s=]+[<[]?[\w.-]+[>\]]?)?(?:\s{2,}|\t+)(\S.*)$/;
```

The one subtlety worth calling out: the value placeholder between the flags and the description
varies by framework. clap and argparse favor bracketed or uppercase metavars (`<FILE>`,
`LEVEL`), while cobra and commander print a bare lowercase type word (`string`, `list`). Matching
it case-insensitively instead of assuming a shape is what lets a single pattern cover all four.

## Live grading forced the tests to be paranoid

Findings update on every keystroke, with no submit button. That is the right feel for a linter,
but it means the parser and rule engine run on partial, half-pasted, and frankly garbage input
constantly. A regex that backtracks badly or a rule that throws on a malformed flag would surface
as a frozen or broken page mid-type.

So the test suite is built around that. Beyond the per-framework fixtures, there are
property-based tests with [fast-check](https://fast-check.dev): the parser must never throw on
any string, and every parsed flag's reported line number must fall within the document. The rule
engine gets the same treatment, plus a check that the ambiguous-short-flag rule fires exactly
when some short flag maps to more than one long flag. There are also adversarial cases (unicode,
CRLF, whitespace-only, hundred-thousand-character lines) and a performance regression test, since
"instant" is a feature here. The `src/lib` logic sits at 100% line and branch coverage.

## What I would do differently

The single-line assumption is the real limitation. Some tools wrap a long flag description onto a
second, indented line, and Flagcraft currently treats that continuation as a non-flag line and
ignores it. Handling wrapped descriptions means tracking indentation state across lines instead
of matching each line independently, which is a meaningful rewrite of the parser's core loop. It
is the first thing I would add.

The rules are also deliberately conservative. They are text heuristics, so they only claim what
they can see: an ambiguous `-f` across subcommands, a missing `--help`, exit codes that do not
separate failure from misuse. I would rather ship five checks that are almost never wrong than
twenty that cry wolf.

Try it on your own tool, or click the git preset and watch thirty years of accumulated
inconsistency get flagged: [apps.charliekrug.com/flagcraft](https://apps.charliekrug.com/flagcraft/).
Source is on [GitHub](https://github.com/ctkrug/flagcraft).
