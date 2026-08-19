export const siteConfig = {
  siteUrl: "https://yousuf.computer",
  name: "Yousuf Altayeb",
  arabicName: "يوسف الطيب",
  bilingualName: "Yousuf Altayeb / يوسف الطيب",
  title: "Yousuf Altayeb / يوسف الطيب | Software Engineer",
  description:
    "Yousuf Altayeb / يوسف الطيب is a software engineer based in Riyadh, Saudi Arabia, building web software, tools, and writing.",
  shortDescription:
    "Software engineer based in Riyadh, building web software, tools, and writing.",
  locale: "en_US",
  alternateLocale: "ar_SA",
  email: "contact@yousuf.computer",
  social: [
    {
      label: "Twitter/X",
      href: "https://twitter.com/yousufaltayeb",
    },
    {
      label: "GitHub",
      href: "https://github.com/yousufaltayeb",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/yousufaltayeb/",
    },
    {
      label: "Qabilah",
      href: "https://qabilah.com/profile/yousufaltayeb/posts",
    },
    {
      label: "Email",
      href: "mailto:contact@yousuf.computer",
    },
  ],
  legacyRootPostSlugs: [
    "biban-2025",
    "demand-for-software-engineers",
    "event-loop-javascript",
    "promises-could-make-your-code-slower",
    "the-unsolved-problem-of-video-protection",
  ],
  legacyTagSlugs: [
    "ai",
    "career",
    "drm",
    "economics",
    "event-loop",
    "events",
    "javascript",
    "nodejs",
    "security",
    "software-engineering",
    "streaming",
    "video",
    "web-development",
  ],
} as const;

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, siteConfig.siteUrl).toString();
}

export function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const sameAsLinks = siteConfig.social
  .map((item) => item.href)
  .filter((href) => href.startsWith("https://"));

export const personId = absoluteUrl("/about#person");
export const websiteId = absoluteUrl("/#website");
export const defaultSocialImage = absoluteUrl("/opengraph-image");

export const personJsonLd = {
  "@type": "Person",
  "@id": personId,
  name: siteConfig.name,
  alternateName: [siteConfig.arabicName, siteConfig.bilingualName],
  url: absoluteUrl("/about"),
  jobTitle: "Software Engineer",
  email: siteConfig.email,
  homeLocation: {
    "@type": "Place",
    name: "Riyadh, Saudi Arabia",
  },
  knowsAbout: [
    "Software engineering",
    "Web development",
    "JavaScript",
    "TypeScript",
    "Application security",
    "Artificial intelligence",
  ],
  sameAs: sameAsLinks,
};

export const websiteJsonLd = {
  "@type": "WebSite",
  "@id": websiteId,
  url: absoluteUrl("/"),
  name: siteConfig.bilingualName,
  alternateName: [siteConfig.name, siteConfig.arabicName],
  description: siteConfig.description,
  inLanguage: ["en", "ar"],
  author: { "@id": personId },
  publisher: { "@id": personId },
};

export const legacyUrlMappings = [
  ...siteConfig.legacyRootPostSlugs.map((slug) => ({
    source: `/${slug}`,
    destination: `/thoughts/${slug}`,
  })),
  {
    source: "/page/1",
    destination: "/thoughts",
  },
  {
    source: "/tags",
    destination: "/thoughts",
  },
  ...siteConfig.legacyTagSlugs.map((tag) => ({
    source: `/tags/${tag}`,
    destination: "/thoughts",
  })),
] as const;
