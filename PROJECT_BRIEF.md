# ChannelSpy — Project Brief
> YouTube Competitor Intelligence Platform  
> Built by: Rubayet Hassan | Challenge: VidMetrics Vibe Coder Role

---

## 🎯 What We're Building

**ChannelSpy** is a clean, modern YouTube competitor analytics dashboard. A user pastes any YouTube channel URL and instantly gets a full breakdown of that channel's video performance — views, engagement rates, trends, and a proprietary performance score — all visualized in a polished, SaaS-grade interface.

**The goal**: Build something impressive enough to win a job challenge AND be portfolio-worthy on GitHub.

---

## 🧭 User Journey (Keep This in Mind Always)

```
1. User lands on ChannelSpy homepage
      ↓
2. Pastes YouTube channel URL (any format)
      ↓
3. Hits "Analyze" → Skeleton loading appears ("Scanning channel...")
      ↓
4. Channel header loads: avatar, name, subs, total views, video count
      ↓
5. KPI cards appear: Avg Views, Avg Engagement, Best Performer, Post Frequency
      ↓
6. Charts render: Views over time, Top 10 videos, Engagement distribution
      ↓
7. Video grid loads: all videos with metrics, badges, and scores
      ↓
8. User sorts/filters → instant re-render
      ↓
9. User clicks Export CSV → downloads full report
      ↓
10. User clicks any video → opens YouTube in new tab
```

---

## 📐 Page Layout

### `/` — Home / Search
- Full-page centered layout
- ChannelSpy logo + tagline: *"Spy on any YouTube channel. Instantly."*
- Large URL input field + "Analyze" button
- Below: 3 bullet points of what you'll get (social proof)
- Background: subtle animated gradient or grid pattern

### `/channel/[handle]` OR same page (state-based)
- **Header section**: Channel banner, avatar, name, handle, subscriber count, verified badge if applicable
- **KPI Row**: 4 metric cards — Avg Views, Avg Engagement Rate, Top Video Score, Upload Frequency
- **Charts Row**: Views trend line, Top 10 bar chart
- **Filter/Sort Bar**: Sort dropdown + date filter + min views filter
- **Video Grid**: Responsive grid of VideoCards
- **Footer**: Export CSV button + "Powered by ChannelSpy"

---

## 🃏 VideoCard Component Spec

Each video card must show:
- Thumbnail (16:9, rounded corners, `next/image`)
- Title (max 2 lines, ellipsis)
- Published date (relative: "3 days ago" + absolute on hover)
- Duration badge (top-right on thumbnail)
- **Views** — formatted (1.2M) with `font-mono`
- **Engagement Rate** — color-coded badge
- **Performance Score** — circular indicator or badge (0-100)
- **Trend arrow** — ↑ green if above avg, ↓ red if below
- On hover: "Watch on YouTube →" button appears

### Performance Score Badge Colors:
- 80-100: Green (`accent-green`)
- 60-79: Blue (`accent-blue`)
- 40-59: Amber (`accent-amber`)
- 0-39: Red (`accent-red`)

---

## 📊 Analytics Logic

### Engagement Rate
```
engagementRate = (likeCount + commentCount) / viewCount * 100
```

### Performance Score (0-100)
```
Normalize views:        viewScore = min(video.views / channelAvgViews, 3) / 3 * 40
Normalize engagement:   engScore  = min(video.engagement / channelAvgEngagement, 3) / 3 * 35
Recency bonus:          days = daysSincePublish
                        recencyScore = days <= 7  ? 25
                                     : days <= 30 ? 15
                                     : days <= 90 ? 8
                                     : 0

performanceScore = Math.round(viewScore + engScore + recencyScore)
```

### Trend Velocity
```
trendDelta = ((video.views - channelAvgViews) / channelAvgViews) * 100
// Display: "+47% vs avg" in green or "-23% vs avg" in red
```

### Posting Frequency
```
Sort videos by date
Calculate average days between uploads
Format: "~3 videos/week" or "~1 video/month"
```

---

## 🎨 Visual Design Reference

### Aesthetic Direction
**Dark. Minimal. Data-forward. Intelligence-branded.**

Think: Linear meets Vercel meets a spy ops dashboard.
- Almost no color except for data highlights
- Zinc/neutral grays dominate
- Blue for data, green for positive, red for negative, amber for trending
- Generous whitespace
- Numbers are large and monospaced
- Cards are slightly raised on hover, not garish

### Font Pairing
```
Display/Headers: Geist (next/font)
Body: Inter (next/font)  
Numbers: font-mono (Geist Mono or system-mono)
```

### Motion
- Page load: fade-in + slight translateY(10px → 0) over 300ms
- Video cards: staggered entrance (each card delays by 50ms × index)
- Hover on card: border brightens + slight scale(1.01)
- Loading: skeleton pulse (Tailwind `animate-pulse`)
- Numbers: no CountUp animation needed, but format cleanly

