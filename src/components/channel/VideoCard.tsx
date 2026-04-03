import Image from "next/image"
import { ArrowDownRight, ArrowUpRight, DollarSign, ExternalLink } from "lucide-react"

import { MetricBadge } from "@/components/channel/MetricBadge"
import type { Video } from "@/lib/types"
import {
  formatDate,
  formatDuration,
  formatEarnings,
  formatEngagement,
  formatRelativeDate,
  formatViews,
} from "@/lib/utils"
import { trackEvent } from "@/lib/analytics"

type VideoCardProps = {
  video: Video
  channelAvgViews: number
  index: number
}

export function VideoCard({ video, channelAvgViews, index }: VideoCardProps) {
  const scoreTone = getScoreTone(video.performanceScore)
  const trendUp = video.trendDelta >= 0
  const trendLabel = `${Math.abs(video.trendDelta).toFixed(0)}% ${trendUp ? "above" : "below"} avg`
  const aboveAverage = video.viewCount >= channelAvgViews
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`
  const isTopPerformer = index < 3

  /* Top border hint for high-scorers */
  const topBorderClass =
    video.performanceScore >= 70
      ? "border-t border-t-[#3ecf8e]/40"
      : video.performanceScore >= 50
        ? "border-t border-t-white/10"
        : ""

  return (
    <div
      className={`video-card-enter group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/10 hover:bg-[#0f0f0f] ${topBorderClass}`}
      style={{ animationDelay: `${index * 45}ms` }}
    >
      {/* Subtle inner highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent"
      />

      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={video.thumbnailUrl || "/brandmark.svg"}
          alt={video.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-sm">
          {formatDuration(video.duration)}
        </span>
        {/* Top performer ribbon */}
        {isTopPerformer && (
          <span className="absolute left-2 top-2 rounded-md border border-[#3ecf8e]/20 bg-black/70 px-2 py-0.5 text-[10px] text-[#3ecf8e] backdrop-blur-sm">
            Top Performer
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-3 line-clamp-2 min-h-10 px-3.5 text-sm font-medium leading-snug text-white/90">
        {video.title}
      </h3>

      {/* Date */}
      <p className="mt-1 px-3.5 text-xs text-white/35" title={formatDate(video.publishedAt)}>
        {formatRelativeDate(video.publishedAt)}
      </p>

      {/* Badges */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 px-3.5">
        <MetricBadge label={`${formatEngagement(video.engagementRate)} engagement`} tone="blue" />
        <MetricBadge label={`Score ${video.performanceScore}`} tone={scoreTone} />
        <MetricBadge
          label={aboveAverage ? "Above avg" : "Below avg"}
          tone={aboveAverage ? "green" : "red"}
        />
        {video.isViewOutlier ? <MetricBadge label="Unusual spike" tone="amber" /> : null}
      </div>

      {/* Stats row */}
      <div className="mt-2.5 flex items-center justify-between px-3.5 pb-3.5">
        <p className="font-mono text-xl font-bold text-white">{formatViews(video.viewCount)}</p>
        <p className={`flex items-center gap-1 text-xs ${trendUp ? "text-[#3ecf8e]" : "text-[#f04444]"}`}>
          {trendUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {trendLabel}
        </p>
      </div>

      <div className="group/earnings relative mx-3.5 mb-1.5 flex items-center justify-between rounded-md border border-white/6 bg-black/20 px-2.5 py-1.5">
        <div className="flex items-center gap-1.5">
          <DollarSign className="h-[14px] w-[14px] text-[#3ecf8e]" />
          <span className="text-[10px] text-[#555]">Est. Earnings</span>
        </div>
        <span className="font-mono text-sm font-semibold text-[#3ecf8e]">
          {formatEarnings(video.estimatedEarnings ?? 0)}
        </span>
        <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-[240px] -translate-x-1/2 rounded-lg border border-[#3ecf8e]/25 bg-[#0b0b0b] px-2.5 py-2 text-[10px] leading-relaxed text-zinc-300 opacity-0 shadow-[0_12px_28px_rgba(0,0,0,0.55)] transition-opacity duration-150 group-hover/earnings:opacity-100">
          Estimated based on public CPM averages. Actual earnings vary by niche and audience.
        </span>
      </div>

      {/* Hover CTA */}
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("outbound_click", { video_id: video.id })}
        className="pointer-events-none mx-3.5 mb-3.5 inline-flex -translate-y-1 items-center gap-1 text-[10px] text-white/40 opacity-0 transition-all duration-200 hover:text-white/70 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100"
      >
        Watch on YouTube <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  )
}

function getScoreTone(score: number): "green" | "blue" | "amber" | "red" {
  if (score >= 80) return "green"
  if (score >= 60) return "blue"
  if (score >= 40) return "amber"
  return "red"
}
