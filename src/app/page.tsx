"use client"

import { useMemo, useState } from "react"
import { Header } from "@/components/layout/Header"
import { SearchInput } from "@/components/layout/SearchInput"
import { ChannelHeader } from "@/components/channel/ChannelHeader"
import { VideoGrid } from "@/components/channel/VideoGrid"
import { ViewsChart } from "@/components/charts/ViewsChart"
import { TopVideosChart } from "@/components/charts/TopVideosChart"
import { EngagementChart } from "@/components/charts/EngagementChart"
import { RecentWinnersChart } from "@/components/charts/RecentWinnersChart"
import { GuidedInsightSummary } from "@/components/insights/GuidedInsightSummary"
import { GridBackground } from "@/components/ui/GridBackground"
import { OrbitLoader } from "@/components/ui/OrbitLoader"
import { SaasLandingHero } from "@/components/ui/saas-landing-hero"
import { Skeleton } from "@/components/ui/skeleton"
import { useChannelData } from "@/hooks/useChannelData"
import { buildGuidedInsightCards, type SummaryCardAction } from "@/lib/insights"
import { exportToCSV, formatViews } from "@/lib/utils"
import { AlertTriangle, ArrowLeft, Download, SearchX, ShieldAlert } from "lucide-react"
import { LandingAttribution } from "@/components/landing/LandingAttribution"

const KPI_ACCENTS = [
  "border-l-2 border-l-indigo-400/60",
  "border-l-2 border-l-[#818cf8]/60",
  "border-l-2 border-l-[#94a3b8]/60",
  "border-l-2 border-l-white/15",
] as const

