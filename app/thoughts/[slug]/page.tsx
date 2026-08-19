import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllPostMeta,
  getPostBySlug,
  generateStaticParams as generatePostStaticParams,
} from "@/lib/posts";
import { notFound } from "next/navigation";
import {
  absoluteUrl,
  personId,
  safeJsonLd,
  siteConfig,
  websiteId,
} from "@/lib/site";
import { formatDateLong } from "@/lib/utils";

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
  const socialImage = absoluteUrl(`/thoughts/${post.slug}/opengraph-image`);
  return {
    title: post.title,
    description: post.description,
    authors: [{ name: siteConfig.name, url: absoluteUrl("/about") }],
    keywords: post.tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      publishedTime: post.date || undefined,
      modifiedTime: post.updated || post.date || undefined,
      authors: [personId],
      tags: post.tags,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [socialImage],
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
  const socialImage = absoluteUrl(`/thoughts/${post.slug}/opengraph-image`);
  const allPosts = await getAllPostMeta();
  const relatedPosts = allPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      ...candidate,
      relevance: candidate.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.relevance - a.relevance || b.date.localeCompare(a.date))
    .slice(0, 3);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    inLanguage: isRtl ? "ar" : "en",
    url: postUrl,
    image: {
      "@type": "ImageObject",
      url: socialImage,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    isPartOf: { "@id": websiteId },
    author: { "@id": personId },
    publisher: { "@id": personId },
    keywords: post.tags,
    articleSection: post.tags,
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingTimeMinutes}M`,
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
        name: "Thoughts",
        item: absoluteUrl("/thoughts"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <article
      className="max-w-[80ch] mx-auto pt-12 sm:pt-16 pb-20"
      lang={isRtl ? "ar" : "en"}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />

      <Link
        href="/thoughts"
        className="font-mono text-sm text-contrast-shaded hover:text-contrast inline-block mb-8 intro-animation"
      >
        {isRtl ? "كل المقالات →" : "← All Posts"}
      </Link>

      <h1
        className="text-4xl font-bold leading-tight tracking-tight mb-5 intro-animation"
        {...(isRtl && {
          style: { fontFamily: "var(--font-arabic-display)" },
        })}
      >
        <bdi dir="auto">{post.title}</bdi>
      </h1>

      <div className="font-mono text-sm text-contrast-shaded mb-14 intro-animation">
        <time dateTime={post.date}>
          {formatDateLong(post.date, isRtl ? "ar-SA" : "en-US")}
        </time>
        <span aria-hidden="true"> · </span>
        <span>
          {isRtl
            ? `${post.readingTimeMinutes} دقائق قراءة`
            : `${post.readingTimeMinutes} min read`}
        </span>
        <span aria-hidden="true"> · </span>
        <Link href="/about" rel="author">
          {isRtl ? siteConfig.arabicName : siteConfig.name}
        </Link>
      </div>

      <div
        className={`prose-d6 fade-in ${isRtl ? "rtl-post" : ""}`}
        {...(isRtl && {
          style: { fontFamily: "var(--font-arabic)" },
        })}
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      {relatedPosts.length > 0 && (
        <aside className="mt-16" aria-labelledby="related-thoughts">
          <h2 id="related-thoughts" className="font-mono text-base mb-6">
            {isRtl ? "مقالات ذات صلة" : "Related thoughts"}
          </h2>
          <ul className="space-y-5">
            {relatedPosts.map((related) => (
              <li key={related.slug}>
                <Link
                  href={`/thoughts/${related.slug}`}
                  className="block text-xl font-bold"
                  lang={related.lang === "ar" ? "ar" : "en"}
                  dir={related.lang === "ar" ? "rtl" : "ltr"}
                >
                  <bdi dir="auto">{related.title}</bdi>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <hr className="h-[1px] bg-line border-0 mt-12 mb-8" />

      <Link
        href="/thoughts"
        className="font-mono text-sm text-contrast-shaded hover:text-contrast"
      >
        {isRtl ? "كل المقالات →" : "← All Posts"}
      </Link>
    </article>
  );
}
