"use client"

import { Activity, Lightbulb, TrendingUp } from "lucide-react"
import type { GuidedInsightCard } from "@/lib/insights"

type GuidedInsightSummaryProps = {
  cards: GuidedInsightCard[]
  onAction: (action: GuidedInsightCard["action"]) => void
  confidence?: "Low" | "Medium" | "High"
}

export function GuidedInsightSummary({ cards, onAction, confidence }: GuidedInsightSummaryProps) {
  const iconByCardId: Record<
    GuidedInsightCard["id"],
    { icon: typeof TrendingUp; iconClass: string; borderClass: string }
  > = {
    working: { icon: TrendingUp, iconClass: "text-[#6366f1]", borderClass: "border-[#6366f1]/20" },
    failing: { icon: Activity, iconClass: "text-[#818cf8]", borderClass: "border-[#818cf8]/20" },
    next: { icon: Lightbulb, iconClass: "text-[#a5b4fc]", borderClass: "border-[#a5b4fc]/20" },
  }

  return (
    <section className="space-y-3">
      <h2 className="font-heading text-base font-semibold tracking-tight text-white">Quick Read</h2>
      {confidence ? (
        <p className="text-xs text-zinc-400">
          Confidence:{" "}
          <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-1.5 py-0.5 text-indigo-300">
            {confidence}
          </span>
          {" "}signal quality based on sample size.
        </p>
      ) : null}

      <div className="grid gap-3 xl:grid-cols-3">
        {cards.map((card) => {
          const { icon: Icon, iconClass, borderClass } = iconByCardId[card.id]

          return (
            <article
              key={card.id}
              className={`rounded-2xl border ${borderClass} bg-white/[0.02] p-5`}
            >
              <Icon className={`mb-3 h-3.5 w-3.5 ${iconClass}`} />
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400">{card.title}</p>
              <p className="mt-2 min-h-[56px] text-sm leading-relaxed text-zinc-300">{card.summary}</p>
              <button
                type="button"
                onClick={() => onAction(card.action)}
                className="mt-3 inline-flex items-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 transition-colors hover:bg-indigo-500/15"
              >
                {card.ctaLabel}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
