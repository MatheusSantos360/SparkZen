import { describe, expect, test, vi, beforeEach } from "vitest";

vi.mock("logfy-x", () => ({
  bold: vi.fn((s: string) => s),
  dim: vi.fn((s: string) => s),
}));

import { sparkzenBanner } from "../../src/core/functions/sparkzenBanner";

describe("sparkzenBanner()", () => {
  beforeEach(() => vi.clearAllMocks());

  test("should call console.log once", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    sparkzenBanner("TEST", (s) => s);
    expect(consoleSpy).toHaveBeenCalledOnce();
    consoleSpy.mockRestore();
  });

  test("should include the message in the output", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    sparkzenBanner("MY MESSAGE", (s) => s);
    const output = consoleSpy.mock.calls[0][0] as string;
    expect(output).toContain("MY MESSAGE");
    consoleSpy.mockRestore();
  });

  test("should apply the color function to the SPARKZEN tag", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const color = vi.fn((s: string) => `[colored:${s}]`);
    sparkzenBanner("TEST", color);
    expect(color).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
