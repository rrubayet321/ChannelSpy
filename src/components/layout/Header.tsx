"use client"

import { useRef, useEffect, useState } from "react"
import { BrandLogo } from "@/components/layout/BrandLogo"
import { LANDING_FAQ_ITEMS } from "@/lib/landing-faq"
import { ChevronDown, Mail, Star } from "lucide-react"

function Dropdown({
  trigger,
  children,
  align = "right",
}: {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "left" | "right"
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex cursor-pointer select-none items-center"
      >
        {trigger}
      </button>

      {/* Panel — always mounted, animated via CSS */}
      <div
        className={`absolute ${align === "right" ? "right-0" : "left-0"} top-full z-[60] mt-2 transition-all duration-300 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-14 min-w-0 w-full items-center border-b border-white/[0.04] bg-black/80 px-4 backdrop-blur-xl sm:px-8">
      <div className="flex min-w-0 shrink items-center">
        <BrandLogo variant="full" />
      </div>

      <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
        {/* FAQ dropdown */}
        <Dropdown
          trigger={
            <span className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-200">
              FAQ
              <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
            </span>
          }
        >
          <div
            className="w-[min(100vw-2rem,22rem)] max-h-[min(70vh,28rem)] overflow-y-auto rounded-xl border border-white/[0.1] bg-[#0a0a0a]/95 p-3 shadow-[0_16px_48px_rgba(0,0,0,0.65)] backdrop-blur-xl"
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
                    <summary className="cursor-pointer select-none list-none text-left text-sm font-medium text-zinc-200 outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="flex items-start justify-between gap-2">
                        <span>{item.q}</span>
                        <span className="shrink-0 text-indigo-400/80 transition-transform duration-200 group-open/item:rotate-180">⌄</span>
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
        </Dropdown>

        {/* Star link */}
        <a
          href="https://github.com/rrubayet321/ChannelSpy"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400 transition-all duration-200 hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-300 hover:shadow-[0_0_12px_rgba(99,102,241,0.15)] sm:inline-flex"
          aria-label="Star ChannelSpy on GitHub"
        >
          <Star className="h-3.5 w-3.5 text-amber-400" aria-hidden />
          Star this repo
        </a>

        {/* Contact dropdown */}
        <Dropdown
          trigger={
            <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400 transition-all duration-200 hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-300 hover:shadow-[0_0_12px_rgba(99,102,241,0.15)]">
              <Mail className="h-3.5 w-3.5" aria-hidden />
              Contact
            </span>
          }
        >
          <div className="w-64 rounded-xl border border-white/[0.1] bg-[#0a0a0a]/95 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.65)] backdrop-blur-xl">
            <p className="text-xs leading-relaxed text-zinc-400">
              For any bug fixes, feedbacks and queries contact me
            </p>
            <a
              href="mailto:rrubayet321@gmail.com"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              <Mail className="h-3 w-3" aria-hidden />
              rrubayet321@gmail.com
            </a>
          </div>
        </Dropdown>

        <span className="h-3.5 w-px bg-white/10 sm:block hidden" />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
          <span className="h-1 w-1 rounded-full bg-zinc-500 opacity-75" />
          Beta
        </span>
      </div>
    </header>
  )
}
