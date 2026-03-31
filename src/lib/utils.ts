import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInCalendarDays, format, formatDistanceToNowStrict, parseISO } from "date-fns"

import type { ParsedChannelInput, Video } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatViews(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0"
  if (n < 1000) return `${Math.round(n)}`
  if (n < 1_000_000) return compactNumber(`${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`)
  if (n < 1_000_000_000) return compactNumber(`${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`)
  return compactNumber(`${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`)
}

export function formatDate(iso: string): string {
  const parsed = parseISO(iso)
  if (Number.isNaN(parsed.getTime())) return "Invalid date"
  return format(parsed, "MMM d, yyyy")
}

export function formatRelativeDate(iso: string): string {
  const parsed = parseISO(iso)
  if (Number.isNaN(parsed.getTime())) return "Invalid date"
  return `${formatDistanceToNowStrict(parsed, { addSuffix: true })}`
}

export function formatDuration(pt: string): string {
  const totalSeconds = parseDurationSeconds(pt)
  if (totalSeconds <= 0) return "0:00"
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const totalMinutes = hours * 60 + minutes
  if (hours > 0) {
    const remMinutes = String(minutes).padStart(2, "0")
    const remSeconds = String(seconds).padStart(2, "0")
    return `${hours}:${remMinutes}:${remSeconds}`
  }
  return `${totalMinutes}:${String(seconds).padStart(2, "0")}`
}

export function parseDurationSeconds(duration: string): number {
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!matches) return 0

  const hours = Number.parseInt(matches[1] ?? "0", 10) || 0
  const minutes = Number.parseInt(matches[2] ?? "0", 10) || 0
  const seconds = Number.parseInt(matches[3] ?? "0", 10) || 0
  return hours * 3600 + minutes * 60 + seconds
}

export function isShortVideo(duration: string): boolean {
  return parseDurationSeconds(duration) <= 180
}

export function formatEngagement(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0.00%"
  const percent = n <= 1 ? n * 100 : n
  return `${percent.toFixed(2)}%`
}

export function calcEngagementRate(
  likes: number,
  comments: number,
  views: number,
): number {
  if (!Number.isFinite(views) || views <= 0) return 0
  const safeLikes = Number.isFinite(likes) && likes > 0 ? likes : 0
  const safeComments = Number.isFinite(comments) && comments > 0 ? comments : 0
  return ((safeLikes + safeComments) / views) * 100
}

export function calcPerformanceScore(
  video: Pick<Video, "viewCount" | "engagementRate">,
  channelAvgViews: number,
  channelAvgEngagement: number,
): number {
  const safeAvgViews = channelAvgViews > 0 ? channelAvgViews : 1
  const safeAvgEngagement = channelAvgEngagement > 0 ? channelAvgEngagement : 1

  const viewScore = (Math.min(video.viewCount / safeAvgViews, 3) / 3) * 55
  const engScore = (Math.min(video.engagementRate / safeAvgEngagement, 3) / 3) * 45

  const total = Math.round(viewScore + engScore)
  return Math.min(100, Math.max(0, total))
}

export function calcTrendDelta(
  video: Pick<Video, "viewCount">,
  channelAvgViews: number,
): number {
  if (!Number.isFinite(channelAvgViews) || channelAvgViews <= 0) return 0
  return ((video.viewCount - channelAvgViews) / channelAvgViews) * 100
}

export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0
  const total = values.reduce((sum, value) => sum + value, 0)
  return total / values.length
}

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }
  return sorted[middle]
}

export function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const normalizedPercentile = Math.max(0, Math.min(100, percentile))
  const index = (normalizedPercentile / 100) * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  if (lower === upper) return sorted[lower]
  const weight = index - lower
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

export function getIqrBounds(values: number[]): { lower: number; upper: number } | null {
  if (values.length < 4) return null
  const q1 = calculatePercentile(values, 25)
  const q3 = calculatePercentile(values, 75)
  const iqr = q3 - q1
  return {
    lower: q1 - iqr * 1.5,
    upper: q3 + iqr * 1.5,
  }
}

export function getConfidenceTier(sampleSize: number): "Low" | "Medium" | "High" {
  if (sampleSize >= 20) return "High"
  if (sampleSize >= 8) return "Medium"
  return "Low"
}

export function calcEstimatedEarnings(viewCount: number): number {
  if (!Number.isFinite(viewCount) || viewCount <= 0) return 0

  let cpm = 1.5
  if (viewCount >= 10_000 && viewCount <= 100_000) {
    cpm = 2.5
  } else if (viewCount > 100_000 && viewCount <= 500_000) {
    cpm = 3.5
  } else if (viewCount > 500_000 && viewCount <= 1_000_000) {
    cpm = 4.5
  } else if (viewCount > 1_000_000) {
    cpm = 5.5
  }

  return (viewCount / 1000) * cpm
}

export function formatEarnings(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return "$0"
  if (amount < 1000) return `$${Math.round(amount)}`
  if (amount < 1_000_000) return `$${compactNumber((amount / 1000).toFixed(1).replace(/\.0$/, ""))}K`
  if (amount < 1_000_000_000) {
    return `$${compactNumber((amount / 1_000_000).toFixed(1).replace(/\.0$/, ""))}M`
  }
  return `$${compactNumber((amount / 1_000_000_000).toFixed(1).replace(/\.0$/, ""))}B`
}

