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
    <Card className="border-[var(--border)] bg-[var(--bg-card)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[var(--text-primary)]">
          Engagement Rate by Video
        </CardTitle>
      </CardHeader>
      <CardContent className="h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
            <YAxis
              tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
              tickFormatter={(value) => `${Number(value).toFixed(1)}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
              labelStyle={{ color: "var(--text-primary)" }}
              formatter={(value: unknown) => formatEngagement(Number(value ?? 0))}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.fullTitle ?? "Video"
              }
            />
            <Bar dataKey="engagementRate" fill="var(--accent-amber)" radius={[4, 4, 0, 0]} />
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
