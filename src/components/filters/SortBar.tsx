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
    <div className="flex w-full items-center sm:w-auto">
      <label htmlFor="sort-by" className="sr-only">
        Sort videos
      </label>
      <select
        id="sort-by"
        value={value}
        onChange={(event) => onChange(event.target.value as SortOption)}
        className="w-full min-w-0 rounded-lg border border-white/8 bg-[#0d0d0d] px-3 py-1.5 text-xs text-white/70 outline-none transition-colors focus:border-white/18 focus:text-white sm:w-auto sm:min-w-[8.5rem]"
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