### Logo
- Text: "Channel**Spy**" — "Channel" in `text-secondary`, "Spy" in `text-primary` + bold
- Small eye/lens icon from Lucide (`Eye` or `Scan`)
- Tagline: *"Competitor intelligence. Instantly."*

---

## 🔌 API Architecture

```
Client (browser)
    ↓ fetch('/api/youtube?action=channel&handle=@MrBeast')
Next.js API Route (/app/api/youtube/route.ts)
    ↓ fetch('https://www.googleapis.com/youtube/v3/...' + YOUTUBE_API_KEY)
YouTube Data API v3
    ↓ JSON response
API Route processes + returns clean data
    ↓
Client renders
```

### API Route Actions:
- `action=channel&handle={handle}` → channel info
- `action=channel&channelId={id}` → channel info by ID  
- `action=videos&playlistId={id}&pageToken={token}` → paginated videos
- `action=stats&ids={comma,list}` → batch video statistics

### Quota Management:
- Each `channels` call: ~1 unit
- Each `search` call: ~100 units (avoid — use playlistItems instead)
- Each `playlistItems` call: ~1 unit
- Each `videos` call: ~1 unit
- Daily quota: 10,000 units
- Strategy: Use `playlistItems` NOT `search` to get channel videos

---

## 🗓️ Build Timeline (4 days)

### Day 1 — Core (Foundation)
- [ ] `npx create-next-app` + shadcn setup
- [ ] Design system in `globals.css` (CSS variables)
- [ ] Header + SearchInput components
- [ ] YouTube API route (channel lookup + video fetch)
- [ ] URL parser (all formats)
- [ ] Basic video list rendering

### Day 2 — Analytics + Charts
- [ ] Engagement rate + Performance Score algorithm
- [ ] Trend velocity calculation
- [ ] MetricBadge component (color-coded)
- [ ] ViewsChart (Recharts LineChart)
- [ ] TopVideosChart (Recharts BarChart)
- [ ] KPI cards row

### Day 3 — Polish + Features
- [ ] Sort and filter UI
- [ ] Skeleton loading states
- [ ] Error states (channel not found, quota exceeded)
- [ ] CSV export
- [ ] Mobile responsive tweaks
- [ ] Staggered card animations

### Day 4 — Ship
- [ ] Final QA on all URL formats
- [ ] Vercel deploy + env var
- [ ] README writing
- [ ] Loom recording
- [ ] Written submission (Notion/PDF)

---

## 📝 README Structure (for GitHub)

```markdown
# ChannelSpy 🕵️
> YouTube competitor intelligence. Paste a channel URL. Get instant analytics.

## Live Demo
[channelspy.vercel.app](...)

## Features
- 📊 Video performance analytics (views, engagement, score)
- 📈 Charts: views over time, top performers
- 🏆 Proprietary Performance Score (0-100)
- 📉 Trend velocity vs channel average
- 🔽 Export full report as CSV
- 📱 Mobile responsive

## Tech Stack
Next.js 14 · TypeScript · Tailwind CSS · Recharts · shadcn/ui · YouTube API v3

## Setup
1. Clone repo
2. `npm install`
3. Create `.env.local` → add `YOUTUBE_API_KEY=your_key`
4. `npm run dev`

## Architecture
[brief explanation of API proxy pattern]

## What I'd Add Next
- Channel vs channel comparison
- Historical data caching (Redis)
- Email reports
- Multi-channel watchlist
```

---

## 💭 Product Thinking (For Written Submission)

### What I'd add with more time:
1. **Channel vs Channel comparison** — side-by-side analytics for 2 channels
2. **Historical tracking** — save channel snapshots, track growth over time
3. **Best time to post analysis** — based on top-performing video publish times
4. **Topic clustering** — group videos by title keywords, see which topics perform best
5. **Thumbnail analysis** — flag if thumbnail style correlates with performance
6. **Email reports** — schedule weekly spy reports to inbox
7. **Multi-channel watchlist** — track 5 competitors at once
8. **API caching** — Redis layer to avoid re-fetching same channel data

### What feels missing in v1:
- Historical data (we only see current state, not growth trends)
- Pagination for channels with 500+ videos
- Share report via public URL

### v2 direction:
Full competitor tracking SaaS — users create accounts, add competitor channels to a watchlist, get weekly email digests with who's growing fastest and which video formats are winning.

---

## 🏆 How to Stand Out in This Challenge

1. **Performance Score** makes the tool feel proprietary — not just a YouTube wrapper
2. **Clean dark UI** looks like a real paid tool, not a hackathon project
3. **Skeleton loaders** signal engineering maturity
4. **Error handling** shows you think about edge cases
5. **CSV export** adds business utility
6. **Good README** shows professional habits
7. **Written submission** shows product thinking beyond the code

---

*ChannelSpy — Built fast. Built clean. Built to impress.*
