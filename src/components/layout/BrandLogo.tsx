"use client"

import { cn } from "@/lib/utils"

type BrandLogoVariant = "icon" | "wordmark" | "full"

type BrandLogoProps = {
  variant?: BrandLogoVariant
  className?: string
  iconClassName?: string
  textClassName?: string
  showLiveDot?: boolean
}

/**
 * BrandMark — A bold, vibrant gradient ring representing a "Spy Lens"
 * colored with the signature Aceternity vibrant palette (Purple -> Magenta -> Orange).
 */
function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-8 w-8 items-center justify-center", className)} aria-hidden="true">
      {/* Outer vibrant lens ring */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="brand-gradient" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4338ca" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a5b4fc" />
          </linearGradient>
          <linearGradient id="brand-gradient-glow" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4338ca" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        
        {/* Glow behind the ring */}
        <circle cx="16" cy="16" r="11" stroke="url(#brand-gradient-glow)" strokeWidth="6" filter="blur(4px)" opacity="0.6"/>
        
        {/* Crisp core ring */}
        <circle cx="16" cy="16" r="11" stroke="url(#brand-gradient)" strokeWidth="4" />
        
        {/* Inner 'recording/live' signal dot */}
        <circle cx="16" cy="16" r="3" fill="#818cf8" />
      </svg>
    </span>
  )
}

function BrandWordmark({
  className,
}: {
  className?: string
}) {
  return (
    <span className={cn("font-heading text-lg tracking-tight", className)}>
      <span className="font-semibold text-white">Channel</span>
      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-300">Spy</span>
    </span>
  )
}

export function BrandLogo({
  variant = "full",
  className,
  iconClassName,
  textClassName,
}: BrandLogoProps) {
  if (variant === "icon") {
    return (
      <span className={cn("inline-flex", className)} aria-label="ChannelSpy">
        <BrandMark className={iconClassName} />
      </span>
    )
  }

  if (variant === "wordmark") {
    return (
      <span className={cn("inline-flex items-center", className)} aria-label="ChannelSpy">
        <BrandWordmark className={textClassName} />
      </span>
    )
  }

  return (
    <span className={cn("inline-flex items-center gap-2", className)} aria-label="ChannelSpy">
      <BrandMark className={iconClassName} />
      <BrandWordmark className={textClassName} />
    </span>
  )
}
