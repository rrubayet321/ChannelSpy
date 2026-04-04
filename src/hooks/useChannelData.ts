"use client"

import { useCallback, useMemo, useRef, useState, startTransition } from "react"

import type { AnalyticsBucket, Channel, ChannelAnalytics, ParsedChannelInput, Video } from "@/lib/types"
import {
  calculateAverage,
  calculateMedian,
  calculatePercentile,
  calcEstimatedEarnings,
  calcEngagementRate,
  calcPerformanceScore,
  calcTrendDelta,
  getConfidenceTier,
  getIqrBounds,
  isShortVideo,
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

  /** Bumps when a new analysis starts or `clear` runs so stale async work cannot overwrite state. */
  const analysisGenerationRef = useRef(0)

  const clear = useCallback(() => {
    analysisGenerationRef.current += 1
    setState({
      data: null,
      isLoading: false,
      error: null,
      errorCode: null,
    })
  }, [])

  const analyzeChannel = useCallback(
    async (input: string, options?: { forceRefresh?: boolean }): Promise<ChannelAnalytics | null> => {
      const requestGeneration = ++analysisGenerationRef.current

      const isStale = () => requestGeneration !== analysisGenerationRef.current

      const parsedInput = parseChannelUrl(input)
      if (!parsedInput.value) {
        if (isStale()) return null
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
        if (isStale()) return null
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

        if (isStale()) return null

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

        const baseWithEngagementAndType = mergedBase.map((video) => ({
          ...video,
          isShort: isShortVideo(video.duration),
          engagementRate: calcEngagementRate(video.likeCount, video.commentCount, video.viewCount),
        }))

        const longForm = buildAnalyticsBucket(
          baseWithEngagementAndType.filter((video) => !video.isShort),
        )
        const shorts = buildAnalyticsBucket(
          baseWithEngagementAndType.filter((video) => video.isShort),
        )

        const analytics: ChannelAnalytics = {
          channel: channelResponse,
          longForm,
          shorts,
        }

        analyticsCache.set(cacheKey, analytics)
        if (isStale()) return null
        startTransition(() => {
          setState({
            data: analytics,
            isLoading: false,
            error: null,
            errorCode: null,
          })
        })
        return analytics
      } catch (error) {
        if (isStale()) return null
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

function buildAnalyticsBucket(
  videos: Array<
    Pick<Video, "id" | "title" | "thumbnailUrl" | "publishedAt" | "duration" | "viewCount" | "likeCount" | "commentCount"> & {
      isShort: boolean
      engagementRate: number
    }
  >,
): AnalyticsBucket {
  if (videos.length === 0) {
    return {
      videos: [],
      avgViews: 0,
      typicalViews: 0,
      avgEngagement: 0,
      totalEstimatedEarnings: 0,
      avgEarningsPerVideo: 0,
      confidence: "Low",
      breakoutRate: 0,
      viewPercentiles: {
        p25: 0,
        p50: 0,
        p75: 0,
      },
      momentumPercent: 0,
      consistencyScore: 0,
      postingFrequency: "~N/A",
      topPerformers: [],
    }
  }

  const viewValues = videos.map((video) => video.viewCount)
  const engagementValues = videos.map((video) => video.engagementRate)
  const rawAvgViews = calculateAverage(viewValues)
  const avgEngagement = calculateAverage(engagementValues)
  const typicalViews = calculateMedian(viewValues)
  const iqrBounds = getIqrBounds(viewValues)

  const baselineVideos =
    iqrBounds == null
      ? videos
      : videos.filter(
          (video) => video.viewCount >= iqrBounds.lower && video.viewCount <= iqrBounds.upper,
        )

  const avgViews =
    baselineVideos.length > 0
      ? calculateAverage(baselineVideos.map((video) => video.viewCount))
      : rawAvgViews

  const robustBaselineViews = typicalViews > 0 ? typicalViews : avgViews
  const viewPercentiles = {
    p25: calculatePercentile(viewValues, 25),
    p50: calculatePercentile(viewValues, 50),
    p75: calculatePercentile(viewValues, 75),
  }

  const sortedByRecent = [...videos].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
  const recencyWeights = new Map<string, number>(
    sortedByRecent.map((video, index) => [video.id, 1 + Math.max(0, 12 - index) * 0.02]),
  )

  const enrichedVideos: Video[] = videos.map((video) => {
    const performanceScore = calcPerformanceScore(video, robustBaselineViews, avgEngagement)
    const trendDelta = calcTrendDelta(video, robustBaselineViews)
    const estimatedEarnings = calcEstimatedEarnings(video.viewCount)
    const isViewOutlier =
      iqrBounds != null &&
      (video.viewCount < iqrBounds.lower || video.viewCount > iqrBounds.upper)
    return {
      ...video,
      isViewOutlier,
      estimatedEarnings,
      performanceScore,
      trendDelta,
    }
  })

  const topPerformers = [...enrichedVideos]
    .sort(
      (a, b) =>
        b.performanceScore * (recencyWeights.get(b.id) ?? 1) -
        a.performanceScore * (recencyWeights.get(a.id) ?? 1),
    )
    .slice(0, 3)

  const breakoutThreshold = robustBaselineViews * 1.5
  const breakoutCount =
    breakoutThreshold > 0
      ? enrichedVideos.filter((video) => video.viewCount >= breakoutThreshold).length
      : 0
  const breakoutRate = enrichedVideos.length > 0 ? (breakoutCount / enrichedVideos.length) * 100 : 0
  const totalEstimatedEarnings = enrichedVideos.reduce(
    (sum, video) => sum + (video.estimatedEarnings ?? 0),
    0,
  )
  const avgEarningsPerVideo =
    enrichedVideos.length > 0 ? totalEstimatedEarnings / enrichedVideos.length : 0

  return {
    videos: enrichedVideos,
    avgViews,
    typicalViews,
    avgEngagement,
    totalEstimatedEarnings,
    avgEarningsPerVideo,
    confidence: getConfidenceTier(enrichedVideos.length),
    breakoutRate,
    viewPercentiles,
    momentumPercent: calculateMomentumPercent(enrichedVideos),
    consistencyScore: calculateConsistencyScore(enrichedVideos),
    postingFrequency: calculatePostingFrequency(enrichedVideos),
    topPerformers,
  }
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

function calculateMomentumPercent(videos: Pick<Video, "publishedAt" | "viewCount">[]): number {
  if (videos.length < 6) return 0

  const sorted = [...videos].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
  const recent = sorted.slice(0, 5)
  const previous = sorted.slice(5, 10)
  if (previous.length === 0) return 0

  const recentAvg = calculateAverage(recent.map((video) => video.viewCount))
  const previousAvg = calculateAverage(previous.map((video) => video.viewCount))
  if (previousAvg <= 0) return 0

  return ((recentAvg - previousAvg) / previousAvg) * 100
}

function calculateConsistencyScore(videos: Pick<Video, "publishedAt">[]): number {
  if (videos.length < 3) return 0

  const timestamps = videos
    .map((video) => new Date(video.publishedAt).getTime())
    .filter((timestamp) => Number.isFinite(timestamp))
    .sort((a, b) => b - a)

  if (timestamps.length < 3) return 0

  const gaps: number[] = []
  for (let i = 0; i < timestamps.length - 1; i += 1) {
    const gapDays = Math.max(0, timestamps[i] - timestamps[i + 1]) / (1000 * 60 * 60 * 24)
    gaps.push(gapDays)
  }

  const avgGap = calculateAverage(gaps)
  if (avgGap <= 0) return 0

  const variance = calculateAverage(gaps.map((gap) => (gap - avgGap) ** 2))
  const stdDev = Math.sqrt(variance)
  const coefficient = stdDev / avgGap

  const score = Math.round((1 - Math.min(coefficient, 1.2) / 1.2) * 100)
  return Math.max(0, Math.min(100, score))
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
