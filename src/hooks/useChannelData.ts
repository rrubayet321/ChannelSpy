"use client"

import { useCallback, useMemo, useState } from "react"

import type { Channel, ChannelAnalytics, ParsedChannelInput, Video } from "@/lib/types"
import {
  calcEngagementRate,
  calcPerformanceScore,
  calcTrendDelta,
  parseChannelUrl,
} from "@/lib/utils"

type UseChannelDataState = {
  data: ChannelAnalytics | null
  isLoading: boolean
  error: string | null
  errorCode: ApiErrorCode | null
}

type UseChannelDataResult = UseChannelDataState & {
  analyzeChannel: (input: string, options?: { forceRefresh?: boolean }) => Promise<ChannelAnalytics | null>
  clear: () => void
}

type ApiErrorResponse = {
  error?: {
    code?: ApiErrorCode
    message?: string
  }
}

type ApiErrorCode = "NOT_FOUND" | "QUOTA_EXCEEDED" | "INVALID_INPUT" | "UNKNOWN"

type ChannelActionResponse = {
  channel: Channel
}

type VideosActionResponse = {
  nextPageToken: string | null
  videos: Array<{
    id: string
    title: string
    thumbnailUrl: string
    publishedAt: string
  }>
}

type StatsActionResponse = {
  stats: Array<{
    id: string
    title: string
    publishedAt: string
    thumbnailUrl: string
    duration: string
    viewCount: number
    likeCount: number
    commentCount: number
  }>
}

const analyticsCache = new Map<string, ChannelAnalytics>()
const MAX_VIDEOS_TO_FETCH = 200
const YOUTUBE_API_ROUTE = "/api/youtube"

export function useChannelData(): UseChannelDataResult {
  const [state, setState] = useState<UseChannelDataState>({
    data: null,
    isLoading: false,
    error: null,
    errorCode: null,
  })

  const clear = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
      errorCode: null,
    })
  }, [])

  const analyzeChannel = useCallback(
    async (input: string, options?: { forceRefresh?: boolean }): Promise<ChannelAnalytics | null> => {
      const parsedInput = parseChannelUrl(input)
      if (!parsedInput.value) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Please enter a valid YouTube channel URL or handle.",
          errorCode: "INVALID_INPUT",
        }))
        return null
      }

      const cacheKey = toCacheKey(parsedInput)
      if (!options?.forceRefresh && analyticsCache.has(cacheKey)) {
        const cachedData = analyticsCache.get(cacheKey) ?? null
        setState({
          data: cachedData,
          isLoading: false,
          error: null,
          errorCode: null,
        })
        return cachedData
      }

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        errorCode: null,
      }))

      try {
        const channelResponse = await fetchChannel(parsedInput)
        const allVideos = await fetchPlaylistVideos(channelResponse.uploadsPlaylistId)
        const statsById = await fetchStatsMap(allVideos.map((video) => video.id))

        const mergedBase = allVideos
          .map((playlistVideo) => {
            const stats = statsById.get(playlistVideo.id)
            if (!stats) return null

            return {
              id: playlistVideo.id,
              title: stats.title || playlistVideo.title,
              thumbnailUrl: stats.thumbnailUrl || playlistVideo.thumbnailUrl,
              publishedAt: stats.publishedAt || playlistVideo.publishedAt,
              duration: stats.duration,
              viewCount: stats.viewCount,
              likeCount: stats.likeCount,
              commentCount: stats.commentCount,
            }
          })
          .filter((video): video is NonNullable<typeof video> => video !== null)

        const avgViews = calculateAverage(mergedBase.map((video) => video.viewCount))
        const baseWithEngagement = mergedBase.map((video) => ({
          ...video,
          engagementRate: calcEngagementRate(video.likeCount, video.commentCount, video.viewCount),
        }))
        const avgEngagement = calculateAverage(
          baseWithEngagement.map((video) => video.engagementRate),
        )

        const videos: Video[] = baseWithEngagement.map((video) => {
          const performanceScore = calcPerformanceScore(video, avgViews, avgEngagement)
          const trendDelta = calcTrendDelta(video, avgViews)

          return {
            ...video,
            performanceScore,
            trendDelta,
          }
        })

        const topPerformers = [...videos]
          .sort((a, b) => b.performanceScore - a.performanceScore)
          .slice(0, 3)

        const analytics: ChannelAnalytics = {
          channel: channelResponse,
          videos,
          avgViews,
          avgEngagement,
          postingFrequency: calculatePostingFrequency(videos),
          topPerformers,
        }

        analyticsCache.set(cacheKey, analytics)
        setState({
          data: analytics,
          isLoading: false,
          error: null,
          errorCode: null,
        })
        return analytics
      } catch (error) {
        const details = normalizeUnknownError(error)
        setState({
          data: null,
          isLoading: false,
          error: details.message,
          errorCode: details.code,
        })
        return null
      }
    },
    [],
  )

  return useMemo(
    () => ({
      ...state,
      analyzeChannel,
      clear,
    }),
    [analyzeChannel, clear, state],
  )
}

