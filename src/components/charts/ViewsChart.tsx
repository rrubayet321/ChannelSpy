"use client"

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ViewsMetricTooltip } from "@/components/charts/chartTooltip"
import type { Video } from "@/lib/types"
import { formatViews } from "@/lib/utils"

type ViewsChartProps = {
  videos: Video[]
}

export function ViewsChart({ videos }: ViewsChartProps) {
  const data = videos
    .slice()
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
    .slice(-20)
    .map((v) => ({
      name: v.title.length > 22 ? v.title.slice(0, 22) + "…" : v.title,
      fullTitle: v.title,
      views: v.viewCount,
    }))

  return (
    <div className="rounded-2xl border border-white/10 bg-[#09090b] p-5 shadow-[0_0_24px_rgba(99,102,241,0.06)]">
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-300">
        View Trend — Latest 20
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="linesGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#a5b4fc" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={false} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v: number) => formatViews(v)}
            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={ViewsMetricTooltip} cursor={{ stroke: "rgba(99,102,241,0.25)", strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="views"
            stroke="url(#linesGradient)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "#818cf8", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
