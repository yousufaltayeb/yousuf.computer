import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects, getAllJobs } from "@/lib/portfolio-data";
import { absoluteUrl, siteConfig } from "@/lib/site";

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
  },
  twitter: {
    card: "summary",
    title: `Work | ${siteConfig.bilingualName}`,
    description,
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
              className="bg-faint border border-faint p-8 aspect-video relative flex flex-col items-center justify-center"
            >
              <span
                className="font-mono text-5xl select-none text-contrast opacity-20 font-bold tracking-tighter"
                aria-hidden="true"
              >
                {job.symbol}
              </span>
              <div className="absolute bottom-4 left-4 flex flex-col">
                <span className="font-mono text-[10px] text-contrast/75 uppercase tracking-wider">
                  {job.period}
                </span>
                <span className="text-contrast text-[14px] font-medium">
                  {job.company}
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
              className="bg-faint border border-faint overflow-hidden block group"
            >
              <div className="flex items-center justify-center aspect-[4/3]">
                <span
                  className="font-mono text-4xl select-none text-contrast opacity-20 font-bold tracking-tighter"
                  aria-hidden="true"
                >
                  {project.symbol || "{ }"}
                </span>
              </div>
              <div className="px-5 pb-5">
                <div className="font-mono text-[10px] text-contrast/75 uppercase tracking-wider mb-1">
                  {project.year}
                </div>
                <div className="text-[14px] text-contrast font-medium">
                  {project.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
