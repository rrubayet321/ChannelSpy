"use client"

import { ArrowRight, BarChart2, Clock, TrendingUp, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/analytics"

type SaasLandingHeroProps = {
  onGetStarted: () => void
  onTrySample?: (handle: string) => void
  className?: string
}

export function SaasLandingHero({ onGetStarted, onTrySample, className }: SaasLandingHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate min-h-[calc(100vh-57px)] overflow-hidden bg-black",
        className,
      )}
    >
      {/* Film grain texture overlay */}
      <div
        aria-hidden="true"
        className="hero-grain pointer-events-none absolute inset-0 z-20 opacity-[0.018]"
      />

      {/* Animated purple gradient orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <style>{`
          @keyframes orb-drift-1 {
            0%   { transform: translate(0%, 0%) scale(1); opacity: 0.8; }
            33%  { transform: translate(-4%, 6%) scale(1.08); opacity: 1; }
            66%  { transform: translate(5%, -4%) scale(0.95); opacity: 0.75; }
            100% { transform: translate(0%, 0%) scale(1); opacity: 0.8; }
          }
          @keyframes orb-drift-2 {
            0%   { transform: translate(0%, 0%) scale(1); opacity: 0.75; }
            33%  { transform: translate(5%, -5%) scale(1.06); opacity: 0.95; }
            66%  { transform: translate(-4%, 4%) scale(0.96); opacity: 0.65; }
            100% { transform: translate(0%, 0%) scale(1); opacity: 0.75; }
          }
          @keyframes orb-drift-3 {
            0%   { transform: translate(0%, 0%) scale(1); opacity: 0.6; }
            50%  { transform: translate(3%, 5%) scale(1.1); opacity: 0.8; }
            100% { transform: translate(0%, 0%) scale(1); opacity: 0.6; }
          }
        `}</style>

        {/* Top-right — large indigo orb */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            right: "-10%",
            width: "65vw",
            height: "65vh",
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(99,102,241,0.45) 0%, rgba(79,70,229,0.20) 45%, transparent 72%)",
            filter: "blur(72px)",
            animation: "orb-drift-1 18s ease-in-out infinite",
          }}
        />

        {/* Bottom-left — deep violet orb */}
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-12%",
            width: "60vw",
            height: "60vh",
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(109,40,217,0.40) 0%, rgba(76,29,149,0.18) 50%, transparent 72%)",
            filter: "blur(90px)",
            animation: "orb-drift-2 24s ease-in-out infinite",
          }}
        />

        {/* Center-bottom — small accent orb */}
        <div
          style={{
            position: "absolute",
            bottom: "-5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "40vw",
            height: "30vh",
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(139,92,246,0.28) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "orb-drift-3 30s ease-in-out infinite",
          }}
        />
      </div>

      {/* Content — center-aligned, Antarys style */}
      <div className="relative z-10 flex min-h-[calc(100vh-57px)] items-center justify-center px-6 sm:px-14 lg:px-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">

          {/* Badge */}
          <p className="hero-stagger-1 mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[10px] font-medium tracking-[0.18em] uppercase text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" aria-hidden />
            Free YouTube channel analyzer
          </p>

          {/* Headline — DM Serif Display, center-aligned */}
          <h1 className="hero-stagger-2 font-[family-name:var(--font-display-face)] text-[2.6rem] font-normal leading-[1.1] tracking-[-0.01em] text-white sm:text-[3.5rem] lg:text-[4.75rem]">
            Discover what&apos;s working
            <span className="block italic text-white/60">
              for any YouTube channel.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-stagger-3 mt-6 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-[1.05rem]">
            Paste a channel URL, @handle, or channel ID — get top videos, engagement rates, posting
            patterns, and momentum trends.
          </p>

          {/* Benefit bullets — centered, lucide icons */}
          <ul className="hero-stagger-3 mt-5 flex flex-col items-center gap-2 sm:flex-row sm:gap-5" aria-label="Key features">
            <li className="flex items-center gap-2 text-sm text-zinc-500">
              <BarChart2 className="h-3.5 w-3.5 shrink-0 text-indigo-400/70" aria-hidden />
              Top-performing videos
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-500">
              <TrendingUp className="h-3.5 w-3.5 shrink-0 text-indigo-400/70" aria-hidden />
              Engagement & momentum
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-500">
              <Clock className="h-3.5 w-3.5 shrink-0 text-indigo-400/70" aria-hidden />
              Posting patterns
            </li>
          </ul>

          {/* CTAs */}
          <div className="hero-stagger-4 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            {/* Primary — white solid, Antarys style */}
            <button
              type="button"
              onClick={() => {
                trackEvent("hero_cta_clicked")
                onGetStarted()
              }}
              className="group btn-clean focus-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#0a0a0a] hover:bg-white/90 sm:w-auto"
            >
              Analyze a Channel
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </button>

            {/* Secondary — ghost border */}
            {onTrySample && (
              <button
                type="button"
                onClick={() => {
                  trackEvent("try_sample_clicked")
                  onTrySample("@MrBeast")
                }}
                className="btn-clean focus-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/10 px-6 text-sm font-medium text-zinc-400 hover:border-white/20 hover:text-white sm:w-auto"
              >
                <Zap className="h-3.5 w-3.5 text-indigo-400" aria-hidden />
                Try with @MrBeast
              </button>
            )}
          </div>

          {/* Trust microcopy */}
          <p className="hero-stagger-4 mt-5 text-xs text-zinc-600">
            Free &middot; No signup required &middot; Results in ~15 seconds &middot; Supports URLs, @handles &amp; channel IDs
          </p>
        </div>
      </div>
    </section>
  )
}
