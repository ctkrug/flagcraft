# Flagcraft — Architecture

Vite + TypeScript, no framework, no backend. Everything runs client-side in the browser.

## Modules (`src/lib/`)

- **`types.ts`** — shared shapes: `FlagDef` (short/long/description/line), `ParsedHelp`
  (raw text + split lines + parsed flags), `Finding` (rule violation with severity/message/
  citation), `Rule` (id + description + `check(parsed) => Finding[]`).
- **`parser.ts`** — `parseHelpText(raw)`: turns pasted `--help` text into a `ParsedHelp`. One
  regex (`FLAG_LINE`) recognizes the column-aligned layout argparse, clap, cobra, and
  commander all share (flag(s), optional value placeholder, 2+ spaces/tab, description).
  Framework-agnostic by design — see `docs/VISION.md` §Key design decisions.
- **`rules.ts`** — `runRules(parsed)`: runs every `Rule` in the `rules` array and flattens the
  findings. Five rules currently: `missing-help-flag`, `inconsistent-flag-casing`,
  `ambiguous-short-flag-reuse` (groups flags by short form, flags any short flag mapped to
  >1 distinct long flag), `missing-version-flag`, `exit-code-convention` (scans raw lines for
  an "Exit codes:" section and checks for ≥2 distinct non-zero codes). Adding a rule is pure
  addition: write a `Rule`, push it onto `rules`.
- **`report.ts`** — `classifyReport(text, parsed)`: decides which of three UI states to show —
  `idle` (nothing pasted yet), `no-flags` (pasted text parsed to zero flags — prose, JSON,
  etc.), or `ready` (render findings). `EMPTY_STATE_MESSAGES` holds the copy for the first two.
- **`presets.ts`** — `presets`: an array of `{ id, label, helpText }` bundling hand-authored,
  static fixtures shaped like real git/docker/kubectl `--help` output (no network fetch),
  intentionally including the short-flag inconsistencies (`-f` meaning different things in
  different subcommands) that make grading them a fun, non-contrived demo.

## App shell

- **`index.html`** — the whole page: header/wordmark, a two-pane grid (`#help-input` textarea
  left, `#report` findings region right), and a `#presets` mount point in the input pane's
  header row. All asset paths are relative (`./src/style.css`) for subpath deployment.
- **`main.ts`** — wires it together: `grade()` parses the textarea's current value, classifies
  it via `classifyReport`, and either renders an empty-state message or runs `runRules` and
  renders findings. Grading fires on every `input` event (no submit button) and once on load.
  `renderPresets()` builds the preset buttons from `presets` and, on click, fills the textarea
  and calls `grade()`.
- **`style.css`** — CRT-terminal design tokens and component styles per `docs/DESIGN.md`.

## Data flow

```
textarea input event
  -> parseHelpText(text)      → ParsedHelp
  -> classifyReport(text, parsed) → "idle" | "no-flags" | "ready"
       "ready": runRules(parsed) → Finding[] -> renderFindings
       else:    EMPTY_STATE_MESSAGES[state] -> renderEmptyState
```

## Tests (`tests/`)

Vitest + jsdom. One file per `src/lib/` module (`parser.test.ts`, `rules.test.ts`,
`report.test.ts`, `presets.test.ts`) plus `parser-frameworks.test.ts`, which fixtures one
realistic help-text sample per supported framework (argparse, clap, cobra, commander) to pin
down cross-framework parsing. `main.test.ts` covers the app-shell wiring itself (grade-on-input,
preset click handling, empty states, HTML-escaping of pasted content) by mounting the same
markup `index.html` provides and dynamically re-importing `main.ts` per test.
`src/lib/*` sits at 100% line/branch coverage; `parser.ts` and `rules.ts` also carry adversarial
(unicode, CRLF, empty/whitespace-only, pathological-length) and performance-regression cases
since grading re-runs on every keystroke.

## Run it

- `npm run dev` — dev server.
- `npm test` — `vitest run`, the full suite.
- `npm run coverage` — `vitest run --coverage`.
- `npm run lint` — `tsc --noEmit`.
- `npm run build` — `tsc -b && vite build`; static output in `dist/`, all relative paths, safe
  to serve from a subpath (`apps.charliekrug.com/flagcraft/`).