export function parseChannelUrl(input: string): ParsedChannelInput {
  const raw = input.trim()
  if (!raw) {
    return { type: "username", value: "" }
  }

  if (raw.startsWith("@")) {
    return { type: "handle", value: raw.replace(/^@/, "") }
  }

  const normalized =
    raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`

  try {
    const parsed = new URL(normalized)
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase()
    const path = parsed.pathname.replace(/\/+$/, "")
    const parts = path.split("/").filter(Boolean)

    if (host !== "youtube.com" && host !== "m.youtube.com" && host !== "youtu.be") {
      return { type: "username", value: raw }
    }

    if (parts.length === 0) {
      return { type: "username", value: raw }
    }

    if (parts[0]?.startsWith("@")) {
      return { type: "handle", value: parts[0].replace(/^@/, "") }
    }

    if (parts[0] === "channel" && parts[1]) {
      return { type: "channelId", value: parts[1] }
    }

    if ((parts[0] === "c" || parts[0] === "user") && parts[1]) {
      return { type: "username", value: parts[1] }
    }
  } catch {
    // Fallback to bare input heuristics below.
  }

  return { type: "username", value: raw.replace(/^@/, "") }
}

export type ExportCsvContext = {
  /** Channel average views for the active tab (same bucket as export). */
  channelAvgViews: number
  /** Channel average engagement % for the active tab. */
  avgEngagementPercent: number
}

/**
 * Exports a decision-friendly CSV: UTF-8 BOM for Excel, summary block, then rows sorted by
 * performance score (highest first) with clear metrics and tiers.
 */
export function exportToCSV(
  videos: Video[],
  channelName: string,
  tab?: "long" | "shorts",
  context?: ExportCsvContext,
): void {
  if (typeof window === "undefined" || videos.length === 0) return

  const sorted = [...videos].sort(
    (a, b) => b.performanceScore - a.performanceScore || b.viewCount - a.viewCount,
  )

  const tabLabel =
    tab === "shorts" ? "Shorts" : tab === "long" ? "Long-form videos" : "All formats"

  const metadataRows: [string, string | number][] = [
    ["Export type", "ChannelSpy channel analytics (summary + video rows)"],
    ["How to use", guidanceBlurb()],
    ["Channel", channelName.trim() || "Unknown"],
    ["Content tab", tabLabel],
    ["Sort order", "Performance Score (highest first), then Views"],
    ["Exported at (UTC)", new Date().toISOString()],
    ["Video rows below", sorted.length],
  ]

  if (context != null && Number.isFinite(context.channelAvgViews)) {
    metadataRows.push(["Channel avg views (this tab)", Math.round(context.channelAvgViews)])
  }
  if (context != null && Number.isFinite(context.avgEngagementPercent)) {
    metadataRows.push(["Channel avg engagement % (this tab)", context.avgEngagementPercent.toFixed(2)])
  }

  const headers = [
    "Rank",
    "Video Title",
    "Video ID",
    "YouTube URL",
    "Views",
    "Likes",
    "Comments",
    "Engagement Rate %",
    "Performance Score (0-100)",
    "Views vs Channel Avg %",
    "Estimated Earnings",
    "Performance Tier",
    "Published Date",
    "Days Since Published",
    "Duration",
    "Duration Seconds",
    "Format",
  ]

  const dataRows = sorted.map((video, index) => {
    const published = parseISO(video.publishedAt)
    const daysSince =
      Number.isNaN(published.getTime()) ? "" : differenceInCalendarDays(new Date(), published)
    const durSec = parseDurationSeconds(video.duration)
    const vsAvg = Number.isFinite(video.trendDelta) ? Number(video.trendDelta.toFixed(2)) : ""

    return [
      index + 1,
      video.title,
      video.id,
      `https://www.youtube.com/watch?v=${video.id}`,
      Math.round(video.viewCount),
      Math.round(video.likeCount),
      Math.round(video.commentCount),
      Number(video.engagementRate.toFixed(2)),
      video.performanceScore,
      vsAvg,
      formatEarnings(video.estimatedEarnings ?? 0),
      performanceTierLabel(video.performanceScore),
      formatDate(video.publishedAt),
      daysSince === "" ? "" : daysSince,
      formatDuration(video.duration),
      durSec,
      video.isShort ? "Short" : "Long",
    ]
  })

  const lines: string[] = []
  lines.push("\uFEFF")
  for (const [key, val] of metadataRows) {
    lines.push(`${csvCell(key)},${csvCell(val)}`)
  }
  lines.push("")
  lines.push(headers.map((h) => csvCell(h)).join(","))
  for (const row of dataRows) {
    lines.push(row.map((cell) => csvCell(cell)).join(","))
  }

  const csv = lines.join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const safeName = channelName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "channelspy-report"
  const suffix = tab === "shorts" ? "-shorts" : tab === "long" ? "-long" : ""
  const link = document.createElement("a")
  link.href = url
  link.download = `${safeName}${suffix}-analytics.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function guidanceBlurb(): string {
  return (
    "Performance Score blends views vs channel average, engagement vs average, and recency. " +
    "Views vs Channel Avg % is percent above/below this tab's average views. " +
    "Filter or sort in Excel/Sheets by Tier, Score, or vs Avg to find winners and laggards."
  )
}

function performanceTierLabel(score: number): string {
  if (score >= 75) return "Excellent"
  if (score >= 55) return "Strong"
  if (score >= 35) return "Moderate"
  return "Developing"
}

/** One CSV field: numbers unquoted (Excel-friendly); strings quoted. */
function csvCell(value: string | number): string {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return ""
    return String(value)
  }
  return escapeCsv(value)
}

function escapeCsv(value: string): string {
  const escaped = value.replace(/"/g, '""')
  return `"${escaped}"`
}

function compactNumber(value: string): string {
  // Remove normal/nbsp/narrow-nbsp whitespace to prevent "125 . 3K" artifacts.
  return value.replace(/[\s\u00A0\u202F]+/g, "")
}
