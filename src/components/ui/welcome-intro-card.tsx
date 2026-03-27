"use client"

import { ArrowRight } from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"

type WelcomeIntroCardProps = {
  onProceed: () => void
  className?: string
}

export function WelcomeIntroCard({ onProceed, className }: WelcomeIntroCardProps) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-2xl rounded-2xl border border-[#1f1f1f] bg-[#0f0f0f] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_16px_60px_rgba(0,0,0,0.55)] sm:p-8",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-[#2a2a2a]">
            <Image
              src="/avatars/rubayet-cartoon.svg"
              alt="Rubayet Hassan profile"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Rubayet Hassan</p>
            <p className="text-xs text-[#8a8a8a]">@rubayet079</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <h1 className="font-heading text-[2rem] font-bold leading-tight tracking-tight text-white sm:text-[2.7rem]">
          Stop guessing. Start spying.
        </h1>
        <p className="max-w-[60ch] text-sm leading-relaxed text-[#a5a5a5] sm:text-base">
          Every competitor&apos;s best videos, ranked and decoded — instantly.
        </p>
      </div>

      <div className="mt-7 flex items-center justify-between border-t border-[#1e1e1e] pt-4">
        <p className="text-xs text-[#6f6f6f]">Built for fast competitor research</p>
        <button
          type="button"
          onClick={onProceed}
          className="group inline-flex h-[3.4rem] min-w-[9.4rem] items-center justify-center gap-2 rounded-[45px] border-[3px] border-[var(--accent-blue)] bg-[var(--text-primary)] px-5 text-[1.05rem] font-semibold text-[var(--bg-primary)] transition-all duration-300 hover:bg-[var(--accent-blue)] hover:text-white hover:text-[1.18rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] motion-reduce:transition-none"
        >
          Proceed
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </button>
      </div>
    </section>
  )
}
