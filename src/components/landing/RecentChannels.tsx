"use client"

import Image from "next/image"
import { Clock, X } from "lucide-react"
import type { RecentChannel } from "@/hooks/useRecentChannels"
import { formatViews } from "@/lib/utils"

type RecentChannelsProps = {
  recents: RecentChannel[]
  onSelect: (handle: string) => void
  onClear: () => void
}

export function RecentChannels({ recents, onSelect, onClear }: RecentChannelsProps) {
  if (recents.length === 0) return null

  return (
    <section className="mx-auto mt-6 max-w-3xl">
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-zinc-600">
          <Clock className="h-3 w-3" aria-hidden />
          Recent
        </p>
        <button
          type="button"
          onClick={onClear}
          className="text-[10px] text-zinc-600 transition-colors hover:text-zinc-400"
          aria-label="Clear recent channels"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recents.map((channel) => (
          <button
            key={channel.handle}
            type="button"
            onClick={() => onSelect(channel.handle)}
            className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 text-left transition-colors hover:border-indigo-500/25 hover:bg-indigo-500/8 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
          >
            {channel.thumbnailUrl ? (
              <Image
                src={channel.thumbnailUrl}
                alt=""
                aria-hidden="true"
                width={20}
                height={20}
                unoptimized
                className="h-5 w-5 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[8px] font-bold text-zinc-400">
                {channel.title.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="max-w-[120px] truncate text-xs font-medium text-zinc-200">
                {channel.title}
              </p>
              <p className="text-[10px] text-zinc-600">
                {formatViews(channel.subscriberCount)} subs
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
