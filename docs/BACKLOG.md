# Flagcraft — Backlog

13 stories across 4 epics. Story 1.1 is the wow moment and must be reachable before anything
else in this backlog is built.

## Epic 1 — Core grading experience

- [ ] **1.1 Live grading of pasted `--help` text with guideline citations (wow moment)**
  - Pasting real CLI `--help` text (e.g. `git --help`) produces a findings list that updates
    live as the text changes, with no submit button required.
  - Every finding shows a plain-language message AND a specific CLI Guidelines citation, not a
    generic "issue found."
  - An empty textarea shows the designed empty state, not a blank panel or a thrown error.

- [ ] **1.2 One-click famous-CLI presets**
  - Clicking a preset button (git, docker, kubectl) populates the textarea with that CLI's real
    `--help` text, bundled as a static fixture (no network fetch), and triggers grading
    immediately.
  - At least 3 presets are available and each produces a non-empty findings list.

- [ ] **1.3 Design polish pass for the grader shell**
  - Page matches `docs/DESIGN.md` tokens and the CRT-terminal direction (colors, fonts, glow,
    blinking cursor).
  - Layout composes cleanly at 390px, 768px, and 1440px with no horizontal scroll or dead
    margins.
  - Every interactive control (textarea, preset buttons) has themed hover, focus-visible, and
    active states — no naked native widgets.

## Epic 2 — Guideline rule coverage

- [ ] **2.1 Ambiguous short-flag reuse detection across a command tree**
  - Help text where the same short flag (e.g. `-f`) maps to different long flags in different
    subcommands produces a finding citing the ambiguity, naming both conflicting meanings.
  - Help text where every short flag maps consistently across subcommands produces no such
    finding.

- [ ] **2.2 `--version` presence check**
  - Help text with no `--version`/`-V` flag produces a warning-severity finding citing the
    relevant guideline.
  - Help text that includes `--version` produces no such finding.

- [ ] **2.3 Exit code convention check**
  - Help text whose documented exit codes don't distinguish a general failure code from a
    usage-error code produces a finding explaining the distinction the guidelines recommend.
  - Help text that documents distinct codes (e.g. "0 success, 1 error, 2 usage") produces no
    such finding.

## Epic 3 — Robust cross-framework parsing

- [ ] **3.1 Parse argparse-style help text**
  - A fixture of real Python argparse `--help` output (usage line + `options:` section) parses
    every documented flag with correct short/long/description extraction.

- [ ] **3.2 Parse clap-style help text**
  - A fixture of real Rust clap `--help` output, including flags with `<VALUE>` placeholders,
    parses every documented flag correctly.

- [ ] **3.3 Parse cobra-style help text**
  - A fixture of real Go cobra `--help` output (command tree + `Flags:`/`Global Flags:`
    sections, e.g. kubectl-shaped) parses flags from both sections.

- [ ] **3.4 Parse commander-style help text**
  - A fixture of real Node commander.js `--help` output (comma-separated short/long pairs)
    parses every documented flag correctly.

- [ ] **3.5 Graceful handling of malformed or non-CLI pasted text**
  - Pasting prose, JSON, or other non-`--help` text parses to zero flags and shows a
    "couldn't find any flags" empty state — never a thrown error or crash.

## Epic 4 — Ship polish & accessibility

- [ ] **4.1 Static build verified deployable under a subpath**
  - `npm run build` output in `dist/` loads with no console errors when served from a
    non-root base path (relative asset paths throughout, no leading `/`).

- [ ] **4.2 Accessibility pass**
  - Textarea and report region are keyboard-reachable with visible focus states.
  - The findings list is in an `aria-live` region so updates are announced to screen readers.
  - Text/accent color pairs meet a 4.5:1 contrast ratio.
