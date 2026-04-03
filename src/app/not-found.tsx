import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <div className="mx-auto max-w-md">
        {/* 404 number */}
        <p className="font-[family-name:var(--font-display-face)] text-8xl font-normal text-white/10">
          404
        </p>

        {/* Message */}
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-white">
          Page not found
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-white/90"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to home
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 px-6 text-sm font-medium text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
          >
            <Search className="h-3.5 w-3.5" aria-hidden />
            Analyze a channel
          </Link>
        </div>
      </div>
    </div>
  )
}
