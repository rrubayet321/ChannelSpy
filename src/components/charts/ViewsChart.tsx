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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card className="border-[var(--border)] bg-[var(--bg-card)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[var(--text-primary)]">
          Views Trend (Last 20 Videos)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
            <YAxis
              tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
              tickFormatter={(value) => formatViews(Number(value))}
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
            <Line
              type="monotone"
              dataKey="viewCount"
              stroke="var(--accent-blue)"
              strokeWidth={2}
              dot={{ r: 2, fill: "var(--accent-blue)" }}
              activeDot={{ r: 4, fill: "var(--accent-blue)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function truncateTitle(title: string, maxLength: number): string {
  if (title.length <= maxLength) return title
  return `${title.slice(0, maxLength - 1)}…`
}
