export const LANDING_FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "What is ChannelSpy?",
    a: "ChannelSpy turns a public YouTube channel into a quick performance report: views, engagement, trends, and top videos—so you can see what is working without manual spreadsheets.",
  },
  {
    q: "What can I paste in the search box?",
    a: "Use an @handle, channel ID, custom URL path, or a full YouTube channel URL. If YouTube can resolve it, we try to analyze it.",
  },
  {
    q: "Do I need a YouTube API key in the browser?",
    a: "No. Requests go through the app server-side integration so your keys are not exposed in the client.",
  },
  {
    q: "What is the difference between Long Videos and Shorts?",
    a: "We split uploads by duration so you can compare long-form vs Shorts separately. Metrics and exports always match the tab you have selected.",
  },
  {
    q: "What does CSV export include?",
    a: "A short summary block explains metrics, then one row per video (sorted by performance score). Columns include rank, title, ID, URL, views, likes, comments, engagement %, performance score, views vs channel average %, tier (Excellent to Developing), publish date, days since publish, duration, and Long vs Short.",
  },
]
