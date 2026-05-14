import type { Metadata } from "next";
import { absoluteUrl, safeJsonLd, sameAsLinks, siteConfig } from "@/lib/site";

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
  },
  twitter: {
    card: "summary",
    title: `About ${siteConfig.bilingualName}`,
    description: siteConfig.description,
  },
};

const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": absoluteUrl("/about#profile"),
  url: absoluteUrl("/about"),
  name: `${siteConfig.bilingualName} profile`,
  mainEntity: {
    "@type": "Person",
    "@id": absoluteUrl("/about#person"),
    name: siteConfig.name,
    alternateName: [siteConfig.arabicName, siteConfig.bilingualName],
    url: absoluteUrl("/about"),
    jobTitle: "Software Engineer",
    email: siteConfig.email,
    homeLocation: {
      "@type": "Place",
      name: "Riyadh, Saudi Arabia",
    },
    sameAs: sameAsLinks,
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
        <h1 className="text-4xl md:text-5xl mb-5 leading-tight">
          Yousuf Altayeb{" "}
          <span className="font-arabic-display" dir="rtl" lang="ar">
            / يوسف الطيب
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
