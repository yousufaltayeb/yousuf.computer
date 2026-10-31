import type { MetadataRoute } from "next";
import { getAllPostMeta } from "@/lib/posts";
import {
  getAllJobs,
  getAllProjects,
  getWorkSourcePaths,
} from "@/lib/portfolio-data";
import { lastCommitDate, newestCommitDate } from "@/lib/content-dates";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, jobs, projects] = await Promise.all([
    getAllPostMeta(),
    getAllJobs(),
    getAllProjects(),
  ]);

  const workSources = getWorkSourcePaths();

  // Posts carry their own dates; everything else falls back to git history.
  const newestPostDate = posts
    .map((post) => post.updated || post.date)
    .filter(Boolean)
    .sort()
    .at(-1);
  const newestWorkDate = newestCommitDate([...workSources.values()]);
  const aboutDate = lastCommitDate("content/pages/about.md");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: [newestPostDate, newestWorkDate].filter(Boolean).sort().at(-1),
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: aboutDate,
      priority: 0.9,
    },
    {
      url: absoluteUrl("/thoughts"),
      lastModified: newestPostDate,
      priority: 0.8,
    },
    {
      url: absoluteUrl("/work"),
      lastModified: newestWorkDate,
      priority: 0.8,
    },
  ];

  const thoughtRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/thoughts/${post.slug}`),
    lastModified: post.updated || post.date || undefined,
    priority: 0.7,
  }));

  const workRoutes: MetadataRoute.Sitemap = [...jobs, ...projects].map((item) => {
    const source = workSources.get(item.id);
    return {
      url: absoluteUrl(`/work/${item.id}`),
      lastModified: source ? lastCommitDate(source) : undefined,
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...thoughtRoutes, ...workRoutes];
}
