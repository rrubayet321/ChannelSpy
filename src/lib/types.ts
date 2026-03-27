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
}

export interface Video {
  id: string
  title: string
  thumbnailUrl: string
  publishedAt: string
  duration: string
  viewCount: number
  likeCount: number
  commentCount: number
  engagementRate: number
  performanceScore: number
  trendDelta: number
}

export interface ChannelAnalytics {
  channel: Channel
  videos: Video[]
  avgViews: number
  avgEngagement: number
  postingFrequency: string
  topPerformers: Video[]
}

export type ParsedChannelInputType = "handle" | "channelId" | "username"

export interface ParsedChannelInput {
  type: ParsedChannelInputType
  value: string
}
