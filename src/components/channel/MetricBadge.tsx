import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type MetricTone = "green" | "blue" | "amber" | "red" | "neutral"

type MetricBadgeProps = {
  label: string
  tone?: MetricTone
}

const toneClassMap: Record<MetricTone, string> = {
  green: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  blue: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  amber: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  red: "border-red-500/40 bg-red-500/10 text-red-300",
  neutral: "border-zinc-700 bg-zinc-800 text-zinc-300",
}

export function MetricBadge({ label, tone = "neutral" }: MetricBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-md px-2 py-0.5 text-xs font-medium", toneClassMap[tone])}
    >
      {label}
    </Badge>
  )
}
