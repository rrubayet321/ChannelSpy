"use client"

import { Activity, Lightbulb, TrendingUp } from "lucide-react"

import type { GuidedInsightCard } from "@/lib/insights"

type GuidedInsightSummaryProps = {
  cards: GuidedInsightCard[]
  onAction: (action: GuidedInsightCard["action"]) => void
}

export function GuidedInsightSummary({ cards, onAction }: GuidedInsightSummaryProps) {
  const iconByCardId: Record<GuidedInsightCard["id"], { icon: typeof TrendingUp; colorClass: string }> = {
    working: { icon: TrendingUp, colorClass: "text-[#4f8ef7]" },
    failing: { icon: Activity, colorClass: "text-[#f5a623]" },
    next: { icon: Lightbulb, colorClass: "text-[#3ecf8e]" },
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-white">Quick Read</h2>
        <p className="text-xs text-[#6d7688]">Three answers for fast decision making</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {cards.map((card) => {
          const { icon: Icon, colorClass } = iconByCardId[card.id]

          return (
            <article
              key={card.id}
              className="rounded-2xl border border-[#222833] bg-[#0f131a] p-5 transition-colors hover:border-[#334056]"
            >
              <Icon className={`mb-3 h-4 w-4 ${colorClass}`} />
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#7a8498]">{card.title}</p>
              <p className="mt-2 min-h-[64px] text-sm leading-relaxed text-[#c0c8d8]">{card.summary}</p>
              <button
                type="button"
                onClick={() => onAction(card.action)}
                className="mt-3 inline-flex items-center rounded-lg border border-[#2e3442] bg-[#121722] px-3 py-1.5 text-xs text-[#d7dbe6] transition-colors hover:border-[#4c5872] hover:text-white"
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
