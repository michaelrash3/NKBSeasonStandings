import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadSettings, loadTeams } from "../storage";

const backing = new Map<string, string>();

beforeEach(() => {
  backing.clear();
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => backing.get(k) ?? null,
    setItem: (k: string, v: string) => { backing.set(k, v); },
    removeItem: (k: string) => { backing.delete(k); },
  });
});

describe("storage hardening", () => {
  it("falls back safely from corrupted json", () => {
    backing.set("league_teams_v1", "{oops");
    expect(loadTeams()).toEqual([]);
  });

  it("coerces out-of-range settings", () => {
    backing.set("league_settings_v1", JSON.stringify({ goldCutoff: -3, maxScoreCap: 500 }));
    const settings = loadSettings();
    expect(settings.goldCutoff).toBe(1);
    expect(settings.maxScoreCap).toBe(99);
  });
});
