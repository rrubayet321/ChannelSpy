import { describe, expect, it } from "vitest"

import {
  calculateMedian,
  calculatePercentile,
  calcEstimatedEarnings,
  calcPerformanceScore,
  calcTrendDelta,
  formatEarnings,
  formatViews,
  getConfidenceTier,
  getIqrBounds,
  parseChannelUrl,
  parseDurationSeconds,
} from "@/lib/utils"

describe("parseChannelUrl", () => {
  it("parses @handle", () => {
    expect(parseChannelUrl("@MrBeast")).toEqual({ type: "handle", value: "MrBeast" })
  })

  it("parses /channel/UC… id", () => {
    const id = "UC1234567890abcdefghij"
    expect(parseChannelUrl(`https://www.youtube.com/channel/${id}`)).toEqual({
      type: "channelId",
      value: id,
    })
  })

  it("parses /c/customname as username", () => {
    expect(parseChannelUrl("https://youtube.com/c/SomeName")).toEqual({
      type: "username",
      value: "SomeName",
    })
  })

  it("returns empty username for blank input", () => {
    expect(parseChannelUrl("   ")).toEqual({ type: "username", value: "" })
  })
})

describe("parseDurationSeconds", () => {
  it("parses ISO 8601 duration", () => {
    expect(parseDurationSeconds("PT1H2M3S")).toBe(3600 + 120 + 3)
    expect(parseDurationSeconds("PT45S")).toBe(45)
    expect(parseDurationSeconds("PT0S")).toBe(0)
  })
})

describe("formatViews", () => {
  it("formats thousands and millions", () => {
    expect(formatViews(500)).toBe("500")
    expect(formatViews(1500)).toBe("1.5K")
    expect(formatViews(1_500_000)).toBe("1.5M")
  })

  it("handles invalid numbers", () => {
    expect(formatViews(Number.NaN)).toBe("0")
    expect(formatViews(-1)).toBe("0")
  })
})

describe("calcTrendDelta", () => {
  it("returns percent vs channel average", () => {
    expect(calcTrendDelta({ viewCount: 150 }, 100)).toBeCloseTo(50, 5)
    expect(calcTrendDelta({ viewCount: 50 }, 100)).toBeCloseTo(-50, 5)
  })

  it("returns 0 when average is missing", () => {
    expect(calcTrendDelta({ viewCount: 100 }, 0)).toBe(0)
  })
})

describe("calcPerformanceScore", () => {
  it("scores in 0–100 range", () => {
    const score = calcPerformanceScore({ viewCount: 200, engagementRate: 4 }, 100, 2)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it("rewards above-average views and engagement", () => {
    const low = calcPerformanceScore({ viewCount: 50, engagementRate: 1 }, 100, 2)
    const high = calcPerformanceScore({ viewCount: 300, engagementRate: 6 }, 100, 2)
    expect(high).toBeGreaterThan(low)
  })
})

describe("robust analytics helpers", () => {
  it("calculates median correctly", () => {
    expect(calculateMedian([1, 9, 3])).toBe(3)
    expect(calculateMedian([1, 3, 9, 11])).toBe(6)
    expect(calculateMedian([])).toBe(0)
  })

  it("calculates percentiles on sorted distribution", () => {
    const values = [10, 20, 30, 40, 50]
    expect(calculatePercentile(values, 25)).toBe(20)
    expect(calculatePercentile(values, 50)).toBe(30)
    expect(calculatePercentile(values, 75)).toBe(40)
  })

  it("builds IQR bounds and handles small samples", () => {
    expect(getIqrBounds([1, 2, 3])).toBeNull()
    const bounds = getIqrBounds([100, 110, 120, 130, 150, 160, 500])
    expect(bounds).not.toBeNull()
    expect(bounds!.upper).toBeLessThan(500)
  })

  it("assigns confidence tiers from sample size", () => {
    expect(getConfidenceTier(3)).toBe("Low")
    expect(getConfidenceTier(10)).toBe("Medium")
    expect(getConfidenceTier(25)).toBe("High")
  })
})

describe("estimated earnings", () => {
  it("applies tiered CPM boundaries correctly", () => {
    expect(calcEstimatedEarnings(9_999)).toBeCloseTo((9_999 / 1000) * 1.5, 6)
    expect(calcEstimatedEarnings(10_000)).toBeCloseTo((10_000 / 1000) * 2.5, 6)
    expect(calcEstimatedEarnings(100_000)).toBeCloseTo((100_000 / 1000) * 2.5, 6)
    expect(calcEstimatedEarnings(100_001)).toBeCloseTo((100_001 / 1000) * 3.5, 6)
    expect(calcEstimatedEarnings(500_000)).toBeCloseTo((500_000 / 1000) * 3.5, 6)
    expect(calcEstimatedEarnings(500_001)).toBeCloseTo((500_001 / 1000) * 4.5, 6)
    expect(calcEstimatedEarnings(1_000_000)).toBeCloseTo((1_000_000 / 1000) * 4.5, 6)
    expect(calcEstimatedEarnings(1_000_001)).toBeCloseTo((1_000_001 / 1000) * 5.5, 6)
  })

  it("formats compact earnings strings", () => {
    expect(formatEarnings(0)).toBe("$0")
    expect(formatEarnings(950)).toBe("$950")
    expect(formatEarnings(1_250)).toBe("$1.3K")
    expect(formatEarnings(45_300)).toBe("$45.3K")
    expect(formatEarnings(1_200_000)).toBe("$1.2M")
  })
})
