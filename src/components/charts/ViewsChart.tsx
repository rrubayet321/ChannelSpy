"use client"

import { useMemo } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { ChannelAnalytics } from "@/lib/types"
import { formatViews } from "@/lib/utils"

type ViewsChartProps = {
  analytics: ChannelAnalytics
}

export function ViewsChart({ analytics }: ViewsChartProps) {
  const chartData = useMemo(() => {
    return [...analytics.videos]
      .sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
      )
      .slice(-20)
      .map((video) => ({
        id: video.id,
        title: truncateTitle(video.title, 20),
        fullTitle: video.title,
        viewCount: video.viewCount,
      }))
  }, [analytics])

  return (
    <div className="rounded-2xl border border-[#1e1e1e] bg-[#0f0f0f] p-5">
      <p className="mb-3 text-sm font-medium text-white">Views Trend (Last 20 Videos)</p>
      <div className="h-72 min-w-[640px] overflow-x-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid stroke="#1e1e1e" strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fill: "#555", fontSize: 11 }} />
            <YAxis
              tick={{ fill: "#555", fontSize: 11 }}
              tickFormatter={(value) => formatViews(Number(value))}
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
            <Line
              type="monotone"
              dataKey="viewCount"
              stroke="#4f8ef7"
              strokeWidth={2}
              dot={{ r: 2, fill: "#4f8ef7" }}
              activeDot={{ r: 4, fill: "#4f8ef7" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function truncateTitle(title: string, maxLength: number): string {
  if (title.length <= maxLength) return title
  return `${title.slice(0, maxLength - 1)}…`
}
