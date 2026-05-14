import type { Metadata } from "next";
import LegacyCanonicalPage from "@/components/LegacyCanonicalPage";
import { absoluteUrl, legacyUrlMappings, siteConfig } from "@/lib/site";

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
  openGraph: {
    title: `Thoughts | ${siteConfig.bilingualName}`,
    description: `This tag archive moved to ${absoluteUrl(destination)}.`,
    url: absoluteUrl(destination),
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `Thoughts | ${siteConfig.bilingualName}`,
    description: `This tag archive moved to ${absoluteUrl(destination)}.`,
  },
};

export default function LegacyTagsPage() {
  return <LegacyCanonicalPage targetPath={destination} title="Tags moved" />;
}
