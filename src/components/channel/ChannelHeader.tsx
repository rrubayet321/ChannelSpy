import { useMemo, useState } from "react"

import type { Channel } from "@/lib/types"
import { formatViews } from "@/lib/utils"

type ChannelHeaderProps = {
  channel: Channel
}

export function ChannelHeader({ channel }: ChannelHeaderProps) {
  const handle = channel.handle ? `@${channel.handle}` : ""
  const [failedThumbnailUrl, setFailedThumbnailUrl] = useState<string | null>(null)

  const initials = useMemo(() => getChannelInitials(channel.title), [channel.title])
  const avatarSrc = channel.thumbnailUrl?.trim() ?? ""
  const shouldShowFallback = !avatarSrc || failedThumbnailUrl === avatarSrc

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6 sm:p-7">
      {/* Subtle top edge highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-4 text-center">
        {/* Avatar — plain <img> so any YouTube/Google CDN host works; next/image still enforces remotePatterns even when unoptimized */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
          {shouldShowFallback ? (
            <div className="flex h-full w-full items-center justify-center bg-white/5 text-xl font-semibold text-white/70">
              {initials}
            </div>
          ) : (
            // Channel avatars come from many YouTube/Google hostnames; next/image blocks disallowed hosts even with unoptimized.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarSrc}
              alt={`${channel.title} channel picture`}
              width={160}
              height={160}
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setFailedThumbnailUrl(avatarSrc)}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
            />
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <h2 className="truncate font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {channel.title}
          </h2>
          <p className="text-sm text-white/40 sm:text-base">{handle}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            <StatPill label="Subscribers" value={formatViews(channel.subscriberCount)} />
            <StatPill label="Total views" value={formatViews(channel.viewCount)} />
            <StatPill label="Videos" value={formatViews(channel.videoCount)} />
          </div>
        </div>
      </div>
    </section>
  )
}

function getChannelInitials(title: string): string {
  const cleanTitle = title.trim()
  if (!cleanTitle) return "CH"

  const words = cleanTitle.split(/\s+/).filter(Boolean)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()

  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase()
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5 text-sm">
      <span className="text-white/40">{label}</span>
      <span className="font-mono font-semibold text-white">{value}</span>
    </span>
  )
}
