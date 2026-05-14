import type { MetadataRoute } from "next";
import { getAllPostMeta } from "@/lib/posts";
import { getAllJobs, getAllProjects } from "@/lib/portfolio-data";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, jobs, projects] = await Promise.all([
    getAllPostMeta(),
    getAllJobs(),
    getAllProjects(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      priority: 0.9,
    },
    {
      url: absoluteUrl("/thoughts"),
      priority: 0.8,
    },
    {
      url: absoluteUrl("/work"),
      priority: 0.8,
    },
  ];

  const thoughtRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/thoughts/${post.slug}`),
    lastModified: post.date || undefined,
    priority: 0.7,
  }));

  const workRoutes: MetadataRoute.Sitemap = [...jobs, ...projects].map((item) => ({
    url: absoluteUrl(`/work/${item.id}`),
    priority: 0.6,
  }));

  return [...staticRoutes, ...thoughtRoutes, ...workRoutes];
}
