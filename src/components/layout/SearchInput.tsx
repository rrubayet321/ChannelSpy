"use client"

import { FormEvent, useState } from "react"
import { Loader2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={isLoading}
          placeholder={placeholder}
          className="h-12 border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
          aria-label="YouTube channel input"
        />
        <Button
          type="submit"
          disabled={isLoading || value.trim().length === 0}
          className="h-12 min-w-28 bg-zinc-100 text-zinc-900 hover:bg-zinc-300"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {isLoading ? "Scanning..." : "Analyze"}
        </Button>
      </div>
      <p className="text-xs text-zinc-500">
        Supports `@handle`, `/channel/...`, `/c/...`, and bare handles.
      </p>
    </form>
  )
}
