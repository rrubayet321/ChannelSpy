"use client"

import { BrandLogo } from "@/components/layout/BrandLogo"
import { LANDING_FAQ_ITEMS } from "@/lib/landing-faq"
import { ChevronDown } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-14 min-w-0 w-full items-center border-b border-white/[0.06] bg-black/80 px-4 backdrop-blur-xl sm:px-8">
      {/* Brand — given prominent visual weight */}
      <div className="flex min-w-0 shrink items-center">
        <BrandLogo variant="full" />
      </div>

      {/* Right side — kept minimal for brand-focus */}
      <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
        <details
          id="header-faq"
          className="group relative"
        >
          <summary className="flex cursor-pointer list-none items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-zinc-400 outline-none transition-colors hover:bg-white/[0.04] hover:text-zinc-200 marker:content-none [&::-webkit-details-marker]:hidden">
            FAQ
            <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60 transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <div
            className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,22rem)] max-h-[min(70vh,28rem)] overflow-y-auto rounded-xl border border-white/[0.1] bg-[#0a0a0a] p-3 shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
            role="region"
            aria-label="Frequently asked questions"
          >
            <p className="border-b border-white/[0.06] px-1 pb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Help
            </p>
            <ul className="mt-2 space-y-1">
              {LANDING_FAQ_ITEMS.map((item) => (
                <li key={item.q}>
                  <details className="group/item rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 open:border-indigo-500/25 open:bg-white/[0.04]">
                    <summary className="cursor-pointer list-none text-left text-sm font-medium text-zinc-200 outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="flex items-start justify-between gap-2">
                        <span>{item.q}</span>
                        <span className="shrink-0 text-indigo-400/80 transition-transform group-open/item:rotate-180">⌄</span>
                      </span>
                    </summary>
                    <p className="mt-2 border-t border-white/[0.06] pt-2 text-xs leading-relaxed text-zinc-400">
                      {item.a}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </details>
        <a
          href="https://github.com/rrubayet321/ChannelSpy"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden text-xs text-white/30 transition-colors hover:text-white/60 sm:inline"
          aria-label="GitHub"
        >
          GitHub
        </a>
        <span className="h-3.5 w-px bg-white/10 sm:block hidden" />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-indigo-400">
          <span className="h-1 w-1 rounded-full bg-indigo-400 opacity-75" />
          Beta
        </span>
      </div>
    </header>
  )
}
