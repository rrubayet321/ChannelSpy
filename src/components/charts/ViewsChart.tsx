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

import type { Video } from "@/lib/types"
import { formatViews } from "@/lib/utils"

import { tooltipHideCursor } from "@/components/charts/chartInteraction"

type ViewsChartProps = {
  videos: Video[]
}

export function ViewsChart({ videos }: ViewsChartProps) {
  const chartData = useMemo(() => {
    return [...videos]
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
  }, [videos])

  return (
    <div className="overflow-hidden rounded-2xl border border-[#222833] bg-[#0f131a] p-5">
      <p className="mb-3 text-sm font-semibold text-white">View Trend (Latest 20 Uploads)</p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid stroke="#273041" strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fill: "#7b8499", fontSize: 11 }} />
            <YAxis
              tick={{ fill: "#7b8499", fontSize: 11 }}
              tickFormatter={(value) => formatViews(Number(value))}
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
            <Line
              type="monotone"
              dataKey="viewCount"
              stroke="#4f8ef7"
              strokeWidth={2}
              dot={{ r: 2, fill: "#4f8ef7" }}
              activeDot={{
                r: 6,
                fill: "#4f8ef7",
                stroke: "#9ec5ff",
                strokeWidth: 2,
                style: { filter: "drop-shadow(0 0 8px rgba(79, 142, 247, 0.55))" },
              }}
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
