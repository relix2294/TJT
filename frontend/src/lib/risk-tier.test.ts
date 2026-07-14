import { describe, expect, it } from "vitest";
import { normalizeRiskTier, riskTierLabel, riskTierScore } from "@/lib/risk-tier";

describe("normalizeRiskTier", () => {
  it("passes through current tier codes", () => {
    expect(normalizeRiskTier("lower")).toBe("lower");
    expect(normalizeRiskTier("medium")).toBe("medium");
    expect(normalizeRiskTier("higher")).toBe("higher");
  });

  it("maps legacy credit-letter codes", () => {
    expect(normalizeRiskTier("AAA")).toBe("lower");
    expect(normalizeRiskTier("AA")).toBe("medium");
    expect(normalizeRiskTier("A")).toBe("higher");
  });

  it("defaults unknown / empty values to medium", () => {
    expect(normalizeRiskTier("")).toBe("medium");
    expect(normalizeRiskTier(null)).toBe("medium");
    expect(normalizeRiskTier(undefined)).toBe("medium");
    expect(normalizeRiskTier("ZZZ")).toBe("medium");
  });

  it("is case-insensitive and trims for legacy letters", () => {
    expect(normalizeRiskTier("  aaa ")).toBe("lower");
  });
});

describe("riskTierLabel", () => {
  it("localizes each tier", () => {
    expect(riskTierLabel("lower", "en")).toBe("Lower risk");
    expect(riskTierLabel("lower", "ru")).toBe("Ниже риск");
    expect(riskTierLabel("AA", "ru")).toBe("Средний риск");
    expect(riskTierLabel("higher", "en")).toBe("Higher risk");
  });

  it("never emits a raw credit-letter code", () => {
    for (const raw of ["AAA", "AA", "A", "lower", "medium", "higher"]) {
      for (const lang of ["en", "ru"] as const) {
        expect(riskTierLabel(raw, lang)).not.toMatch(/^A+$/);
      }
    }
  });
});

describe("riskTierScore", () => {
  it("maps tiers to a coarse out-of-5 score", () => {
    expect(riskTierScore("lower")).toBe("4.9");
    expect(riskTierScore("medium")).toBe("4.7");
    expect(riskTierScore("higher")).toBe("4.5");
    expect(riskTierScore("AAA")).toBe("4.9");
  });
});
