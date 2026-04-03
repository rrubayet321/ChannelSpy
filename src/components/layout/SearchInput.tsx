"use client"

import { FormEvent, useRef, useState } from "react"
import { Loader2, Search } from "lucide-react"

import { AnimatedGlowingSearchBar } from "@/components/ui/animated-glowing-search-bar"
import { trackEvent } from "@/lib/analytics"

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
  const hasStartedRef = useRef(false)

  const handleValueChange = (nextValue: string) => {
    if (!hasStartedRef.current && nextValue.length > 0) {
      hasStartedRef.current = true
      trackEvent("input_started")
    }
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
    trackEvent("analyze_clicked", { input_length: trimmed.length })
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
          className="analyze-cta-glow btn-clean flex h-12 w-full shrink-0 min-w-[120px] items-center justify-center gap-2 self-center rounded-xl border border-[#7c88ff] bg-[#6c78ff] px-5 text-sm font-semibold text-white hover:bg-[#7a86ff] active:scale-[0.98] disabled:opacity-50 sm:w-auto"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Search className="h-4 w-4" aria-hidden />}
          {isLoading ? "Analyzing…" : "Analyze"}
        </button>
      </div>
    </form>
  )
}
