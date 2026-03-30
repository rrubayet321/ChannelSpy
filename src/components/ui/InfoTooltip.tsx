import { Info } from "lucide-react"

type InfoTooltipProps = {
  text: string
  ariaLabel?: string
}

export function InfoTooltip({ text, ariaLabel = "What this means" }: InfoTooltipProps) {
  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        aria-label={ariaLabel}
        className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/50 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
      >
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-[220px] -translate-x-1/2 rounded-xl border border-indigo-500/15 bg-[#0a0a0a] px-3 py-2 text-[11px] leading-relaxed text-zinc-200 opacity-0 shadow-[0_16px_40px_rgba(0,0,0,0.55)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
        {text}
      </span>
    </span>
  )
}

