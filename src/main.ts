import "./style.css";
import { parseHelpText } from "./lib/parser";
import { runRules } from "./lib/rules";
import type { Finding } from "./lib/types";

const input = document.querySelector<HTMLTextAreaElement>("#help-input")!;
const report = document.querySelector<HTMLDivElement>("#report")!;

function renderFindings(findings: Finding[]): void {
  if (findings.length === 0) {
    report.innerHTML = '<p class="empty-state">No help text yet — paste some to grade it.</p>';
    return;
  }

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
  const text = input.value.trim();
  if (!text) {
    renderFindings([]);
    return;
  }
  const parsed = parseHelpText(text);
  renderFindings(runRules(parsed));
}

input.addEventListener("input", grade);
grade();
