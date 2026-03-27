import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import type { Channel } from "@/lib/types"
import { formatViews } from "@/lib/utils"

type ChannelHeaderProps = {
  channel: Channel
}

export function ChannelHeader({ channel }: ChannelHeaderProps) {
  const handle = channel.handle ? `@${channel.handle}` : ""

  return (
    <Card className="border-zinc-800 bg-zinc-900/70">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-zinc-700">
          <Image
            src={channel.thumbnailUrl || "/vercel.svg"}
            alt={channel.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-semibold tracking-tight text-zinc-100">
            {channel.title}
          </h2>
          <p className="text-sm text-zinc-400">{handle}</p>
          <div className="mt-2 grid gap-2 text-xs text-zinc-400 sm:grid-cols-3">
            <p>
              Subscribers:{" "}
              <span className="font-mono text-zinc-100">
                {formatViews(channel.subscriberCount)}
              </span>
            </p>
            <p>
              Total views:{" "}
              <span className="font-mono text-zinc-100">{formatViews(channel.viewCount)}</span>
            </p>
            <p>
              Videos: <span className="font-mono text-zinc-100">{formatViews(channel.videoCount)}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
