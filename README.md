# Flagcraft

Paste your CLI's `--help` output. Get back a structured lint report scored against the
[Command Line Interface Guidelines](https://clig.dev) — inconsistent flag casing, a missing
`-h`/`--help`, ambiguous single-letter flags, unclear exit-code conventions, and more, each
finding cited to the specific guideline it violates.

No upload, no server round-trip: once the page is open, everything runs client-side in the
browser — pasted text never leaves your machine. Paste `git --help` and watch it get graded
line-by-line in real time — including the inconsistencies git itself has picked up over thirty
years of history.

## Try it

Flagcraft isn't published anywhere yet, so run it locally:

```sh
git clone https://github.com/ctkrug/flagcraft.git
cd flagcraft
npm install
npm run dev
```

Then open the printed `localhost` URL and click one of the `git`/`docker`/`kubectl` preset
buttons, or paste your own CLI's `--help` output, to see it graded live.

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

## Features

- **Real-time grading**: paste text, findings update as you type, no submit button required.
- **Rule engine**: five checks encoding the CLI Guidelines — `-h`/`--help` presence, flag-name
  casing consistency, ambiguous short-flag reuse across a command tree, `--version` presence,
  and exit-code convention (does the CLI distinguish a general failure from a usage error).
- **Framework-agnostic parsing**: handles `--help` output shapes from argparse, clap, cobra,
  commander, and hand-rolled formats sharing the same column-aligned convention.
- **Guideline citations**: every finding links back to the specific CLI Guidelines section it
  violates, not just a generic warning.
- **Famous-CLI presets**: one-click examples (`git`, `docker`, `kubectl`) so the tool is
  instantly demoable with zero setup — including their real-world short-flag inconsistencies.
- **Graceful on bad input**: pasting prose or non-`--help` text shows a designed "couldn't find
  any flags" state, never a blank panel or a thrown error.

## Stack

TypeScript, built with [Vite](https://vitejs.dev), tested with [Vitest](https://vitest.dev).
Entirely client-side — no backend, no build-time network calls, ships as a static site.

## Status

Core v1 scope is functionally complete — see [`docs/VISION.md`](docs/VISION.md) for the full
design, [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the codebase map, and
[`docs/BACKLOG.md`](docs/BACKLOG.md) for the story-by-story build plan.

## License

MIT — see [`LICENSE`](LICENSE).
