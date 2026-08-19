import { getAllPostMeta } from "@/lib/posts";
import { getAllJobs, getAllProjects } from "@/lib/portfolio-data";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const [posts, jobs, projects] = await Promise.all([
    getAllPostMeta(),
    getAllJobs(),
    getAllProjects(),
  ]);

  const text = `# ${siteConfig.bilingualName}

> ${siteConfig.shortDescription}

Yousuf Altayeb is a software engineer based in Riyadh, Saudi Arabia. This site contains his profile, work history, software projects, and technical writing in English and Arabic.

## Primary pages

- [Home](${absoluteUrl("/")}): Profile summary, recent writing, and featured projects.
- [About](${absoluteUrl("/about")}): Bilingual personal and professional profile.
- [Thoughts](${absoluteUrl("/thoughts")}): Technical essays and notes.
- [Work](${absoluteUrl("/work")}): Work experience and software projects.
- [RSS feed](${absoluteUrl("/feed.xml")}): Latest writing.

## Writing

${posts.map((post) => `- [${post.title}](${absoluteUrl(`/thoughts/${post.slug}`)}): ${post.description}`).join("\n")}

## Work experience

${jobs.map((job) => `- [${job.role} at ${job.company}](${absoluteUrl(`/work/${job.id}`)}): ${job.description}`).join("\n")}

## Projects

${projects.map((project) => `- [${project.title}](${absoluteUrl(`/work/${project.id}`)}): ${project.description}`).join("\n")}
`;

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
