import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNowStrict, parseISO } from "date-fns"

import type { ParsedChannelInput, Video } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatViews(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0"
  if (n < 1000) return `${Math.round(n)}`
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`
  if (n < 1_000_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`
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
  const matches = pt.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!matches) return "0:00"

  const hours = Number(matches[1] ?? 0)
  const minutes = Number(matches[2] ?? 0)
  const seconds = Number(matches[3] ?? 0)

  const totalMinutes = hours * 60 + minutes
  if (hours > 0) {
    const remMinutes = String(minutes).padStart(2, "0")
    const remSeconds = String(seconds).padStart(2, "0")
    return `${hours}:${remMinutes}:${remSeconds}`
  }
  return `${totalMinutes}:${String(seconds).padStart(2, "0")}`
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
  video: Pick<Video, "viewCount" | "engagementRate" | "publishedAt">,
  channelAvgViews: number,
  channelAvgEngagement: number,
): number {
  const safeAvgViews = channelAvgViews > 0 ? channelAvgViews : 1
  const safeAvgEngagement = channelAvgEngagement > 0 ? channelAvgEngagement : 1

  const viewScore = (Math.min(video.viewCount / safeAvgViews, 3) / 3) * 40
  const engScore =
    (Math.min(video.engagementRate / safeAvgEngagement, 3) / 3) * 35

  const publishedDate = parseISO(video.publishedAt)
  const daysSincePublish = Number.isNaN(publishedDate.getTime())
    ? Number.POSITIVE_INFINITY
    : Math.max(
        0,
        Math.floor((Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)),
      )

  const recencyScore =
    daysSincePublish <= 7 ? 25 : daysSincePublish <= 30 ? 15 : daysSincePublish <= 90 ? 8 : 0

  const total = Math.round(viewScore + engScore + recencyScore)
  return Math.min(100, Math.max(0, total))
}

export function calcTrendDelta(
  video: Pick<Video, "viewCount">,
  channelAvgViews: number,
): number {
  if (!Number.isFinite(channelAvgViews) || channelAvgViews <= 0) return 0
  return ((video.viewCount - channelAvgViews) / channelAvgViews) * 100
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

export function exportToCSV(videos: Video[], channelName: string): void {
  if (typeof window === "undefined" || videos.length === 0) return

  const headers = [
    "title",
    "views",
    "likes",
    "comments",
    "engagement rate",
    "performance score",
    "trend delta",
    "published date",
    "duration",
    "YouTube URL",
  ]

  const rows = videos.map((video) => [
    escapeCsv(video.title),
    String(video.viewCount),
    String(video.likeCount),
    String(video.commentCount),
    `${video.engagementRate.toFixed(2)}%`,
    String(video.performanceScore),
    `${video.trendDelta.toFixed(2)}%`,
    escapeCsv(formatDate(video.publishedAt)),
    escapeCsv(formatDuration(video.duration)),
    escapeCsv(`https://www.youtube.com/watch?v=${video.id}`),
  ])

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const safeName = channelName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "channelspy-report"
  const link = document.createElement("a")
  link.href = url
  link.download = `${safeName}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapeCsv(value: string): string {
  const escaped = value.replace(/"/g, '""')
  return `"${escaped}"`
}
