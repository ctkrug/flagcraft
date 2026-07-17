# Flagcraft — Vision

## The problem

The [Command Line Interface Guidelines](https://clig.dev) are a well-regarded, opinionated spec
for what a good CLI should look and feel like — consistent flag naming, sane exit codes,
predictable help text, sensible defaults. But they're prose. Nobody re-reads a style guide
before shipping a `--help` string, and unlike code style (where `eslint`/`black`/`gofmt` catch
drift automatically), there's no linter that checks a CLI's *surface* — the thing a user
actually sees — against this spec.

The result: even extremely mature, widely-used CLIs (git chief among them) have accumulated
small inconsistencies — a flag that means one thing in one subcommand and another thing
elsewhere, a missing `-h` alias on some subcommands but not others, exit codes that don't
distinguish "you used it wrong" from "it broke." Nobody catches these because nobody's checking.

## Who it's for

- **CLI authors** who want a second pair of eyes on their `--help` output before they ship,
  without adopting a framework or restructuring their argument parser.
- **Framework-agnostic by design** — argparse, clap, cobra, commander, or a hand-rolled parser
  all produce ordinary `--help` text, and that's all Flagcraft needs. No SDK, no source access,
  no build step.
- **Anyone curious** whether their favorite CLI actually follows the guidelines it's implicitly
  expected to — the fun, viral use case (paste `git --help`, watch it get roasted).

## The core idea

Flagcraft is two things wired together:

1. **A parser** that turns raw `--help` text — in whatever column-aligned shape argparse, clap,
   cobra, or commander happen to produce it — into one structured model: a list of flags, each
   with its short form, long form, and description, plus the original text for context.
2. **A rule engine** that walks that structured model and checks it against the CLI Guidelines,
   emitting a finding for each violation with a plain-language message and a citation to the
   specific guideline section it encodes.

Everything runs client-side, in the browser, on paste — no upload, no server, no account. The
grading updates live as the user types, so the feedback loop is instant.

## Key design decisions

- **Text in, not source in.** Flagcraft never asks for a repo or executes anything. It works
  from the same `--help` output any user would see, which is what makes it framework-agnostic —
  the hard generality problem is parsing free-form text robustly, not integrating with N
  different CLI libraries.
- **Cite the guideline, not just "this looks wrong."** Every finding names the specific CLI
  Guidelines section it's checking, so the tool teaches the spec instead of just scolding.
- **Client-side only.** No backend to run, secure, or pay for; the tool is a static site that
  can be hosted anywhere, including a path-based subdomain deploy.
- **Rules are independent and additive.** Each rule is a self-contained check with its own id,
  description, and citation, so new guideline coverage is pure addition, never a rewrite of
  existing rules.

## What "v1 done" looks like

- Pasting `git --help` (or any real CLI's help text) produces a live, line-cited report with at
  least the rule set in `docs/BACKLOG.md` fully implemented: help-flag presence, flag-name
  casing consistency, ambiguous short-flag reuse, `--version` presence, and exit-code guidance
  where detectable from text.
- The parser handles argparse, clap, cobra, and commander output shapes without hand-tuning per
  framework.
- The page looks and feels intentional — see `docs/DESIGN.md` — not like an unstyled form.
- One-click famous-CLI presets make the tool instantly demoable with zero setup.
- The whole thing ships as a single static bundle, deployable with no server.
