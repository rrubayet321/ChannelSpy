"use client"

import { useMemo, useState } from "react"
import { FileSearch } from "lucide-react"

import { FilterPanel } from "@/components/filters/FilterPanel"
import { SortBar } from "@/components/filters/SortBar"
import type { Video } from "@/lib/types"
import { parseDurationSeconds } from "@/lib/utils"

import { VideoCard } from "@/components/channel/VideoCard"

type SortOption = "views" | "engagementRate" | "performanceScore" | "date" | "duration"
type FilterPreset = "all" | "month" | "quarter" | "year"

type VideoGridProps = {
  videos: Video[]
  channelAvgViews: number
}

export function VideoGrid({ videos, channelAvgViews }: VideoGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>("views")
  const [preset, setPreset] = useState<FilterPreset>("all")
  const [minViews, setMinViews] = useState("")
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const hasSecondaryFilters = preset !== "all" || minViews.trim().length > 0

  const filteredAndSortedVideos = useMemo(() => {
    const fromTimestamp = getPresetStartTimestamp(preset)
    const minViewsValue = Number.parseInt(minViews, 10)
    const minViewsThreshold =
      Number.isFinite(minViewsValue) && minViewsValue > 0 ? minViewsValue : 0

    const filtered = videos.filter((video) => {
      if (video.viewCount < minViewsThreshold) return false

      const publishedTs = new Date(video.publishedAt).getTime()
      if (fromTimestamp !== null && publishedTs < fromTimestamp) return false

      return true
    })

    return [...filtered].sort((a, b) => compareVideos(a, b, sortBy))
  }, [preset, minViews, sortBy, videos])

  if (videos.length === 0) {
    return (
      <div className="rounded-2xl border border-[#2f3b59] bg-[#10172a] p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#36496f] bg-[#1a2440]">
          <FileSearch className="h-6 w-6 text-[#c8d2ea]" />
        </div>
        <p className="text-sm font-medium text-white">Spy Report is empty.</p>
        <p className="mt-1 text-xs text-[#c1cce6]">
          We found the channel, but no videos were returned to analyze yet.
        </p>
      </div>
    )
  }

  return (
    <section className="space-y-5">
      <p className="text-left text-xs uppercase tracking-[0.14em] text-[#c4d0ea]">
        Showing {filteredAndSortedVideos.length} of {videos.length}
      </p>

      <div className="space-y-3 rounded-2xl border border-[#2f3b59] bg-[#10172a] px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#d0daf1]">
            Essentials first: sort quickly, then open advanced filters if needed.
          </p>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <SortBar value={sortBy} onChange={setSortBy} />
            <button
              type="button"
              onClick={() => setAdvancedOpen((current) => !current)}
              className="w-full rounded-lg border border-[#36496f] bg-[#17223c] px-3 py-1.5 text-xs text-[#dbe3f6] transition-colors hover:border-[#5b6d96] hover:text-white sm:w-auto"
            >
              {advancedOpen ? "Hide advanced" : "Advanced filters"}
            </button>
          </div>
        </div>

        {advancedOpen && (
          <div className="flex flex-col gap-2 border-t border-[#2c3956] pt-3">
            <FilterPanel
              preset={preset}
              minViews={minViews}
              onPresetChange={setPreset}
              onMinViewsChange={setMinViews}
            />
            {hasSecondaryFilters && (
              <button
                type="button"
                onClick={() => {
                  setPreset("all")
                  setMinViews("")
                }}
                className="self-start rounded-lg border border-[#36496f] px-2.5 py-1 text-xs text-[#dbe3f6] transition-colors hover:border-[#5b6d96] hover:text-white"
              >
                Reset advanced filters
              </button>
            )}
          </div>
        )}
      </div>

      {filteredAndSortedVideos.length === 0 ? (
        <div className="rounded-2xl border border-[#2f3b59] bg-[#10172a] p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#36496f] bg-[#1a2440]">
            <FileSearch className="h-6 w-6 text-[#c8d2ea]" />
          </div>
          <p className="text-sm font-medium text-white">No intel matches these filters.</p>
          <p className="mt-1 text-xs text-[#c1cce6]">
            Try widening date range or lowering minimum views.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 pb-16 sm:grid-cols-2 xl:grid-cols-3">
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

function getPresetStartTimestamp(preset: FilterPreset): number | null {
  if (preset === "all") return null

  const now = new Date()
  if (preset === "month") {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).getTime()
  }
  if (preset === "quarter") {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 2, 1)).getTime()
  }
  return new Date(Date.UTC(now.getUTCFullYear(), 0, 1)).getTime()
}
