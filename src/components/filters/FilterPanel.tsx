"use client"

import { Filter } from "lucide-react"

type FilterPanelProps = {
  dateFrom: string
  dateTo: string
  minViews: string
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  onMinViewsChange: (value: string) => void
}

export function FilterPanel({
  dateFrom,
  dateTo,
  minViews,
  onDateFromChange,
  onDateToChange,
  onMinViewsChange,
}: FilterPanelProps) {
  return (
    <div className="grid gap-3 rounded-lg border border-zinc-800 bg-zinc-900/70 p-3 sm:grid-cols-3">
      <div className="flex items-center gap-2 text-xs text-zinc-400 sm:col-span-3">
        <Filter className="h-4 w-4" />
        Filters (client-side, instant)
      </div>

      <label className="space-y-1 text-xs text-zinc-400">
        <span>From date</span>
        <input
          type="date"
          value={dateFrom}
          onChange={(event) => onDateFromChange(event.target.value)}
          className="h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 text-sm text-zinc-100 outline-none focus:border-zinc-500"
        />
      </label>

      <label className="space-y-1 text-xs text-zinc-400">
        <span>To date</span>
        <input
          type="date"
          value={dateTo}
          onChange={(event) => onDateToChange(event.target.value)}
          className="h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 text-sm text-zinc-100 outline-none focus:border-zinc-500"
        />
      </label>

      <label className="space-y-1 text-xs text-zinc-400">
        <span>Minimum views</span>
        <input
          type="number"
          min={0}
          step={1000}
          value={minViews}
          onChange={(event) => onMinViewsChange(event.target.value)}
          placeholder="e.g. 100000"
          className="h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 text-sm text-zinc-100 outline-none focus:border-zinc-500"
        />
      </label>
    </div>
  )
}
