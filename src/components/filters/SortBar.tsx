"use client"

import { ArrowUpDown } from "lucide-react"

type SortOption = "views" | "engagementRate" | "performanceScore" | "date" | "duration"

type SortBarProps = {
  value: SortOption
  onChange: (value: SortOption) => void
}

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "views", label: "Views" },
  { value: "engagementRate", label: "Engagement Rate" },
  { value: "performanceScore", label: "Performance Score" },
  { value: "date", label: "Date" },
  { value: "duration", label: "Duration" },
]

export function SortBar({ value, onChange }: SortBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2">
      <ArrowUpDown className="h-4 w-4 text-zinc-400" />
      <label htmlFor="sort-by" className="text-xs text-zinc-400">
        Sort by
      </label>
      <select
        id="sort-by"
        value={value}
        onChange={(event) => onChange(event.target.value as SortOption)}
        className="h-8 rounded-md border border-zinc-700 bg-zinc-900 px-2 text-sm text-zinc-100 outline-none focus:border-zinc-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
