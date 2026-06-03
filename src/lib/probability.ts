export type ProbabilityInterval = {
  estimate: number;
  lower: number;
  upper: number;
  margin: number;
};

const clampProbability = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Wilson score interval for a binomial proportion.
 * Accepts probabilities on the 0-1 scale and returns 0-1 bounds.
 */
export const wilsonScoreInterval = (
  estimate: number,
  samples: number,
  zScore = 1.96
): ProbabilityInterval => {
  const p = clampProbability(estimate);
  if (!Number.isFinite(samples) || samples <= 0) {
    return { estimate: p, lower: p, upper: p, margin: 0 };
  }

  const n = Math.max(1, Math.round(samples));
  const z2 = zScore ** 2;
  const denominator = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denominator;
  const spread = (zScore * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n ** 2))) / denominator;
  const lower = clampProbability(center - spread);
  const upper = clampProbability(center + spread);

  return {
    estimate: p,
    lower,
    upper,
    margin: Math.max(p - lower, upper - p),
  };
};

export const formatProbabilityMargin = (margin: number) => {
  if (!Number.isFinite(margin) || margin <= 0) return "±0%";
  return `±${Math.max(1, Math.ceil(margin * 100))}%`;
};
