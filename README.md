# Flagcraft

**▶ Live demo — [apps.charliekrug.com/flagcraft](https://apps.charliekrug.com/flagcraft/)**

[![CI](https://github.com/ctkrug/flagcraft/actions/workflows/ci.yml/badge.svg)](https://github.com/ctkrug/flagcraft/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-ffb000.svg)](LICENSE)

A linter for your CLI's `--help` output. Paste the text your command-line tool prints, and
Flagcraft grades it against the [Command Line Interface Guidelines](https://clig.dev): a missing
`-h`/`--help`, inconsistent flag casing, ambiguous single-letter flags, an absent `--version`,
and exit codes that don't tell a general failure apart from a usage error. Every finding cites
the specific guideline it breaks, so you get a reason, not just a red mark.

Nothing is uploaded. Once the page loads, parsing and grading run entirely in your browser, and
the text you paste never leaves your machine.

## Sample output

Paste `docker --help` and Flagcraft grades it live:

```
error    No --help flag found in the parsed output.
         CLI Guidelines §Help: "Provide -h and --help"

error    "-v" means different things in different places: --version vs. --volumes.
         CLI Guidelines §Consistency: keep a flag's meaning consistent across a command tree

error    "-f" means different things in different places: --file vs. --force.
         CLI Guidelines §Consistency: keep a flag's meaning consistent across a command tree

warning  Documented exit codes don't distinguish a general failure from a usage error.
         CLI Guidelines §Errors: use 1 for a general failure, 2 for a usage error
```

Findings update on every keystroke, with no submit button. Click a preset (`git`, `docker`,
`kubectl`) to grade a real, well-known tool in one click.

## Run it locally

```sh
git clone https://github.com/ctkrug/flagcraft.git
cd flagcraft
npm install
npm run dev
```

Open the printed `localhost` URL, then paste your own CLI's `--help` output or click a preset.

## What it checks

| Check | Severity | Guideline |
|---|---|---|
| No `-h` short alias for `--help` | error / warning | Help |
| Long flag not lowercase, hyphen-separated | warning | Naming |
| A short flag mapped to two different long flags | error | Consistency |
| No `--version` (or `-V`) flag | warning | Help |
| Documented exit codes don't separate failure from misuse | warning | Errors |

## How it works

Flagcraft never runs your program or reads its source. It parses the same `--help` text a user
would see in a terminal, which is what makes it framework-agnostic: argparse, clap, cobra,
commander, and hand-rolled parsers all produce column-aligned help text, and that is all
Flagcraft needs. A single parser normalizes those layouts into one model of flags and
descriptions, then an additive rule engine walks that model and emits a cited finding per
violation. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the module map and
[`docs/VISION.md`](docs/VISION.md) for the design rationale.

## Development

```sh
npm test          # run the full Vitest suite
npm run coverage  # the suite with a V8 coverage report
npm run lint      # tsc --noEmit type check
npm run build     # production build into site/
```

The `src/lib/` logic sits at 100% line and branch coverage, including property-based fuzz tests
and adversarial (unicode, CRLF, pathological-length) cases, since grading re-runs on every
keystroke.

## Stack

TypeScript, built with [Vite](https://vitejs.dev), tested with [Vitest](https://vitest.dev). No
backend, no build-time network calls. It ships as a static bundle deployable under any subpath.

## License

MIT. See [`LICENSE`](LICENSE).

---

More of Charlie's projects → https://apps.charliekrug.com
