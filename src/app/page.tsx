"use client"

import { Header } from "@/components/layout/Header"
import { SearchInput } from "@/components/layout/SearchInput"
import { ChannelHeader } from "@/components/channel/ChannelHeader"
import { VideoGrid } from "@/components/channel/VideoGrid"
import { ViewsChart } from "@/components/charts/ViewsChart"
import { TopVideosChart } from "@/components/charts/TopVideosChart"
import { EngagementChart } from "@/components/charts/EngagementChart"
import { Skeleton } from "@/components/ui/skeleton"
import { useChannelData } from "@/hooks/useChannelData"
import { exportToCSV, formatEngagement, formatViews } from "@/lib/utils"
import { AlertTriangle, Download, SearchX, ShieldAlert } from "lucide-react"

const KPI_ACCENTS = [
  "border-l-2 border-l-[#4f8ef7]",
  "border-l-2 border-l-[#3ecf8e]",
  "border-l-2 border-l-[#f5a623]",
  "border-l-2 border-l-[#888]",
] as const

export default function Home() {
  const { data, error, errorCode, isLoading, analyzeChannel } = useChannelData()

  return (
    <div className="min-h-screen bg-[#080808] text-[#f0f0f0]">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Hero — full bleed, no card */}
        <section className="mx-auto mb-12 max-w-3xl text-center">
          <span className="mb-5 inline-flex items-center rounded-full border border-[#242424] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#666]">
            Competitor intelligence platform
          </span>

          <h1 className="font-heading text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl">
            Turn any YouTube channel
            <br />
            <span className="bg-gradient-to-r from-white to-[#888] bg-clip-text text-transparent">
              into actionable intel.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-base text-[#666]">
            Paste a channel URL and instantly scan views, engagement, trend velocity, and top performers.
          </p>

          <div className="mt-8">
            <SearchInput isLoading={isLoading} onAnalyze={analyzeChannel} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#555]">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#3ecf8e]" />
              Works with @handles and full URLs
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#3ecf8e]" />
              No API key exposed on client
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#3ecf8e]" />
              Instant client-side filters
            </span>
          </div>
        </section>

        {/* Feature cards */}
        <section className="mb-8 grid gap-3 sm:grid-cols-3">
          <FeatureCard label="Inputs" description="Handle, channel ID, custom URL, and full channel links." />
          <FeatureCard label="Signals" description="Performance score, engagement ratios, and trend delta vs average." />
          <FeatureCard label="Output" description="Exportable report-ready video intel in one click." />
        </section>

        {isLoading && <LoadingState />}

        {!isLoading && error && <ErrorState code={errorCode} fallbackMessage={error} />}

        {!isLoading && data && (
          <section className="space-y-8">
            <p className="text-center text-sm text-[#3ecf8e]">Intel ready.</p>
            <ChannelHeader channel={data.channel} />

            {/* KPI row */}
            <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
              <KpiCard title="Avg Views" value={formatViews(data.avgViews)} accent={KPI_ACCENTS[0]} />
              <KpiCard title="Avg Engagement" value={formatEngagement(data.avgEngagement)} accent={KPI_ACCENTS[1]} />
              <KpiCard title="Best Performer" value={data.topPerformers[0]?.title ?? "N/A"} mono={false} accent={KPI_ACCENTS[2]} />
              <KpiCard title="Upload Frequency" value={data.postingFrequency} mono={false} accent={KPI_ACCENTS[3]} />
            </section>

            {/* Charts */}
            <section className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-heading text-lg font-semibold tracking-tight text-white">Charts</h2>
                <p className="text-xs text-[#555]">Powered by current channel analytics</p>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                <ViewsChart analytics={data} />
                <EngagementChart analytics={data} />
              </div>
              <TopVideosChart analytics={data} />
            </section>

            {/* Spy Report */}
            <section className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold text-white">Video Intel</h2>
                  <p className="ml-3 text-sm text-[#555]">{data.videos.length} videos analyzed</p>
                </div>
                <button
                  type="button"
                  onClick={() => exportToCSV(data.videos, data.channel.title)}
                  disabled={data.videos.length === 0}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#242424] px-3 py-1.5 text-xs text-[#888] transition-colors hover:border-[#444] hover:text-white disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export Report
                </button>
              </div>
              <VideoGrid videos={data.videos} channelAvgViews={data.avgViews} />
            </section>
          </section>
        )}
      </main>
    </div>
  )
}

