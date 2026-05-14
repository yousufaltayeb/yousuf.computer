import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostMeta } from "@/lib/posts";
import { formatDateShort } from "@/lib/utils";
import { absoluteUrl, siteConfig } from "@/lib/site";

const description =
  "Essays and notes by Yousuf Altayeb / يوسف الطيب on software engineering, JavaScript, security, AI, and the web.";

export const metadata: Metadata = {
  title: "Thoughts",
  description,
  alternates: {
    canonical: absoluteUrl("/thoughts"),
  },
  openGraph: {
    title: `Thoughts | ${siteConfig.bilingualName}`,
    description,
    url: absoluteUrl("/thoughts"),
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `Thoughts | ${siteConfig.bilingualName}`,
    description,
  },
};

export default async function ThoughtsPage() {
  const posts = await getAllPostMeta();

  return (
    <>
      <section className="pt-16 sm:pt-24 pb-6 intro-animation">
        <h1 className="text-4xl mb-4 font-bold">Thoughts</h1>
        <h2 className="font-serif text-2xl max-w-[820px] text-contrast-shaded">
          Essays, learning, and other miscellaneous goodies.
        </h2>
      </section>

      <section className="pt-12 sm:pt-16 pb-20 fade-in">
        <div className="flex flex-col gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={`/thoughts/${post.slug}`}
                className="group block"
              >
                <time className="font-mono text-contrast-shaded text-sm block mb-1">
                  {formatDateShort(post.date)}
                </time>
                <h2 className="text-3xl font-bold leading-snug">
                  {post.title}
                </h2>
              </Link>
            ))
          ) : (
            <p className="text-contrast-shaded">No thoughts yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
