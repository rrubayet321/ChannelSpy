import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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
    default: "ChannelSpy",
    template: "%s | ChannelSpy",
  },
  applicationName: "ChannelSpy",
  description:
    "Modern YouTube competitor intelligence for creators and teams. Analyze performance, trends, and content velocity instantly.",
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
    title: "ChannelSpy",
    description:
      "Modern YouTube competitor intelligence for creators and teams. Analyze performance, trends, and content velocity instantly.",
    type: "website",
    images: ["/brandmark.svg"],
  },
  twitter: {
    card: "summary",
    title: "ChannelSpy",
    description:
      "Modern YouTube competitor intelligence for creators and teams. Analyze performance, trends, and content velocity instantly.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
