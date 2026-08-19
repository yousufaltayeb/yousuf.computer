import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegacyCanonicalPage from "@/components/LegacyCanonicalPage";
import { getPostBySlug } from "@/lib/posts";
import {
  absoluteUrl,
  defaultSocialImage,
  legacyUrlMappings,
  siteConfig,
} from "@/lib/site";

interface LegacyPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return siteConfig.legacyRootPostSlugs.map((slug) => ({ slug }));
}

function getLegacyPostDestination(slug: string) {
  return legacyUrlMappings.find((item) => item.source === `/${slug}`)?.destination;
}

export async function generateMetadata({
  params,
}: LegacyPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = getLegacyPostDestination(slug);
  if (!destination) return {};

  const post = await getPostBySlug(slug);
  const title = post ? post.title : "Post moved";

  return {
    title: {
      absolute: `${title} | ${siteConfig.bilingualName}`,
    },
    description: `This post moved to ${absoluteUrl(destination)}.`,
    alternates: {
      canonical: absoluteUrl(destination),
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title,
      description: `This post moved to ${absoluteUrl(destination)}.`,
      url: absoluteUrl(destination),
      type: "article",
      images: [defaultSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `This post moved to ${absoluteUrl(destination)}.`,
      images: [defaultSocialImage],
    },
  };
}

export default async function LegacyPostPage({ params }: LegacyPostPageProps) {
  const { slug } = await params;
  const destination = getLegacyPostDestination(slug);

  if (!destination) {
    notFound();
  }

  const post = await getPostBySlug(slug);

  return (
    <LegacyCanonicalPage
      targetPath={destination}
      title={post ? post.title : "Post moved"}
      lang={post?.lang === "ar" ? "ar" : "en"}
    />
  );
}
