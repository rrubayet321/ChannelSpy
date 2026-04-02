"use client"

import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

const LOGO_SRC = "/channelspy-logo.png"
const LOGO_WIDTH = 720
const LOGO_HEIGHT = 144

/** Shell + image treatment aligned with header/cards (white/8 borders, indigo ambient glow). */
const logoShellClass =
  "rounded-lg border border-white/[0.08] bg-black/50 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_28px_rgba(99,102,241,0.08)] transition-[border-color,box-shadow,background-color] duration-200"

const logoShellHoverClass =
  "hover:border-indigo-500/25 hover:bg-black/60 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_32px_rgba(99,102,241,0.14)]"

const iconShellClass =
  "rounded-md border border-white/[0.08] bg-black/50 p-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_20px_rgba(99,102,241,0.1)] transition-[border-color,box-shadow,background-color] duration-200"

/** Nudge asset purple toward app indigo (#6366f1) and keep whites crisp on dark UI. */
const logoImageClass =
  "select-none brightness-[1.04] contrast-[1.03] saturate-[1.06] hue-rotate-[-6deg]"

/**
 * Locks vertical rhythm: inline images sit on the text baseline and pick up extra gap below.
 * Fixed-height flex row keeps icon + wordmark optically centered in the shell.
 */
function LogoMark({
  heightClass,
  className,
  maxWidthClass,
}: {
  heightClass: string
  maxWidthClass?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex min-w-0 items-center justify-center leading-none",
        heightClass,
        maxWidthClass,
      )}
    >
      <Image
        src={LOGO_SRC}
        alt="ChannelSpy"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className={cn(
          "block h-full w-auto max-h-full max-w-full object-contain object-left -translate-y-px",
          logoImageClass,
          className,
        )}
        priority
      />
    </span>
  )
}

type BrandLogoVariant = "icon" | "wordmark" | "full"

type BrandLogoProps = {
  variant?: BrandLogoVariant
  className?: string
  iconClassName?: string
  textClassName?: string
  showLiveDot?: boolean
}

export function BrandLogo({
  variant = "full",
  className,
  iconClassName,
}: BrandLogoProps) {
  if (variant === "icon") {
    return (
      <Link
        href="/"
        className={cn(
          "relative block h-8 w-8 shrink-0 overflow-hidden",
          iconShellClass,
          logoShellHoverClass,
          className,
        )}
        aria-label="ChannelSpy home"
      >
        <Image
          src={LOGO_SRC}
          alt=""
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          className={cn(
            "block h-full w-full object-cover object-left leading-none",
            logoImageClass,
            iconClassName,
          )}
          priority
        />
      </Link>
    )
  }

  if (variant === "wordmark") {
    return (
      <Link
        href="/"
        className={cn(
          "inline-flex items-center justify-center leading-none",
          logoShellClass,
          logoShellHoverClass,
          className,
        )}
        aria-label="ChannelSpy home"
      >
        <LogoMark heightClass="h-6" maxWidthClass="max-w-[min(100%,12rem)]" />
      </Link>
    )
  }

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center justify-center leading-none",
        logoShellClass,
        logoShellHoverClass,
        className,
      )}
      aria-label="ChannelSpy home"
    >
      <LogoMark
        heightClass="h-[30px] sm:h-8"
        maxWidthClass="max-w-[min(100vw-8rem,14rem)] sm:max-w-none"
      />
    </Link>
  )
}
