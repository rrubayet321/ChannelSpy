# ChannelSpy

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3-22C55E)
![YouTube](https://img.shields.io/badge/API-YouTube_Data_v3-FF0000?logo=youtube&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-15%20passing-brightgreen)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

> You have ten competitor tabs open and a spreadsheet that is already wrong.

**ChannelSpy** is a Next.js app that turns any public YouTube channel into a **clean analytics report** in one paste: KPIs, trend charts, sortable video intelligence, plain-language “Quick Read” cards, and a **decision-ready CSV export** — without exposing API keys in the browser.

It’s designed to stay **easy to understand**: key metrics include short “What this means” tooltips, and baselines avoid being thrown off by one viral outlier.

Built as a full-stack project to explore **App Router**, **server-only secrets**, **Recharts**, and **quota-conscious** YouTube Data API v3 usage.

---

## Demo

**Live:** [channelspy.vercel.app](https://channelspy.vercel.app)

```
User pastes @handle, /channel/ID, or full YouTube URL
           ↓
  Next.js route handler fetches channel + uploads playlist + video stats
           ↓
  Client merges data: Long vs Shorts buckets, scores, momentum, steadiness, breakout rate
           ↓
  Dashboard: Quick Read → KPIs → charts → filterable video grid → Export CSV
```

---

## Architecture

```mermaid
flowchart LR
    user([User]) -->|paste URL| ui[Next.js App]
    ui -->|GET /api/youtube| route[Route Handler]
    route -->|channels playlistItems videos| yt[YouTube Data API v3]
    yt -->|JSON| route
    route -->|sanitized JSON| ui
    ui -->|useChannelData + utils| metrics[Scores & buckets]
    metrics -->|Recharts + grid| viz[Charts & tables]
```

---

## Tech Stack

| Layer | Technology | Why |
| --- | --- | --- |
| Framework | **Next.js 16** (App Router) | SSR-friendly app + API routes in one repo |
| UI | **React 19**, **Tailwind CSS v4** | Fast iteration, dark SaaS layout |
| Charts | **Recharts** | Composable charts for trends and comparisons |
| Data | **YouTube Data API v3** | Official channel, playlist, and video statistics |
| Quality | **Vitest**, **ESLint** | Fast unit tests for core `lib/utils` without a browser |
| Styling tokens | **shadcn/tailwind.css** | Consistent design variables |

---

## Technical Highlights

**Server-side API proxy** — `YOUTUBE_API_KEY` is read only in `src/app/api/youtube/route.ts`. The client calls same-origin `/api/youtube`; the key never ships to the browser.

**Playlist-first ingestion** — The app walks the channel **uploads playlist** (`playlistItems` + batched `videos`) instead of abusing `search.list`, keeping quota use predictable for deep reports.

**Long vs Shorts split** — Videos are classified by duration (≤3 minutes = Short). Averages, momentum, and charts stay meaningful instead of blending incompatible formats.

**Robust baselines** — “Typical Views” uses a median-first baseline and smooths the effect of extreme spikes so comparisons feel more reliable across channels.

**Unusual spike labeling** — Videos that are far outside a channel’s usual view range are tagged as **“Unusual spike”** (they’re still shown, just treated carefully in baseline math).

**Beat-usual rate** — Shows how often a channel uploads videos that beat their usual baseline (a quick signal for repeat winners vs one-off hits).

**Confidence label** — Each report bucket shows a simple **Low / Medium / High** confidence indicator based on sample size (so users don’t over-trust tiny samples).

**Performance score (0–100)** — Per video: **views vs typical baseline** (up to **55** pts) plus **engagement vs channel typical** (up to **45** pts). Top performers land in a **70–90+** range on healthy channels.

**CSV export** — UTF-8 BOM for Excel, a short metadata block, then rows sorted by score with human column names (`Views`, `Performance Tier`, `Views vs Channel Avg %`, etc.).

**Structured errors** — API returns typed error codes (`NOT_FOUND`, `QUOTA_EXCEEDED`, `INVALID_INPUT`, …) so the UI can show specific recovery copy.

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- [Google Cloud](https://console.cloud.google.com/) project with **YouTube Data API v3** enabled

### Install & run

```bash
git clone https://github.com/rrubayet321/ChannelSpy.git
cd ChannelSpy
npm install
```

Create `.env.local` (never commit it):

```bash
YOUTUBE_API_KEY=your_youtube_data_api_v3_key
```

```bash
npm run dev
# → http://localhost:3000
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (`src/**/*.test.ts`) |

---

## API Reference

Single route: **`GET /api/youtube`** — all actions via query parameters.

| `action` | Required params | Description |
| --- | --- | --- |
| `channel` | `handle` **or** `channelId` | Resolve channel metadata + uploads playlist id |
| `videos` | `playlistId` | Page through playlist items (optional `pageToken`, `maxResults`) |
| `stats` | `ids` (comma-separated video ids, max 50) | Snippet + statistics + contentDetails per video |

**Errors** — JSON body `{ error: { code, message } }` with appropriate HTTP status (400 / 404 / 429 / 500 / 502).

---

## Tests

Unit tests mock **nothing** for YouTube — they target **pure helpers** (`parseChannelUrl`, `formatViews`, `calcPerformanceScore`, …) so CI stays fast and credential-free.

```bash
npm run test
# 15 tests, sub-second
```

---

## Known Limitations

- Fetches are capped (e.g. **200** recent uploads per analysis) to stay within reasonable quota and latency.
- **Momentum**, **steadiness**, and **confidence** need enough published videos; small channels may show `0`, `~N/A`, or **Low** confidence where data is insufficient.
- Thumbnails rely on YouTube/Google CDNs; `next.config.ts` `images.remotePatterns` must include hosts your deployment uses.

---

## License

[MIT](LICENSE)

---

Built by **[Rubayet Hassan](https://github.com/rrubayet321)** · [ChannelSpy on GitHub](https://github.com/rrubayet321/ChannelSpy)
