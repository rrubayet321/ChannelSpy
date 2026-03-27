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
import { formatEngagement } from "@/lib/utils"

import { tooltipHideCursor } from "@/components/charts/chartInteraction"

type EngagementChartProps = {
  videos: Video[]
}

export function EngagementChart({ videos }: EngagementChartProps) {
  const chartData = useMemo(() => {
    return [...videos]
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
  }, [videos])

  return (
    <div className="overflow-hidden rounded-2xl border border-[#222833] bg-[#0f131a] p-5">
      <p className="mb-3 text-sm font-semibold text-white">Audience Connection by Video</p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid stroke="#273041" strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fill: "#7b8499", fontSize: 11 }} />
            <YAxis
              tick={{ fill: "#7b8499", fontSize: 11 }}
              tickFormatter={(value) => `${Number(value).toFixed(1)}%`}
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
              formatter={(value: unknown) => [formatEngagement(Number(value ?? 0)), "Engagement"]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullTitle ?? "Video"}
            />
            <Bar
              dataKey="engagementRate"
              fill="#f5a623"
              radius={[4, 4, 0, 0]}
              activeBar={{
                fill: "#ffc14d",
                stroke: "#ffd78a",
                strokeWidth: 1.5,
                fillOpacity: 1,
                style: { filter: "drop-shadow(0 0 10px rgba(245, 166, 35, 0.45))" },
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
