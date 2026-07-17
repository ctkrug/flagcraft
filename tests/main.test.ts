import { beforeEach, describe, expect, it, vi } from "vitest";

function mountAppShell(): void {
  document.body.innerHTML = `
    <div id="app">
      <textarea id="help-input"></textarea>
      <div id="presets"></div>
      <div id="report"></div>
    </div>
  `;
}

async function loadMain(): Promise<void> {
  vi.resetModules();
  await import("../src/main");
}

describe("app shell wiring", () => {
  beforeEach(() => {
    mountAppShell();
  });

  it("shows the idle empty state on load with no input", async () => {
    await loadMain();
    const report = document.querySelector("#report")!;
    expect(report.textContent).toContain("No help text yet");
  });

  it("re-grades on every input event", async () => {
    await loadMain();
    const input = document.querySelector<HTMLTextAreaElement>("#help-input")!;
    const report = document.querySelector("#report")!;

    input.value = "  -h, --help    Show help";
    input.dispatchEvent(new Event("input"));

    expect(report.querySelector(".finding-error")).toBeNull();
  });

  it("shows the no-flags empty state for unparsable text", async () => {
    await loadMain();
    const input = document.querySelector<HTMLTextAreaElement>("#help-input")!;
    const report = document.querySelector("#report")!;

    input.value = "just some prose, no flags here";
    input.dispatchEvent(new Event("input"));

    expect(report.textContent).toContain("Couldn't find any flags");
  });

  it("renders preset buttons and grades on click", async () => {
    await loadMain();
    const buttons = document.querySelectorAll<HTMLButtonElement>(".preset-btn");
    expect(buttons.length).toBeGreaterThan(0);

    buttons[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));

    const input = document.querySelector<HTMLTextAreaElement>("#help-input")!;
    expect(input.value.length).toBeGreaterThan(0);
    const report = document.querySelector("#report")!;
    expect(report.querySelector(".finding")).not.toBeNull();
  });

  it("escapes flag descriptions so pasted markup can't inject elements", async () => {
    await loadMain();
    const input = document.querySelector<HTMLTextAreaElement>("#help-input")!;
    const report = document.querySelector("#report")!;

    input.value = '  --help    <img src=x onerror="window.__pwned = true">';
    input.dispatchEvent(new Event("input"));

    expect(report.querySelector("img")).toBeNull();
    expect((window as unknown as { __pwned?: boolean }).__pwned).toBeUndefined();
  });
});
