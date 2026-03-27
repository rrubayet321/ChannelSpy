import Image from "next/image"
import { ArrowDownRight, ArrowUpRight, ExternalLink } from "lucide-react"

import { MetricBadge } from "@/components/channel/MetricBadge"
import type { Video } from "@/lib/types"
import { formatDate, formatDuration, formatEngagement, formatRelativeDate, formatViews } from "@/lib/utils"

type VideoCardProps = {
  video: Video
  channelAvgViews: number
  index: number
}

export function VideoCard({ video, channelAvgViews, index }: VideoCardProps) {
  const scoreTone = getScoreTone(video.performanceScore)
  const trendUp = video.trendDelta >= 0
  const trendLabel = `${Math.abs(video.trendDelta).toFixed(0)}% ${trendUp ? "above" : "below"} channel average`
  const aboveAverage = video.viewCount >= channelAvgViews
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`
  const scoreTopBorderClass =
    video.performanceScore >= 70
      ? "border-t-2 border-t-[#3ecf8e]"
      : video.performanceScore >= 50
        ? "border-t-2 border-t-[#4f8ef7]"
        : ""
  const isTopPerformer = index < 3

  return (
    <div
      className={`video-card-enter group overflow-hidden rounded-2xl border border-[#1e1e1e] bg-[#0f0f0f] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2a2a2a] ${scoreTopBorderClass}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
        <Image
          src={video.thumbnailUrl || "/vercel.svg"}
          alt={video.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] text-white">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-3 line-clamp-2 min-h-10 px-3 text-sm font-medium text-[#e0e0e0]">{video.title}</h3>

      {/* Date */}
      <p className="mt-1 px-3 text-xs text-[#555]" title={formatDate(video.publishedAt)}>
        {formatRelativeDate(video.publishedAt)}
      </p>

      {/* Badges */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5 px-3">
        {isTopPerformer ? (
          <span className="rounded-full border border-[#3ecf8e]/20 bg-[#3ecf8e]/10 px-2 py-0.5 text-[10px] text-[#3ecf8e]">
            Top Performer
          </span>
        ) : null}
        <MetricBadge label={`${formatEngagement(video.engagementRate)} audience connection`} tone="blue" />
        <MetricBadge label={`Strength ${video.performanceScore}`} tone={scoreTone} />
        <MetricBadge
          label={aboveAverage ? "Above channel average" : "Below channel average"}
          tone={aboveAverage ? "green" : "red"}
        />
      </div>

      {/* Stats row */}
      <div className="mt-2 flex items-center justify-between px-3 pb-3">
        <p className="font-mono text-xl font-bold text-white">{formatViews(video.viewCount)} views</p>
        <p className={`ml-auto flex items-center gap-1 text-xs ${trendUp ? "text-[#3ecf8e]" : "text-[#f04444]"}`}>
          {trendUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          {trendLabel}
        </p>
      </div>

      {/* Hover CTA */}
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-none mx-3 mb-3 inline-flex -translate-y-1 items-center gap-1 text-[10px] text-[#4f8ef7] opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100"
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
