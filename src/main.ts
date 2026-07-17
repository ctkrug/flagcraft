import "./style.css";
import { parseHelpText } from "./lib/parser";
import { runRules } from "./lib/rules";
import { classifyReport, EMPTY_STATE_MESSAGES } from "./lib/report";
import type { Finding } from "./lib/types";

const input = document.querySelector<HTMLTextAreaElement>("#help-input")!;
const report = document.querySelector<HTMLDivElement>("#report")!;

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

input.addEventListener("input", grade);
grade();
