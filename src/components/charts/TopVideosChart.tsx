"use client"

import { useEffect, useRef, useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ViewsMetricTooltip } from "@/components/charts/chartTooltip"
import type { Video } from "@/lib/types"
import { formatViews } from "@/lib/utils"

type TopVideosChartProps = {
  videos: Video[]
}

/** Word-wrap titles for the Y-axis (up to `maxLines`); adds an ellipsis only if the title still does not fit. */
function titleLines(title: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = title.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return [""]

  const lines: string[] = []
  let line = ""

  const flush = () => {
    if (line) {
      lines.push(line)
      line = ""
    }
  }

  for (const word of words) {
    if (lines.length >= maxLines) {
      const last = lines[maxLines - 1]
      if (!last.endsWith("…")) {
        lines[maxLines - 1] =
          last.length <= maxCharsPerLine - 1 ? `${last}…` : `${last.slice(0, maxCharsPerLine - 1)}…`
      }
      return lines.slice(0, maxLines)
    }

    const candidate = line ? `${line} ${word}` : word
    if (candidate.length <= maxCharsPerLine) {
      line = candidate
      continue
    }

    flush()
    if (lines.length >= maxLines) {
      const last = lines[maxLines - 1]
      if (!last.endsWith("…")) {
        lines[maxLines - 1] =
          last.length <= maxCharsPerLine - 1 ? `${last}…` : `${last.slice(0, maxCharsPerLine - 1)}…`
      }
      return lines.slice(0, maxLines)
    }

    if (word.length <= maxCharsPerLine) {
      line = word
    } else {
      lines.push(`${word.slice(0, Math.max(1, maxCharsPerLine - 1))}…`)
    }
  }

  if (line) {
    if (lines.length < maxLines) {
      lines.push(line)
    } else {
      const last = lines[maxLines - 1]
      if (!last.endsWith("…")) {
        lines[maxLines - 1] =
          last.length <= maxCharsPerLine - 1 ? `${last}…` : `${last.slice(0, maxCharsPerLine - 1)}…`
      }
    }
  }
  return lines.length > 0 ? lines : [`${title.slice(0, Math.max(1, maxCharsPerLine - 1))}…`]
}

function YAxisTitleTick({
  x,
  y,
  payload,
  maxCharsPerLine,
}: {
  x: string | number
  y: string | number
  payload: { value: string }
  maxCharsPerLine: number
}) {
  const nx = Number(x)
  const ny = Number(y)
  const lines = titleLines(String(payload?.value ?? ""), maxCharsPerLine, 3)
  const lineHeight = 11
  const offsetY = -((lines.length - 1) * lineHeight) / 2

  return (
    <g transform={`translate(${nx},${ny})`}>
      <title>{String(payload?.value ?? "")}</title>
      {lines.map((line, i) => (
        <text
          key={i}
          x={-6}
          y={offsetY + i * lineHeight}
          dy={lineHeight / 2}
          textAnchor="end"
          fill="rgba(255,255,255,0.55)"
          fontSize={10}
        >
          {line}
        </text>
      ))}
    </g>
  )
}

export function TopVideosChart({ videos }: TopVideosChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [yAxisWidth, setYAxisWidth] = useState(200)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0
      if (w <= 0) return
      setYAxisWidth(Math.min(320, Math.max(140, Math.round(w * 0.42))))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const data = videos
    .slice()
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 10)
    .map((v) => ({
      name: v.title,
      fullTitle: v.title,
      views: v.viewCount,
    }))

  const maxCharsPerLine = Math.max(14, Math.min(40, Math.floor(yAxisWidth / 5.25)))

  const colors = [
    "#6366f1",
    "#818cf8",
    "#a5b4fc",
    "#94a3b8",
    "#64748b",
    "#475569",
    "rgba(99,102,241,0.5)",
    "rgba(99,102,241,0.35)",
    "rgba(99,102,241,0.22)",
    "rgba(99,102,241,0.12)",
  ]

  return (
    <div
      ref={wrapRef}
      className="rounded-2xl border border-white/10 bg-[#09090b] p-5 shadow-[0_0_24px_rgba(99,102,241,0.06)]"
    >
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-300">
        Top Videos by Views
      </p>
      <ResponsiveContainer width="100%" height={Math.max(280, data.length * 36)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
          barSize={12}
        >
          <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v: number) => formatViews(v)}
            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={(props) => <YAxisTitleTick {...props} maxCharsPerLine={maxCharsPerLine} />}
            axisLine={false}
            tickLine={false}
            width={yAxisWidth}
            interval={0}
          />
          <Tooltip content={ViewsMetricTooltip} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <Bar dataKey="views" radius={[0, 4, 4, 0]}>
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index] || "rgba(99,102,241,0.08)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
