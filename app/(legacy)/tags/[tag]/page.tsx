import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegacyCanonicalPage from "@/components/LegacyCanonicalPage";
import {
  absoluteUrl,
  defaultSocialImage,
  legacyUrlMappings,
  siteConfig,
} from "@/lib/site";

interface LegacyTagPageProps {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  return siteConfig.legacyTagSlugs.map((tag) => ({ tag }));
}

function getDestination(tag: string) {
  return legacyUrlMappings.find((item) => item.source === `/tags/${tag}`)
    ?.destination;
}

export async function generateMetadata({
  params,
}: LegacyTagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const destination = getDestination(tag);
  if (!destination) return {};

  return {
    title: {
      absolute: `Thoughts | ${siteConfig.bilingualName}`,
    },
    description: `This tag page moved to ${absoluteUrl(destination)}.`,
    alternates: {
      canonical: absoluteUrl(destination),
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: `Thoughts | ${siteConfig.bilingualName}`,
      description: `This tag page moved to ${absoluteUrl(destination)}.`,
      url: absoluteUrl(destination),
      type: "website",
      images: [defaultSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `Thoughts | ${siteConfig.bilingualName}`,
      description: `This tag page moved to ${absoluteUrl(destination)}.`,
      images: [defaultSocialImage],
    },
  };
}

export default async function LegacyTagPage({ params }: LegacyTagPageProps) {
  const { tag } = await params;
  const destination = getDestination(tag);

  if (!destination) {
    notFound();
  }

  return <LegacyCanonicalPage targetPath={destination} title="Tag moved" />;
}
