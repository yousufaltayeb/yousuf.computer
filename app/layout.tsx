import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";


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
      path: "../public/fonts/Thmanyah-Font-Family/thmanyah typeface/thmanyahseriftext/woff2/thmanyahseriftext-Regular.woff2",
      weight: "400",
    },
    {
      path: "../public/fonts/Thmanyah-Font-Family/thmanyah typeface/thmanyahseriftext/woff2/thmanyahseriftext-Medium.woff2",
      weight: "500",
    },
    {
      path: "../public/fonts/Thmanyah-Font-Family/thmanyah typeface/thmanyahseriftext/woff2/thmanyahseriftext-Bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-thmanyah-text",
  adjustFontFallback: false,
});

const thmanyahDisplay = localFont({
  src: [
    {
      path: "../public/fonts/Thmanyah-Font-Family/thmanyah typeface/thmanyahserifdisplay/woff2/thmanyahserifdisplay-Regular.woff2",
      weight: "400",
    },
    {
      path: "../public/fonts/Thmanyah-Font-Family/thmanyah typeface/thmanyahserifdisplay/woff2/thmanyahserifdisplay-Bold.woff2",
      weight: "700",
    },
    {
      path: "../public/fonts/Thmanyah-Font-Family/thmanyah typeface/thmanyahserifdisplay/woff2/thmanyahserifdisplay-Black.woff2",
      weight: "900",
    },
  ],
  variable: "--font-thmanyah-display",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Yousuf Altayeb | Software Engineer",
  description: "Software engineer, writer, and explorer. Building fast, secure, and elegant software.",
  icons: {
    icon: "/fav.png",
  },
  openGraph: {
    title: "Yousuf Altayeb",
    description: "Software engineer, writer, and explorer.",
    type: "website",
    url: "https://yousuf.computer",
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
