import { Eye } from "lucide-react"

export function Header() {
  return (
    <header className="w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="rounded-md border border-zinc-700 bg-zinc-900 p-2">
            <Eye className="h-4 w-4 text-zinc-100" />
          </span>
          <div>
            <p className="text-lg font-semibold tracking-tight">
              <span className="text-zinc-400">Channel</span>
              <span className="text-zinc-100">Spy</span>
            </p>
            <p className="text-xs text-zinc-500">Competitor intelligence. Instantly.</p>
          </div>
        </div>
      </div>
    </header>
  )
}
