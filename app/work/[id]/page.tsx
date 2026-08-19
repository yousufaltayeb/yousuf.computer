import Link from "next/link";
import type { Metadata } from "next";
import { getAllProjects, getProjectById, getAllJobs, getJobById } from "@/lib/portfolio-data";
import { notFound } from "next/navigation";
import {
  absoluteUrl,
  defaultSocialImage,
  personId,
  safeJsonLd,
  siteConfig,
  websiteId,
} from "@/lib/site";

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
  const description = job ? job.description : project!.description;
  const tags = job ? job.tags : project!.tags;
  const url = absoluteUrl(`/work/${id}`);
  return {
    title,
    description,
    keywords: tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      images: [defaultSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultSocialImage],
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
  const description = job ? job.description : project!.description;
  const pageUrl = absoluteUrl(`/work/${id}`);
  const tags = job ? job.tags : project!.tags;
  const workJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: title,
    description,
    keywords: tags,
    isPartOf: { "@id": websiteId },
    author: { "@id": personId },
    about: project
      ? {
          "@type": "CreativeWork",
          name: project.title,
          description: project.description,
          creator: { "@id": personId },
          dateCreated: project.year ? String(project.year) : undefined,
          keywords: project.tags,
          codeRepository: project.links?.github,
          sameAs: project.links?.demo,
        }
      : {
          "@type": "OrganizationRole",
          roleName: job!.role,
          member: { "@id": personId },
          memberOf: {
            "@type": "Organization",
            name: job!.company,
          },
        },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Work",
        item: absoluteUrl("/work"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: pageUrl,
      },
    ],
  };

  return (
    <article className="max-w-[80ch] mx-auto pt-12 sm:pt-16 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(workJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <Link
        href="/work"
        className="font-mono text-sm text-contrast-shaded hover:text-contrast inline-block mb-8 intro-animation"
      >
        &larr; Work
      </Link>

      <h1 className="text-4xl font-bold leading-tight tracking-tight mb-16 intro-animation">
        {title}
      </h1>

      <p className="sr-only">{description}</p>

      <div
        className="prose-d6 fade-in"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {project?.links?.github && (
        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-3 border border-contrast bg-contrast px-4 py-3 font-mono text-sm font-bold [color:var(--base)] hover:border-acid hover:bg-acid hover:text-stone"
        >
          View {title} on GitHub
          <span aria-hidden="true">↗</span>
        </a>
      )}

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
