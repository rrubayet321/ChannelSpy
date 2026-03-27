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
import { OrbitLoader } from "@/components/ui/OrbitLoader"
import { Skeleton } from "@/components/ui/skeleton"
import { SpecialText } from "@/components/ui/special-text"
import { WelcomeIntroCard } from "@/components/ui/welcome-intro-card"
import { useChannelData } from "@/hooks/useChannelData"
import { buildGuidedInsightCards, type SummaryCardAction } from "@/lib/insights"
import { exportToCSV, formatViews } from "@/lib/utils"
import { AlertTriangle, ArrowLeft, Download, SearchX, ShieldAlert } from "lucide-react"

const KPI_ACCENTS = [
  "border-l-2 border-l-[var(--accent-blue)]",
  "border-l-2 border-l-[var(--accent-green)]",
  "border-l-2 border-l-[var(--accent-amber)]",
  "border-l-2 border-l-[var(--text-secondary)]",
] as const

export default function Home() {
  const { data, error, errorCode, isLoading, analyzeChannel, clear } = useChannelData()
  const [reportMode, setReportMode] = useState(false)
  const [activeTab, setActiveTab] = useState<"long" | "shorts">("long")
  const [showDetailedSections, setShowDetailedSections] = useState(false)
  const [channelInput, setChannelInput] = useState("")
  const [showIntro, setShowIntro] = useState(true)
  const [introTextAnimationKey, setIntroTextAnimationKey] = useState(0)
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
    setShowDetailedSections(false)
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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {showIntro ? (
          <section className="flex min-h-[72vh] flex-col items-center justify-center py-8 sm:py-12">
            <div className="intro-fade-up mb-8 text-center sm:mb-10">
              <span
                tabIndex={0}
                className="inline-block cursor-default"
                onMouseEnter={() => setIntroTextAnimationKey((prev) => prev + 1)}
                onFocus={() => setIntroTextAnimationKey((prev) => prev + 1)}
                aria-label="Introducing ChannelSpy heading"
              >
                <SpecialText
                  key={introTextAnimationKey}
                  className="!h-auto !leading-tight !font-heading text-2xl font-semibold tracking-[0.01em] text-[#f4f6ff] sm:text-4xl"
                >
                  Introducing ChannelSpy
                </SpecialText>
              </span>
            </div>
            <WelcomeIntroCard onProceed={() => setShowIntro(false)} className="intro-fade-up" />
          </section>
        ) : (
          <>
            {!reportMode && (
              <>
                <section className="mx-auto mb-20 max-w-4xl text-center sm:mb-24">
              <span className="mb-6 inline-flex items-center rounded-full border border-[#252a33] bg-[#0f1218] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#7c8596]">
                YouTube channel insights
              </span>

              <h1 className="font-heading text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl">
                Turn any YouTube channel
                <br />
                <span className="bg-gradient-to-r from-white to-[#888] bg-clip-text text-transparent">
                  into clear insights.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#7f8695]">
                Paste a channel URL to quickly see views, audience response, recent growth, and top videos.
              </p>

              <div className="mt-10 space-y-5 sm:mt-12 sm:space-y-6">
                <SearchInput
                  isLoading={isLoading}
                  onAnalyze={handleAnalyze}
                  value={channelInput}
                  onValueChange={setChannelInput}
                />
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  {exampleHandles.map((handle) => (
                    <button
                      key={handle}
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        setChannelInput(handle)
                        void handleAnalyze(handle)
                      }}
                      className="rounded-full border border-[#2d3648] bg-[#111621] px-3 py-1 text-xs text-[#8e98ad] transition-colors hover:border-[#4e5e7a] hover:text-white disabled:opacity-50"
                    >
                      Try {handle}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-[#697286] sm:mt-10">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-green)]" />
                  Works with @handles and full URLs
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-green)]" />
                  No API key exposed on client
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-green)]" />
                  Fast filtering
                </span>
              </div>
                </section>

                <section className="mb-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
                  <FeatureCard label="Inputs" description="Handle, channel ID, custom URL, and full channel links." />
                  <FeatureCard label="Metrics" description="Views, audience response, and recent growth compared with normal performance." />
                  <FeatureCard label="Output" description="Export a video report in one click." />
                </section>
              </>
            )}

            {reportMode && (
              <section className="space-y-10">
            <section className="sticky top-14 z-20 rounded-2xl border border-[#222833] bg-[#0f131a]/95 p-4 backdrop-blur">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="report-back-button group"
                      aria-label="Back to channel search"
                    >
                      <span className="sr-only">Back</span>
                      <span className="report-back-button-box" aria-hidden="true">
                        <ArrowLeft className="report-back-button-elem" />
                        <ArrowLeft className="report-back-button-elem" />
                      </span>
                    </button>
                    <span className="text-xs uppercase tracking-[0.16em] text-[#7a8397]">Channel report</span>
                  </div>
                  <div className="inline-flex rounded-xl border border-[#2b3343] bg-[#0e131d] p-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab("long")}
                      className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                        activeTab === "long"
                          ? "bg-[#1c2433] text-white"
                          : "text-[#8a93a6] hover:text-[#c2cad8]"
                      }`}
                    >
                      Long Videos {data ? `(${data.longForm.videos.length})` : ""}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("shorts")}
                      className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                        activeTab === "shorts"
                          ? "bg-[#1c2433] text-white"
                          : "text-[#8a93a6] hover:text-[#c2cad8]"
                      }`}
                    >
                      Shorts {data ? `(${data.shorts.videos.length})` : ""}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => jumpToSection("overview")}
                    className="rounded-lg border border-[#2d3648] bg-[#121824] px-2.5 py-1 text-xs text-[#a4aec2] transition-colors hover:border-[#4e5e7a] hover:text-white"
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => jumpToSection("trends")}
                    className="rounded-lg border border-[#2d3648] bg-[#121824] px-2.5 py-1 text-xs text-[#a4aec2] transition-colors hover:border-[#4e5e7a] hover:text-white"
                  >
                    Trends
                  </button>
                  <button
                    type="button"
                    onClick={() => jumpToSection("videos")}
                    className="rounded-lg border border-[#2d3648] bg-[#121824] px-2.5 py-1 text-xs text-[#a4aec2] transition-colors hover:border-[#4e5e7a] hover:text-white"
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
                <p className="text-center text-sm text-[var(--accent-green)]">
                  {activeTab === "long" ? "Long video report is ready." : "Shorts report is ready."}
                </p>
                <p className="text-center text-xs text-[#768094]">
                  How to read this dashboard: check overview first, then trends, then open the video list for actions.
                </p>
                <ChannelHeader channel={data.channel} />
                <GuidedInsightSummary cards={guidedCards} onAction={handleGuidedAction} />

            <section id="overview-section" className="grid grid-cols-2 gap-4 sm:gap-4 xl:grid-cols-4">
              <KpiCard
                title="Typical Views"
                value={formatViews(activeBucket.avgViews)}
                accent={KPI_ACCENTS[0]}
                helper="What a normal upload usually gets in this tab."
              />
              <KpiCard
                title="Audience Connection"
                value={`${activeBucket.avgEngagement.toFixed(2)}%`}
                accent={KPI_ACCENTS[1]}
                helper="How strongly viewers react through likes and comments."
              />
              <KpiCard
                title="Top Video"
                value={activeBucket.topPerformers[0]?.title ?? "N/A"}
                mono={false}
                accent={KPI_ACCENTS[2]}
                helper="Your strongest recent proof of what works."
              />
              <KpiCard
                title="Posting Rhythm"
                value={activeBucket.postingFrequency.replace("videos", "uploads")}
                mono={false}
                accent={KPI_ACCENTS[3]}
                helper="How often new videos are published."
              />
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
              <SecondaryMetricCard
                title="Momentum"
                value={formatMomentum(activeBucket.momentumPercent)}
                helper={
                  activeBucket.momentumPercent < 0
                    ? "Recent uploads getting fewer views than older ones"
                    : "Recent uploads getting more views than older ones"
                }
                tone={activeBucket.momentumPercent >= 0 ? "positive" : "negative"}
              />
              <SecondaryMetricCard
                title="Consistency"
                value={`${activeBucket.consistencyScore}/100`}
                helper={consistencyExplanation(activeBucket.consistencyScore)}
                tone={activeBucket.consistencyScore >= 60 ? "positive" : "neutral"}
              />
              <SecondaryMetricCard
                title="Views per Subscriber"
                value={`${(viewsPerSubscriber * 100).toFixed(1)}%`}
                helper={`About ${Math.round(Math.max(0, viewsPerSubscriber * 100))} in 100 subscribers watch each video`}
                tone={viewsPerSubscriber >= 0.05 ? "positive" : "neutral"}
              />
            </section>

            {!showDetailedSections && (
              <section className="rounded-2xl border border-[#222833] bg-[#0f131a] p-5">
                <p className="text-sm text-[#b8c2d8]">
                  The key numbers are shown above. Open detailed charts when you are ready for a deeper view.
                </p>
                <button
                  type="button"
                  onClick={() => setShowDetailedSections(true)}
                  className="mt-3 inline-flex items-center rounded-lg border border-[#2c3340] bg-[#141a27] px-3 py-1.5 text-xs text-[#d7dbe6] transition-colors hover:border-[#4e5e7a] hover:text-white"
                >
                  Show detailed charts
                </button>
              </section>
            )}

            {showDetailedSections && (
            <section id="trends-section" className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-heading text-lg font-semibold tracking-tight text-white">Trends</h2>
                <p className="text-xs text-[#778198]">{activeTab === "long" ? "Long videos" : "Shorts"}</p>
              </div>
              <p className="text-xs text-[#8b93a8]">
                See what is accelerating, what is stable, and which uploads are beating the channel baseline.
              </p>
              <div className="grid gap-4 xl:grid-cols-2">
                <ViewsChart videos={activeBucket.videos} />
                <EngagementChart videos={activeBucket.videos} />
              </div>
              <RecentWinnersChart videos={activeBucket.videos} baselineViews={activeBucket.avgViews} />
              <TopVideosChart videos={activeBucket.videos} />
            </section>
            )}

            {showDetailedSections && (
            <section id="videos-section" className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold text-white">Video List</h2>
                  <p className="ml-3 text-sm text-[#7a8397]">{activeBucket.videos.length} videos analyzed</p>
                </div>
                <button
                  type="button"
                  onClick={() => exportToCSV(activeBucket.videos, data.channel.title)}
                  disabled={activeBucket.videos.length === 0}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#2d3648] bg-[#121824] px-3 py-1.5 text-xs text-[#a4aec2] transition-colors hover:border-[#4e5e7a] hover:text-white disabled:opacity-50"
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
    <div className="rounded-2xl border border-[#222833] bg-[#0f131a] p-5 transition-colors hover:border-[#334056]">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-[#6bb0ff]">{label}</p>
      <p className="text-sm leading-relaxed text-[#a4aec2]">{description}</p>
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
    <div className={`rounded-2xl border border-[#222833] bg-[#0f131a] p-5 ${accent}`}>
      <p className="text-[10px] uppercase tracking-[0.15em] text-[#7b8499]">{title}</p>
      <p className={`mt-2 text-2xl font-semibold text-white sm:text-3xl ${mono ? "font-mono" : ""}`}>{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-[#929bb0]">{helper}</p>
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
      ? "border-[#3ecf8e]/30 bg-[#3ecf8e]/5"
      : tone === "negative"
        ? "border-[#f04444]/30 bg-[#f04444]/5"
        : "border-[#222833] bg-[#0f131a]"

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-[10px] uppercase tracking-[0.14em] text-[#7b8499]">{title}</p>
      <p className="mt-1 font-mono text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-[#a0aac0]">{helper}</p>
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
