import type { Metadata } from "next";
import LegacyCanonicalPage from "@/components/LegacyCanonicalPage";
import {
  absoluteUrl,
  defaultSocialImage,
  legacyUrlMappings,
  sharedOpenGraph,
  sharedTwitter,
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
    ...sharedOpenGraph,
    title: `Thoughts | ${siteConfig.bilingualName}`,
    description: `This tag archive moved to ${absoluteUrl(destination)}.`,
    url: absoluteUrl(destination),
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    ...sharedTwitter,
    title: `Thoughts | ${siteConfig.bilingualName}`,
    description: `This tag archive moved to ${absoluteUrl(destination)}.`,
    images: [defaultSocialImage],
  },
};

export default function LegacyTagsPage() {
  return <LegacyCanonicalPage targetPath={destination} title="Tags moved" />;
}
