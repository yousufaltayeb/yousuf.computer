import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects, getAllJobs } from "@/lib/portfolio-data";
import { absoluteUrl, defaultSocialImage, siteConfig } from "@/lib/site";

const description =
  "Work experience and projects by Yousuf Altayeb / يوسف الطيب.";

export const metadata: Metadata = {
  title: "Work",
  description,
  alternates: {
    canonical: absoluteUrl("/work"),
  },
  openGraph: {
    title: `Work | ${siteConfig.bilingualName}`,
    description,
    url: absoluteUrl("/work"),
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `Work | ${siteConfig.bilingualName}`,
    description,
    images: [defaultSocialImage],
  },
};

export default async function WorkPage() {
  const [jobs, projects] = await Promise.all([getAllJobs(), getAllProjects()]);
  return (
    <>
      <section className="pt-16 sm:pt-24 pb-6 intro-animation">
        <h1 className="text-4xl mb-4 font-bold">Work</h1>
        <h2 className="font-serif text-2xl text-contrast-shaded">
          Things I&rsquo;ve built, and places I&rsquo;ve worked.
        </h2>
      </section>

      {/* Job Experience */}
      <section className="pt-12 sm:pt-16 pb-12 fade-in">
        <h3 className="text-contrast mb-4 font-mono">Job Experience</h3>
        <hr className="h-[1px] bg-line border-0 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/work/${job.id}`}
              className="group relative flex min-h-[270px] flex-col justify-between overflow-hidden border border-faint bg-faint p-6 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:origin-left before:scale-x-0 before:bg-acid before:transition-transform before:duration-300 hover:border-contrast hover:before:scale-x-100 focus-visible:before:scale-x-100 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className="font-mono text-sm font-bold text-acid"
                  aria-hidden="true"
                >
                  {job.symbol}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-contrast/75">
                  {job.period}
                </span>
              </div>

              <div className="py-8">
                <h4 className="max-w-[20ch] font-mono text-[clamp(1.65rem,3vw,2.6rem)] font-bold leading-[1.05] tracking-tighter text-contrast">
                  {job.company}
                </h4>
              </div>

              <div className="flex items-end justify-between gap-4">
                <p className="max-w-[34ch] text-sm leading-snug text-contrast-shaded">
                  {job.role}
                </p>
                <span
                  className="font-mono text-lg text-contrast-shaded transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-acid"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="pb-20 sm:pb-24 fade-in">
        <h3 className="text-contrast mb-4 font-mono">Projects</h3>
        <hr className="h-[1px] bg-line border-0 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/work/${project.id}`}
              className="group relative flex min-h-[340px] flex-col justify-between overflow-hidden border border-faint bg-faint p-6 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:origin-left before:scale-x-0 before:bg-acid before:transition-transform before:duration-300 hover:border-contrast hover:before:scale-x-100 focus-visible:before:scale-x-100 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className="font-mono text-sm font-bold text-acid"
                  aria-hidden="true"
                >
                  {project.symbol || "{ }"}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-contrast/75">
                  {project.year}
                </span>
              </div>

              <div className="py-8">
                <h4 className="max-w-[18ch] font-mono text-[clamp(1.8rem,3.5vw,3.25rem)] font-bold leading-[1.02] tracking-tighter text-contrast">
                  {project.title}
                </h4>
              </div>

              <div>
                <p className="line-clamp-2 max-w-[52ch] text-sm leading-relaxed text-contrast-shaded">
                  {project.description}
                </p>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-contrast/75">
                    {project.tags.slice(0, 3).map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <span
                    className="font-mono text-lg text-contrast-shaded transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-acid"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
