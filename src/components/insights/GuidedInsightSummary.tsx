"use client"

import type { GuidedInsightCard } from "@/lib/insights"

type GuidedInsightSummaryProps = {
  cards: GuidedInsightCard[]
  onAction: (action: GuidedInsightCard["action"]) => void
}

export function GuidedInsightSummary({ cards, onAction }: GuidedInsightSummaryProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-white">Quick Read</h2>
        <p className="text-xs text-[#555]">Three answers for fast decision making</p>
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.id}
            className="rounded-2xl border border-[#1e1e1e] bg-[#0f0f0f] p-4 transition-colors hover:border-[#2c2c2c]"
          >
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#666]">{card.title}</p>
            <p className="mt-2 min-h-[64px] text-sm leading-relaxed text-[#b3b3b3]">{card.summary}</p>
            <button
              type="button"
              onClick={() => onAction(card.action)}
              className="mt-3 inline-flex items-center rounded-lg border border-[#2a2a2a] px-3 py-1.5 text-xs text-[#d7d7d7] transition-colors hover:border-[#444] hover:text-white"
            >
              {card.ctaLabel}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
