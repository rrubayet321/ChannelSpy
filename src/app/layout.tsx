import type { Metadata } from "next";
import { Geist_Mono, Manrope, Sora } from "next/font/google";
import "./globals.css";

const displayFont = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const monoFont = Geist_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
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
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} dark h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
