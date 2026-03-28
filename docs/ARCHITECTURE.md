# ChannelSpy — Architecture

This document describes how data moves through the app and where core logic lives. It complements the high-level flow in the root [README.md](../README.md).

## High-level diagram

```
Browser (React)
    │
    ├─ parseChannelUrl()          src/lib/utils.ts
    │
    ├─ useChannelData()           src/hooks/useChannelData.ts
    │     └─ fetch → /api/youtube?action=...
    │
    └─ Presentation               src/app/page.tsx, components/

Server (Next.js Route Handler)
    │
    └─ GET /api/youtube          src/app/api/youtube/route.ts
          └─ YouTube Data API v3 (API key from env only)
```

## API route: `GET /api/youtube`

All YouTube traffic is server-side. The client passes query parameters; the handler validates input and calls Google’s API with `YOUTUBE_API_KEY`.

| `action`   | Purpose |
| ---------- | ------- |
| `channel`  | Resolve channel metadata (by `handle` or `channelId`), including `uploadsPlaylistId`. |
| `videos`   | Paginate `playlistItems` for the uploads playlist (video ids + basic snippet fields). |
| `stats`    | Batch-fetch `videos` resource for statistics and `contentDetails` (duration, counts). |

The hook orchestrates these actions: resolve channel → pull playlist pages (up to a cap) → batch stats → merge rows on the client.

## Client hook: `useChannelData`

**File:** `src/hooks/useChannelData.ts`

Responsibilities:

1. Parse user input with `parseChannelUrl`.
2. Optional in-memory cache keyed by parsed input type + value.
3. Sequential fetches: channel → playlist videos → stats map.
4. Classify each row as long-form vs Short (`isShortVideo`: duration ≤ 3 minutes).
5. Compute per-video `engagementRate` via `calcEngagementRate` in `src/lib/utils.ts`.
6. Build two `AnalyticsBucket` instances (`longForm`, `shorts`) via `buildAnalyticsBucket`:
   - `avgViews`, `avgEngagement`
   - `performanceScore`, `trendDelta` per video
   - `momentumPercent`, `consistencyScore`, `postingFrequency`, `topPerformers`

## Analytics engine (pure logic)

**Primary files:** `src/lib/utils.ts`, `src/hooks/useChannelData.ts`

| Concern | Implementation notes |
| ------- | -------------------- |
| Performance Score | `calcPerformanceScore`: view component (40), engagement component (35), recency bonus (25 max), clamp 0–100. |
| Trend vs average | `calcTrendDelta`: percent above/below channel average views. |
| Momentum | Last 5 vs next 5 uploads by date; percent change in mean views. |
| Consistency | Std-dev of inter-upload gaps vs mean gap; mapped to 0–100. |
| Engagement | `(likes + comments) / views * 100`. |

## UI layers

- **Landing / report shell:** `src/app/page.tsx`
- **Charts:** `src/components/charts/*` (Recharts)
- **Channel & videos:** `src/components/channel/*`, `src/components/filters/*`
- **Insights:** `src/lib/insights.ts` + `GuidedInsightSummary`
- **Branding / chrome:** `src/components/layout/*`

## Security & configuration

- `YOUTUBE_API_KEY` is read only in `src/app/api/youtube/route.ts`.
- Client bundles never include the key; failed configuration returns a server error without leaking secrets.

## Extension points

- **Caching:** replace or wrap `analyticsCache` in `useChannelData` with Redis or Vercel KV for multi-user durability.
- **Comparison:** duplicate bucket logic for a second channel and diff in UI.
- **Shareable URLs:** encode channel id + tab in query string and hydrate on load.
