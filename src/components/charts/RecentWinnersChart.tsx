"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { Video } from "@/lib/types"
import { formatViews } from "@/lib/utils"

type RecentWinnersChartProps = {
  videos: Video[]
  baselineViews: number
}

export function RecentWinnersChart({ videos, baselineViews }: RecentWinnersChartProps) {
  const data = videos
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 8)
    .reverse()
    .map((v) => ({
      name: v.title.length > 22 ? v.title.slice(0, 22) + "…" : v.title,
      views: v.viewCount,
      aboveBaseline: v.viewCount >= baselineViews,
    }))

  return (
    <div className="rounded-2xl border border-white/10 bg-[#09090b] p-5 shadow-[0_0_24px_rgba(99,102,241,0.06)]">
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-300">
        Recent vs Channel Baseline
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={false} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v: number) => formatViews(v)}
            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#18181b",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: 10,
              fontSize: 12,
              color: "#f5f5f5",
              padding: "8px 12px",
              fontFamily: "inherit",
            }}
            formatter={(value) => [formatViews(Number(value ?? 0)), "Views"]}
            labelFormatter={(label) => String(label ?? "")}
            cursor={{ fill: "rgba(99,102,241,0.08)" }}
          />
          <ReferenceLine
            y={baselineViews}
            stroke="rgba(255,255,255,0.3)"
            strokeDasharray="4 4"
            label={{ value: "Baseline", fill: "rgba(255,255,255,0.55)", fontSize: 9, position: "insideTopRight" }}
          />
          <Bar dataKey="views" radius={[4, 4, 0, 0]} maxBarSize={36}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.aboveBaseline ? "#818cf8" : "rgba(129,140,248,0.25)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
