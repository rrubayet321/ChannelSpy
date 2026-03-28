"use client"

import { useId, useState } from "react"
import { HelpCircle } from "lucide-react"

export function ChartColorsGuide() {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:border-indigo-500/25 hover:text-indigo-300"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <HelpCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Chart colors
      </button>
      {open && (
        <div
          id={panelId}
          role="region"
          aria-label="Chart color guide"
          className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-[min(100vw-2rem,20rem)] rounded-xl border border-white/10 bg-[#0c0c0c] p-4 shadow-[0_0_28px_rgba(99,102,241,0.12)]"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
            What the colors mean
          </p>
          <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-zinc-400">
            <li>
              <span className="font-medium text-indigo-300">Indigo gradient (lines and bars)</span> — higher
              intensity means a larger value (more views, higher engagement, or a stronger rank in the top list).
            </li>
            <li>
              <span className="font-medium text-zinc-300">Lighter or faded segments</span> — lower relative values
              or later ranks in the Top videos list (same scale, less magnitude).
            </li>
            <li>
              <span className="font-medium text-[#818cf8]">Recent vs baseline</span> — brighter bars are at or
              above the channel average views; dimmer bars are below that baseline.
            </li>
          </ul>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 w-full rounded-lg border border-white/10 py-1.5 text-[11px] text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}
