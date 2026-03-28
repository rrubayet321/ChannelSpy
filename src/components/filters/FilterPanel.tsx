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
                ? "border-white/18 bg-white/8 text-white"
                : "border-white/7 text-white/45 hover:border-white/14 hover:text-white/70"
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
          className="w-32 rounded-lg border border-white/8 bg-[#0d0d0d] px-3 py-1 text-xs text-white/70 outline-none placeholder:text-white/25 focus:border-white/18 focus:text-white"
        />
      </label>
    </div>
  )
}
