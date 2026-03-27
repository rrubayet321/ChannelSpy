"use client"

type SortOption = "views" | "engagementRate" | "performanceScore" | "date" | "duration"

type SortBarProps = {
  value: SortOption
  onChange: (value: SortOption) => void
}

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "views", label: "Views" },
  { value: "engagementRate", label: "Engagement" },
  { value: "performanceScore", label: "Score" },
  { value: "date", label: "Date" },
  { value: "duration", label: "Duration" },
]

export function SortBar({ value, onChange }: SortBarProps) {
  return (
    <div className="flex items-center">
      <label htmlFor="sort-by" className="sr-only">
        Sort videos
      </label>
      <select
        id="sort-by"
        value={value}
        onChange={(event) => onChange(event.target.value as SortOption)}
        className="rounded-lg border border-[#1e1e1e] bg-[#0f0f0f] px-3 py-1 text-xs text-[#888] outline-none transition-colors focus:border-[#333]"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort: {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
