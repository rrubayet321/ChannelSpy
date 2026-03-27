"use client"

import { Filter, Search } from "lucide-react"
import type { InputHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export type AnimatedGlowingSearchBarProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "type"
> & {
  className?: string
  /** Extra wrapper classes (centering, max width). */
  wrapperClassName?: string
}

/**
 * Glowing animated search field styled for ChannelSpy (dark UI, blue / green accents).
 * Pass standard input props; use with a parent <form onSubmit={...}>.
 */
export function AnimatedGlowingSearchBar({
  className,
  wrapperClassName,
  disabled,
  placeholder = "Paste YouTube channel URL or @handle",
  ...inputProps
}: AnimatedGlowingSearchBarProps) {
  return (
    <div className={cn("relative flex w-full max-w-lg items-center justify-center sm:max-w-xl", wrapperClassName)}>
      <div className="group relative flex min-h-[48px] w-full items-center justify-center" id="channel-search-glow">
        {/* Outer glow layers — conic gradients tuned to app theme (#4f8ef7, #3ecf8e, neutrals) */}
        <div
          className="absolute z-0 h-full w-full max-h-[58px] overflow-hidden rounded-xl blur-[2.5px]
            before:absolute before:top-1/2 before:left-1/2 before:z-[-2] before:h-[999px] before:w-[999px] before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-60 before:bg-[conic-gradient(#000,#1e3a5f_5%,#000_38%,#000_50%,#2d6b4f_60%,#000_87%)] before:bg-no-repeat before:transition-all before:duration-[2000ms]
            group-hover:before:rotate-[-120deg] group-focus-within:before:rotate-[420deg] group-focus-within:before:duration-[4000ms]"
          aria-hidden
        />
        <div
          className="absolute z-0 h-full w-full max-h-[54px] overflow-hidden rounded-xl blur-[2px]
            before:absolute before:top-1/2 before:left-1/2 before:z-[-2] before:h-[600px] before:w-[600px] before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg] before:bg-[conic-gradient(rgba(0,0,0,0),#0d1f2d,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#1a4d3a,rgba(0,0,0,0)_60%)] before:bg-no-repeat before:transition-all before:duration-[2000ms]
            group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-[442deg] group-focus-within:before:duration-[4000ms]"
          aria-hidden
        />
        <div
          className="absolute z-0 h-full w-full max-h-[54px] overflow-hidden rounded-lg blur-[2px]
            before:absolute before:top-1/2 before:left-1/2 before:z-[-2] before:h-[600px] before:w-[600px] before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[83deg] before:bg-[conic-gradient(rgba(0,0,0,0)_0%,#5a7ab8,rgba(0,0,0,0)_8%,rgba(0,0,0,0)_50%,#4db892,rgba(0,0,0,0)_58%)] before:brightness-125 before:transition-all before:duration-[2000ms]
            group-hover:before:rotate-[-97deg] group-focus-within:before:rotate-[443deg] group-focus-within:before:duration-[4000ms]"
          aria-hidden
        />
        <div
          className="absolute z-0 h-full w-full max-h-[50px] overflow-hidden rounded-xl blur-[0.5px]
            before:absolute before:top-1/2 before:left-1/2 before:z-[-2] before:h-[600px] before:w-[600px] before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-70 before:bg-[conic-gradient(#121212,#2a4a8c_5%,#121212_14%,#121212_50%,#2d8f6a_60%,#121212_64%)] before:brightness-110 before:transition-all before:duration-[2000ms]
            group-hover:before:rotate-[-110deg] group-focus-within:before:rotate-[430deg] group-focus-within:before:duration-[4000ms]"
          aria-hidden
        />

        <div className="relative z-[1] w-full">
          <input
            type="text"
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="off"
            className={cn(
              "h-12 w-full min-w-0 rounded-lg border border-[#252a34] bg-[#11141a] pr-11 pl-11 text-sm text-white caret-[#6bb0ff] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] outline-none transition-[box-shadow,border-color] placeholder:font-normal placeholder:text-[#98a2b3] focus:border-[#3b4e73] focus:ring-2 focus:ring-[#4f8ef7]/30 disabled:opacity-50",
              className,
            )}
            {...inputProps}
          />
          <div
            className="pointer-events-none absolute top-2 left-1.5 h-4 w-7 rounded-full bg-[#4f8ef7]/20 opacity-80 blur-xl transition-opacity duration-2000 group-hover:opacity-0"
            aria-hidden
          />

          <div
            className="absolute top-2 right-2 h-8 w-8 overflow-hidden rounded-md
              before:absolute before:top-1/2 before:left-1/2 before:h-[600px] before:w-[600px] before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-90 before:bg-[conic-gradient(rgba(0,0,0,0),#2a2f3d,rgba(0,0,0,0)_50%,rgba(0,0,0,0)_50%,#2a3548,rgba(0,0,0,0)_100%)] before:bg-no-repeat before:brightness-125 before:animate-[spin_10s_linear_infinite]"
            aria-hidden
          />

          <div className="absolute top-2 right-2 z-[2] flex h-8 w-8 items-center justify-center overflow-hidden rounded-md border border-[#2c3648] bg-gradient-to-b from-[#1a1d25] via-[#0c0f14] to-[#151a22] [isolation:isolate]">
            <Filter className="h-4 w-4 text-[#acb9d1]" strokeWidth={1.3} aria-hidden />
          </div>

          <div className="pointer-events-none absolute top-[13px] left-3.5 text-[#aeb7c8]">
            <Search className="h-5 w-5" strokeWidth={2} aria-hidden />
          </div>
        </div>
      </div>
    </div>
  )
}
