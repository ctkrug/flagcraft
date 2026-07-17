# Flagcraft — Design

## 1. Aesthetic direction

**CRT terminal.** Flagcraft grades terminal output, so the tool itself should feel like a
terminal session, not a SaaS dashboard wrapped around one. Think a phosphor-amber CRT monitor
in a dim room: a near-black screen with a warm glow, monospace type, a blinking cursor in the
wordmark, and findings that read like compiler diagnostics scrolling past.

This is distinct from the schematic/blueprint direction several recent sibling projects have
used (Terseql, Readout, Branchreel, Quarry, Cable Check, Swapscope) — this is a lit CRT glass,
not graph paper. It's also distinct from Side B's warm tactile toy and Facet's risograph print.
No other recent ship has used a terminal-emulator aesthetic.

## 2. Tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0a0d0a` | page background (near-black, faint green cast) |
| `--surface-1` | `#10140f` | panel background |
| `--surface-2` | `#171d16` | recessed surfaces (textarea, finding cards) |
| `--text` | `#d7f5df` | primary text (pale phosphor) |
| `--text-muted` | `#7a9483` | secondary text, labels |
| `--accent` | `#ffb000` | phosphor amber — wordmark, warnings, focus glow |
| `--accent-support` | `#4fd8e0` | cyan — secondary highlights, citations |
| `--success` | `#5ee88f` | passing checks |
| `--danger` | `#ff5f56` | error-severity findings |

- **Display font:** IBM Plex Mono (700), used for the wordmark and section labels — wide
  tracking, unmistakably terminal.
- **UI font:** Inter (400/500/600) for body copy and finding messages — dense diagnostic text
  needs a font built for paragraph reading, not just monospace everywhere.
- **Spacing:** 8px base scale (4/8/16/24/32).
- **Radius:** 6px — enough to read as a window, not sharp enough to feel like graph paper.
- **Glow:** `0 0 0 1px rgba(255,176,0,.25), 0 0 16px rgba(255,176,0,.12)` on focus — a soft CRT
  bloom, not a hard outline.
- **Motion:** UI transitions 150–200ms ease-out; a blinking cursor at ~1.1s per cycle.

## 3. Layout intent

The hero is the **paste-and-grade split pane**: input on the left, live report on the right,
each panel filling its half of the viewport (≥60vh combined on desktop). At 1440×900 the two
panes sit side by side; at 390×844 they stack, input first. There is no marketing copy above
the fold — the grader itself is the landing page.

## 4. Signature detail

The wordmark `flagcraft_` carries a blinking cyan cursor block as its trailing character,
animated on a steady CRT-style interval — the one flourish that signals "this is alive," even
before anything is pasted.

## 5. Juice — n/a

Flagcraft is a text-grading tool, not a game or playful toy; D2's "game feel" requirements
(tweened movement, impact/goal feedback, synth SFX) don't apply. The equivalent feedback
mechanism here is **live grading**: findings update on every keystroke with no submit button,
and each finding card is styled by severity (amber warning / red error) with a citation line —
the closest analog to "juice" for a linter is immediacy and legibility of feedback, both
handled by the live-update wiring in `src/main.ts` and the finding-card styles in
`src/style.css`.
