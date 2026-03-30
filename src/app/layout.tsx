import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const sansFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://channelspy.app"),
  title: {
    default: "ChannelSpy — YouTube Competitor Intelligence",
    template: "%s | ChannelSpy",
  },
  applicationName: "ChannelSpy",
  description:
    "Analyze any YouTube channel instantly. Views, engagement, trends, and performance scores.",
  keywords: [
    "YouTube analytics",
    "channel analytics",
    "competitor research",
    "creator tools",
    "ChannelSpy",
  ],
  authors: [{ name: "Rubayet Hassan", url: "https://www.linkedin.com/in/rubayet-hassan2" }],
  creator: "Rubayet Hassan",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "ChannelSpy — YouTube Competitor Intelligence",
    description:
      "Analyze any YouTube channel instantly. Views, engagement, trends, and performance scores.",
    type: "website",
    images: ["/brandmark.svg"],
  },
  twitter: {
    card: "summary",
    title: "ChannelSpy — YouTube Competitor Intelligence",
    description:
      "Analyze any YouTube channel instantly. Views, engagement, trends, and performance scores.",
    images: ["/brandmark.svg"],
  },
};


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${monoFont.variable} dark h-full`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L2QR5MD1TJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-L2QR5MD1TJ');
  `}
        </Script>
      </body>
    </html>
  );
}
