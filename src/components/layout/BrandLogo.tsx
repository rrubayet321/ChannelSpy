import { cn } from "@/lib/utils"

type BrandLogoVariant = "icon" | "wordmark" | "full"

type BrandLogoProps = {
  variant?: BrandLogoVariant
  className?: string
  iconClassName?: string
  textClassName?: string
  showLiveDot?: boolean
}

function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("brand-mark-box", className)} aria-hidden="true">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="9" stroke="var(--brand-mark-foreground)" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="3" fill="var(--brand-mark-foreground)" />
      </svg>
    </span>
  )
}

function BrandWordmark({
  className,
  showLiveDot = true,
}: {
  className?: string
  showLiveDot?: boolean
}) {
  return (
    <span className={cn("font-heading text-lg tracking-tight", className)}>
      <span className="font-light text-[var(--brand-wordmark-light)]">Channel</span>
      <span className="font-bold text-[var(--brand-wordmark-strong)]">Spy</span>
      {showLiveDot ? (
        <span
          className="relative -top-1.5 ml-0.5 inline-block h-[6px] w-[6px] rounded-full bg-[var(--brand-live-dot)]"
          aria-label="Live brand indicator"
        />
      ) : null}
    </span>
  )
}

export function BrandLogo({
  variant = "full",
  className,
  iconClassName,
  textClassName,
  showLiveDot = true,
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
        <BrandWordmark className={textClassName} showLiveDot={showLiveDot} />
      </span>
    )
  }

  return (
    <span className={cn("inline-flex items-center gap-3", className)} aria-label="ChannelSpy">
      <BrandMark className={iconClassName} />
      <BrandWordmark className={textClassName} showLiveDot={showLiveDot} />
    </span>
  )
}
