import { describe, expect, it } from "vitest";
import { summarizeCsvImportIssues, type CsvImportIssue } from "../importReport";

describe("summarizeCsvImportIssues", () => {
  it("groups skipped import rows by issue type", () => {
    const issues: CsvImportIssue[] = [
      { kind: "missing-team", rowNumber: 2 },
      { kind: "missing-team", rowNumber: 5 },
      { kind: "duplicate-id", rowNumber: 7, detail: "g1" },
    ];

    expect(summarizeCsvImportIssues(issues)).toEqual([
      "2 row(s) skipped: missing Away/Home team (rows 2, 5)",
      "1 row(s) skipped: duplicate Game ID (rows 7) — g1",
    ]);
  });

  it("limits long row lists", () => {
    const issues: CsvImportIssue[] = Array.from({ length: 6 }, (_, index) => ({
      kind: "unknown-team",
      rowNumber: index + 2,
    }));

    expect(summarizeCsvImportIssues(issues, 3)).toEqual([
      "6 row(s) skipped: team name mismatch (rows 2, 3, 4, +3 more)",
    ]);
  });
});
