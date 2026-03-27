import { BrandLogo } from "@/components/layout/BrandLogo"

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#1e1e1e] bg-[#080808]/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-3 sm:px-6">
        <BrandLogo variant="full" />
      </div>
    </header>
  )
}
