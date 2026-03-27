"use client"

import { Header } from "@/components/layout/Header"
import { SearchInput } from "@/components/layout/SearchInput"
import { ChannelHeader } from "@/components/channel/ChannelHeader"
import { VideoGrid } from "@/components/channel/VideoGrid"
import { ViewsChart } from "@/components/charts/ViewsChart"
import { TopVideosChart } from "@/components/charts/TopVideosChart"
import { EngagementChart } from "@/components/charts/EngagementChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useChannelData } from "@/hooks/useChannelData"
import { formatEngagement, formatViews } from "@/lib/utils"
import { AlertTriangle, SearchX, ShieldAlert } from "lucide-react"

export default function Home() {
  const { data, error, errorCode, isLoading, analyzeChannel } = useChannelData()

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <section className="mx-auto mb-8 max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Spy on any YouTube channel. Instantly.
          </h1>
          <p className="mt-4 text-sm text-zinc-400 sm:text-base">
            Paste a channel URL and get performance intel: views, engagement, trends, and top performers.
          </p>
          <div className="mt-8">
            <SearchInput isLoading={isLoading} onAnalyze={analyzeChannel} />
          </div>
        </section>

        {isLoading && <LoadingState />}

        {!isLoading && error && <ErrorState code={errorCode} fallbackMessage={error} />}

        {!isLoading && data && (
          <section className="space-y-6">
            <p className="text-center text-sm text-[var(--accent-green)]">Intel ready.</p>
            <ChannelHeader channel={data.channel} />

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard title="Avg Views" value={formatViews(data.avgViews)} />
              <KpiCard title="Avg Engagement" value={formatEngagement(data.avgEngagement)} />
              <KpiCard title="Best Performer" value={data.topPerformers[0]?.title ?? "N/A"} mono={false} />
              <KpiCard title="Upload Frequency" value={data.postingFrequency} mono={false} />
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-zinc-100">Charts</h2>
                <p className="text-xs text-zinc-400">Powered by current channel analytics</p>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                <ViewsChart analytics={data} />
                <EngagementChart analytics={data} />
              </div>
              <TopVideosChart analytics={data} />
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-zinc-100">Spy Report</h2>
                <p className="text-xs text-zinc-400">{data.videos.length} videos analyzed</p>
              </div>
              <VideoGrid videos={data.videos} channelAvgViews={data.avgViews} />
            </section>
          </section>
        )}
      </main>
    </div>
  )
}

function KpiCard({
  title,
  value,
  mono = true,
}: {
  title: string
  value: string
  mono?: boolean
}) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/70">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={`${mono ? "font-mono" : ""} text-base text-zinc-100`}>{value}</CardContent>
    </Card>
  )
}

function LoadingState() {
  return (
    <section className="space-y-6">
      <p className="text-center text-sm text-zinc-400">Scanning channel...</p>

      <Card className="border-zinc-800 bg-zinc-900/70">
        <CardContent className="flex gap-4 p-5">
          <Skeleton className="h-16 w-16 rounded-full bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-1/3 bg-zinc-800" />
            <Skeleton className="h-4 w-1/4 bg-zinc-800" />
            <div className="grid gap-2 pt-1 sm:grid-cols-3">
              <Skeleton className="h-4 w-full bg-zinc-800" />
              <Skeleton className="h-4 w-full bg-zinc-800" />
              <Skeleton className="h-4 w-full bg-zinc-800" />
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-24 w-full bg-zinc-800" />
        <Skeleton className="h-24 w-full bg-zinc-800" />
        <Skeleton className="h-24 w-full bg-zinc-800" />
        <Skeleton className="h-24 w-full bg-zinc-800" />
      </section>

      <section className="space-y-3">
        <Skeleton className="h-5 w-24 bg-zinc-800" />
        <div className="grid gap-4 xl:grid-cols-2">
          <Skeleton className="h-72 w-full bg-zinc-800" />
          <Skeleton className="h-72 w-full bg-zinc-800" />
        </div>
        <Skeleton className="h-80 w-full bg-zinc-800" />
      </section>

      <section className="space-y-3">
        <Skeleton className="h-5 w-28 bg-zinc-800" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-80 w-full bg-zinc-800" />
          <Skeleton className="h-80 w-full bg-zinc-800" />
          <Skeleton className="h-80 w-full bg-zinc-800" />
        </div>
      </section>
    </section>
  )
}

function ErrorState({
  code,
  fallbackMessage,
}: {
  code: string | null
  fallbackMessage: string
}) {
  if (code === "QUOTA_EXCEEDED") {
    return (
      <Card className="mx-auto max-w-3xl border-amber-900/70 bg-amber-950/30 text-amber-100">
        <CardContent className="flex items-start gap-3 p-4 text-sm">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Spy Report unavailable: quota reached.</p>
            <p className="mt-1 text-amber-200/80">
              YouTube API daily quota is exhausted. Please retry later or switch API key.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (code === "NOT_FOUND") {
    return (
      <Card className="mx-auto max-w-3xl border-blue-900/70 bg-blue-950/30 text-blue-100">
        <CardContent className="flex items-start gap-3 p-4 text-sm">
          <SearchX className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">No channel intel found.</p>
            <p className="mt-1 text-blue-200/80">Check the channel URL or handle and try again.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (code === "INVALID_INPUT") {
    return (
      <Card className="mx-auto max-w-3xl border-red-900/70 bg-red-950/30 text-red-100">
        <CardContent className="flex items-start gap-3 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Input needs a valid YouTube channel format.</p>
            <p className="mt-1 text-red-200/80">
              Try `@handle`, `/channel/...`, `/c/...`, or full channel URL.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-3xl border-red-900/70 bg-red-950/30 text-red-100">
      <CardContent className="p-4 text-sm">{fallbackMessage}</CardContent>
    </Card>
  )
}
