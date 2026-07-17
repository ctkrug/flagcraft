# Flagcraft

Paste your CLI's `--help` output. Get back a structured lint report scored against the
[Command Line Interface Guidelines](https://clig.dev) — inconsistent flag casing, a missing
`-h`/`--help`, ambiguous single-letter flags, unclear exit-code conventions, and more, each
finding cited to the specific guideline it violates.

No install, no upload, no server round-trip: everything runs client-side in the browser. Paste
`git --help` and watch it get graded line-by-line in real time — including the inconsistencies
git itself has picked up over thirty years of history.

## Why

The CLI Guidelines are a genuinely good spec, but they live as prose. Nobody re-reads a style
guide before writing a `--help` string, and there's no linter for it the way there is for code
style. Flagcraft is that linter: point it at raw `--help` text from *any* CLI — built with
argparse, clap, cobra, commander, or hand-rolled — and it tells you exactly which guideline you
violated and why, line by line.

## How it works

Flagcraft never executes your CLI or asks for source code — it works purely from the text a
user would already see in a terminal. A parser normalizes wildly different `--help` layouts
(argparse's column alignment, clap's usage/options split, cobra's command trees, commander's
brackets) into one structured model of flags, descriptions, and usage lines. A rule engine then
walks that model against the CLI Guidelines heuristics and reports violations with the specific
guideline they cite.

## Planned features

- **Real-time grading**: paste text, findings update as you type, no submit button required.
- **Rule engine**: a growing set of checks encoding the CLI Guidelines — flag casing
  consistency, `-h`/`--help` presence, ambiguous short-flag reuse across a command tree, exit
  code conventions, `--version` presence, and more.
- **Framework-agnostic parsing**: robust across `--help` output shapes from argparse, clap,
  cobra, commander, and hand-rolled formats.
- **Guideline citations**: every finding links back to the specific CLI Guidelines section it
  violates, not just a generic warning.
- **Famous-CLI presets**: one-click examples (`git --help`, `docker --help`, `kubectl --help`)
  so the tool is instantly demoable with zero setup.

## Stack

TypeScript, built with [Vite](https://vitejs.dev), tested with [Vitest](https://vitest.dev).
Entirely client-side — no backend, no build-time network calls, ships as a static site.

## Status

Early scaffold. See [`docs/VISION.md`](docs/VISION.md) for the full design and
[`docs/BACKLOG.md`](docs/BACKLOG.md) for the build plan.

## License

MIT — see [`LICENSE`](LICENSE).
