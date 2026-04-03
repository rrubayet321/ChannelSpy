/**
 * ChannelSpy Analytics — typed event tracking helper
 * Wraps GA4 (gtag) and Microsoft Clarity.
 * No new third-party dependencies — uses the existing GA4 + Clarity already loaded in layout.tsx.
 */

// ─── Global type declarations ──────────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    clarity?: (action: string, ...args: unknown[]) => void
  }
}

// ─── Event catalog ─────────────────────────────────────────────────────────

export type AnalyticsEvent =
  | "landing_page_view"    // User lands on the hero page
  | "hero_cta_clicked"     // "Analyze a Channel" button on hero
  | "try_sample_clicked"   // "Try with @MrBeast" button on hero
  | "sample_input_clicked" // Quick-fill handle button on search page
  | "input_started"        // First keystroke in the search input (once per session)
  | "analyze_clicked"      // Form submitted
  | "analyze_success"      // Channel data returned successfully
  | "analyze_failed"       // Error state shown
  | "results_viewed"       // Report opened with real data
  | "outbound_click"       // YouTube video link clicked in results
  | "export_csv"           // Export CSV button clicked

// ─── Session-scoped deduplication ─────────────────────────────────────────

const firedOnce = new Set<AnalyticsEvent>()
const ONCE_EVENTS: ReadonlySet<AnalyticsEvent> = new Set([
  "landing_page_view",
  "input_started",
])

// ─── Core tracking function ────────────────────────────────────────────────

/**
 * Fire an analytics event to GA4 and Clarity.
 * Some events (landing_page_view, input_started) fire only once per page session.
 */
export function trackEvent(
  name: AnalyticsEvent,
  params?: Record<string, string | number>,
): void {
  if (ONCE_EVENTS.has(name)) {
    if (firedOnce.has(name)) return
    firedOnce.add(name)
  }

  try {
    window.gtag?.("event", name, {
      event_category: "channelspy",
      ...params,
    })
  } catch {
    // GA not loaded — safe to swallow
  }

  try {
    window.clarity?.("event", name)
  } catch {
    // Clarity not loaded — safe to swallow
  }
}
