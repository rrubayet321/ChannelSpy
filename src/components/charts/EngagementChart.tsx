"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { EngagementMetricTooltip } from "@/components/charts/chartTooltip"
import type { Video } from "@/lib/types"

type EngagementChartProps = {
  videos: Video[]
}

export function EngagementChart({ videos }: EngagementChartProps) {
  const data = videos
    .slice()
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
    .slice(-20)
    .map((v) => ({
      name: v.title.length > 22 ? v.title.slice(0, 22) + "…" : v.title,
      fullTitle: v.title,
      engagement: parseFloat(v.engagementRate.toFixed(2)),
    }))

  return (
    <div className="rounded-2xl border border-white/10 bg-[#09090b] p-5 shadow-[0_0_24px_rgba(99,102,241,0.06)]">
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-300">
        Engagement by Video
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={false} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={EngagementMetricTooltip} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
          <Bar dataKey="engagement" fill="url(#barGradient)" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
