"use client"

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import type { AnalyticsBucket, Channel } from "@/lib/types"
import { formatEarnings, formatViews } from "@/lib/utils"

type CompareChannelsProps = {
  channelA: Channel
  channelB: Channel
  bucketA: AnalyticsBucket
  bucketB: AnalyticsBucket
  tab: "long" | "shorts"
  onClose: () => void
}

type MetricRow = {
  label: string
  valueA: string
  valueB: string
  /** positive = A wins, negative = B wins, 0 = tie */
  diff: number
}

function pct(a: number, b: number): number {
  if (b <= 0) return 0
  return ((a - b) / b) * 100
}

function buildRows(
  bucketA: AnalyticsBucket,
  bucketB: AnalyticsBucket,
): MetricRow[] {
  return [
    {
      label: "Typical Views",
      valueA: formatViews(bucketA.typicalViews),
      valueB: formatViews(bucketB.typicalViews),
      diff: pct(bucketA.typicalViews, bucketB.typicalViews),
    },
    {
      label: "Engagement",
      valueA: `${bucketA.avgEngagement.toFixed(2)}%`,
      valueB: `${bucketB.avgEngagement.toFixed(2)}%`,
      diff: pct(bucketA.avgEngagement, bucketB.avgEngagement),
    },
    {
      label: "Momentum",
      valueA: `${bucketA.momentumPercent >= 0 ? "+" : ""}${Math.round(bucketA.momentumPercent)}%`,
      valueB: `${bucketB.momentumPercent >= 0 ? "+" : ""}${Math.round(bucketB.momentumPercent)}%`,
      diff: bucketA.momentumPercent - bucketB.momentumPercent,
    },
    {
      label: "Beat-usual Rate",
      valueA: `${Math.round(bucketA.breakoutRate)}%`,
      valueB: `${Math.round(bucketB.breakoutRate)}%`,
      diff: pct(bucketA.breakoutRate, bucketB.breakoutRate),
    },
    {
      label: "Upload Cadence",
      valueA: `${bucketA.consistencyScore}/100`,
      valueB: `${bucketB.consistencyScore}/100`,
      diff: bucketA.consistencyScore - bucketB.consistencyScore,
    },
    {
      label: "Est. Earnings (total)",
      valueA: formatEarnings(bucketA.totalEstimatedEarnings),
      valueB: formatEarnings(bucketB.totalEstimatedEarnings),
      diff: pct(bucketA.totalEstimatedEarnings, bucketB.totalEstimatedEarnings),
    },
    {
      label: "Videos analyzed",
      valueA: String(bucketA.videos.length),
      valueB: String(bucketB.videos.length),
      diff: bucketA.videos.length - bucketB.videos.length,
    },
  ]
}

function DiffIcon({ diff }: { diff: number }) {
  if (Math.abs(diff) < 1) return <Minus className="h-3 w-3 text-zinc-600" aria-hidden />
  if (diff > 0) return <ArrowUpRight className="h-3 w-3 text-[#3ecf8e]" aria-hidden />
  return <ArrowDownRight className="h-3 w-3 text-[#f04444]" aria-hidden />
}

export function CompareChannels({
  channelA,
  channelB,
  bucketA,
  bucketB,
  tab,
  onClose,
}: CompareChannelsProps) {
  const rows = buildRows(bucketA, bucketB)
  const label = tab === "shorts" ? "Shorts" : "Long videos"

  return (
    <section
      className="rounded-2xl border border-indigo-500/20 bg-[#08080f] px-4 py-4"
      aria-label="Channel comparison"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400">
            Side-by-side comparison · {label}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Metrics are based on the most recent 200 uploads for each channel.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md px-2.5 py-1 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          aria-label="Close comparison"
        >
          Close
        </button>
      </div>

      {/* Header row */}
      <div className="mb-1 grid grid-cols-[1fr_auto_auto_auto] gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] text-[10px] font-medium uppercase tracking-wider text-zinc-600">
        <span>Metric</span>
        <span className="truncate max-w-[120px]">{channelA.title}</span>
        <span className="truncate max-w-[120px]">{channelB.title}</span>
        <span className="text-right">Edge</span>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[1fr_auto_auto_auto] gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] py-2.5 text-sm"
          >
            <span className="text-xs text-zinc-400">{row.label}</span>
            <span
              className={`font-mono text-xs ${row.diff > 1 ? "text-white" : "text-zinc-400"}`}
            >
              {row.valueA}
            </span>
            <span
              className={`font-mono text-xs ${row.diff < -1 ? "text-white" : "text-zinc-400"}`}
            >
              {row.valueB}
            </span>
            <span className="flex items-center justify-end">
              <DiffIcon diff={row.diff} />
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
