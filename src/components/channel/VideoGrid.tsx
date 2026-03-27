"use client"

import { useMemo, useState } from "react"
import { FileSearch } from "lucide-react"

import { FilterPanel } from "@/components/filters/FilterPanel"
import { SortBar } from "@/components/filters/SortBar"
import type { Video } from "@/lib/types"

import { VideoCard } from "@/components/channel/VideoCard"

type SortOption = "views" | "engagementRate" | "performanceScore" | "date" | "duration"

type VideoGridProps = {
  videos: Video[]
  channelAvgViews: number
}

export function VideoGrid({ videos, channelAvgViews }: VideoGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>("views")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [minViews, setMinViews] = useState("")

  const filteredAndSortedVideos = useMemo(() => {
    const fromTimestamp = dateFrom ? new Date(`${dateFrom}T00:00:00Z`).getTime() : null
    const toTimestamp = dateTo ? new Date(`${dateTo}T23:59:59Z`).getTime() : null
    const minViewsValue = Number.parseInt(minViews, 10)
    const minViewsThreshold =
      Number.isFinite(minViewsValue) && minViewsValue > 0 ? minViewsValue : 0

    const filtered = videos.filter((video) => {
      if (video.viewCount < minViewsThreshold) return false

      const publishedTs = new Date(video.publishedAt).getTime()
      if (fromTimestamp !== null && publishedTs < fromTimestamp) return false
      if (toTimestamp !== null && publishedTs > toTimestamp) return false

      return true
    })

    return [...filtered].sort((a, b) => compareVideos(a, b, sortBy))
  }, [dateFrom, dateTo, minViews, sortBy, videos])

  if (videos.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/60">
          <FileSearch className="h-6 w-6 text-zinc-400" />
        </div>
        <p className="text-sm font-medium text-zinc-200">Spy Report is empty.</p>
        <p className="mt-1 text-xs text-zinc-400">
          We found the channel, but no videos were returned to analyze yet.
        </p>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[auto_1fr] lg:items-start">
        <SortBar value={sortBy} onChange={setSortBy} />
        <FilterPanel
          dateFrom={dateFrom}
          dateTo={dateTo}
          minViews={minViews}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onMinViewsChange={setMinViews}
        />
      </div>

      <p className="text-xs text-zinc-400">
        Showing {filteredAndSortedVideos.length} of {videos.length} videos
      </p>

      {filteredAndSortedVideos.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/60">
            <FileSearch className="h-6 w-6 text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-200">No intel matches these filters.</p>
          <p className="mt-1 text-xs text-zinc-400">Try widening date range or lowering minimum views.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredAndSortedVideos.map((video, index) => (
            <VideoCard key={video.id} video={video} channelAvgViews={channelAvgViews} index={index} />
          ))}
        </div>
      )}
    </section>
  )
}

function compareVideos(a: Video, b: Video, sortBy: SortOption): number {
  switch (sortBy) {
    case "engagementRate":
      return b.engagementRate - a.engagementRate
    case "performanceScore":
      return b.performanceScore - a.performanceScore
    case "date":
      return parsePublishedAt(b.publishedAt) - parsePublishedAt(a.publishedAt)
    case "duration":
      return parseDurationSeconds(b.duration) - parseDurationSeconds(a.duration)
    case "views":
    default:
      return b.viewCount - a.viewCount
  }
}

function parsePublishedAt(isoDate: string): number {
  const ts = new Date(isoDate).getTime()
  return Number.isFinite(ts) ? ts : 0
}

function parseDurationSeconds(duration: string): number {
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!matches) return 0

  const hours = Number.parseInt(matches[1] ?? "0", 10) || 0
  const minutes = Number.parseInt(matches[2] ?? "0", 10) || 0
  const seconds = Number.parseInt(matches[3] ?? "0", 10) || 0
  return hours * 3600 + minutes * 60 + seconds
}
