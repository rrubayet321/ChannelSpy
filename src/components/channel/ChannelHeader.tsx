import Image from "next/image"

import type { Channel } from "@/lib/types"
import { formatViews } from "@/lib/utils"

type ChannelHeaderProps = {
  channel: Channel
}

export function ChannelHeader({ channel }: ChannelHeaderProps) {
  const handle = channel.handle ? `@${channel.handle}` : ""

  return (
    <div className="rounded-2xl border border-[#1e1e1e] bg-[#0f0f0f] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-[#242424]">
          <Image
            src={channel.thumbnailUrl || "/vercel.svg"}
            alt={channel.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-2xl font-bold text-white">{channel.title}</h2>
          <p className="text-sm text-[#555]">{handle}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatPill label="Subscribers" value={formatViews(channel.subscriberCount)} />
            <StatPill label="Total views" value={formatViews(channel.viewCount)} />
            <StatPill label="Videos" value={formatViews(channel.videoCount)} />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#1e1e1e] bg-[#141414] px-3 py-1 text-sm">
      <span className="text-[#555]">{label}</span>
      <span className="font-mono text-white">{value}</span>
    </span>
  )
}
