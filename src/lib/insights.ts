import type { AnalyticsBucket } from "@/lib/types"

export type SummaryCardAction = "overview" | "trends" | "videos"

export type GuidedInsightCard = {
  id: "working" | "failing" | "next"
  title: string
  summary: string
  ctaLabel: string
  action: SummaryCardAction
}

export function buildGuidedInsightCards(
  bucket: AnalyticsBucket,
  tab: "long" | "shorts",
): GuidedInsightCard[] {
  const topVideo = bucket.topPerformers[0]
  const contentLabel = tab === "long" ? "long videos" : "shorts"
  const trendDirection = bucket.momentumPercent >= 0 ? "up" : "down"
  const trendMagnitude = Math.abs(bucket.momentumPercent).toFixed(0)
  const breakoutRate = Math.round(bucket.breakoutRate)

  const pulseSummary =
    bucket.videos.length > 0
      ? `Typical views are about ${Math.round(bucket.typicalViews).toLocaleString()} per ${contentLabel} upload (${bucket.confidence} confidence).`
      : "This channel needs more videos in this tab before trends can be trusted."

  const trendSummary =
    bucket.videos.length > 0
      ? `Recent performance is ${trendDirection} ${trendMagnitude}% and about ${breakoutRate}% of uploads beat the usual baseline.`
      : "Recent trend is neutral because there is not enough history yet."

  const nextSummary = topVideo
    ? `Use "${topVideo.title}" as a model and aim for the same format/packaging style in your next release.`
    : "Publish one more video in this tab to unlock stronger recommendations."

  return [
    {
      id: "working",
      title: "How this channel is doing",
      summary: pulseSummary,
      ctaLabel: "Go to overview",
      action: "overview",
    },
    {
      id: "failing",
      title: "What is improving or dropping",
      summary: trendSummary,
      ctaLabel: "Go to trends",
      action: "trends",
    },
    {
      id: "next",
      title: "What to do next",
      summary: nextSummary,
      ctaLabel: "Go to videos",
      action: "videos",
    },
  ]
}
