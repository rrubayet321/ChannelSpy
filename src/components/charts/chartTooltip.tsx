"use client"

import type { CSSProperties } from "react"
import type { TooltipContentProps } from "recharts"
import { formatViews } from "@/lib/utils"

export const chartTooltipBoxStyle: CSSProperties = {
  background: "#18181b",
  border: "1px solid rgba(99,102,241,0.3)",
  borderRadius: 10,
  fontSize: 12,
  color: "#f5f5f5",
  padding: "8px 12px",
  fontFamily: "inherit",
}

export type ChartRowPayload = {
  fullTitle?: string
  name?: string
  views?: number
  engagement?: number
}

export function truncateChartTitle(s: string, max = 35): string {
  const t = s.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max)}…`
}

/** Views-based charts: Title + Views (formatted). No raw data keys. */
export function ViewsMetricTooltip(props: TooltipContentProps) {
  const { active, payload } = props
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload as ChartRowPayload
  const title = truncateChartTitle(row.fullTitle ?? row.name ?? "")
  const views = row.views
  if (!Number.isFinite(views)) return null
  return (
    <div style={chartTooltipBoxStyle}>
      <div style={{ marginBottom: 4, fontWeight: 500 }}>Title: {title}</div>
      <div>Views: {formatViews(Number(views))}</div>
    </div>
  )
}

/** Engagement chart: Title + Engagement %. */
export function EngagementMetricTooltip(props: TooltipContentProps) {
  const { active, payload } = props
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload as ChartRowPayload
  const title = truncateChartTitle(row.fullTitle ?? row.name ?? "")
  const eng = row.engagement
  if (!Number.isFinite(eng)) return null
  return (
    <div style={chartTooltipBoxStyle}>
      <div style={{ marginBottom: 4, fontWeight: 500 }}>Title: {title}</div>
      <div>Engagement: {Number(eng).toFixed(2)}%</div>
    </div>
  )
}
