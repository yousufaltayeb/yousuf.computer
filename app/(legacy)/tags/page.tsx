import type { Metadata } from "next";
import LegacyCanonicalPage from "@/components/LegacyCanonicalPage";
import {
  absoluteUrl,
  defaultSocialImage,
  legacyUrlMappings,
  siteConfig,
} from "@/lib/site";

const destination =
  legacyUrlMappings.find((item) => item.source === "/tags")?.destination ??
  "/thoughts";

export const metadata: Metadata = {
  title: {
    absolute: `Thoughts | ${siteConfig.bilingualName}`,
  },
  description: `This tag archive moved to ${absoluteUrl(destination)}.`,
  alternates: {
    canonical: absoluteUrl(destination),
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: `Thoughts | ${siteConfig.bilingualName}`,
    description: `This tag archive moved to ${absoluteUrl(destination)}.`,
    url: absoluteUrl(destination),
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `Thoughts | ${siteConfig.bilingualName}`,
    description: `This tag archive moved to ${absoluteUrl(destination)}.`,
    images: [defaultSocialImage],
  },
};

export default function LegacyTagsPage() {
  return <LegacyCanonicalPage targetPath={destination} title="Tags moved" />;
}
