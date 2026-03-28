import { cn } from "@/lib/utils"

type MetricTone = "green" | "blue" | "amber" | "red" | "neutral"

type MetricBadgeProps = {
  label: string
  tone?: MetricTone
}

const toneClassMap: Record<MetricTone, string> = {
  green: "border-[#3ecf8e]/30 bg-[#3ecf8e]/10 text-[#3ecf8e]",
  blue: "border-[#6366f1]/30 bg-[#6366f1]/10 text-[#a5b4fc]",
  amber: "border-[#f5a623]/30 bg-[#f5a623]/10 text-[#f5a623]",
  red: "border-[#f04444]/30 bg-[#f04444]/10 text-[#f04444]",
  neutral: "border-[#36496f] bg-[#17223c] text-[#d3dcf2]",
}

export function MetricBadge({ label, tone = "neutral" }: MetricBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-normal",
        toneClassMap[tone],
      )}
    >
      {label}
    </span>
  )
}
