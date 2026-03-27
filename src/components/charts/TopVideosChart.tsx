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

import type { Video } from "@/lib/types"
import { formatViews } from "@/lib/utils"

import { tooltipHideCursor } from "@/components/charts/chartInteraction"

type TopVideosChartProps = {
  videos: Video[]
}

export function TopVideosChart({ videos }: TopVideosChartProps) {
  const chartData = useMemo(() => {
    return [...videos]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10)
      .map((video) => ({
        id: video.id,
        title: truncateTitle(video.title, 24),
        fullTitle: video.title,
        viewCount: video.viewCount,
      }))
      .reverse()
  }, [videos])

  return (
    <div className="overflow-hidden rounded-2xl border border-[#222833] bg-[#0f131a] p-5">
      <p className="mb-3 text-sm font-semibold text-white">Top Videos by Views</p>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 12, left: 24, bottom: 8 }}>
            <CartesianGrid stroke="#273041" strokeDasharray="3 3" />
            <XAxis
              type="number"
              tick={{ fill: "#7b8499", fontSize: 11 }}
              tickFormatter={(value) => formatViews(Number(value))}
            />
            <YAxis
              type="category"
              dataKey="title"
              tick={{ fill: "#7b8499", fontSize: 11 }}
              width={130}
            />
            <Tooltip
              {...tooltipHideCursor}
              contentStyle={{
                backgroundColor: "#141a24",
                border: "1px solid #2b3343",
                borderRadius: "0.75rem",
                color: "#f0f0f0",
              }}
              labelStyle={{ color: "#f0f0f0" }}
              formatter={(value: unknown) => [formatViews(Number(value ?? 0)), "Views"]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullTitle ?? "Video"}
            />
            <Bar
              dataKey="viewCount"
              fill="#3ecf8e"
              radius={[4, 4, 4, 4]}
              activeBar={{
                fill: "#5ee4a4",
                stroke: "#8ff5c8",
                strokeWidth: 1.5,
                fillOpacity: 1,
                style: { filter: "drop-shadow(0 0 10px rgba(62, 207, 142, 0.45))" },
              }}
            />
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