async function fetchChannel(parsedInput: ParsedChannelInput): Promise<Channel> {
  const params = new URLSearchParams({ action: "channel" })
  if (parsedInput.type === "channelId") {
    params.set("channelId", parsedInput.value)
  } else {
    params.set("handle", parsedInput.value)
  }

  const response = await fetch(`${YOUTUBE_API_ROUTE}?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  })
  const payload = (await response.json()) as ChannelActionResponse | ApiErrorResponse
  if (!response.ok) {
    throw toChannelDataError(payload, "Failed to fetch channel data.")
  }
  if (!("channel" in payload) || !payload.channel?.uploadsPlaylistId) {
    throw new ChannelDataError("Channel response is missing required metadata.", "UNKNOWN")
  }

  return payload.channel
}

async function fetchPlaylistVideos(playlistId: string): Promise<VideosActionResponse["videos"]> {
  const allVideos: VideosActionResponse["videos"] = []
  let nextPageToken: string | null = null

  while (allVideos.length < MAX_VIDEOS_TO_FETCH) {
    const params = new URLSearchParams({
      action: "videos",
      playlistId,
      maxResults: "50",
    })
    if (nextPageToken) {
      params.set("pageToken", nextPageToken)
    }

    const response = await fetch(`${YOUTUBE_API_ROUTE}?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    })
    const payload = (await response.json()) as VideosActionResponse | ApiErrorResponse
    if (!response.ok) {
      throw toChannelDataError(payload, "Failed to fetch channel videos.")
    }
    if (!("videos" in payload) || !Array.isArray(payload.videos)) {
      throw new ChannelDataError("Videos response is malformed.", "UNKNOWN")
    }

    allVideos.push(...payload.videos)
    nextPageToken = payload.nextPageToken

    if (!nextPageToken) {
      break
    }
  }

  return allVideos.slice(0, MAX_VIDEOS_TO_FETCH)
}

async function fetchStatsMap(videoIds: string[]): Promise<Map<string, StatsActionResponse["stats"][number]>> {
  const statsMap = new Map<string, StatsActionResponse["stats"][number]>()
  const uniqueIds = Array.from(new Set(videoIds.filter(Boolean)))

  for (let i = 0; i < uniqueIds.length; i += 50) {
    const chunk = uniqueIds.slice(i, i + 50)
    if (chunk.length === 0) continue

    const params = new URLSearchParams({
      action: "stats",
      ids: chunk.join(","),
    })
    const response = await fetch(`${YOUTUBE_API_ROUTE}?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    })
    const payload = (await response.json()) as StatsActionResponse | ApiErrorResponse

    if (!response.ok) {
      throw toChannelDataError(payload, "Failed to fetch video stats.")
    }
    if (!("stats" in payload) || !Array.isArray(payload.stats)) {
      throw new ChannelDataError("Stats response is malformed.", "UNKNOWN")
    }

    for (const video of payload.stats) {
      statsMap.set(video.id, video)
    }
  }

  return statsMap
}

function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0
  const total = values.reduce((sum, value) => sum + value, 0)
  return total / values.length
}

function calculatePostingFrequency(videos: Pick<Video, "publishedAt">[]): string {
  if (videos.length < 2) return "~N/A"

  const timestamps = videos
    .map((video) => new Date(video.publishedAt).getTime())
    .filter((timestamp) => Number.isFinite(timestamp))
    .sort((a, b) => b - a)

  if (timestamps.length < 2) return "~N/A"

  let gapDaysTotal = 0
  for (let i = 0; i < timestamps.length - 1; i += 1) {
    const gapMs = Math.max(0, timestamps[i] - timestamps[i + 1])
    gapDaysTotal += gapMs / (1000 * 60 * 60 * 24)
  }

  const avgDaysBetweenUploads = gapDaysTotal / (timestamps.length - 1)
  if (!Number.isFinite(avgDaysBetweenUploads) || avgDaysBetweenUploads <= 0) return "~N/A"

  if (avgDaysBetweenUploads < 30) {
    const videosPerWeek = 7 / avgDaysBetweenUploads
    return `~${videosPerWeek.toFixed(1)} videos/week`
  }

  const videosPerMonth = 30 / avgDaysBetweenUploads
  return `~${videosPerMonth.toFixed(1)} videos/month`
}

function extractApiErrorDetails(payload: unknown, fallback: string): {
  message: string
  code: ApiErrorCode
} {
  const apiError = payload as ApiErrorResponse
  const code = apiError.error?.code
  const message = apiError.error?.message
  if (!code && !message) return { message: fallback, code: "UNKNOWN" }

  switch (code) {
    case "NOT_FOUND":
      return {
        message: "Channel not found. Check the URL/handle and try again.",
        code: "NOT_FOUND",
      }
    case "QUOTA_EXCEEDED":
      return {
        message: "YouTube quota is currently exceeded. Please try again later.",
        code: "QUOTA_EXCEEDED",
      }
    case "INVALID_INPUT":
      return {
        message: message ?? "The provided channel input is invalid.",
        code: "INVALID_INPUT",
      }
    default:
      return { message: message ?? fallback, code: "UNKNOWN" }
  }
}

class ChannelDataError extends Error {
  code: ApiErrorCode

  constructor(message: string, code: ApiErrorCode) {
    super(message)
    this.code = code
  }
}

function toChannelDataError(payload: unknown, fallback: string): ChannelDataError {
  const details = extractApiErrorDetails(payload, fallback)
  return new ChannelDataError(details.message, details.code)
}

function normalizeUnknownError(error: unknown): { message: string; code: ApiErrorCode } {
  if (error instanceof ChannelDataError) {
    return { message: error.message, code: error.code }
  }
  if (error instanceof Error) {
    return { message: error.message, code: "UNKNOWN" }
  }
  return { message: "Failed to load channel analytics.", code: "UNKNOWN" }
}

function toCacheKey(parsedInput: ParsedChannelInput): string {
  return `${parsedInput.type}:${parsedInput.value.toLowerCase()}`
}
