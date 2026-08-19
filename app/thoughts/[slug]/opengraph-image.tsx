import { notFound } from "next/navigation";
import {
  generateStaticParams as generatePostStaticParams,
  getPostBySlug,
} from "@/lib/posts";
import { createSocialImage, socialImageSize } from "@/lib/social-image";

export const dynamic = "force-static";
export const alt = "Article by Yousuf Altayeb / يوسف الطيب";
export const size = socialImageSize;
export const contentType = "image/png";

interface OpenGraphImageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return generatePostStaticParams();
}

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return createSocialImage({
    title: post.title,
    label:
      post.lang === "ar"
        ? `Technical writing · yousuf.computer`
        : `${post.readingTimeMinutes} min read · yousuf.computer`,
    lang: post.lang === "ar" ? "ar" : "en",
  });
}
