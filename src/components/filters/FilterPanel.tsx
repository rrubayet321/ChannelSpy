"use client"

type FilterPreset = "all" | "month" | "quarter" | "year"

type FilterPanelProps = {
  preset: FilterPreset
  minViews: string
  onPresetChange: (value: FilterPreset) => void
  onMinViewsChange: (value: string) => void
}

export function FilterPanel({
  preset,
  minViews,
  onPresetChange,
  onMinViewsChange,
}: FilterPanelProps) {
  const options: Array<{ value: FilterPreset; label: string }> = [
    { value: "all", label: "All time" },
    { value: "month", label: "This month" },
    { value: "quarter", label: "Last 3 months" },
    { value: "year", label: "This year" },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((option) => {
        const active = preset === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onPresetChange(option.value)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              active
                ? "border-[#333] bg-[#1e1e1e] text-white"
                : "border-[#1e1e1e] text-[#555] hover:text-[#888]"
            }`}
          >
            {option.label}
          </button>
        )
      })}
      <label className="ml-1">
        <span className="sr-only">Minimum views</span>
        <input
          type="number"
          min={0}
          step={1000}
          value={minViews}
          onChange={(event) => onMinViewsChange(event.target.value)}
          placeholder="Min views"
          className="w-32 rounded-lg border border-[#1e1e1e] bg-[#0f0f0f] px-3 py-1 text-xs text-[#888] outline-none placeholder:text-[#333] focus:border-[#333]"
        />
      </label>
    </div>
  )
}
