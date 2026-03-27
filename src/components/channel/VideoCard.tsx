import Image from "next/image"
import { ArrowDownRight, ArrowUpRight, ExternalLink } from "lucide-react"

import { MetricBadge } from "@/components/channel/MetricBadge"
import { Card, CardContent } from "@/components/ui/card"
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
  const trendLabel = `${trendUp ? "+" : ""}${video.trendDelta.toFixed(0)}% vs avg`
  const aboveAverage = video.viewCount >= channelAvgViews
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`

  return (
    <Card
      className="video-card-enter group overflow-hidden border-zinc-800 bg-zinc-900/70 transition-all duration-200 hover:scale-[1.01] hover:border-zinc-500 hover:shadow-lg hover:shadow-black/30"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-0">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={video.thumbnailUrl || "/vercel.svg"}
            alt={video.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 font-mono text-xs text-zinc-100">
            {formatDuration(video.duration)}
          </span>
        </div>

        <div className="space-y-3 p-4">
          <h3 className="line-clamp-2 min-h-10 text-sm font-medium text-zinc-100">{video.title}</h3>

          <p className="text-xs text-zinc-400" title={formatDate(video.publishedAt)}>
            {formatRelativeDate(video.publishedAt)}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <MetricBadge label={`${formatEngagement(video.engagementRate)} engagement`} tone="blue" />
            <MetricBadge label={`Score ${video.performanceScore}`} tone={scoreTone} />
            <MetricBadge
              label={aboveAverage ? "Above avg" : "Below avg"}
              tone={aboveAverage ? "green" : "red"}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="font-mono text-sm text-zinc-100">{formatViews(video.viewCount)} views</p>
            <p
              className={`flex items-center gap-1 text-xs ${
                trendUp ? "text-emerald-300" : "text-red-300"
              }`}
            >
              {trendUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {trendLabel}
            </p>
          </div>

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-300 opacity-0 -translate-y-1 pointer-events-none transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto hover:border-zinc-500 hover:text-zinc-100"
          >
            Watch on YouTube <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

function getScoreTone(score: number): "green" | "blue" | "amber" | "red" {
  if (score >= 80) return "green"
  if (score >= 60) return "blue"
  if (score >= 40) return "amber"
  return "red"
}