function FeatureCard({ label, description }: { label: string; description: string }) {
  return (
    <div className="rounded-2xl border border-[#1e1e1e] bg-[#0f0f0f] p-5 transition-colors hover:border-[#2a2a2a]">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-[#f04444]">{label}</p>
      <p className="text-sm leading-relaxed text-[#888]">{description}</p>
    </div>
  )
}

function KpiCard({
  title,
  value,
  mono = true,
  accent,
}: {
  title: string
  value: string
  mono?: boolean
  accent: string
}) {
  return (
    <div className={`rounded-2xl border border-[#1e1e1e] bg-[#0f0f0f] p-5 ${accent}`}>
      <p className="text-[10px] uppercase tracking-[0.15em] text-[#555]">{title}</p>
      <p className={`mt-2 text-2xl font-semibold text-white sm:text-3xl ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  )
}

function LoadingState() {
  return (
    <section className="space-y-6">
      <p className="text-center text-sm text-[#888]">Scanning channel...</p>

      <div className="rounded-2xl border border-[#1e1e1e] bg-[#0f0f0f] p-5">
        <div className="flex gap-4">
          <Skeleton className="h-16 w-16 rounded-full bg-[#1a1a1a]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-1/3 bg-[#1a1a1a]" />
            <Skeleton className="h-4 w-1/4 bg-[#1a1a1a]" />
            <div className="grid gap-2 pt-1 sm:grid-cols-3">
              <Skeleton className="h-4 w-full bg-[#1a1a1a]" />
              <Skeleton className="h-4 w-full bg-[#1a1a1a]" />
              <Skeleton className="h-4 w-full bg-[#1a1a1a]" />
            </div>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl bg-[#1a1a1a]" />
        ))}
      </section>

      <section className="space-y-3">
        <Skeleton className="h-5 w-24 bg-[#1a1a1a]" />
        <div className="grid gap-4 xl:grid-cols-2">
          <Skeleton className="h-72 w-full rounded-2xl bg-[#1a1a1a]" />
          <Skeleton className="h-72 w-full rounded-2xl bg-[#1a1a1a]" />
        </div>
        <Skeleton className="h-80 w-full rounded-2xl bg-[#1a1a1a]" />
      </section>

      <section className="space-y-3">
        <Skeleton className="h-5 w-28 bg-[#1a1a1a]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-2xl bg-[#1a1a1a]" />
          ))}
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
      <div className="mx-auto max-w-3xl rounded-2xl border border-[#f5a623]/30 bg-[#f5a623]/5 p-4">
        <div className="flex items-start gap-3 text-sm">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#f5a623]" />
          <div>
            <p className="font-medium text-white">Spy Report unavailable: quota reached.</p>
            <p className="mt-1 text-[#888]">YouTube API daily quota is exhausted. Please retry later or switch API key.</p>
          </div>
        </div>
      </div>
    )
  }

  if (code === "NOT_FOUND") {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-[#4f8ef7]/30 bg-[#4f8ef7]/5 p-4">
        <div className="flex items-start gap-3 text-sm">
          <SearchX className="mt-0.5 h-4 w-4 shrink-0 text-[#4f8ef7]" />
          <div>
            <p className="font-medium text-white">No channel intel found.</p>
            <p className="mt-1 text-[#888]">Check the channel URL or handle and try again.</p>
          </div>
        </div>
      </div>
    )
  }

  if (code === "INVALID_INPUT") {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-[#f04444]/30 bg-[#f04444]/5 p-4">
        <div className="flex items-start gap-3 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#f04444]" />
          <div>
            <p className="font-medium text-white">Input needs a valid YouTube channel format.</p>
            <p className="mt-1 text-[#888]">Try @handle, /channel/..., /c/..., or full channel URL.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-[#f04444]/30 bg-[#f04444]/5 p-4">
      <p className="text-sm text-[#888]">{fallbackMessage}</p>
    </div>
  )
}
