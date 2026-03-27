"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { ChannelAnalytics } from "@/lib/types"
import { formatEngagement } from "@/lib/utils"

type EngagementChartProps = {
  analytics: ChannelAnalytics
}

export function EngagementChart({ analytics }: EngagementChartProps) {
  const chartData = useMemo(() => {
    return [...analytics.videos]
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
      .slice(0, 20)
      .reverse()
      .map((video) => ({
        id: video.id,
        title: truncateTitle(video.title, 18),
        fullTitle: video.title,
        engagementRate: video.engagementRate,
      }))
  }, [analytics])

  return (
    <div className="rounded-2xl border border-[#1e1e1e] bg-[#0f0f0f] p-5">
      <p className="mb-3 text-sm font-medium text-white">Engagement Rate by Video</p>
      <div className="h-72 min-w-[640px] overflow-x-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid stroke="#1e1e1e" strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fill: "#555", fontSize: 11 }} />
            <YAxis
              tick={{ fill: "#555", fontSize: 11 }}
              tickFormatter={(value) => `${Number(value).toFixed(1)}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#141414",
                border: "1px solid #242424",
                borderRadius: "0.75rem",
                color: "#f0f0f0",
              }}
              labelStyle={{ color: "#f0f0f0" }}
              formatter={(value: unknown) => formatEngagement(Number(value ?? 0))}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullTitle ?? "Video"}
            />
            <Bar dataKey="engagementRate" fill="#f5a623" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function truncateTitle(title: string, maxLength: number): string {
  if (title.length <= maxLength) return title
  return `${title.slice(0, maxLength - 1)}…`
}
