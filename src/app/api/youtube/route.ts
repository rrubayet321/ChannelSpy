import { NextRequest, NextResponse } from "next/server"

type ApiErrorCode =
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "QUOTA_EXCEEDED"
  | "UPSTREAM_ERROR"
  | "SERVER_MISCONFIGURED"

type ApiErrorResponse = {
  error: {
    code: ApiErrorCode
    message: string
  }
}

type YouTubeError = {
  error?: {
    code?: number
    errors?: Array<{
      reason?: string
    }>
  }
}

type YouTubeData = {
  items?: Array<Record<string, unknown>>
  nextPageToken?: string
  prevPageToken?: string
  pageInfo?: {
    totalResults?: unknown
    resultsPerPage?: unknown
  }
}

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"

export async function GET(request: NextRequest) {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    return errorResponse(
      500,
      "SERVER_MISCONFIGURED",
      "YouTube API key is not configured on the server.",
    )
  }

  const params = request.nextUrl.searchParams
  const action = params.get("action")

  if (!action) {
    return errorResponse(400, "INVALID_INPUT", "Missing required query param: action.")
  }

  switch (action) {
    case "channel":
      return handleChannelAction(params, apiKey)
    case "videos":
      return handleVideosAction(params, apiKey)
    case "stats":
      return handleStatsAction(params, apiKey)
    default:
      return errorResponse(400, "INVALID_INPUT", "Invalid action.")
  }
}

async function handleChannelAction(params: URLSearchParams, apiKey: string) {
  const handle = sanitizeValue(params.get("handle"))
  const channelId = sanitizeValue(params.get("channelId"))

  if (!handle && !channelId) {
    return errorResponse(
      400,
      "INVALID_INPUT",
      "Provide one of: handle or channelId for action=channel.",
    )
  }

  const query = new URLSearchParams({
    part: "snippet,statistics,contentDetails",
    key: apiKey,
  })

  if (handle) {
    query.set("forHandle", handle.startsWith("@") ? handle : `@${handle}`)
  } else if (channelId) {
    query.set("id", channelId)
  }

  const upstream = await fetchYouTube(`/channels?${query.toString()}`)
  if ("error" in upstream) return upstream.error

  const data = upstream.data as YouTubeData
  const item = data.items?.[0]
  if (!item) {
    return errorResponse(404, "NOT_FOUND", "Channel not found.")
  }

  const snippet = asRecord(item?.snippet)
  const statistics = asRecord(item?.statistics)
  const contentDetails = asRecord(item?.contentDetails)
  const brandingSettings = asRecord(item?.brandingSettings)
  const image = asRecord(brandingSettings?.image)
  const thumbnails = asRecord(snippet?.thumbnails)
  const highThumb = asRecord(thumbnails?.high)
  const defaultThumb = asRecord(thumbnails?.default)
  const status = asRecord(item?.status)
  const relatedPlaylists = asRecord(contentDetails?.relatedPlaylists)

  const normalized = {
    channel: {
      id: asString(item?.id),
      title: asString(snippet?.title),
      handle: asString(snippet?.customUrl).replace(/^@/, ""),
      description: asString(snippet?.description),
      thumbnailUrl: asString(highThumb?.url) || asString(defaultThumb?.url),
      bannerUrl: asOptionalString(image?.bannerExternalUrl),
      subscriberCount: safeNumber(statistics?.subscriberCount),
      videoCount: safeNumber(statistics?.videoCount),
      viewCount: safeNumber(statistics?.viewCount),
      publishedAt: asString(snippet?.publishedAt),
      uploadsPlaylistId: asString(relatedPlaylists?.uploads),
      verified: asString(status?.longUploadsStatus) === "allowed",
    },
  }

  if (!normalized.channel.id || !normalized.channel.uploadsPlaylistId) {
    return errorResponse(
      404,
      "NOT_FOUND",
      "Channel found but missing required metadata.",
    )
  }

  return NextResponse.json(normalized)
}

