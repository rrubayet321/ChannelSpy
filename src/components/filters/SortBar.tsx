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
    <div className="flex w-full items-center gap-1 overflow-x-auto border-y border-[#1e1e1e] bg-[#0f0f0f] py-3">
      <span className="shrink-0 text-xs text-[#555]">Sort by</span>
      {sortOptions.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`shrink-0 border-b-2 px-3 py-1.5 text-xs transition-colors ${
            value === opt.value
              ? "border-[#4f8ef7] text-white"
              : "border-transparent text-[#555] hover:text-white"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
