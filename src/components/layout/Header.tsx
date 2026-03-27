"use client"

import { BrandLogo } from "@/components/layout/BrandLogo"

export function Header() {
  const handleLogoClick = () => {
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/88 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={handleLogoClick}
          className="inline-flex rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
          aria-label="Reload ChannelSpy"
        >
          <BrandLogo variant="full" showLiveDot />
        </button>
      </div>
    </header>
  )
}
