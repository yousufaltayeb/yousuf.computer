import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { sharedOpenGraph, sharedTwitter } from "@/lib/site";
import { THEME_BAR_COLOR, themeInitScript } from "@/lib/theme";
import {
  absoluteUrl,
  defaultSocialImage,
  personJsonLd,
  safeJsonLd,
  siteConfig,
  websiteJsonLd,
} from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const departureMono = localFont({
  src: "./fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure-mono",
  weight: "400",
});

const thmanyahText = localFont({
  src: [
    {
      path: "./fonts/ThmanyahSerifText-Regular.woff2",
      weight: "400",
    },
    {
      path: "./fonts/ThmanyahSerifText-Medium.woff2",
      weight: "500",
    },
    {
      path: "./fonts/ThmanyahSerifText-Bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-thmanyah-text",
  adjustFontFallback: false,
  preload: false,
});

const thmanyahDisplay = localFont({
  src: [
    {
      path: "./fonts/ThmanyahSerifDisplay-Regular.woff2",
      weight: "400",
    },
    {
      path: "./fonts/ThmanyahSerifDisplay-Bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-thmanyah-display",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.bilingualName}`,
  },
  description: siteConfig.description,
  keywords: [
    "Yousuf Altayeb",
    "يوسف الطيب",
    "software engineer Riyadh",
    "web software",
    "JavaScript",
    "TypeScript",
  ],
  applicationName: siteConfig.bilingualName,
  authors: [{ name: siteConfig.name, url: absoluteUrl("/about") }],
  creator: siteConfig.bilingualName,
  publisher: siteConfig.bilingualName,
  alternates: {
    types: {
      "application/rss+xml": absoluteUrl("/feed.xml"),
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    ...sharedOpenGraph,
    title: siteConfig.title,
    description: siteConfig.description,
    type: "website",
    url: absoluteUrl("/"),
    images: [
      {
        url: defaultSocialImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.bilingualName} — Software Engineer`,
      },
    ],
  },
  twitter: {
    ...sharedTwitter,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [defaultSocialImage],
  },
};

export const viewport: Viewport = {
  // Dark is the default; ThemeToggle rewrites this tag when the visitor switches.
  themeColor: THEME_BAR_COLOR.dark,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${departureMono.variable} ${thmanyahText.variable} ${thmanyahDisplay.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteConfig.bilingualName} — Thoughts`}
          href={absoluteUrl("/feed.xml")}
        />
      </head>
      <body className="bg-base text-contrast antialiased font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              "@context": "https://schema.org",
              "@graph": [websiteJsonLd, personJsonLd],
            }),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-acid focus:text-stone focus:px-4 focus:py-2 focus:font-mono focus:text-sm"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="max-w-[1200px] mx-auto px-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
