"use client"

import { FormEvent, useState } from "react"
import { Loader2, Search } from "lucide-react"

import { AnimatedGlowingSearchBar } from "@/components/ui/animated-glowing-search-bar"

type SearchInputProps = {
  isLoading: boolean
  onAnalyze: (input: string) => Promise<unknown> | void
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
}

export function SearchInput({
  isLoading,
  onAnalyze,
  placeholder = "Paste YouTube channel URL or @handle",
  value,
  onValueChange,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState("")
  const inputValue = value ?? internalValue

  const handleValueChange = (nextValue: string) => {
    if (onValueChange) {
      onValueChange(nextValue)
      return
    }
    setInternalValue(nextValue)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed || isLoading) return
    await onAnalyze(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
        <div className="min-w-0 flex-1 sm:max-w-none">
          <AnimatedGlowingSearchBar
            value={inputValue}
            onChange={(event) => handleValueChange(event.target.value)}
            disabled={isLoading}
            placeholder={placeholder}
            aria-label="YouTube channel input"
            name="channel"
            wrapperClassName="mx-auto max-w-full"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || inputValue.trim().length === 0}
          className="flex h-12 shrink-0 min-w-[116px] items-center justify-center gap-2 self-center rounded-xl border border-white/10 bg-white px-5 text-sm font-semibold text-black shadow-[0_8px_20px_rgba(255,255,255,0.08)] transition-colors hover:bg-[#ececec] disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {isLoading ? "Scanning..." : "Analyze"}
        </button>
      </div>
    </form>
  )
}
