import Image from "next/image"
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
  const shouldShowFallback = !channel.thumbnailUrl || failedThumbnailUrl === channel.thumbnailUrl

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#222833] bg-[#0f131a] p-6 sm:p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#1f2633]/55 to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-4 text-center">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-[#364359]">
          {shouldShowFallback ? (
            <div className="flex h-full w-full items-center justify-center bg-[#171d29] text-xl font-semibold text-[#d4ddef]">
              {initials}
            </div>
          ) : (
            <Image
              src={channel.thumbnailUrl}
              alt={channel.title}
              fill
              unoptimized
              onError={() => setFailedThumbnailUrl(channel.thumbnailUrl)}
              className="object-cover transition-transform duration-300 hover:scale-[1.03]"
            />
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <h2 className="truncate font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {channel.title}
          </h2>
          <p className="text-sm text-[#8f9ab1] sm:text-base">{handle}</p>
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
    <span className="inline-flex items-center gap-2 rounded-lg border border-[#2a3446] bg-[#141b27] px-3.5 py-1.5 text-sm transition-colors hover:border-[#3f4d65] hover:bg-[#182132]">
      <span className="text-[#8390a8]">{label}</span>
      <span className="font-mono font-semibold text-white">{value}</span>
    </span>
  )
}
