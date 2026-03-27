import Link from "next/link";
import { getAllPostMeta } from "@/lib/posts";
import { getAllProjects } from "@/lib/portfolio-data";
import HeadingSlider from "@/components/HeadingSlider";

export default async function Home() {
  const [posts, allProjects] = await Promise.all([getAllPostMeta(), getAllProjects()]);
  const recentPosts = posts.slice(0, 5);

  return (
    <>
      {/* Hero */}
      <section className="py-24 intro-animation relative">
        <h1 className="text-4xl mb-4">Hello, my name is Yousuf.</h1>
        <h2 className="text-2xl">
          I am a Software Engineer based in Riyadh, Saudi Arabia.
        </h2>
        <div className="hidden lg:flex items-center gap-2 lg:gap-8 mt-8">
          {[
            { label: "Twitter", href: "https://twitter.com/yousufaltayeb" },
            { label: "Github", href: "https://github.com/yousufaltayeb" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/yousufaltayeb/" },
            { label: "Qabilah", href: "https://qabilah.com/profile/yousufaltayeb/posts" },
            { label: "Email", href: "mailto:contact@yousuf.computer" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="cursor-alias underline"
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      {/* About Me + Recent Thoughts */}
      <section className="fade-in pb-12">
        <div className="lg:grid grid-cols-12 gap-12">
          {/* About Me */}
          <div className="col-span-8">
            <h3 className="text-contrast mb-4 font-mono">About Me</h3>
            <hr className="h-[1px] bg-line border-0 mb-8" />
            <article className="mb-8">
              <div className="bg-faint aspect-video px-4">
                <HeadingSlider />
              </div>
              <p className="text-sm text-center mt-4 opacity-70 font-mono">
                &larr; Scrub the timeline &rarr;
              </p>
            </article>
          </div>

          {/* Recent Thoughts */}
          <div className="col-span-4">
            <h3 className="text-contrast mb-4 font-mono">Recent Thoughts</h3>
            <hr className="h-[1px] bg-line border-0 mb-8" />
            <ul>
              {recentPosts.map((post) => (
                <li key={post.slug} className="block mb-4">
                  <time className="font-mono text-contrast-shaded text-sm block mb-1">
                    {post.date}
                  </time>
                  <Link href={`/thoughts/${post.slug}`}>
                    <h3 className="text-xl font-bold">{post.title}</h3>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/thoughts" className="more-link mt-8">
              More <span className="arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Side Projects */}
      <section className="fade-in pt-12">
        <h3 className="text-contrast mb-4 font-mono">Side Projects</h3>
        <hr className="h-[1px] bg-line border-0 mb-8" />
        <div className="flex gap-4 overflow-auto scrollbar-hide">
          {allProjects
            .filter((p) => p.featured)
            .map((project) => (
              <Link
                key={project.id}
                href={`/work/${project.id}`}
                className="bg-[#EEEAE3] border border-[#EEEAE3] overflow-hidden block min-w-[250px] flex-1"
              >
                <div className="flex items-center justify-center aspect-[4/3]">
                  <span className="font-mono text-4xl select-none text-[#282725] opacity-20 font-bold tracking-tighter" aria-hidden="true">
                    {project.symbol || "{ }"}
                  </span>
                </div>
                <div className="px-5 pb-5">
                  <div className="font-mono text-[10px] text-[#282725]/60 uppercase tracking-wider mb-1">
                    {project.year}
                  </div>
                  <div className="text-[14px] text-[#282725] font-medium">
                    {project.title}
                  </div>
                </div>
              </Link>
            ))}
        </div>
        <Link href="/work" className="more-link mt-4">
          More <span className="arrow">&rarr;</span>
        </Link>
      </section>
    </>
  );
}
