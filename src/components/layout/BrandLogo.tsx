"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

/** Inline SVG spy-lens icon — concentric circles motif, scales cleanly */
function SpyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" />
    </svg>
  )
}

type BrandLogoVariant = "icon" | "wordmark" | "full"

type BrandLogoProps = {
  variant?: BrandLogoVariant
  className?: string
}

export function BrandLogo({ variant = "full", className }: BrandLogoProps) {
  if (variant === "icon") {
    return (
      <Link
        href="/"
        className={cn("inline-flex items-center justify-center", className)}
        aria-label="ChannelSpy home"
      >
        <SpyIcon className="h-6 w-6 text-white" />
      </Link>
    )
  }

  if (variant === "wordmark") {
    return (
      <Link
        href="/"
        className={cn("inline-flex items-center", className)}
        aria-label="ChannelSpy home"
      >
        <span className="text-[15px] font-semibold tracking-tight text-white">
          ChannelSpy
        </span>
      </Link>
    )
  }

  // full — icon + wordmark (default)
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2", className)}
      aria-label="ChannelSpy home"
    >
      <SpyIcon className="h-5 w-5 shrink-0 text-white" />
      <span className="text-[15px] font-semibold tracking-tight text-white">
        ChannelSpy
      </span>
    </Link>
  )
}
