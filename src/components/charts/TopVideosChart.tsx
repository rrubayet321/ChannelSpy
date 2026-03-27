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
import { formatViews } from "@/lib/utils"

type TopVideosChartProps = {
  analytics: ChannelAnalytics
}

export function TopVideosChart({ analytics }: TopVideosChartProps) {
  const chartData = useMemo(() => {
    return [...analytics.videos]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10)
      .map((video) => ({
        id: video.id,
        title: truncateTitle(video.title, 24),
        fullTitle: video.title,
        viewCount: video.viewCount,
      }))
      .reverse()
  }, [analytics])

  return (
    <div className="rounded-2xl border border-[#1e1e1e] bg-[#0f0f0f] p-5">
      <p className="mb-3 text-sm font-medium text-white">Top 10 Videos by Views</p>
      <div className="h-80 min-w-[700px] overflow-x-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 12, left: 24, bottom: 8 }}>
            <CartesianGrid stroke="#1e1e1e" strokeDasharray="3 3" />
            <XAxis
              type="number"
              tick={{ fill: "#555", fontSize: 11 }}
              tickFormatter={(value) => formatViews(Number(value))}
            />
            <YAxis
              type="category"
              dataKey="title"
              tick={{ fill: "#555", fontSize: 11 }}
              width={130}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#141414",
                border: "1px solid #242424",
                borderRadius: "0.75rem",
                color: "#f0f0f0",
              }}
              labelStyle={{ color: "#f0f0f0" }}
              formatter={(value: unknown) => formatViews(Number(value ?? 0))}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullTitle ?? "Video"}
            />
            <Bar dataKey="viewCount" fill="#3ecf8e" radius={[4, 4, 4, 4]} />
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
