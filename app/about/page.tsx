import type { Metadata } from "next";
import {
  absoluteUrl,
  defaultSocialImage,
  personJsonLd,
  safeJsonLd,
  siteConfig,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: siteConfig.description,
  alternates: {
    canonical: absoluteUrl("/about"),
  },
  openGraph: {
    title: `About ${siteConfig.bilingualName}`,
    description: siteConfig.description,
    url: absoluteUrl("/about"),
    type: "profile",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${siteConfig.bilingualName}`,
    description: siteConfig.description,
    images: [defaultSocialImage],
  },
};

const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": absoluteUrl("/about#profile"),
  url: absoluteUrl("/about"),
  name: `${siteConfig.bilingualName} profile`,
  mainEntity: {
    ...personJsonLd,
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(profileJsonLd) }}
      />

      <section className="pt-16 sm:pt-24 pb-10 intro-animation">
        <h1
          className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-4xl leading-tight md:text-5xl"
          aria-label={siteConfig.bilingualName}
        >
          <span aria-hidden="true">Yousuf Altayeb</span>
          <span
            className="inline-flex items-baseline gap-x-3 whitespace-nowrap"
            aria-hidden="true"
          >
            <span className="font-mono text-[0.82em] leading-none opacity-90">
              /
            </span>
            <span
              className="font-arabic-display [unicode-bidi:isolate]"
              dir="rtl"
              lang="ar"
            >
              يوسف الطيب
            </span>
          </span>
        </h1>
        <p className="text-2xl max-w-[820px] text-contrast-shaded">
          Software engineer based in Riyadh, Saudi Arabia.
        </p>
      </section>

      <section className="fade-in pb-20 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <h2 className="text-contrast mb-4 font-mono">Profile</h2>
            <hr className="h-[1px] bg-line border-0 mb-8" />
            <div className="space-y-7 text-xl leading-relaxed text-contrast-shaded">
              <p>
                I build web software and tools, and I write about software
                engineering, JavaScript, security, AI, and the web.
              </p>
              <p className="font-arabic text-2xl leading-relaxed" dir="rtl" lang="ar">
                يوسف الطيب مهندس برمجيات مقيم في الرياض، السعودية. أبني
                برمجيات ويب وأدوات، وأكتب عن هندسة البرمجيات والويب.
              </p>
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <h2 className="text-contrast mb-4 font-mono">Links</h2>
            <hr className="h-[1px] bg-line border-0 mb-8" />
            <ul className="space-y-4">
              {siteConfig.social.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="more-link text-base"
                  >
                    {item.label} <span className="arrow">&rarr;</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
