import "./style.css";
import { parseHelpText } from "./lib/parser";
import { runRules } from "./lib/rules";
import { classifyReport, EMPTY_STATE_MESSAGES } from "./lib/report";
import { presets } from "./lib/presets";
import type { Finding } from "./lib/types";

const input = document.querySelector<HTMLTextAreaElement>("#help-input")!;
const report = document.querySelector<HTMLDivElement>("#report")!;
const presetsContainer = document.querySelector<HTMLDivElement>("#presets")!;

function renderEmptyState(message: string): void {
  report.innerHTML = `<p class="empty-state">${escapeHtml(message)}</p>`;
}

function renderFindings(findings: Finding[]): void {
  report.innerHTML = findings
    .map(
      (f) => `
        <div class="finding finding-${f.severity}">
          <p class="finding-message">${escapeHtml(f.message)}</p>
          <p class="finding-citation">${escapeHtml(f.citation)}</p>
        </div>
      `,
    )
    .join("");
}

function escapeHtml(value: string): string {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function grade(): void {
  const text = input.value;
  const parsed = parseHelpText(text);
  const state = classifyReport(text, parsed);

  if (state === "ready") {
    renderFindings(runRules(parsed));
    return;
  }
  renderEmptyState(EMPTY_STATE_MESSAGES[state]);
}

function renderPresets(): void {
  presetsContainer.innerHTML = presets
    .map(
      (preset) =>
        `<button type="button" class="preset-btn" data-preset-id="${escapeHtml(preset.id)}">${escapeHtml(preset.label)}</button>`,
    )
    .join("");

  presetsContainer.querySelectorAll<HTMLButtonElement>(".preset-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = presets.find((p) => p.id === button.dataset.presetId);
      if (!preset) return;
      input.value = preset.helpText;
      grade();
    });
  });
}

input.addEventListener("input", grade);
renderPresets();
grade();