async function handleVideosAction(params: URLSearchParams, apiKey: string) {
  const playlistId = sanitizeValue(params.get("playlistId"))
  const pageToken = sanitizeValue(params.get("pageToken"))
  const maxResultsRaw = sanitizeValue(params.get("maxResults"))

  if (!playlistId) {
    return errorResponse(
      400,
      "INVALID_INPUT",
      "Missing required query param: playlistId.",
    )
  }

  const maxResults = clampInt(maxResultsRaw, 1, 50, 50)
  const query = new URLSearchParams({
    part: "snippet,contentDetails",
    playlistId,
    maxResults: String(maxResults),
    key: apiKey,
  })
  if (pageToken) query.set("pageToken", pageToken)

  const upstream = await fetchYouTube(`/playlistItems?${query.toString()}`)
  if ("error" in upstream) return upstream.error

  const data = upstream.data as YouTubeData
  const items = Array.isArray(data.items) ? data.items : []
  const videos = items
    .map((item) => {
      const contentDetails = asRecord(item.contentDetails)
      const snippet = asRecord(item.snippet)
      const thumbnails = asRecord(snippet?.thumbnails)
      const highThumb = asRecord(thumbnails?.high)
      const mediumThumb = asRecord(thumbnails?.medium)
      const defaultThumb = asRecord(thumbnails?.default)
      const videoId = asString(contentDetails?.videoId)
      return {
        id: videoId,
        title: asString(snippet?.title),
        thumbnailUrl: asString(highThumb?.url) || asString(mediumThumb?.url) || asString(defaultThumb?.url),
        publishedAt: asString(contentDetails?.videoPublishedAt) || asString(snippet?.publishedAt),
        channelId: asString(snippet?.channelId),
      }
    })
    .filter((video) => Boolean(video.id))

  return NextResponse.json({
    playlistId,
    nextPageToken: data.nextPageToken ?? null,
    prevPageToken: data.prevPageToken ?? null,
    pageInfo: {
      totalResults: safeNumber(data.pageInfo?.totalResults),
      resultsPerPage: safeNumber(data.pageInfo?.resultsPerPage),
    },
    videos,
  })
}

async function handleStatsAction(params: URLSearchParams, apiKey: string) {
  const rawIds = sanitizeValue(params.get("ids"))
  if (!rawIds) {
    return errorResponse(400, "INVALID_INPUT", "Missing required query param: ids.")
  }

  const ids = rawIds
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 50)

  if (ids.length === 0) {
    return errorResponse(
      400,
      "INVALID_INPUT",
      "Provide at least one valid video id in ids.",
    )
  }

  const query = new URLSearchParams({
    part: "snippet,statistics,contentDetails",
    id: ids.join(","),
    key: apiKey,
    maxResults: "50",
  })

  const upstream = await fetchYouTube(`/videos?${query.toString()}`)
  if ("error" in upstream) return upstream.error

  const data = upstream.data as YouTubeData
  const items = Array.isArray(data.items) ? data.items : []
  const stats = items.map((item) => {
    const snippet = asRecord(item.snippet)
    const statistics = asRecord(item.statistics)
    const contentDetails = asRecord(item.contentDetails)
    const thumbnails = asRecord(snippet?.thumbnails)
    const highThumb = asRecord(thumbnails?.high)
    const mediumThumb = asRecord(thumbnails?.medium)
    const defaultThumb = asRecord(thumbnails?.default)

    return {
      id: asString(item.id),
      title: asString(snippet?.title),
      publishedAt: asString(snippet?.publishedAt),
      thumbnailUrl: asString(highThumb?.url) || asString(mediumThumb?.url) || asString(defaultThumb?.url),
      duration: asString(contentDetails?.duration) || "PT0S",
      viewCount: safeNumber(statistics?.viewCount),
      likeCount: safeNumber(statistics?.likeCount),
      commentCount: safeNumber(statistics?.commentCount),
    }
  })

  return NextResponse.json({
    requestedIds: ids,
    foundCount: stats.length,
    stats,
  })
}

async function fetchYouTube(path: string) {
  try {
    const response = await fetch(`${YOUTUBE_API_BASE}${path}`, {
      method: "GET",
      cache: "no-store",
    })

    const payload: unknown = await response.json().catch(() => ({}))

    if (!response.ok) {
      return { error: mapUpstreamError(response.status, payload) } as const
    }

    return { data: payload as Record<string, unknown> } as const
  } catch {
    return {
      error: errorResponse(
        502,
        "UPSTREAM_ERROR",
        "Failed to connect to YouTube API.",
      ),
    } as const
  }
}

function mapUpstreamError(status: number, payload: unknown) {
  const upstream = payload as YouTubeError
  const reasons = upstream.error?.errors?.map((entry) => entry.reason ?? "") ?? []
  const hasQuotaReason = reasons.some((reason) =>
    ["quotaExceeded", "dailyLimitExceeded", "rateLimitExceeded"].includes(reason),
  )

  if (status === 403 && hasQuotaReason) {
    return errorResponse(
      429,
      "QUOTA_EXCEEDED",
      "YouTube API quota exceeded. Please try again later.",
    )
  }

  if (status === 404) {
    return errorResponse(404, "NOT_FOUND", "Requested resource not found.")
  }

  if (status === 400) {
    return errorResponse(400, "INVALID_INPUT", "Invalid request parameters.")
  }

  return errorResponse(502, "UPSTREAM_ERROR", "YouTube API request failed.")
}

function errorResponse(status: number, code: ApiErrorCode, message: string) {
  return NextResponse.json<ApiErrorResponse>(
    {
      error: {
        code,
        message,
      },
    },
    { status },
  )
}

function sanitizeValue(value: string | null): string | null {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function safeNumber(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : ""
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined
}

function clampInt(
  value: string | null,
  min: number,
  max: number,
  fallback: number,
): number {
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(min, Math.min(max, parsed))
}
