import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { absoluteUrl, siteConfig } from "@/lib/site";

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
    {
      path: "./fonts/ThmanyahSerifDisplay-Black.woff2",
      weight: "900",
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
  applicationName: siteConfig.bilingualName,
  authors: [{ name: siteConfig.name, url: absoluteUrl("/about") }],
  creator: siteConfig.bilingualName,
  publisher: siteConfig.bilingualName,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: "website",
    url: absoluteUrl("/"),
    siteName: siteConfig.bilingualName,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@yousufaltayeb",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${departureMono.variable} ${thmanyahText.variable} ${thmanyahDisplay.variable}`}>
      <body className="bg-base text-contrast antialiased font-sans">
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
