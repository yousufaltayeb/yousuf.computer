import Link from "next/link";
import type { Metadata } from "next";
import {
  getPostBySlug,
  generateStaticParams as generatePostStaticParams,
} from "@/lib/posts";
import { notFound } from "next/navigation";
import { absoluteUrl, safeJsonLd, siteConfig } from "@/lib/site";

interface ThoughtPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return await generatePostStaticParams();
}

export async function generateMetadata({ params }: ThoughtPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const url = absoluteUrl(`/thoughts/${post.slug}`);
  return {
    title: post.title,
    description: `${post.title} by ${siteConfig.bilingualName}.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: `${post.title} by ${siteConfig.bilingualName}.`,
      type: "article",
      url,
      publishedTime: post.date || undefined,
      authors: [absoluteUrl("/about#person")],
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: `${post.title} by ${siteConfig.bilingualName}.`,
    },
  };
}

export default async function ThoughtPage({ params }: ThoughtPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const isRtl = post.lang === "ar";
  const postUrl = absoluteUrl(`/thoughts/${post.slug}`);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${postUrl}#article`,
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: isRtl ? "ar" : "en",
    url: postUrl,
    mainEntityOfPage: postUrl,
    author: {
      "@type": "Person",
      "@id": absoluteUrl("/about#person"),
      name: siteConfig.name,
      alternateName: [siteConfig.arabicName, siteConfig.bilingualName],
      url: absoluteUrl("/about"),
    },
  };

  return (
    <article className="max-w-[80ch] mx-auto pt-12 sm:pt-16 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />

      <Link
        href="/thoughts"
        className="font-mono text-sm text-contrast-shaded hover:text-contrast inline-block mb-8 intro-animation"
      >
        &larr; All Posts
      </Link>

      <h1
        className="text-4xl font-bold leading-tight tracking-tight mb-16 intro-animation"
        dir={isRtl ? "rtl" : "ltr"}
        {...(isRtl && {
          style: { fontFamily: "var(--font-arabic-display)" },
        })}
      >
        {post.title}
      </h1>

      <div
        className={`prose-d6 fade-in ${isRtl ? "rtl-post" : ""}`}
        dir={isRtl ? "rtl" : "ltr"}
        {...(isRtl && {
          style: { fontFamily: "var(--font-arabic)" },
        })}
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      <hr className="h-[1px] bg-line border-0 mt-12 mb-8" />

      <Link
        href="/thoughts"
        className="font-mono text-sm text-contrast-shaded hover:text-contrast"
      >
        &larr; All Posts
      </Link>
    </article>
  );
}
