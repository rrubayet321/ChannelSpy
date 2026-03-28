import { describe, expect, it } from "vitest"

import {
  calcPerformanceScore,
  calcTrendDelta,
  formatViews,
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
  const recent = new Date().toISOString()

  it("scores in 0–100 range", () => {
    const score = calcPerformanceScore(
      {
        viewCount: 200,
        engagementRate: 4,
        publishedAt: recent,
      },
      100,
      2,
    )
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it("rewards above-average views and engagement", () => {
    const low = calcPerformanceScore(
      { viewCount: 50, engagementRate: 1, publishedAt: recent },
      100,
      2,
    )
    const high = calcPerformanceScore(
      { viewCount: 300, engagementRate: 6, publishedAt: recent },
      100,
      2,
    )
    expect(high).toBeGreaterThan(low)
  })
})