export default function Home() {
  const { data, error, errorCode, isLoading, analyzeChannel, clear } = useChannelData()
  const [reportMode, setReportMode] = useState(false)
  const [activeTab, setActiveTab] = useState<"long" | "shorts">("long")
  const [showDetailedSections, setShowDetailedSections] = useState(true)
  const [channelInput, setChannelInput] = useState("")
  const [showIntro, setShowIntro] = useState(true)
  const exampleHandles = ["@MrBeast", "@mkbhd", "@chriswillx"] as const

  const activeBucket =
    data == null ? null : activeTab === "long" ? data.longForm : data.shorts

  const guidedCards = useMemo(
    () => (activeBucket ? buildGuidedInsightCards(activeBucket, activeTab) : []),
    [activeBucket, activeTab],
  )
  const viewsPerSubscriber =
    data != null && data.channel.subscriberCount > 0
      ? activeBucket != null
        ? activeBucket.avgViews / data.channel.subscriberCount
        : 0
      : 0

  const handleAnalyze = async (input: string) => {
    setReportMode(true)
    setShowDetailedSections(true)
    const analytics = await analyzeChannel(input)
    if (!analytics) return
    if (analytics.longForm.videos.length === 0 && analytics.shorts.videos.length > 0) {
      setActiveTab("shorts")
      return
    }
    setActiveTab("long")
  }

  const handleBack = () => {
    clear()
    setReportMode(false)
    setActiveTab("long")
    setShowDetailedSections(false)
    setChannelInput("")
  }

  const handleGuidedAction = (action: SummaryCardAction) => {
    if (action === "trends" || action === "videos") {
      setShowDetailedSections(true)
      window.setTimeout(() => {
        const targetId = action === "trends" ? "trends-section" : "videos-section"
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 80)
      return
    }
    document.getElementById("overview-section")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const jumpToSection = (section: "overview" | "trends" | "videos") => {
    if (section === "overview") {
      document.getElementById("overview-section")?.scrollIntoView({ behavior: "smooth", block: "start" })
      return
    }

    setShowDetailedSections(true)
    window.setTimeout(() => {
      document.getElementById(section === "trends" ? "trends-section" : "videos-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 80)
  }

  return (
    <div className="min-h-screen bg-black text-[#f2f2f2]">
      <Header />

      <main
        className={
          showIntro
            ? "w-full"
            : "mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
        }
      >
        {showIntro ? (
          <section className="relative overflow-x-hidden bg-black">
            <GridBackground />
            <div className="relative z-10">
              <SaasLandingHero className="intro-fade-up" onGetStarted={() => setShowIntro(false)} />
            </div>
            <LandingAttribution />
          </section>
        ) : (
          <>
            {!reportMode && (
              <>
                <div className="mx-auto mb-6 max-w-3xl">
                  <button
                    type="button"
                    onClick={() => setShowIntro(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-400 transition-colors hover:border-white/15 hover:bg-white/[0.06] hover:text-zinc-200"
                  >
                    <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
                    Back to home
                  </button>
                </div>
                <section className="mx-auto mb-16 max-w-3xl text-center">
                  <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] text-indigo-300/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    YouTube Competitor Intelligence
                  </span>

                  <h1 className="font-heading text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
                    Decode any channel.
                    <br />
                    <span className="text-white/60">Instantly.</span>
                  </h1>

                  <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-zinc-300">
                    Paste a competitor URL — get views, engagement, top videos, and posting patterns.
                  </p>

                  <div className="mt-10 space-y-4">
                    <SearchInput
                      isLoading={isLoading}
                      onAnalyze={handleAnalyze}
                      value={channelInput}
                      onValueChange={setChannelInput}
                    />
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {exampleHandles.map((handle) => (
                        <button
                          key={handle}
                          type="button"
                          disabled={isLoading}
                          onClick={() => {
                            setChannelInput(handle)
                            void handleAnalyze(handle)
                          }}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400 transition-colors hover:border-indigo-500/30 hover:text-indigo-300 disabled:opacity-40"
                        >
                          {handle}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="mb-12 grid gap-3 sm:grid-cols-3">
                  <FeatureCard label="Inputs" description="@handle, channel ID, or URL" />
                  <FeatureCard label="Analytics" description="Views, engagement & momentum" />
                  <FeatureCard label="Export" description="One-click CSV download" />
                </section>
                <LandingAttribution />
              </>
            )}

            {reportMode && (
              <section className="space-y-10">
            <section className="sticky top-14 z-20 min-w-0 rounded-2xl border border-white/6 bg-[#080808]/90 p-3 shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-4">
              <div className="flex min-w-0 flex-col gap-3">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="report-back-button group"
                      aria-label="Back to channel search"
                    >
                      <span className="sr-only">Back</span>
                      <span className="report-back-button-box" aria-hidden="true">
                        <span className="report-back-button-frame">
                          <ArrowLeft className="report-back-button-elem" />
                        </span>
                        <span className="report-back-button-frame">
                          <ArrowLeft className="report-back-button-elem" />
                        </span>
                      </span>
                    </button>
                  </div>
                  <div
                    className="inline-flex max-w-full flex-wrap rounded-xl border border-white/7 bg-white/4 p-1"
                    role="tablist"
                    aria-label="Report content type"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveTab("long")}
                      role="tab"
                      id="tab-long-videos"
                      aria-selected={activeTab === "long"}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        activeTab === "long"
                          ? "bg-indigo-500/20 text-indigo-300"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      Long Videos {data ? `(${data.longForm.videos.length})` : ""}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("shorts")}
                      role="tab"
                      id="tab-shorts-videos"
                      aria-selected={activeTab === "shorts"}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        activeTab === "shorts"
                          ? "bg-indigo-500/20 text-indigo-300"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      Shorts {data ? `(${data.shorts.videos.length})` : ""}
                    </button>
                  </div>
                </div>
                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => jumpToSection("overview")}
                    aria-label="Jump to overview section"
                    className="rounded-lg border border-white/8 px-2.5 py-1 text-xs text-zinc-400 transition-colors hover:border-indigo-500/25 hover:text-indigo-300"
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => jumpToSection("trends")}
                    aria-label="Jump to trends section"
                    className="rounded-lg border border-white/8 px-2.5 py-1 text-xs text-zinc-400 transition-colors hover:border-indigo-500/25 hover:text-indigo-300"
                  >
                    Trends
                  </button>
                  <button
                    type="button"
                    onClick={() => jumpToSection("videos")}
                    aria-label="Jump to videos section"
                    className="rounded-lg border border-white/8 px-2.5 py-1 text-xs text-zinc-400 transition-colors hover:border-indigo-500/25 hover:text-indigo-300"
                  >
                    Videos
                  </button>
                </div>
              </div>
            </section>

            {isLoading && <LoadingState />}
            {!isLoading && error && <ErrorState code={errorCode} fallbackMessage={error} />}
            {!isLoading && data && activeBucket && (
              <>
                <ChannelHeader channel={data.channel} />
                <GuidedInsightSummary cards={guidedCards} onAction={handleGuidedAction} />

            <section id="overview-section" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
              <KpiCard
                title="Avg Views"
                value={formatViews(activeBucket.avgViews)}
                accent={KPI_ACCENTS[0]}
                helper="Per upload"
              />
              <KpiCard
                title="Engagement"
                value={`${activeBucket.avgEngagement.toFixed(2)}%`}
                accent={KPI_ACCENTS[1]}
                helper="Likes + comments rate"
              />
              <KpiCard
                title="Top Video"
                value={activeBucket.topPerformers[0]?.title ?? "N/A"}
                mono={false}
                accent={KPI_ACCENTS[2]}
                helper="Best performer"
              />
              <KpiCard
                title="Posting Rhythm"
                value={activeBucket.postingFrequency.replace("videos", "uploads")}
                mono={false}
                accent={KPI_ACCENTS[3]}
                helper="Upload frequency"
              />
            </section>

            <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <SecondaryMetricCard
                title="Momentum"
                value={formatMomentum(activeBucket.momentumPercent)}
                helper={activeBucket.momentumPercent < 0 ? "Trending downward" : "Trending upward"}
                tone={activeBucket.momentumPercent >= 0 ? "positive" : "negative"}
              />
              <SecondaryMetricCard
                title="Consistency"
                value={`${activeBucket.consistencyScore}/100`}
                helper={consistencyExplanation(activeBucket.consistencyScore)}
                tone={activeBucket.consistencyScore >= 60 ? "positive" : "neutral"}
              />
              <SecondaryMetricCard
                title="Views / Subscriber"
                value={`${(viewsPerSubscriber * 100).toFixed(1)}%`}
                helper={`${Math.round(Math.max(0, viewsPerSubscriber * 100))} in 100 subscribers`}
                tone={viewsPerSubscriber >= 0.05 ? "positive" : "neutral"}
              />
            </section>

            {!showDetailedSections && (
              <section className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#0a0a0a] px-4 py-4 shadow-[0_0_16px_rgba(99,102,241,0.04)] sm:flex-row sm:items-center sm:px-5">
                <button
                  type="button"
                  onClick={() => setShowDetailedSections(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/25 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-300 transition-colors hover:bg-indigo-500/18 hover:text-indigo-200"
                >
                  View detailed charts
                </button>
                <span className="text-xs text-zinc-500">Views trend · engagement · top videos</span>
              </section>
            )}

            {showDetailedSections && (
            <section id="trends-section" className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-base font-semibold tracking-tight text-white">Trends</h2>
                </div>
                <span className="text-xs text-zinc-500">{activeTab === "long" ? "Long videos" : "Shorts"}</span>
              </div>
              <div className="grid min-w-0 gap-4 xl:grid-cols-2">
                <div className="min-w-0 overflow-x-auto">
                  <div className="min-w-[min(100%,340px)] xl:min-w-0">
                    <ViewsChart videos={activeBucket.videos} />
                  </div>
                </div>
                <div className="min-w-0 overflow-x-auto">
                  <div className="min-w-[min(100%,340px)] xl:min-w-0">
                    <EngagementChart videos={activeBucket.videos} />
                  </div>
                </div>
              </div>
              <div className="min-w-0 overflow-x-auto">
                <div className="min-w-[min(100%,340px)] xl:min-w-0">
                  <RecentWinnersChart videos={activeBucket.videos} baselineViews={activeBucket.avgViews} />
                </div>
              </div>
              <div className="min-w-0 overflow-x-auto">
                <div className="min-w-[min(100%,340px)] xl:min-w-0">
                  <TopVideosChart videos={activeBucket.videos} />
                </div>
              </div>
            </section>
            )}

            {showDetailedSections && (
            <section id="videos-section" className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-heading text-base font-semibold text-white">Videos</h2>
                  <span className="text-xs text-zinc-500">{activeBucket.videos.length} analyzed</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    exportToCSV(activeBucket.videos, data.channel.title, activeTab, {
                      channelAvgViews: activeBucket.avgViews,
                      avgEngagementPercent: activeBucket.avgEngagement,
                    })
                  }
                  disabled={activeBucket.videos.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/25 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 transition-colors hover:bg-indigo-500/18 disabled:opacity-40"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </button>
              </div>
              <VideoGrid videos={activeBucket.videos} channelAvgViews={activeBucket.avgViews} />
            </section>
            )}
              </>
            )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function FeatureCard({ label, description }: { label: string; description: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3.5 shadow-[0_0_16px_rgba(99,102,241,0.03)] transition-all duration-200 hover:border-white/14 hover:shadow-[0_0_20px_rgba(99,102,241,0.08)]">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-400">{label}</p>
      <p className="text-sm text-zinc-400">{description}</p>
    </div>
  )
}

function KpiCard({
  title,
  value,
  mono = true,
  accent,
  helper,
}: {
  title: string
  value: string
  mono?: boolean
  accent: string
  helper: string
}) {
  return (
    <div className={`group rounded-2xl border border-white/8 bg-[#0c0c0c] p-5 shadow-[0_0_20px_rgba(99,102,241,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/14 hover:shadow-[0_0_24px_rgba(99,102,241,0.1)] ${accent}`}>
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400">{title}</p>
      <p className={`mt-2.5 break-words text-xl font-bold text-white sm:text-2xl xl:text-3xl ${mono ? "font-mono" : "font-heading"}`}>{value}</p>
      <p className="mt-1.5 text-[11px] text-zinc-500">{helper}</p>
    </div>
  )
}

function SecondaryMetricCard({
  title,
  value,
  helper,
  tone = "neutral",
}: {
  title: string
  value: string
  helper: string
  tone?: "positive" | "negative" | "neutral"
}) {
  const toneClass =
    tone === "positive"
      ? "border-[#3ecf8e]/18 bg-[#3ecf8e]/4"
      : tone === "negative"
        ? "border-[#f04444]/18 bg-[#f04444]/4"
        : "border-white/6 bg-[#0a0a0a]"

  const valueColor =
    tone === "positive"
      ? "text-[#3ecf8e]"
      : tone === "negative"
        ? "text-[#f04444]"
        : "text-white"

  return (
    <div className={`rounded-2xl border p-4 shadow-[0_0_20px_rgba(99,102,241,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(99,102,241,0.08)] ${toneClass}`}>
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400">{title}</p>
      <p className={`mt-1.5 font-mono text-2xl font-bold ${valueColor}`}>{value}</p>
      <p className="mt-1 text-[11px] text-zinc-500">{helper}</p>
    </div>
  )
}

function formatMomentum(value: number): string {
  if (!Number.isFinite(value)) return "0%"
  const rounded = Math.round(value)
  return `${rounded > 0 ? "+" : ""}${rounded}%`
}

function consistencyExplanation(score: number): string {
  if (score >= 75) return "Uploads are very evenly spaced"
  if (score >= 55) return "Uploads are fairly evenly spaced"
  return "Uploads are not evenly spaced"
}

function LoadingState() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col items-center gap-2">
        <OrbitLoader />
      </div>

      <div className="rounded-2xl border border-[#222833] bg-[#0f131a] p-5">
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
            <p className="font-medium text-white">Channel report unavailable: limit reached.</p>
            <p className="mt-1 text-[#888]">The daily YouTube request limit has been reached. Please try again later.</p>
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
            <p className="font-medium text-white">No channel data found.</p>
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
