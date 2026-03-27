"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { Video } from "@/lib/types"
import { formatViews } from "@/lib/utils"

import { tooltipHideCursor } from "@/components/charts/chartInteraction"

type RecentWinnersChartProps = {
  videos: Video[]
  baselineViews: number
}

export function RecentWinnersChart({ videos, baselineViews }: RecentWinnersChartProps) {
  const chartData = useMemo(() => {
    return [...videos]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 12)
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 6)
      .reverse()
      .map((video) => ({
        id: video.id,
        title: truncateTitle(video.title, 22),
        fullTitle: video.title,
        viewCount: video.viewCount,
      }))
  }, [videos])

  return (
    <div className="overflow-hidden rounded-2xl border border-[#222833] bg-[#0f131a] p-5">
      <p className="mb-1 text-sm font-semibold text-white">Recent Winners vs Channel Baseline</p>
      <p className="mb-3 text-xs text-[#8d95a9]">
        Quickly spot which recent uploads are clearly outperforming the typical video.
      </p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
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
            <ReferenceLine
              y={baselineViews}
              stroke="#888"
              strokeDasharray="5 5"
              label={{
                value: "Typical channel view level",
                position: "insideTopRight",
                fill: "#7b7b7b",
                fontSize: 10,
              }}
            />
            <Bar
              dataKey="viewCount"
              fill="#4f8ef7"
              radius={[4, 4, 0, 0]}
              activeBar={{
                fill: "#6ba8ff",
                stroke: "#9ec5ff",
                strokeWidth: 1.5,
                fillOpacity: 1,
                style: { filter: "drop-shadow(0 0 10px rgba(79, 142, 247, 0.45))" },
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
