"use client"

import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type SaasLandingHeroProps = {
  onGetStarted: () => void
  className?: string
}

export function SaasLandingHero({ onGetStarted, className }: SaasLandingHeroProps) {
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

      {/* Diagonal gradient stripes — bottom-right, NOT overlapping text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          className="gradient-stripe-group absolute"
          style={{
            right: "-22%",
            bottom: "-62%",
            width: "140vw",
            height: "210vh",
            transform: "rotate(-35deg)",
            transformOrigin: "center center",
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "center",
            gap: "0px",
          }}
        >
          <div style={{ width: "16rem", backgroundColor: "#1e1b4b" }} />
          <div style={{ width: "4rem", backgroundColor: "#312e81" }} />
          <div style={{ width: "1.5rem", backgroundColor: "#4338ca" }} />
          <div style={{ width: "0.8rem", backgroundColor: "#6366f1" }} />
          <div style={{ width: "0.4rem", backgroundColor: "#a5b4fc" }} />
        </div>

        {/* Soft glow wash behind stripes */}
        <div
          className="gradient-stripe-glow absolute"
          style={{
            right: "-12%",
            bottom: "-50%",
            width: "120vw",
            height: "190vh",
            transform: "rotate(-35deg)",
            background:
              "linear-gradient(90deg, transparent 5%, rgba(30,27,75,0.2) 25%, rgba(99,102,241,0.1) 55%, rgba(99,102,241,0.04) 80%, transparent)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Content — left-aligned, vertically centered (matches Aceternity reference) */}
      <div className="relative z-10 flex min-h-[calc(100vh-57px)] items-center px-8 sm:px-14 lg:px-24">
        <div className="max-w-xl">
          <p className="hero-stagger-1 mb-5 text-xs font-medium tracking-[0.2em] uppercase text-zinc-400">
            YouTube competitor intelligence
          </p>

          <h1 className="hero-stagger-2 font-heading text-[2.75rem] font-semibold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[5rem]">
            Decode any YouTube channel, instantly.
          </h1>

          <p className="hero-stagger-3 mt-6 max-w-md text-base leading-relaxed text-zinc-300 sm:text-lg">
            Paste a competitor URL and see what&apos;s working, what&apos;s failing, and what to publish next.
          </p>

          <div className="hero-stagger-4 mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onGetStarted}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#6366f1] px-7 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(99,102,241,0.3)] transition-all hover:bg-[#818cf8] hover:shadow-[0_12px_32px_rgba(99,102,241,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5b4fc] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Get started
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <p className="text-sm text-zinc-500">
              Questions? Open <span className="text-zinc-400">FAQ</span> in the top bar.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
