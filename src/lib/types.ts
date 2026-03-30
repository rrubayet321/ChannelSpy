export interface Channel {
  id: string
  title: string
  handle: string
  description: string
  thumbnailUrl: string
  bannerUrl?: string
  subscriberCount: number
  videoCount: number
  viewCount: number
  publishedAt: string
  uploadsPlaylistId: string
  verified?: boolean
}

export interface Video {
  id: string
  title: string
  thumbnailUrl: string
  publishedAt: string
  duration: string
  isShort: boolean
  isViewOutlier?: boolean
  viewCount: number
  likeCount: number
  commentCount: number
  engagementRate: number
  performanceScore: number
  trendDelta: number
}

export interface AnalyticsBucket {
  videos: Video[]
  avgViews: number
  typicalViews: number
  avgEngagement: number
  confidence: "Low" | "Medium" | "High"
  breakoutRate: number
  viewPercentiles: {
    p25: number
    p50: number
    p75: number
  }
  momentumPercent: number
  consistencyScore: number
  postingFrequency: string
  topPerformers: Video[]
}

export interface ChannelAnalytics {
  channel: Channel
  longForm: AnalyticsBucket
  shorts: AnalyticsBucket
}

export type ParsedChannelInputType = "handle" | "channelId" | "username"

export interface ParsedChannelInput {
  type: ParsedChannelInputType
  value: string
}
