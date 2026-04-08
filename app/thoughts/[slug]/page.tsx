import Link from "next/link";
import type { Metadata } from "next";
import {
  getPostBySlug,
  generateStaticParams as generatePostStaticParams,
} from "@/lib/posts";
import { notFound } from "next/navigation";

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
  return {
    title: `${post.title} | Yousuf Altayeb`,
    description: post.title,
    openGraph: {
      title: post.title,
      type: "article",
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

  return (
    <article className="max-w-[80ch] mx-auto pt-12 sm:pt-16 pb-20">
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
          style: { fontFamily: "var(--font-ibm-arabic)" },
        })}
      >
        {post.title}
      </h1>

      <div
        className={`prose-d6 fade-in ${isRtl ? "rtl-post" : ""}`}
        dir={isRtl ? "rtl" : "ltr"}
        {...(isRtl && {
          style: { fontFamily: "var(--font-ibm-arabic)" },
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
