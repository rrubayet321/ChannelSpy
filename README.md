---

# ChannelSpy 🕵️

> YouTube competitor intelligence. Paste a channel URL. Get instant analytics.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white)](https://channelspy.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## Overview

**ChannelSpy** turns any public YouTube channel into a focused analytics report: KPIs, trend charts, sortable video intelligence, and plain-language summaries you can share or export. It is built for **enterprise media teams**, **content creators**, and **agencies** who need fast competitor context without juggling spreadsheets or raw API responses.

---

## Live Demo

**[channelspy.vercel.app](https://channelspy.vercel.app)**

> Paste a YouTube channel URL like `@MrBeast` or `@mkbhd` to get started.

---

## Features

- 🔗 Channel URL parsing (handles, `/channel/`, `/c/`, `/user/`, full URLs)
- 🎬 Long Videos vs Shorts separation (duration-based, ≤3 minutes = Short)
- 📈 Performance Score (0–100 proprietary composite per video)
- 📉 Momentum tracking (recent uploads vs prior window)
- ⏱️ Consistency score (upload spacing regularity, 0–100)
- 👀 Views per subscriber (reach efficiency vs audience size)
- 💡 Quick Read cards (plain-language insights + jump links)
- 📊 View trend chart (latest 20 uploads)
- 🤝 Engagement by video chart (likes + comments vs views)
- 🏆 Recent vs channel baseline chart (winners vs typical performance)
- 🥇 Top videos by views chart
- ↕️ Sort by views, engagement, performance score, date, duration
- 🎛️ Advanced filters (date presets, minimum views)
- 📤 CSV export
- 📱 Responsive design
- 🔒 Secure API proxy (`YOUTUBE_API_KEY` never exposed to the client)

---

## Tech Stack

| Category        | Technology                                                                 |
| --------------- | -------------------------------------------------------------------------- |
| Framework       | [Next.js](https://nextjs.org/) 16 (App Router)                             |
| Language        | [TypeScript](https://www.typescriptlang.org/)                              |
| Styling         | [Tailwind CSS](https://tailwindcss.com/) v4                                |
| Charts          | [Recharts](https://recharts.org/)                                          |
| API             | Next.js Route Handler → [YouTube Data API v3](https://developers.google.com/youtube/v3) |
| Deployment      | [Vercel](https://vercel.com/)                                              |
| Font            | [Inter](https://fonts.google.com/specimen/Inter) + [JetBrains Mono](https://www.jetbrains.com/lp/mono/) via `next/font` |
| UI Components   | [shadcn/ui](https://ui.shadcn.com/) patterns, [Lucide React](https://lucide.dev/) icons |

---

## Architecture

### Data Flow

```
User Input
    → parseChannelUrl (client, lib/utils)
    → GET /api/youtube?action=channel | videos | stats
    → YouTube Data API v3 (server-side only)
    → useChannelData hook (fetch, merge, cache)
    → Analytics engine (utils + hook: scores, momentum, consistency)
    → UI components (KPIs, charts, Quick Read, video grid, export)
```

For a deeper breakdown of routes, actions, and metric code paths, see **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

### Key Design Decisions

1. **Playlist items over search** — The app walks the channel **uploads playlist** (`playlistItems` + batched `videos` statistics) instead of `search.list`. That yields a stable, channel-owned video list with **lower quota cost** per deep analysis than repeatedly searching.
2. **Long / Shorts split** — Shorts and long-form behave differently in algorithm, length, and audience expectation. **Separate buckets** keep averages, momentum, and charts meaningful instead of blending incompatible formats.
3. **Server-side API proxy** — All YouTube calls run in **`src/app/api/youtube/route.ts`**. The browser never sees `YOUTUBE_API_KEY`, reducing leak risk and keeping keys compatible with server-only rotation.
4. **Performance Score** — Each video gets a **0–100 score**: views vs channel average (capped, up to 40 pts), engagement vs channel average (capped, up to 35 pts), plus a **recency bonus** (up to 25 pts for uploads in the last 7–90 days). The result highlights “strong right now” uploads, not just all-time giants.

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **YouTube Data API v3** key ([Google Cloud Console](https://console.cloud.google.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rrubayet321/ChannelSpy.git
   cd ChannelSpy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   touch .env.local
   ```

4. **Add your API key** to `.env.local`:

   ```bash
   YOUTUBE_API_KEY=your_youtube_data_api_v3_key
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable           | Required | Description |
| ------------------ | -------- | ----------- |
| `YOUTUBE_API_KEY`  | **Yes**  | YouTube Data API v3 key from Google Cloud Console (enabled for YouTube Data API v3, restricted appropriately). |

---

## Usage

The analyzer accepts common channel formats, for example:

- `@MrBeast`
- `https://www.youtube.com/@mkbhd`
- `https://www.youtube.com/channel/UCxxxxxx`

Paste into the search field and run **Analyze** to open the report.

---

## Analytics Explained

- **Performance Score (0–100)** — Composite signal: how **views** and **engagement** compare to this channel’s own averages (each capped at 3× average for scoring), plus a **recency** boost for newer uploads. Capped between 0 and 100.
- **Momentum** — Compares average views of the **5 most recent** uploads to the **next 5** older uploads (requires enough history). Positive % means recent videos are outperforming the prior batch on views.
- **Consistency score (0–100)** — Measures **regularity of gaps** between publish dates (coefficient-of-variation style). **99/100** means upload spacing is very steady vs the channel’s typical gap; lower scores mean erratic schedules.
- **Views per subscriber** — `(average views per video in tab) / subscriber count`, shown as a percentage of subscribers reached per upload. Useful for **reach efficiency**, especially across channel sizes.
- **Engagement rate** — `(likeCount + commentCount) / viewCount × 100`, expressed as a percentage. Reflects **audience reaction density** per view.

---

## Roadmap

### What I'd build next:

- Channel vs channel comparison
- Historical snapshot tracking
- Weekly email digest reports
- Redis caching layer
- Shareable report URLs
- Multi-channel watchlist

---

## Contributing

Contributions are welcome. Fork the repository, create a branch for your change, and open a pull request with a clear description of the problem and solution. Please run `npm run lint` and `npx tsc --noEmit` before submitting.

---

## License

MIT — see [LICENSE](LICENSE).

---

## Author

Built by **Rubayet Hassan**

- GitHub: [@rrubayet321](https://github.com/rrubayet321)
- Built for the **VidMetrics Vibe Coder** challenge

---
