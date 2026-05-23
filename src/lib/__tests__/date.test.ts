import { describe, expect, it } from "vitest";
import { normalizeDateInput, parseDateValue, formatGameDate } from "../date";

describe("normalizeDateInput", () => {
  it("normalizes M/D form", () => {
    expect(normalizeDateInput("5/1")).toBe("5/1");
    expect(normalizeDateInput("05/01")).toBe("5/1");
    expect(normalizeDateInput("12/31")).toBe("12/31");
  });

  it("clamps out-of-range values", () => {
    expect(normalizeDateInput("13/1")).toBe("12/1");
    expect(normalizeDateInput("5/40")).toBe("5/31");
  });

  it("parses ISO dates", () => {
    expect(normalizeDateInput("2026-05-01")).toBe("5/1");
  });

  it("accepts alpha-month tokens", () => {
    expect(normalizeDateInput("May 1")).toBe("5/1");
    expect(normalizeDateInput("Jun 15")).toBe("6/15");
  });

  it("rejects bare numbers and noise", () => {
    expect(normalizeDateInput("5")).toBe("");
    expect(normalizeDateInput("hello")).toBe("");
    expect(normalizeDateInput("")).toBe("");
  });

  it("formatGameDate falls back to placeholder", () => {
    expect(formatGameDate("")).toBe("No Date");
    expect(formatGameDate("5/1")).toBe("5/1");
  });

  it("parseDateValue is finite for valid dates and infinite for blanks", () => {
    expect(Number.isFinite(parseDateValue("5/1"))).toBe(true);
    expect(parseDateValue("")).toBe(Number.POSITIVE_INFINITY);
  });
});
