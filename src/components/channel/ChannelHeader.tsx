import Image from "next/image"

import type { Channel } from "@/lib/types"
import { formatViews } from "@/lib/utils"

type ChannelHeaderProps = {
  channel: Channel
}

export function ChannelHeader({ channel }: ChannelHeaderProps) {
  const handle = channel.handle ? `@${channel.handle}` : ""

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#1e1e1e] bg-[#0f0f0f] p-6 sm:p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#1a1a1a]/45 to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-4 text-center">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-[#2f2f2f]">
          <Image
            src={channel.thumbnailUrl || "/vercel.svg"}
            alt={channel.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 hover:scale-[1.03]"
          />
        </div>

        <div className="min-w-0 space-y-1">
          <h2 className="truncate font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {channel.title}
          </h2>
          <p className="text-sm text-[#777] sm:text-base">{handle}</p>
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

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-[#222] bg-[#121212] px-3.5 py-1.5 text-sm transition-colors hover:border-[#2e2e2e] hover:bg-[#151515]">
      <span className="text-[#6d6d6d]">{label}</span>
      <span className="font-mono font-semibold text-white">{value}</span>
    </span>
  )
}
