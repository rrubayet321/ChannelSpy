import type { Video } from "@/lib/types"

/** Day name index → label */
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

export type DayCadenceEntry = {
  day: string
  avgViews: number
  count: number
}

/**
 * Derive average views per day-of-week from a set of videos.
 * Returns entries sorted best-to-worst, only for days that have at least one upload.
 * Minimum 5 videos required for meaningful signal.
 */
export function getBestPostingDays(videos: Video[]): DayCadenceEntry[] {
  if (videos.length < 5) return []

  const dayBuckets = new Map<number, { total: number; count: number }>()

  for (const video of videos) {
    const date = new Date(video.publishedAt)
    if (Number.isNaN(date.getTime())) continue
    const dow = date.getUTCDay()
    const existing = dayBuckets.get(dow)
    if (existing) {
      existing.total += video.viewCount
      existing.count += 1
    } else {
      dayBuckets.set(dow, { total: video.viewCount, count: 1 })
    }
  }

  return Array.from(dayBuckets.entries())
    .map(([dow, { total, count }]) => ({
      day: DAY_LABELS[dow],
      avgViews: count > 0 ? total / count : 0,
      count,
    }))
    .sort((a, b) => b.avgViews - a.avgViews)
}

/**
 * Returns a human-readable best-day sentence, e.g.:
 * "Videos posted on Wed average 45% more views than the channel typical."
 */
export function getBestDaySummary(
  videos: Video[],
  typicalViews: number,
): string | null {
  const days = getBestPostingDays(videos)
  if (days.length === 0 || typicalViews <= 0) return null
  const best = days[0]
  if (best.count < 2) return null
  const lift = ((best.avgViews - typicalViews) / typicalViews) * 100
  if (Math.abs(lift) < 5) return null
  const direction = lift >= 0 ? "more" : "fewer"
  return `Videos posted on ${best.day} average ${Math.abs(Math.round(lift))}% ${direction} views than typical.`
}
