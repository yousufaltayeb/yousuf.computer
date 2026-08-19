import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostMeta } from "@/lib/posts";
import { getAllProjects } from "@/lib/portfolio-data";
import HeadingSlider from "@/components/HeadingSlider";
import { absoluteUrl, defaultSocialImage, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: siteConfig.title,
  },
  description: siteConfig.description,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [defaultSocialImage],
  },
};

export default async function Home() {
  const [posts, allProjects] = await Promise.all([getAllPostMeta(), getAllProjects()]);
  const recentPosts = posts.slice(0, 5);
  const heroLinks = [
    { label: "View selected work →", href: "/work" },
    { label: "Email me →", href: `mailto:${siteConfig.email}` },
    ...siteConfig.social.filter(({ label }) =>
      ["GitHub", "LinkedIn"].includes(label),
    ),
  ];

  return (
    <>
      {/* Hero */}
      <section className="py-24 intro-animation relative">
        <h1
          className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-4xl leading-tight md:text-5xl"
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
        <h2 className="text-2xl max-w-[820px] text-contrast-shaded">
          Full-stack engineer based in Riyadh, focused on backend systems and
          product engineering.
        </h2>
        <p className="mt-5 max-w-[760px] text-lg leading-relaxed text-contrast-shaded">
          I work across the stack, but I’m most interested in backend
          engineering, AI engineering, and system design. My recent work
          includes production web products, backend systems, and developer
          tools.
        </p>
        <p className="mt-4 font-mono text-sm text-contrast-shaded">
          Currently open to full-stack and backend engineering opportunities.
        </p>
        <div className="flex flex-wrap items-center gap-2 lg:gap-8 mt-8">
          {heroLinks.map(({ label, href }) =>
            href.startsWith("/") ? (
              <Link key={label} href={href} className="underline">
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={
                  href.startsWith("http")
                    ? "cursor-alias underline"
                    : "underline"
                }
              >
                {label}
              </a>
            ),
          )}
        </div>
      </section>

      {/* About Me + Recent Thoughts */}
      <section className="fade-in pb-12">
        <div className="lg:grid grid-cols-12 gap-12">
          {/* About Me */}
          <div className="col-span-8">
            <h3 className="text-contrast mb-4 font-mono">My Path</h3>
            <hr className="h-[1px] bg-line border-0 mb-8" />
            <article className="mb-8">
              <div className="bg-faint aspect-video px-4">
                <HeadingSlider />
              </div>
              <p className="text-sm text-center mt-4 opacity-70 font-mono">
                &larr; Scrub the timeline &rarr;
              </p>
            </article>
          </div>

          {/* Recent Thoughts */}
          <div className="col-span-4">
            <h3 className="text-contrast mb-4 font-mono">Recent Writing</h3>
            <hr className="h-[1px] bg-line border-0 mb-8" />
            <ul>
              {recentPosts.map((post) => (
                <li key={post.slug} className="block mb-4">
                  <time className="font-mono text-contrast-shaded text-sm block mb-1">
                    {post.date}
                  </time>
                  <Link href={`/thoughts/${post.slug}`}>
                    <h3 className="text-xl font-bold">{post.title}</h3>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/thoughts" className="more-link mt-8">
              View all writing <span className="arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="fade-in pt-12">
        <h3 className="text-contrast mb-4 font-mono">Selected Work</h3>
        <hr className="h-[1px] bg-line border-0 mb-8" />
        <div className="flex gap-4 overflow-auto scrollbar-hide">
          {allProjects
            .filter((p) => p.featured)
            .map((project) => (
              <Link
                key={project.id}
                href={`/work/${project.id}`}
                className="group relative flex min-h-[260px] min-w-[270px] flex-1 flex-col justify-between overflow-hidden border border-faint bg-faint p-5 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:origin-left before:scale-x-0 before:bg-acid before:transition-transform before:duration-300 hover:border-contrast hover:before:scale-x-100 focus-visible:before:scale-x-100"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="font-mono text-xs font-bold text-acid"
                    aria-hidden="true"
                  >
                    {project.symbol || "{ }"}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-contrast/75">
                    {project.year}
                  </span>
                </div>

                <div className="py-6">
                  <h4 className="max-w-[16ch] font-mono text-3xl font-bold leading-none tracking-tighter text-contrast">
                    {project.title}
                  </h4>
                </div>

                <div>
                  <p className="line-clamp-2 text-xs leading-relaxed text-contrast-shaded">
                    {project.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-contrast/75">
                      {project.tags.slice(0, 2).join(" · ")}
                    </span>
                    <span
                      className="font-mono text-[1rem] text-contrast-shaded transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-acid"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
        <Link href="/work" className="more-link mt-4">
          View all work <span className="arrow">&rarr;</span>
        </Link>
      </section>
    </>
  );
}
