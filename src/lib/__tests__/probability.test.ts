import { describe, expect, it } from "vitest";
import { formatProbabilityMargin, wilsonScoreInterval } from "../probability";

describe("wilsonScoreInterval", () => {
  it("keeps bounds inside the probability scale", () => {
    const interval = wilsonScoreInterval(0.5, 220);
    expect(interval.lower).toBeGreaterThanOrEqual(0);
    expect(interval.upper).toBeLessThanOrEqual(1);
    expect(interval.lower).toBeLessThan(interval.estimate);
    expect(interval.upper).toBeGreaterThan(interval.estimate);
  });

  it("shrinks as sample size increases", () => {
    const small = wilsonScoreInterval(0.5, 50);
    const large = wilsonScoreInterval(0.5, 500);
    expect(large.margin).toBeLessThan(small.margin);
  });

  it("formats readable percentage margins", () => {
    expect(formatProbabilityMargin(0)).toBe("±0%");
    expect(formatProbabilityMargin(0.011)).toBe("±2%");
  });
});
