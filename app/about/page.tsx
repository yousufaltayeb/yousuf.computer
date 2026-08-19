import type { Metadata } from "next";
import Link from "next/link";
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
          Full-stack engineer based in Riyadh, focused on backend engineering,
          AI engineering, and system design.
        </p>
      </section>

      <section className="fade-in pb-20 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="space-y-14 lg:col-span-7 sm:space-y-16">
            <section>
              <h2 className="text-contrast mb-4 font-mono">Profile</h2>
              <hr className="h-[1px] bg-line border-0 mb-8" />
              <div className="space-y-7 text-xl leading-relaxed text-contrast-shaded">
                <p>
                  I build web products across the stack, with most of my
                  attention going to backend architecture: APIs, data models,
                  authorization, background jobs, and the operational details
                  that make systems reliable.
                </p>
                <p
                  className="font-arabic text-2xl leading-relaxed"
                  dir="rtl"
                  lang="ar"
                >
                  أنا يوسف الطيب، مهندس برمجيات مقيم في الرياض. أعمل على تطوير
                  المنتجات عبر الواجهات والأنظمة الخلفية، مع تركيز خاص على هندسة
                  الأنظمة الخلفية والذكاء الاصطناعي وتصميم الأنظمة.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-contrast mb-4 font-mono">Path</h2>
              <hr className="h-[1px] bg-line border-0 mb-8" />
              <div className="space-y-7 text-xl leading-relaxed text-contrast-shaded">
                <p>
                  I didn&apos;t take a direct route into engineering. Before
                  writing software professionally, I spent three years in
                  customer care and back-office operations at stc, then worked
                  in document control on a construction project. Both roles
                  involved finding patterns in messy systems, improving
                  workflows, and making information easier to retrieve.
                </p>
                <p>
                  After years of studying and building independently, I joined
                  Grandshift as a software engineer, working across NestJS
                  backends and frontend applications on payment, notification,
                  and POS systems.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-contrast mb-4 font-mono">Current focus</h2>
              <hr className="h-[1px] bg-line border-0 mb-8" />
              <div className="space-y-7 text-xl leading-relaxed text-contrast-shaded">
                <p>
                  I&apos;m currently building{" "}
                  <Link
                    className="text-link underline underline-offset-4"
                    href="/work/miyari"
                  >
                    Miyari
                  </Link>
                  , an Arabic-first assessment platform for Saudi schools;{" "}
                  <Link
                    className="text-link underline underline-offset-4"
                    href="/work/mutamad-net"
                  >
                    Mutamad
                  </Link>
                  , a bilingual construction-management platform; and{" "}
                  <Link
                    className="text-link underline underline-offset-4"
                    href="/work/whisper"
                  >
                    OpenWhisper
                  </Link>
                  , a privacy-first Linux dictation app.
                </p>
                <p>
                  My strongest interests are backend engineering, AI
                  engineering, and system design. I&apos;m currently open to
                  full-stack and backend engineering opportunities.
                </p>
              </div>
            </section>
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
                    {item.label === "Email" ? "Email me" : item.label}{" "}
                    <span className="arrow">&rarr;</span>
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
