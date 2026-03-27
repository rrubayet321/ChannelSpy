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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card className="border-[var(--border)] bg-[var(--bg-card)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[var(--text-primary)]">
          Top 10 Videos by Views
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 12, left: 24, bottom: 8 }}>
            <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" />
            <XAxis
              type="number"
              tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
              tickFormatter={(value) => formatViews(Number(value))}
            />
            <YAxis
              type="category"
              dataKey="title"
              tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
              width={130}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
              labelStyle={{ color: "var(--text-primary)" }}
              formatter={(value: unknown) => formatViews(Number(value ?? 0))}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.fullTitle ?? "Video"
              }
            />
            <Bar dataKey="viewCount" fill="var(--accent-green)" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function truncateTitle(title: string, maxLength: number): string {
  if (title.length <= maxLength) return title
  return `${title.slice(0, maxLength - 1)}…`
}
