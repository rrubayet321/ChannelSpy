"use client"

import { FormEvent, useState } from "react"
import { Loader2, Search } from "lucide-react"

type SearchInputProps = {
  isLoading: boolean
  onAnalyze: (input: string) => Promise<unknown> | void
  placeholder?: string
}

export function SearchInput({
  isLoading,
  onAnalyze,
  placeholder = "Paste YouTube channel URL or @handle",
}: SearchInputProps) {
  const [value, setValue] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    await onAnalyze(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={isLoading}
          placeholder={placeholder}
          aria-label="YouTube channel input"
          className="h-12 flex-1 rounded-xl border border-[#242424] bg-[#0f0f0f] px-4 text-sm text-[#f0f0f0] outline-none transition-colors placeholder:text-[#444] focus:border-[#444] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || value.trim().length === 0}
          className="flex h-12 min-w-[120px] items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-[#e0e0e0] disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {isLoading ? "Scanning..." : "Analyze"}
        </button>
      </div>
    </form>
  )
}
