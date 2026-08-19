import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegacyCanonicalPage from "@/components/LegacyCanonicalPage";
import {
  absoluteUrl,
  defaultSocialImage,
  legacyUrlMappings,
  siteConfig,
} from "@/lib/site";

interface LegacyIndexPageProps {
  params: Promise<{ page: string }>;
}

export function generateStaticParams() {
  return [{ page: "1" }];
}

function getDestination(page: string) {
  return legacyUrlMappings.find((item) => item.source === `/page/${page}`)
    ?.destination;
}

export async function generateMetadata({
  params,
}: LegacyIndexPageProps): Promise<Metadata> {
  const { page } = await params;
  const destination = getDestination(page);
  if (!destination) return {};

  return {
    title: {
      absolute: `Thoughts | ${siteConfig.bilingualName}`,
    },
    description: `This archive page moved to ${absoluteUrl(destination)}.`,
    alternates: {
      canonical: absoluteUrl(destination),
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: `Thoughts | ${siteConfig.bilingualName}`,
      description: `This archive page moved to ${absoluteUrl(destination)}.`,
      url: absoluteUrl(destination),
      type: "website",
      images: [defaultSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `Thoughts | ${siteConfig.bilingualName}`,
      description: `This archive page moved to ${absoluteUrl(destination)}.`,
      images: [defaultSocialImage],
    },
  };
}

export default async function LegacyIndexPage({ params }: LegacyIndexPageProps) {
  const { page } = await params;
  const destination = getDestination(page);

  if (!destination) {
    notFound();
  }

  return <LegacyCanonicalPage targetPath={destination} title="Archive moved" />;
}
