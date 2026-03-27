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
        <rect x="5" y="5" width="18" height="18" rx="5" stroke="var(--brand-mark-foreground)" strokeWidth="1.4" />
        <path
          d="M9.5 18.2L14 9.7L18.5 18.2"
          stroke="var(--brand-mark-foreground)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M11.3 14.8H16.7" stroke="var(--brand-mark-accent)" strokeWidth="1.4" strokeLinecap="round" />
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
    <span className={cn("font-heading text-lg tracking-[0.01em]", className)}>
      <span className="font-medium text-[var(--brand-wordmark-light)]">Channel</span>
      <span className="ml-[1px] font-semibold text-[var(--brand-wordmark-strong)]">Spy</span>
      {showLiveDot ? (
        <span
          className="relative -top-1.5 ml-1 inline-block h-[5px] w-[5px] rounded-full bg-[var(--brand-live-dot)]"
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
