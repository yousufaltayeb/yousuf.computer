import Link from "next/link";
import type { Metadata } from "next";
import { getAllProjects, getProjectById, getAllJobs, getJobById } from "@/lib/portfolio-data";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/site";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const [projects, jobs] = await Promise.all([getAllProjects(), getAllJobs()]);
  return [
    ...projects.map((p) => ({ id: p.id })),
    ...jobs.map((j) => ({ id: j.id })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const [project, job] = await Promise.all([getProjectById(id), getJobById(id)]);
  const title = job ? job.company : project?.title;
  if (!title) return {};
  const description = job ? `${job.role} at ${job.company}` : title;
  const url = absoluteUrl(`/work/${id}`);
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [project, job] = await Promise.all([getProjectById(id), getJobById(id)]);

  if (!project && !job) {
    notFound();
  }

  const title = job ? job.company : project!.title;
  const html = job ? job.html : project!.html;

  return (
    <article className="max-w-[80ch] mx-auto pt-12 sm:pt-16 pb-20">
      <Link
        href="/work"
        className="font-mono text-sm text-contrast-shaded hover:text-contrast inline-block mb-8 intro-animation"
      >
        &larr; Work
      </Link>

      <h1 className="text-4xl font-bold leading-tight tracking-tight mb-16 intro-animation">
        {title}
      </h1>

      <div
        className="prose-d6 fade-in"
        dangerouslySetInnerHTML={{
          __html: project?.links?.github
            ? html.replace(
                /<\/p>\s*$/,
                `<br/><a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="more-link">View Repo <span class="arrow">&rarr;</span></a></p>`
              )
            : html,
        }}
      />

      <hr className="h-[1px] bg-line border-0 mt-12 mb-8" />

      <Link
        href="/work"
        className="font-mono text-sm text-contrast-shaded hover:text-contrast"
      >
        &larr; Work
      </Link>
    </article>
  );
}
